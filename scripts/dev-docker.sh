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

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE. Create it (see .env.example) and retry." >&2
  exit 1
fi

# Validate required Neon Local settings (do not print values)
if ! grep -Eq '^[[:space:]]*NEON_PROJECT_ID=.+$' "$ENV_FILE"; then
  echo "Missing NEON_PROJECT_ID in .env.development (required for Neon Local)." >&2
  exit 1
fi

if ! grep -Eq '^[[:space:]]*NEON_API_KEY=.+$' "$ENV_FILE"; then
  echo "Missing NEON_API_KEY in .env.development (required for Neon Local)." >&2
  exit 1
fi

exec docker compose \
  -p "$PROJECT_NAME" \
  --env-file "$ENV_FILE" \
  -f "$COMPOSE_FILE" \
  up --build
