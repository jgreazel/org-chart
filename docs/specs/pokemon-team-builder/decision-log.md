# Decision Log

## DEC-001

- Date: 2026-03-26
- Decision ID: DEC-001
- Context: Initiative bootstrap for pokemon-team-builder
- Decision: Documentation artifacts created and designated as source of truth per documentation-contract.md. Initiative slug confirmed as `pokemon-team-builder`.
- Alternatives Considered: None — bootstrap is required process.
- Impact: All future work traces to these artifacts.
- Follow-up Actions: Fill product-spec and technical-spec fully before implementation begins.

## DEC-002

- Date: 2026-03-26
- Decision ID: DEC-002
- Context: Team state persistence strategy
- Decision: Use both localStorage (persistence across refreshes) and URL params (shareable links). No backend persistence for teams at MVP.
- Alternatives Considered: Backend-stored teams with accounts (rejected — over-engineered for MVP); URL params only (rejected — poor UX if URL is lost).
- Impact: No backend database required at MVP; simpler delivery.
- Follow-up Actions: Define URL param schema in technical-spec.

## DEC-003

- Date: 2026-03-26
- Decision ID: DEC-003
- Context: Container registry selection
- Decision: Docker Hub free tier instead of Azure Container Registry to eliminate ~$5/mo ACR Basic cost.
- Alternatives Considered: Azure Container Registry Basic (~$5/mo — rejected for MVP cost target).
- Impact: Near-zero container registry cost at MVP. Re-evaluate if private registry needed post-MVP.
- Follow-up Actions: Configure Docker Hub org in GitHub Actions secrets.

## DEC-004

- Date: 2026-03-26
- Decision ID: DEC-004
- Context: Monorepo tooling selection
- Decision: npm workspaces (native, no extra tooling) over Nx for MVP. Nx overhead not justified at 2-app scale.
- Alternatives Considered: Nx (rejected — overhead not justified); Turborepo (viable but unnecessary at MVP scale).
- Impact: Simpler onboarding, less configuration overhead.
- Follow-up Actions: Revisit Nx if monorepo grows beyond 3 apps/libs.

## DEC-005

- Date: 2026-03-26
- Decision ID: DEC-005
- Context: Angular SSR consideration
- Decision: Defer Angular SSR (Universal) to post-MVP. SEO is not a launch requirement at 0–5 users.
- Alternatives Considered: SSR at launch (rejected — adds infra complexity; SEO not needed for MVP).
- Impact: Simpler deployment as static nginx container.
- Follow-up Actions: Track as post-MVP backlog item.

## DEC-006

- Date: 2026-03-26
- Decision ID: DEC-006
- Context: Gym leader data source
- Decision: Static JSON files in backend (not PokeAPI, not a database). PokeAPI's gym endpoint data is incomplete/inconsistent across generations.
- Alternatives Considered: PokeAPI gym endpoints (rejected — unreliable/incomplete for all gens); SQLite (rejected — unnecessary complexity at MVP).
- Impact: Manual curation of gym JSON files required; ensures accuracy.
- Follow-up Actions: Create apps/backend/data/gyms/gen-1.json through gen-9.json during backend implementation.

## DEC-007

- Date: 2026-03-25
- Decision ID: DEC-007
- Context: CTO orchestration rerun after agent tooling updates.
- Decision: Revalidated delivery with formal product and engineering handoffs. Architecture remains GREEN. Product readiness is AMBER until acceptance criteria operational checks are documented for AC-4, AC-6, and AC-8.
- Alternatives Considered: Immediate full implementation start (rejected - violates gate discipline when readiness is AMBER).
- Impact: Implementation planning and ticket preparation continue. New feature coding does not start until Requirement and UX operational checks return GREEN.
- Follow-up Actions: Publish acceptance traceability addendum and UX/a11y operational checklist; rerun hard gate checkpoint.

## DEC-008

- Date: 2026-03-25
- Decision ID: DEC-008
- Context: Gate-hardening artifacts requested by CTO after orchestration rerun.
- Decision: Published acceptance traceability and UX/a11y operational checklist artifacts in docs/specs/pokemon-team-builder. Requirement gate moved to GREEN. UX gate remains AMBER until checklist execution evidence is attached.
- Alternatives Considered: Keep Requirement gate AMBER until QA execution (rejected - requirement clarity objective already met by explicit pass/fail mapping).
- Impact: Hard-gate blocker narrows to UX execution evidence only.
- Follow-up Actions: QA and Web run checklist at 375px and 1440px, attach evidence, then rerun gate review.

## DEC-009

- Date: 2026-03-25
- Decision ID: DEC-009
- Context: Founder approved immediate QA and Web execution delegation under strict gate policy.
- Decision: Executed formal gate checkpoint with QA Quality Engineer and Product Engineering Manager - Web. Requirement gate confirmed GREEN for clarity/readiness, UX gate remains AMBER because execution is NOT TESTABLE until runnable implementation exists.
- Alternatives Considered: Move UX gate to GREEN based on documentation only (rejected - evidence requirement is mandatory).
- Impact: No feature-code merges permitted until UX checklist evidence exists and gate is rerun.
- Follow-up Actions: UI Engineer delivers runnable vertical slice; QA/Web execute UX-001 through UX-018 with evidence package and request CTO gate review.

