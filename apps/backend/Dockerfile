FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
COPY packages/common/package.json packages/common/
COPY packages/database/package.json packages/database/
COPY apps/backend/package.json apps/backend/

RUN bun install

COPY packages/common packages/common/
COPY packages/database packages/database/
COPY apps/backend apps/backend/

RUN cd packages/database && bunx prisma generate


FROM oven/bun:1-alpine AS runtime

WORKDIR /app/apps/backend

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/packages /app/packages
COPY --from=builder /app/apps/backend /app/apps/backend

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "cd /app/packages/database && bunx prisma migrate deploy && cd /app/apps/backend && bun src/index.ts"]