FROM alpine:3.24.2@sha256:294b683cb724975bec92580e1e685676bd4b50bda910ddb8c51d4cabeaec77e6 AS builder
USER root

# Base alpine image ships no runtime, so install node & yarn from the apk repos
RUN apk add --no-cache nodejs yarn

# Setup nodejs group & nodejs user
RUN addgroup --system nodejs --gid 998 && \
    adduser --system nodejs --uid 999 --home /app/ && \
    chown -R 999:998 /app/

WORKDIR /app
COPY . /app

# Copy package.json and yarn.lock for better layer caching
COPY --chown=999:998 package.json yarn.lock ./

# Set npm/yarn configurations for Alpine builds and Vite compatibility
RUN yarn config set network-timeout 300000 && \
    yarn config set cache-folder /tmp/yarn-cache && \
    yarn config set target_platform linux && \
    yarn config set target_arch x64 && \
    yarn config set target_libc musl

# Install dependencies with proper platform handling for Vite
RUN set -e && \
    echo "Starting yarn install..." && \
    yarn install --frozen-lockfile --production=false --verbose --network-timeout 300000 && \
    echo "Yarn install completed successfully"

# Copy the rest of the application files
COPY --chown=999:998 . /app

# Run postinstall if needed (only if script exists)
RUN if yarn run --silent --json 2>/dev/null | grep -q '"postinstall"'; then \
        yarn run postinstall; \
    else \
        echo "No postinstall script found, skipping..."; \
    fi

# Build app as root to avoid permission issues
USER root

RUN yarn build

# Create production image

FROM nginx:stable-alpine@sha256:0985e772fb9f729e6fa0980da05fca5d9c468e870eed43071545afa9d2e27d94 AS final
    
USER root

WORKDIR /app

# Remove default NGINX config
RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html/
COPY --from=builder /app/env.json /usr/share/nginx/html
COPY --from=builder /app/generate-env.sh .
COPY --from=builder /app/nginx/app.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/nginx/nginx.conf /etc/nginx/nginx.conf

RUN chown -R 999:998 /app && \
    chown -R 999:998 /usr/share/nginx/html && \
    chown -R 999:998 /var/cache/nginx/ && \    
    chown -R 999:998 /run && \
    chmod -R 755 /app    

# Switch to non-root user for security
USER 999

HEALTHCHECK --interval=5m --timeout=3s \
    CMD curl --fail http://localhost:8080 || exit 1

EXPOSE 80

# Generate the env values at runtime and start nginx
CMD ["sh", "-c", "./generate-env.sh && nginx -g 'daemon off;'"]
