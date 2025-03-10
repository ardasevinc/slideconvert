# bun base, still fire
FROM oven/bun:1 AS base
WORKDIR /app

# deps caching, monorepo style
FROM base AS deps
RUN mkdir -p /temp/dev
COPY ./apps/slideconvert-web/package.json ./apps/slideconvert-web/bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# prod deps, no fluff
RUN mkdir -p /temp/prod
COPY ./apps/slideconvert-web/package.json ./apps/slideconvert-web/bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# build stage, scoped to slideconvert-web
FROM base AS builder
WORKDIR /app
COPY --from=deps /temp/dev/node_modules ./node_modules
COPY ./apps/slideconvert-web/ .

# telemetry off, keep it clean
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# build it
RUN bun run build

# final image, just the essentials
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# copy standalone output from the subdir
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# run as bun user
USER bun
EXPOSE 3000

# nextjs standalone server.js, bun handles it
CMD ["bun", "server.js"]