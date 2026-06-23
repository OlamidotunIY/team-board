FROM node:22-alpine AS base

WORKDIR /app

RUN npm install -g pnpm@10.33.0

COPY package.json pnpm-lock.yaml ./

FROM base AS dependencies
RUN pnpm install --frozen-lockfile

FROM dependencies AS build
COPY . .
RUN pnpm build

FROM node:22-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g pnpm@10.33.0

COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["pnpm", "start:prod"]
