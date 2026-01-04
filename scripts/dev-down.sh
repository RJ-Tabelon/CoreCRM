#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! docker info >/dev/null 2>&1; then
  echo "Docker does not appear to be running. Start Docker Desktop and retry." >&2
  exit 1
fi

PROJECT_NAME="corecrm-dev"
ENV_FILE="$ROOT_DIR/.env.development"
COMPOSE_FILE="$ROOT_DIR/docker-compose.dev.yml"

exec docker compose \
  -p "$PROJECT_NAME" \
  --env-file "$ENV_FILE" \
  -f "$COMPOSE_FILE" \
  down --remove-orphans
