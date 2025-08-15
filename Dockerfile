FROM node:20-alpine3.20 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./

RUN pnpm i --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json /app
COPY . .

# Generates prisma files for linting

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm exec prisma generate

ENV NEXT_TELEMETRY_DISABLED 1

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/package.json /app
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copies prisma files for linting
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Install prisma for migration
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
#     apk add --no-cache bash && \
#     VERSION=$(node -e 'console.log(require("./package.json").devDependencies.prisma)') && \
#     pnpm add prisma@$VERSION

EXPOSE 3000

ENV PORT 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output

CMD npx prisma migrate deploy && HOSTNAME="0.0.0.0" node server.js
# CMD HOSTNAME="0.0.0.0" node server.js