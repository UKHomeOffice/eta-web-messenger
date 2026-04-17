#! /bin/bash
set -e

export INGRESS_INTERNAL_ANNOTATIONS=$HOF_CONFIG/ingress-internal-annotations.yaml
export INGRESS_EXTERNAL_ANNOTATIONS=$HOF_CONFIG/ingress-external-annotations.yaml
export NGINX_SETTINGS=$HOF_CONFIG/nginx-settings.yaml

cat >/tmp/kubectl-no-validate <<'EOF'
#!/bin/sh
needs_validate=false

for arg in "$@"; do
  case "$arg" in
    apply|create|replace)
      needs_validate=true
      ;;
  esac
done

if [ "$needs_validate" = true ]; then
  exec kubectl "$@" --validate=false
fi

exec kubectl "$@"
EOF
chmod +x /tmp/kubectl-no-validate

kd=(kd --insecure-skip-tls-verify --timeout 10m --check-interval 10s --kubectl-binary /tmp/kubectl-no-validate)

run_kd() {
  local max_attempts=3
  local delay_seconds=15
  local attempt

  for ((attempt=1; attempt<=max_attempts; attempt++)); do
    if "$@"; then
      return 0
    fi

    if [[ $attempt -lt $max_attempts ]]; then
      echo "kd command failed (attempt $attempt/$max_attempts). Retrying in ${delay_seconds}s..."
      sleep "$delay_seconds"
    fi
  done

  echo "kd failed after ${max_attempts} attempts."
  echo "If logs show timeout errors to /api or /openapi on a 10.x.x.x endpoint, the runner cannot reliably reach the Kubernetes API server."
  echo "Use a self-hosted runner in your private network/VPN path for deploy jobs."
  return 1
}

if [[ $1 == 'tear_down' ]]; then
  export KUBE_NAMESPACE=$BRANCH_ENV
  export DRONE_SOURCE_BRANCH=$(cat /root/.dockersock/branch_name.txt)

  run_kd "${kd[@]}" --delete -f kube/app -f kube/hpa.yml
  echo "Torn Down Branch - $DRONE_SOURCE_BRANCH.internal.branch.sas-notprod.homeoffice.gov.uk"
  exit 0
fi

export KUBE_NAMESPACE=$1
export DRONE_SOURCE_BRANCH=$(echo $DRONE_SOURCE_BRANCH | tr '[:upper:]' '[:lower:]' | tr '/' '-')

if [[ ${KUBE_NAMESPACE} == ${BRANCH_ENV} ]]; then
  run_kd "${kd[@]}" -f kube/certs
  run_kd "${kd[@]}" -f kube/app -f kube/hpa.yml
elif [[ ${KUBE_NAMESPACE} == ${UAT_ENV} ]]; then
  run_kd "${kd[@]}" -f kube/app -f kube/hpa.yml
elif [[ ${KUBE_NAMESPACE} == ${STG_ENV} ]]; then
  run_kd "${kd[@]}" -f kube/app -f kube/hpa.yml
elif [[ ${KUBE_NAMESPACE} == ${PROD_ENV} ]]; then
  run_kd "${kd[@]}" -f kube/app/service.yml
  run_kd "${kd[@]}" -f kube/app/networkpolicy-external.yml -f kube/app/ingress-external.yml
  run_kd "${kd[@]}" -f kube/app/deployment.yml -f kube/hpa.yml
fi

sleep $READY_FOR_TEST_DELAY

if [[ ${KUBE_NAMESPACE} == ${BRANCH_ENV} ]]; then
  echo "Branch - web-messengers-$DRONE_SOURCE_BRANCH.internal.branch.sas-notprod.homeoffice.gov.uk"
fi
