FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY package.json bun.lock ./
COPY packages/common/package.json packages/common/
COPY packages/database/package.json packages/database/
COPY apps/executer/package.json apps/executer/

RUN bun install

COPY packages/common packages/common/
COPY packages/database packages/database/
COPY apps/executer apps/executer/

RUN cd packages/database && bunx prisma generate


FROM oven/bun:1-alpine AS runtime

WORKDIR /app/apps/executer

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/packages /app/packages
COPY --from=builder /app/apps/executer /app/apps/executer

ENV NODE_ENV=production

CMD ["sh", "-c", "cd /app/packages/database && bunx prisma migrate deploy && cd /app/apps/executer && bun src/index.ts"]
