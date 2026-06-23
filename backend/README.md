# TeamBoard Backend

NestJS, GraphQL, MongoDB, RabbitMQ, and Docker backend for the TeamBoard assessment.

## What Is Included

- JWT auth with access/refresh tokens, HTTP-only cookies, and bearer-token support.
- User profile update flow.
- Project module with ownership/shared-member access checks.
- Task module with CRUD, richer board fields, and RabbitMQ lifecycle events.
- MongoDB schemas, GraphQL entities, DTO validation, services, resolvers, and Jest tests.
- Docker Compose for backend, MongoDB, and RabbitMQ.
- Seed data for quick local testing.
- Postman collection at `postman/TeamBoard.postman_collection.json`.

## Architecture

The backend is currently a modular monolith. Each business area has its own module, schema provider, DTOs, resolver, and service:

- `AuthModule`: registration, login, refresh, logout, JWT strategy, current-user context.
- `UserModule`: user persistence and profile updates.
- `ProjectModule`: project persistence, ownership checks, team-member access.
- `TaskModule`: task persistence, project-scoped access checks, RabbitMQ task events.
- `common/interfaces`: shared TypeScript contracts that can later become a shared package.
- `common/messaging`: RabbitMQ client setup for service-to-service/event communication.

This gives you clean boundaries today while keeping the path open to split into services later.

## Local Setup

```bash
pnpm install
cp .env.example .env
pnpm run start:dev
```

GraphQL runs at:

```bash
http://localhost:3000/graphql
```

## Docker Setup

```bash
pnpm run docker:up
pnpm run docker:logs
pnpm run docker:down
```

Compose starts:

- Backend: `http://localhost:3000/graphql`
- MongoDB: `localhost:27017`
- RabbitMQ: `localhost:5672`
- RabbitMQ management UI: `http://localhost:15672` with `teamboard / teamboard`

## Environment

```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/teamboard
JWT_ACCESS_SECRET=replace-with-a-long-random-secret
JWT_REFRESH_SECRET=replace-with-a-different-long-random-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
RABBITMQ_URL=amqp://teamboard:teamboard@localhost:5672
RABBITMQ_QUEUE=teamboard_events
```

If JWT secrets are not provided locally, the app uses generated development fallbacks from `src/auth/constants.ts`. For production, always set real environment secrets.

## Seed Data

```bash
pnpm run seed
```

Seed users:

- `ada@teamboard.local` / `Password123!`
- `grace@teamboard.local` / `Password123!`

The seed also creates sample projects and tasks.

## GraphQL Surface

Auth:

- `register(registerInput)`
- `login(loginInput)`
- `refreshToken`
- `logout`
- `me`

Users:

- `currentUser`
- `updateCurrentUser(userInput)`

Projects:

- `projects`
- `project(id)`
- `createProject(projectInput)`
- `updateProject(projectInput)`
- `deleteProject(id)`

Tasks:

- `tasks(projectId)`
- `task(id)`
- `createTask(taskInput)`
- `updateTask(taskInput)`
- `deleteTask(id)`

Authenticated requests can use either the HTTP-only access-token cookie or:

```http
Authorization: Bearer <accessToken>
```

## RabbitMQ Communication

The task service publishes lifecycle events:

- `task.created`
- `task.updated`
- `task.deleted`

`TaskEventsController` consumes those events over Nest's RabbitMQ transport. This demonstrates service-to-service/event communication inside the current modular monolith. If split later, the task API service can publish the same events and another worker/service can consume them without changing the event contract.

## Extending To Microservices

A practical split would be:

- `auth-service`: owns users, credentials, JWT issuing, auth events.
- `project-service`: owns projects, project membership, project permissions.
- `task-service`: owns tasks, task lifecycle events, task queries.
- `api-gateway`: exposes GraphQL/REST to the frontend and routes to services.

Recommended communication pattern:

- Use gRPC for synchronous service-to-service calls that need immediate answers, such as `AuthService.ValidateToken`, `ProjectService.AssertProjectAccess`, or `UserService.GetUserSummary`.
- Use Kafka for durable event streams, such as `TaskCreated`, `TaskStatusChanged`, `ProjectMemberAdded`, and `UserRegistered`.
- Keep RabbitMQ for local/worker-style queues if you need task queues, retries, and simple command dispatch. Move to Kafka when event history, replay, and multiple independent consumers matter.

Example evolution:

1. Extract protobuf contracts into `/contracts`.
2. Move shared interfaces from `src/common/interfaces` into a versioned package.
3. Split Mongo collections by service ownership.
4. Replace direct provider imports with gRPC clients at module boundaries.
5. Publish domain events to Kafka from each service after successful writes.
6. Keep the GraphQL gateway thin: auth, request shaping, and orchestration only.

## Postman

Import this file directly into Postman:

```bash
postman/TeamBoard.postman_collection.json
```

Run `Auth - Login` first. Its test script stores `accessToken` for the protected project/task/user requests.

## Tests

```bash
pnpm run test
pnpm run test:cov
pnpm run test:e2e
```

The unit tests cover auth, user, project, task, resolver endpoints, and RabbitMQ event handlers.
