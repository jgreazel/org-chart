# CTO Decision Memo — pokemon-team-builder

- Date: 2026-03-26
- Author: Vision-to-Execution CTO Agent
- Status: APPROVED FOR IMPLEMENTATION

---

## Summary

The pokemon-team-builder MVP is a well-scoped, cost-near-zero web application. The product concept is clear, the stack is proven, and the constraints (0–5 users, free tiers, TypeScript everywhere, Angular frontend, Docker + Azure Container Apps) are fully compatible with the goals. All three hard decision gates are GREEN. Implementation is authorized to begin.

---

## Gate Review

### Requirement Gate — GREEN

- User stories US-1 through US-5 are well-defined and cover the full MVP scope.
- Acceptance criteria are specific and testable (e.g., "7th Pokemon blocked with friendly message," "375px usable," "ads hidden after purchase").
- Scope is appropriately bounded: no accounts, no PvP, no SSR at MVP.
- Open questions resolved: team state uses localStorage + URL params; Gen 1–9 at launch; name-only search at MVP.

### UX Gate — GREEN

- Mobile-first (375px baseline → 1440px) is a clear, actionable directive.
- Animation requirements are specific: slot add/remove, gym results reveal, type badge hover.
- Semi-professional + Pokemon-inspired aesthetic is coherent and achievable with Angular Animations + CSS keyframes.
- WCAG AA accessibility baseline is appropriate for MVP.
- No blockers to UX implementation.

### Architecture Gate — GREEN

- Angular 17+ SPA + Node.js/Express (TypeScript) is a proven, maintainable stack.
- Docker containers ensure cloud-agnosticism; Azure Container Apps Consumption plan (min replicas=0) targets ~$0/mo at MVP scale.
- npm workspaces monorepo is appropriately lean for 2 apps at MVP (no Nx overhead).
- PokeAPI (free, no key) is the correct data source; in-memory LRU cache mitigates reliability risk.
- Static JSON for gym leader data (DEC-006) is the right call — PokeAPI gym coverage is unreliable.
- Docker Hub free tier eliminates ~$5/mo ACR cost.
- GitHub Actions CI/CD (lint+test → build+push → deploy) is standard and sufficient.

---

## Key Decisions (Summary)

| ID      | Decision                                                |
| ------- | ------------------------------------------------------- |
| DEC-001 | Spec artifacts are source of truth                      |
| DEC-002 | Team state: localStorage (persist) + URL params (share) |
| DEC-003 | Docker Hub free tier over Azure Container Registry      |
| DEC-004 | npm workspaces over Nx at MVP                           |
| DEC-005 | Angular SSR deferred to post-MVP                        |
| DEC-006 | Gym leader data as curated static JSON (not PokeAPI)    |

---

## Tradeoffs Accepted

| Tradeoff                | Accepted Risk                                 | Rationale                                              |
| ----------------------- | --------------------------------------------- | ------------------------------------------------------ |
| Min replicas = 0        | Cold start latency (~2–5s first request)      | Acceptable at 0–5 users; saves cost                    |
| Static gym JSON         | Manual curation effort (Gen 1–9)              | PokeAPI gym data unreliable; accuracy worth the effort |
| No SSR                  | No SEO at launch                              | 0–5 users don't need organic search traffic yet        |
| AdSense feature-flagged | Delayed monetization if AdSense approval slow | Risk mitigated by `ADS_ENABLED` env var                |

---

## Open Items Before First Commit

1. Create Stripe account and obtain webhook secret.
2. Create Google AdSense account (start approval process early — can take weeks).
3. Create Docker Hub org/repo for container images.
4. Create Azure subscription and Container Apps environment.
5. Set up GitHub repo with npm workspaces scaffold.

---

## Authorized Next Steps

1. **Engineering**: Scaffold monorepo (`apps/frontend`, `apps/backend`, `libs/shared-types`, `infra/`).
2. **Engineering**: Write gym leader static JSON data files (gen-1 through gen-9).
3. **Engineering**: Implement `/api/types/chart` and type coverage logic first (core domain).
4. **Engineering**: Build Angular team builder UI (US-1) with animations.
5. **Product**: Review first working build against acceptance criteria AC-1 through AC-8.

---

## CTO Revalidation Addendum (2026-03-25)

- Author: Vision-to-Execution CTO Agent
- Prior Memo Status: APPROVED FOR IMPLEMENTATION
- Addendum Status: CONDITIONAL GO (implementation planning GO, feature coding HOLD pending gate hardening)

### Consolidated Handoff Outcome

- Product track (Head of Product Engineering): AMBER due operational acceptance detail gaps.
- Engineering track (VP Engineering): GREEN architecture and execution sequence confirmed.
- Final CTO call: Preserve scope and architecture, but enforce hard decision-gate discipline before coding.

### Hard Gate Recheck

- Requirement Gate: GREEN (acceptance traceability artifact published)
- UX Gate: AMBER (operational checklist published; execution evidence pending)
- Architecture Gate: GREEN

### Required Exit Criteria To Return Gates GREEN

1. Execute acceptance traceability checks and convert rows into QA cases.
2. Execute UX operational checklist with evidence capture at 375px and 1440px.
3. Confirm owner and target date for execution checkpoints in delivery status.

### Gate-Hardening Artifacts Published

1. docs/specs/pokemon-team-builder/acceptance-traceability-addendum.md
2. docs/specs/pokemon-team-builder/ux-accessibility-operational-checklist.md

### Implementation Sequence (Approved While Gates Are AMBER)

1. Ticketize first five engineering tasks (monorepo scaffold, type chart endpoint, shared types, gym data loader, frontend skeleton).
2. Prepare CI/CD and local docker workflow.
3. Do not merge new feature code until Requirement and UX gates are GREEN.
