# =======================================================
# LearnLens AI — Production Multi-Stage Dockerfile
# =======================================================

# Stage 1: Build Frontend Assets
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build production bundle
COPY . .
RUN npm run build

# Stage 2: Production Execution Environment
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled frontend and server entrypoint
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts

EXPOSE 3000

# Start production server
CMD ["npx", "tsx", "server.ts"]
