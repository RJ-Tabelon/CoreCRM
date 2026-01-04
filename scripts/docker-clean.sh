#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! docker info >/dev/null 2>&1; then
  echo "Docker does not appear to be running. Start Docker Desktop and retry." >&2
  exit 1
fi

# This removes ONLY CoreCRM dev/prod compose stacks and their named volumes.
# It does NOT run global prune commands.

docker compose -p corecrm-dev --env-file "$ROOT_DIR/.env.development" -f "$ROOT_DIR/docker-compose.dev.yml" down -v --remove-orphans || true
docker compose -p corecrm-prod --env-file "$ROOT_DIR/.env.production" -f "$ROOT_DIR/docker-compose.prod.yml" down -v --remove-orphans || true

echo "CoreCRM docker resources removed (dev/prod stacks + volumes)."
