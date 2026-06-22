# TeamBoard Backend

NestJS, GraphQL, MongoDB, and Redis backend for the TeamBoard assessment.

## Architecture

This is a modular monolith shaped so it can split into services later:

- `AuthModule` handles signup, login, refresh, logout, JWT guards, and current-user context.
- `UserModule` owns user persistence.
- `ProjectModule` owns project persistence and project-level access checks.
- `TaskModule` owns task persistence and publishes Redis events for task lifecycle changes.
- `common/interfaces` contains small shared TypeScript contracts that can be copied or promoted into a shared package for frontend/backend type sharing.

Extra-credit pieces included: Docker Compose orchestration for backend, MongoDB, and Redis; Redis microservice transport/event publishing; modular service boundaries; DTO validation; minimal auth unit coverage.

## Project Setup

```bash
pnpm install
cp .env.example .env
```

## Run Locally

```bash
pnpm run start:dev
```

The API runs on `http://localhost:3000/graphql`.

## Docker

```bash
pnpm run docker:up
pnpm run docker:logs
pnpm run docker:down
```

Docker Compose starts the backend, MongoDB, and Redis. MongoDB and Redis are exposed on `27017` and `6379` by default.

## Environment

Required production variables:

```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/teamboard
JWT_ACCESS_SECRET=replace-with-a-long-random-secret
JWT_REFRESH_SECRET=replace-with-a-different-long-random-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
REDIS_HOST=localhost
REDIS_PORT=6379
```

## GraphQL Surface

- Auth: `register`, `login`, `refreshToken`, `logout`, `me`
- Projects: `createProject`, `updateProject`, `deleteProject`, `projects`, `project`
- Tasks: `createTask`, `updateTask`, `deleteTask`, `tasks`, `task`

Authenticated requests can use either the HTTP-only access-token cookie or an `Authorization: Bearer <token>` header.

## Tests

```bash
pnpm run test
pnpm run test:e2e
pnpm run test:cov
```
