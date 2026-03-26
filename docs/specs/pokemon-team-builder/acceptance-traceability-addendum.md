# Acceptance Traceability Addendum

## Metadata

- Initiative: pokemon-team-builder
- Date: 2026-03-25
- Owner: Product Engineering Manager - Backend APIs Agent
- Purpose: Map AC-1 through AC-8 to implementation surfaces and explicit QA pass/fail checks.

## Traceability Matrix

| AC                                                                  | User Story       | Implementation Surface                                                                                        | Test Type                                        | Pass Criteria                                                                                                                                | Fail Criteria                                                                                                                          |
| ------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| AC-1: Team size 1-6, block 7th with friendly error                  | US-1             | Frontend team store/signals, team slot UI, add action handler                                                 | Frontend unit, e2e                               | User can add up to 6 slots. Attempting 7th is blocked, state unchanged, and a friendly dismissible error is shown.                           | 7th Pokemon is added, no message appears, or state mutates incorrectly at limit.                                                       |
| AC-2: Type chart accuracy (18 types, Gen 6+ chart)                  | US-2             | Backend static type chart JSON, type-effectiveness service, GET /api/types/chart, frontend consumer           | Backend unit, API integration, frontend contract | All 18x18 matchups pass against Gen 6+ chart, endpoint schema is complete, frontend calculations match backend matrix for sample teams.      | Any matchup mismatch, missing row/column, schema drift, or inconsistent frontend output.                                               |
| AC-3: Gen 1-9 gym leaders and Pokemon types present/correct         | US-3             | Backend gym JSON files (1-9), loader/validator, GET /api/gyms?generation=, frontend gym view                  | Backend unit, API integration, e2e smoke         | Each generation 1-9 returns non-empty, schema-valid, curated data and frontend renders with no data gaps.                                    | Missing/empty generation, incorrect leader/type data, invalid schema acceptance, or undefined handling outside 1-9.                    |
| AC-4: Ads shown by default, paid users see no ads                   | US-5             | Frontend ad visibility guard, local paid flag, backend Stripe webhook, ADS_ENABLED and PAYMENTS_ENABLED flags | Backend integration, frontend unit, e2e          | Unpaid user sees ads by default when enabled; valid payment event sets paid state; ads are hidden on subsequent load.                        | Unpaid users do not see ads, paid users still see ads, invalid webhook toggles paid state, or behavior differs across refresh/session. |
| AC-5: Primary flows usable at 375px width                           | US-4             | Frontend responsive layout for search, team, type coverage, gym viability, share, purchase                    | E2E mobile viewport, manual QA                   | At 375px, primary flows complete without blocking overflow or hidden controls; core controls are readable and tappable.                      | Any primary flow cannot complete, clipping/overlap blocks actions, or key controls are inaccessible.                                   |
| AC-6: Animations on add/remove, gym reveal, type badge interactions | US-1, US-2, US-3 | Frontend animation triggers and keyframes/Angular animations for all required interactions                    | Frontend integration, e2e interaction            | All required animation categories trigger on intended interactions without blocking flow completion; reduced-motion fallback preserves flow. | Any required animation category is missing or blocks user completion.                                                                  |
| AC-7: Team persists via localStorage across refresh                 | US-1             | Frontend persistence service and hydration on app init                                                        | Frontend unit, e2e refresh                       | Team composition/order restores after refresh; clear/reset updates storage accurately.                                                       | Team is lost or partially restored; storage is stale after remove/reset.                                                               |
| AC-8: Shareable URL encodes current team                            | US-1, US-4       | Frontend URL encoder/decoder, router integration, schema/type guard validation                                | Frontend unit, e2e deep-link                     | Generated URL reconstructs equivalent team up to 6 members; invalid params are sanitized without crash; same validation as manual add flow.  | Deep-link reconstruction fails, malformed params crash app, or decoder accepts invalid/>6 team entries.                                |

## Required Edge Cases

### AC-4 Edge Cases

1. Invalid Stripe signature must not set paid state.
2. Duplicate webhook delivery is idempotent.
3. PAYMENTS_ENABLED false must not allow paid-state mutation.
4. Clearing local storage after payment follows defined persistence behavior.
5. Multi-tab sessions converge ad visibility state after storage sync.

### AC-8 Edge Cases

1. URL with more than 6 entries is truncated or rejected deterministically.
2. Unknown or non-numeric IDs are ignored safely.
3. Duplicate entries follow a single defined rule consistently.
4. Partial params load safely with best-effort valid subset.
5. Param order decoding is deterministic and documented.

## Gate Impact

- Requirement ambiguity is closed for AC-1 through AC-8.
- Remaining gate dependency is UX operational checklist execution evidence.
