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
