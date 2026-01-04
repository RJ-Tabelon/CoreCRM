# CoreCRM

## Docker (Dev/Prod)

### Prereqs

- Docker Desktop
- Create a root `.env` file (copy from `.env.example`)

### Development

Run Neon Local + backend (hot reload) + frontend (Vite HMR):

```bash
docker compose -f docker-compose.dev.yml up --build
```

URLs:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

Database (inside Docker network):

- `DATABASE_URL=postgres://neon:npg@neon-local:5432/corecrm?sslmode=no-verify`
- Backend uses Neon serverless driver fetch endpoint: `http://neon-local:5432/sql`

Run Drizzle migrations:

```bash
docker compose -f docker-compose.dev.yml exec backend npm run db:migrate
```

### Production

Build frontend and serve via Nginx, reverse-proxying `/api` to the backend:

```bash
docker compose -f docker-compose.prod.yml up --build
```

URLs:

- App (Nginx): http://localhost
- API (via Nginx): http://localhost/api

Run Drizzle migrations (targets your Neon Cloud `DATABASE_URL`):

```bash
docker compose -f docker-compose.prod.yml exec backend npm run db:migrate
```

### Troubleshooting

- Ports in use: stop conflicting processes or change host ports in compose (`3000`, `5173`, `5432`, `80`).
- Vite not reachable: ensure it binds to `0.0.0.0` (handled by the container command) and port `5173` is published.
- Containers can’t reach `localhost`: inside Docker, use service names (`neon-local`, `backend`).
- Neon Local issues:
  - Ensure `NEON_API_KEY` + `NEON_PROJECT_ID` are set in root `.env`.
  - If Git branch detection is flaky on macOS, use Docker Desktop gRPC FUSE (Neon Local docs mention VirtioFS issues).
