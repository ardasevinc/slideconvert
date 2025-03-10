# bun base
FROM oven/bun:1 AS base
WORKDIR /app

# deps caching, full monorepo
FROM base AS deps
RUN mkdir -p /temp/dev
# copy root package.json and lockfile
COPY ./package.json ./bun.lock /temp/dev/
# copy slideconvert-web package.json
COPY ./apps/slideconvert-web/package.json /temp/dev/apps/slideconvert-web/
# copy the workspace package (adjust path if diff)
COPY ./packages/prettier-config/package.json /temp/dev/packages/prettier-config/
RUN cd /temp/dev && bun install --frozen-lockfile

# prod deps
RUN mkdir -p /temp/prod
COPY ./package.json ./bun.lock /temp/prod/
COPY ./apps/slideconvert-web/package.json /temp/prod/apps/slideconvert-web/
COPY ./packages/prettier-config/package.json /temp/prod/packages/prettier-config/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /temp/dev/node_modules ./node_modules
COPY ./apps/slideconvert-web/ ./apps/slideconvert-web/
COPY ./packages/prettier-config/ ./packages/prettier-config/
COPY ./package.json ./bun.lock ./
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN cd apps/slideconvert-web && bun run build

# runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy the entire standalone dir, including its internal structure, to /app
COPY --from=builder /app/apps/slideconvert-web/.next/standalone ./
# Copy public dir for static assets (like images)
COPY --from=builder /app/apps/slideconvert-web/public ./apps/slideconvert-web/public

# Set working dir to where server.js lives
WORKDIR /app/apps/slideconvert-web

USER bun
EXPOSE 3000

# Run server.js from /app/apps/slideconvert-web
CMD ["bun", "server.js"]