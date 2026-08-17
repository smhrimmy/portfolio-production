#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../.."

if [[ ! -f .env ]]; then
  cp .env.example .env
fi

api_port="${PORT:-3001}"
health_url="http://127.0.0.1:${api_port}/health"

api_ready() {
  curl -sf "$health_url" >/dev/null 2>&1
}

if api_ready; then
  echo "Portfolio API server already running on port ${api_port}"
  exit 0
fi

nohup npx tsx server/index.ts >> /tmp/portfolio-api.log 2>&1 &
echo "$!" > /tmp/portfolio-api.pid

for _ in $(seq 1 30); do
  if api_ready; then
    echo "Portfolio API server listening on port ${api_port}"
    exit 0
  fi
  sleep 1
done

echo "Portfolio API server failed to start within 30 seconds" >&2
tail -n 40 /tmp/portfolio-api.log >&2 || true
exit 1
