# Multi-stage build: build React app with Vite, then serve via Nginx

FROM node:20-alpine AS builder

WORKDIR /app

# Install deps
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# Build
COPY frontend ./frontend
RUN cd frontend && npm run build

FROM nginx:1.27-alpine

# Replace default site config with our reverse-proxy + SPA config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Static assets
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

EXPOSE 80
