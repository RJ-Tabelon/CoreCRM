# Multi-stage Dockerfile for Node.js CoreCRM application

# Use Debian slim to avoid slow/fragile native builds on Alpine (e.g., bcrypt)
FROM node:18-slim AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund


FROM node:18-slim AS production

WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => { process.exit(1) })"

CMD ["npm", "start"]


FROM node:18-slim AS development

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .

USER node

EXPOSE 3000

CMD ["npm", "run", "dev"]