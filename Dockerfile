# syntax=docker/dockerfile:1
# Multi-env image for value-arrendadora (Next.js 16, standalone output).
# One Dockerfile for local / development / production - pick the per-env
# NEXT_PUBLIC_* values at BUILD time via --build-arg BUILD_ENV=<env>.
# Runtime-only values are injected via env_file (see docker-compose.*.yml).

# -- base ---------------------------------------------------------
# node:22-alpine: Yarn 4 (Berry) requires Node >= 18.12; Next 16 requires >= 20.9.
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
# This repo uses Yarn 4 (packageManager field + .yarnrc.yml), NOT the Yarn 1
# classic bundled with the node image. Corepack provisions the pinned version.
RUN corepack enable

# -- deps ---------------------------------------------------------
FROM base AS deps
COPY package.json yarn.lock .yarnrc.yml ./
# Yarn 4 equivalent of `--frozen-lockfile`: fails the build if yarn.lock is out
# of sync instead of silently mutating it.
RUN yarn install --immutable

# -- builder ------------------------------------------------------
FROM base AS builder
# Which env file supplies the baked NEXT_PUBLIC_* values: development | production
ARG BUILD_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# `next build` runs in production mode and loads .env.production.local first.
# Copy the chosen env there so its NEXT_PUBLIC_* values get inlined into the bundle.
RUN cp ".env.${BUILD_ENV}" .env.production.local 2>/dev/null || true
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn build

# -- runner -------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
# Standalone server + assets only (minimal runtime)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
