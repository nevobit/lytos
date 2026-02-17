FROM node:lts-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm turbo

COPY turbo.json ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/rest ./apps/rest

FROM node:lts AS installer
WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app .
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile

COPY --from=builder /app .

# RUN pnpm turbo run build --filter=rest...

FROM node:lts AS runner
WORKDIR /app
RUN npm install -g pnpm

COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/packages ./packages

COPY --from=installer /app/apps/rest ./apps/rest

EXPOSE 8000

CMD ["pnpm", "--filter", "rest", "run", "dev"]