## DEC-010

- Date: 2026-03-25
- Decision ID: DEC-010
- Context: First user-facing feature implementation pass.
- Decision: Implement team builder interactions in frontend now with max team size of 6, explicit add/remove behavior, and friendly validation messaging.
- Alternatives Considered: Keep frontend as API-only diagnostics page (rejected - does not progress AC-1 behavior).
- Impact: AC-1 execution can start once dependencies are installed and app is run.
- Follow-up Actions: Add automated tests for team-size guard and remove behavior.

## DEC-011

- Date: 2026-03-25
- Decision ID: DEC-011
- Context: Team persistence and sharing implementation during MVP build.
- Decision: Persist team state in localStorage and mirror team names in URL query string (`team=name1,name2,...`) for shareability.
- Alternatives Considered: localStorage-only persistence (rejected - no sharing); URL-only persistence (rejected - poor resilience).
- Impact: AC-7 and AC-8 implementation paths are now active in code.
- Follow-up Actions: Add decode validation tests for malformed and over-limit URL team params.

## DEC-012

- Date: 2026-03-25
- Decision ID: DEC-012
- Context: Need a searchable Pokemon list before full PokeAPI integration.
- Decision: Add backend `/api/pokemon/search` endpoint backed by a curated static Pokemon catalog for MVP development velocity.
- Alternatives Considered: Full live PokeAPI integration immediately (deferred - adds reliability and caching complexity too early).
- Impact: Frontend can support search/add flows now while preserving a future swap to PokeAPI-backed search.
- Follow-up Actions: Replace static catalog with proxied/cached PokeAPI source in a later backend increment.

## DEC-013

- Date: 2026-03-25
- Decision ID: DEC-013
- Context: Improve team-builder usability during first feature pass.
- Decision: Add live suggestion list under search input and enforce duplicate prevention on team add.
- Alternatives Considered: Button-only add with no suggestion hints (rejected - slower UX and higher input error rate).
- Impact: Improves AC-1 usability while keeping team model constraints intact.
- Follow-up Actions: Add keyboard navigation for suggestion list as accessibility enhancement.

## DEC-014

- Date: 2026-03-25
- Decision ID: DEC-014
- Context: Begin implementing AC-6 animation expectations.
- Decision: Introduce CSS animation hooks for team item add/remove and gym results reveal using lightweight keyframes.
- Alternatives Considered: Defer all animation work until late polish phase (rejected - raises integration and UX risk).
- Impact: Creates baseline for AC-6 checks; reduced-motion fallback remains to be added.
- Follow-up Actions: Add `prefers-reduced-motion` behavior and validate via UX checklist.

## DEC-015

- Date: 2026-03-25
- Decision ID: DEC-015
- Context: Need executable proof path for AC-1, AC-7, and AC-8 logic.
- Decision: Add frontend unit tests for team limit, duplicate checks, URL encode/decode, and restore behavior using Vitest.
- Alternatives Considered: Manual-only validation (rejected - insufficient repeatability for gate evidence).
- Impact: Establishes repeatable test harness for critical team state logic.
- Follow-up Actions: Install dependencies and run `npm run test:frontend` in CI/local pipeline.

## DEC-016

- Date: 2026-03-26
- Decision ID: DEC-016
- Context: Founder requested explicit allocation of agents for unresolved decisions and implementation sequencing.
- Decision: Use a lean gate-first operating model. Decision work is owned by a small decision pod before broader implementation proceeds. Founder approval is required for wedge user, MVP success criteria, monetization policy, ad-removal semantics, and early-user feedback loop. Product and engineering implementation proceeds only after upstream decisions are locked or where work is already approved and does not violate gate policy.
- Alternatives Considered: Full parallel implementation (rejected - violates current UX gate posture and increases rework risk); ad hoc allocation without shared ownership mapping (rejected - creates decision ambiguity).
- Impact: Reduces rework, clarifies approval boundaries, and keeps implementation aligned with current Requirement/UX/Architecture gate discipline.
- Follow-up Actions: Record active owner map in delivery-status; re-run gate checkpoint after UX evidence and documentation reconciliation.

## DEC-017

- Date: 2026-03-26
- Decision ID: DEC-017
- Context: Need explicit ownership for current initiative workstreams under the lean gate-first model.
- Decision: Assign Product Owner Agent, Market Analyst Agent, QA Quality Engineer Agent, and Head of Product Engineering Agent to the decision pod; assign Product Engineering Manager - Web Agent, UI Engineer Agent, Product Engineering Manager - Backend APIs Agent, Backend Engineer Agent, Engineering Manager - Platform Agent, DevOps Engineer Agent, and QA Quality Engineer Agent to implementation workstreams with VP Engineering and CTO oversight.
- Alternatives Considered: Single-agent ownership per domain (rejected - insufficient cross-functional control for product promise, QA evidence, and platform readiness).
- Impact: Creates explicit ownership for decision recommendations, founder approval asks, frontend hardening, backend data accuracy, QA evidence, and platform readiness.
- Follow-up Actions: Keep delivery-status synchronized with agent allocations and update ownership after founder approvals change scope or sequence.
