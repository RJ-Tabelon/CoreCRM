# Docker (Dev/Prod)

## Prereqs

- Docker Desktop
- Configure env files (no manual swapping):
  - `.env.development` for dev
  - `.env.production` for prod

## Development

Run Neon Local + backend (hot reload) + frontend (Vite HMR):

```bash
npm run dev:docker
```

Stops and removes dev containers:

```bash
npm run dev:docker:down
```

URLs:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

Database (inside Docker network):

- `DATABASE_URL=postgres://neon:npg@neon-local:5432/corecrm?sslmode=no-verify`
- Backend uses Neon serverless driver fetch endpoint: `http://neon-local:5432/sql`

Run Drizzle migrations:

```bash
docker compose -p corecrm-dev --env-file .env.development -f docker-compose.dev.yml exec backend npm run db:migrate
```

## Production

Build frontend and serve via Nginx, reverse-proxying `/api` to the backend:

```bash
npm run prod:docker
```

Stops and removes prod containers:

```bash
npm run prod:docker:down
```

URLs:

- App (Nginx): http://localhost
- API (via Nginx): http://localhost/api

Run Drizzle migrations (targets your Neon Cloud `DATABASE_URL`):

```bash
docker compose -p corecrm-prod --env-file .env.production -f docker-compose.prod.yml exec backend npm run db:migrate
```

## Troubleshooting

- Ports in use: stop conflicting processes or change host ports in compose (`3000`, `5173`, `5432`, `80`).
- Vite not reachable: ensure it binds to `0.0.0.0` (handled by the container command) and port `5173` is published.
- Containers can’t reach `localhost`: inside Docker, use service names (`neon-local`, `backend`).
- Neon Local issues:
  - Ensure `NEON_API_KEY` + `NEON_PROJECT_ID` are set in `.env.development`.
  - If Git branch detection is flaky on macOS, use Docker Desktop gRPC FUSE (Neon Local docs mention VirtioFS issues).
