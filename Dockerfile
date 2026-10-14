# Multi-stage Dockerfile for RandomEats

# 1. Build Stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy root and workspace package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install all dependencies (workspaces)
RUN npm ci

# Copy source files
COPY . .

# Build both server (TypeScript) and client (Vite React SPA)
RUN npm run build

# 2. Production Runner Stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Install production dependencies for server
COPY package*.json ./
COPY server/package*.json ./server/
RUN npm ci --omit=dev --workspace=server

# Copy compiled artifacts
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/data ./server/data
COPY --from=builder /app/client/dist ./client/dist

EXPOSE 5000

# Start unified production server (serves API + React frontend)
CMD ["node", "server/dist/server.js"]
