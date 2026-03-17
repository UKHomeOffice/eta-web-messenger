# Web Messengers — Technical Overview

This document provides a developer-focused, end-to-end technical overview of the `web-messengers` project: key dependencies and versions, how environment configuration flows from the container into the built SPA, how to run locally and in Docker, the project layout, and how errors are surfaced/handled.

## Quick summary

- Single Page Application built with React (client-side only).
- Bundled with Parcel (v2) for development and production builds.
- Production artifact is a static site served by nginx; runtime env values are injected into an `env.json` at container start.
- Tests use Jest and React Testing Library.
- Integrates with Genesys Cloud Platform through the use of the web messenger plugin, over a web socket connection.

## Key libraries

Dependencies (important ones):

- react
- react-dom
- react-router
- parcel
- govuk-frontend
- js-cookie
- marked
- uuid

Dev dependencies (testing / tooling highlights):

- jest
- @testing-library/react
- babel-jest
- eslint
- prettier

Note: for a full list of versions see [package.json](../package.json) at the repository root.

## How environment configuration works

- During build the project is bundled with Parcel and the static assets are written to `dist/`.
- The runtime configuration is provided by an `env.json` file that the app fetches at startup. This file is copied into the final nginx image and created at container start by `generate-env.sh`.
- `src/env-bootstrap.js` loads `env.json` with a fetch call and exposes a `getEnvValueByKey(key)` accessor used throughout the app (for example, `config.js` reads the deployment IDs and the logging endpoint).
- The `generate-env.sh` script writes the `env.json` from environment variables (see `Dockerfile` which copies the script and runs it as part of the container CMD). This pattern allows different deployments (k8s, docker) to set environment variables and have the static SPA pick them up at runtime.

> NOTE: because the application is bundled by parcel and served statically, the standard use of `.env` cannot be used to load environment config at runtime. The standard `.env` can be used during local development as Parcel [supports node emulation](https://parceljs.org/features/node-emulation/), but this cannot be used in a production build. That's why an approach to use a similar `env.json` file has been taken to ensure dynamic loading of environment config can still be done at runtime.

Files involved:

- `generate-env.sh` — builds `/usr/share/nginx/html/env.json` from runtime environment variables.
- `nginx/app.conf` and `nginx/nginx.conf` — static file serving and health endpoint configuration.
- `src/env-bootstrap.js` — client-side loader that fetches `env.json` before bootstrapping the React app.
- `config.js` — exports app-level config values using `getEnvValueByKey()`.

## Project layout (high level)

- docs/                  — project documentation
- assets/                — static assets copied to built site
- src/                   — application source
  - index.js             — bootstraps the app: loads env, selects service and renders React tree
  - App.js               — top-level routes (eta, euss, evisa, cookies, accessibility)
  - env-bootstrap.js     — loads `env.json` and exposes `getEnvValueByKey`
  - conversation/        — conversation logic and providers (conversation storage, provider)
  - genesys/             — genesys/adapter integration (where Genesys SDK functions are handled)
  - components/          — UI components and layout
  - styles/              — SCSS and govuk-frontend styles
- nginx/                 — nginx config used in production image
- generate-env.sh        — writes `env.json` from runtime env vars
- Dockerfile             — multi-stage build and production image
- package.json           — build/test scripts and deps

Core runtime flow:

1. Browser requests app -> nginx serves index.html.
2. `index.js` (client) calls `loadEnvironmentConfig()` to fetch `env.json`.
3. After env loaded, React app is mounted. Components call `getEnvValueByKey()` (via `config.js`) to obtain deployment IDs, Genesys environment and the logging endpoint.
4. Conversation provider exposes a conversation id to the child components and utilities.

## Error handling and logging

Runtime errors are handled at a few layers:

- Env load failure: `src/env-bootstrap.js` will throw an Error if fetching `env.json` fails (it checks `res.ok`). That prevents the app from bootstrapping; a hosting/container orchestration system should ensure `env.json` exists (the Docker CMD runs `generate-env.sh` to create it).

- User-visible connection state: the `utils/genesys-agent.js` contains helper functions to translate connection events into user-visible banners. These include offline, reconnected, agent connected/disconnected banners. The helpers operate on the message array and return an updated list so UI components can render banners based on state.

- Conversation/provider: the `ConversationProvider` exposes a conversation id and the storage helpers (e.g. `getConversationId`) contains the logic to persist session state in localStorage. The purpose of the `conversationId` is to group logs together for a given user throughout the life of their 'conversation'. This can help with any diagnostics needed from a support perspective.

- Logging: `config.js` defines `logApiEndpoint` by reading `LOG_ENDPOINT` from env. Due to the nature of Single Page Applications being purely client side, the service cannot log to anywhere meaningful by itself. As a result of this, the service makes use of the [hof-logging-api](https://github.com/UKHomeOffice/hof-logging-api); a lightweight Node API based service which offers a `/log` endpoint to log data to the container, which can then be picked up and shipped to the platform logging solution (currently Opensearch on ACP).

## Testing and linting

- Run unit tests: `yarn test` (uses Jest and coverage reporting).
- Lint: `yarn lint` and `yarn lint:fix`.

## Build & Deployment

The build pipeline is configured with drone, the [drone.yaml](../.drone.yaml) file contains all the build steps and configuration for testing, building and deploying the service. The build process is closely aligned with other HOF services. 

The service is deployed onto Kubernetes, all manifest files can be found in the `kube/` folder in the root directory. `KD` is used to deploy the manifest files into the specified environment.

## Useful scripts (from package.json)

- `yarn start` — parcel dev server on port 3000
- `yarn build` — parcel build (production) with public URL `/assets/`
- `yarn build-prod` — production build to be used in the Docker build
- `yarn test` — run Jest tests with coverage

## Key files

- `src/index.js` — bootstrap + env loading
- `src/env-bootstrap.js` — env loading & accessor
- `config.js` — mapping of runtime values and the `LOG_ENDPOINT`
- `utils/genesys-agent.js` — UI banner helpers for connection/agent state
- `generate-env.sh` and `nginx/app.conf` — runtime env injection and nginx configuration

