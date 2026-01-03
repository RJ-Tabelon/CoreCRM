# CoreCRM Backend Docker + Neon

This backend is containerized to use Neon in two modes:

- Development: runs Neon Local in Docker and auto-creates ephemeral branches.
- Production: connects directly to your Neon cloud database; no local proxy.

## Prerequisites

- Docker Desktop 4.30+ (Compose v2)
- Neon API key and project ID (for Neon Local)

## Environment files

- `.env.development` — local dev with Neon Local (uses `postgres://neon:npg@neon-local:5432/corecrm?sslmode=require`).
- `.env.production` — production settings pointing at your Neon cloud URL.

Both files are templates; fill in secrets before running.

## Run locally with Neon Local (ephemeral branches)

1. Set environment values in `.env.development`:
   - `NEON_API_KEY` and `NEON_PROJECT_ID`
   - `PARENT_BRANCH_ID` (parent branch to fork per run)
2. Start the stack:
   ```bash
   docker compose -f docker-compose.dev.yml --env-file .env.development up --build
   ```

   - Services: `neon-local` proxy and `app` (runs `npm run dev`).
   - Database URL inside the Compose network: `postgres://neon:npg@neon-local:5432/corecrm?sslmode=require`.
   - Each up/down creates and deletes an ephemeral Neon branch via the proxy.
3. App is available at http://localhost:3000 and uses the Neon Local branch.
4. Stop with `docker compose -f docker-compose.dev.yml down`.

## Run with Neon cloud (production-ish)

1. Set `DATABASE_URL` in `.env.production` to your Neon cloud URL (e.g. `...neon.tech...`).
2. Build and run:
   ```bash
   docker compose -f docker-compose.prod.yml --env-file .env.production up --build -d
   ```
3. App is available at http://localhost:3000 and talks directly to Neon cloud. No Neon Local service is started.

## How DATABASE_URL switches

- Dev: `.env.development` sets `DATABASE_URL=postgres://neon:npg@neon-local:5432/corecrm?sslmode=require` and `NEON_LOCAL=true`, enabling Neon Local driver settings.
- Prod: `.env.production` sets `DATABASE_URL` to the Neon cloud URL. `NEON_LOCAL` is unset, so the default serverless driver settings are used.

## Notes

- Neon Local metadata is stored in `./.neon_local/` and is ignored by git.
- To persist a dev branch between runs, change `PARENT_BRANCH_ID` to `BRANCH_ID` and add `DELETE_BRANCH=false` in `docker-compose.dev.yml`.
- The backend Dockerfile exposes port 3000 and defaults to `npm start`; dev compose overrides with `npm run dev` and live-mounted source.
