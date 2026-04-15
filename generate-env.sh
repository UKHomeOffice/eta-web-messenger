#!/bin/sh

# This script generates the env.json file used by the web app to get environment variables at runtime.
# These variables will be set in the Kubernetes deployment manifest in the production environment. 
# In local development, these variables can be set in a .env file and passed to the docker run command.
cat <<EOF > /usr/share/nginx/html/env.json
{
  "ETA_DEPLOYMENT_ID": "${ETA_DEPLOYMENT_ID}",
  "GENESYS_ENVIRONMENT": "${GENESYS_ENVIRONMENT}",
  "GOOGLE_TAG_MANAGER_ID": "${GOOGLE_TAG_MANAGER_ID}",
  "ENABLE_ANALYTICS": ${ENABLE_ANALYTICS},
  "LOG_ENDPOINT": "${LOG_ENDPOINT}"
}
EOF
