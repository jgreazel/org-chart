# pokemon-team-builder

First implementation slice for the pokemon-team-builder initiative.

## Included in this slice

- Backend Express API with:
  - GET /health
  - GET /api/types/chart
  - GET /api/gyms?generation=1-9
- Frontend Vite app that reads API health, type count, and Gen 1 gym sample
- Shared TypeScript contracts in libs/shared-types
- Dockerfiles and docker compose setup

## Local run

1. Install dependencies:

   npm install

2. Start backend:

   npm run dev:backend

3. Start frontend in another terminal:

   npm run dev:frontend

4. Open:

   http://localhost:3000

## Docker run

From infra:

docker compose up --build

Then open:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001/health
