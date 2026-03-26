# Technical Spec

## Metadata

- Initiative: pokemon-team-builder
- Owner: VP Engineering
- Date: 2026-03-26

## Architecture Overview

Monorepo with two primary workloads: an Angular SPA (frontend) and a Node.js/TypeScript REST API (backend). Both containerized via Docker. Deployed to Azure Container Apps on the Consumption plan (free tier). Optimized for 0–5 concurrent users at MVP with near-zero monthly cost.

## Monorepo Structure

```
pokemon-team-builder/
├── apps/
│   ├── frontend/          # Angular 17+ SPA (TypeScript)
│   └── backend/           # Node.js + Express (TypeScript)
├── libs/
│   └── shared-types/      # Shared TypeScript interfaces
├── infra/
│   ├── docker-compose.yml # Local dev
│   └── bicep/             # Azure Container Apps deployment
├── .github/
│   └── workflows/         # GitHub Actions CI/CD
└── package.json           # npm workspaces root
```

## System Components

### Frontend — apps/frontend
- Angular 17+ SPA served as static files via nginx container.
- Responsibilities: team builder UI, type chart display, gym viability display, Google AdSense integration, ad-disable flag (localStorage), shareable URL encoding.
- State: Angular Signals; team persisted in localStorage and URL params.
- Animations: Angular Animations API + CSS keyframes.

### Backend — apps/backend
- Node.js + Express (TypeScript) REST API.
- Responsibilities: PokeAPI proxy with in-memory LRU cache, type chart logic (static JSON), gym leader data (static JSON), Stripe webhook handler.
- No database at MVP: all data is static JSON or in-memory.

### Shared Types — libs/shared-types
- TypeScript interfaces shared between frontend and backend (Pokemon, GymLeader, TypeMatchup, etc.).

### Infrastructure — infra/
- Docker Compose for local development (frontend + backend containers).
- Bicep templates for Azure Container Apps (Consumption plan, min replicas = 0).
- Docker Hub free tier as container registry (avoids ~$5/mo ACR cost).

## Data and API Contracts

| Endpoint | Method | Description |
|---|---|---|
| `/api/pokemon/search?q=<name>` | GET | Search Pokemon by name; returns id, name, types, sprite URL |
| `/api/pokemon/:id` | GET | Get single Pokemon detail |
| `/api/gyms?generation=<1-9>` | GET | Get all gym leaders for a generation with their Pokemon types |
| `/api/types/chart` | GET | Get full 18x18 type effectiveness matrix |
| `/api/payments/webhook` | POST | Stripe webhook; returns ad-disable confirmation |

## Dependencies

| Dependency | Purpose | Cost |
|---|---|---|
| PokeAPI (pokeapi.co) | Pokemon data source | Free, no key required |
| Google AdSense | Monetization | Free (revenue share) |
| Stripe Checkout | One-time ad-disable purchase | Free + transaction fees |
| Azure Container Apps (Consumption) | Hosting | ~$0 at 0–5 users |
| Docker Hub free tier | Container registry | Free |
| GitHub Actions free tier | CI/CD | Free (2,000 min/mo) |

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| PokeAPI downtime | In-memory LRU cache (TTL 24h) + static fallback JSON for critical data |
| AdSense approval delay | Feature-flag via `ADS_ENABLED` env var; launch without ads initially |
| Stripe setup complexity | Use Stripe Checkout hosted page; minimal custom backend code |
| Azure cold start (min replicas=0) | Acceptable at MVP scale; document known cold-start latency |
| Type chart data accuracy | Data-driven Jest unit tests for all 18×18 type matchup combinations |

## Test Strategy

- **Unit**: Jest for backend services; Angular Testing Library + Jest for frontend components.
- **Integration**: Supertest for API endpoint contracts.
- **E2E**: Playwright for happy-path flows (team builder, gym viability, ad toggle).
- **Data accuracy**: Jest data-driven tests for the full type matchup table.

## Rollout and Rollback Plan

- Deploy via GitHub Actions on merge to `main`.
- Each deploy pushes a new Docker image tagged with git SHA.
- Rollback: re-deploy previous image tag via `az containerapp update`.
- Feature flags: `ADS_ENABLED`, `PAYMENTS_ENABLED` env vars.

## CI/CD Pipeline (GitHub Actions)

```
on: push to main
jobs:
  1. lint-and-test     # frontend + backend in parallel
  2. build-and-push    # Docker images to Docker Hub
  3. deploy            # az containerapp update (frontend + backend)
```

## Traceability To Product Spec

| User Story | Technical Component |
|---|---|
| US-1 (Pokemon search) | `/api/pokemon/search` + frontend search component |
| US-2 (Type coverage) | `/api/types/chart` + frontend type chart component |
| US-3 (Gym viability) | `/api/gyms` + frontend gym viability component |
| US-4 (Mobile-first) | Angular responsive design, nginx static serving |
| US-5 (Ad disable) | Stripe webhook + localStorage flag + Angular ad component |
