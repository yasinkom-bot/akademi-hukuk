FROM node:20-alpine AS base

# Install postgresql-client for pg_dump / pg_restore
RUN apk add --no-cache postgresql-client

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm i --legacy-peer-deps

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "server.js"]
