---
name: IT Org Chart README
description: "Documentation file describing the agent hierarchy and workflow. Not an executable agent."
---

# IT Org Agent Chart

## Primary Interface

- Start all conversations with `Vision-to-Execution CTO Agent`.
- The CTO agent is the founder-facing interface for vision, questions, decisions, and status.

## Ladder

Tier 1

- Vision-to-Execution CTO Agent

Tier 2

- VP Engineering Agent
- Head of Product Engineering Agent

Tier 3 (manager routing layer)

- Engineering Manager - Platform Agent
- Engineering Manager - Application Services Agent
- Product Engineering Manager - Web Agent
- Product Engineering Manager - Backend APIs Agent

Tier 3 and 4 (specialist execution layer, hybrid by workstream)

- Product Owner Agent (shared service across product and engineering tracks)
- Market Analyst Agent
- UI/UX Designer Agent
- Cloud Architect Agent
- DevOps Engineer Agent
- UI Engineer Agent
- Backend Engineer Agent
- QA Quality Engineer Agent

## Workflow

1. Founder shares idea or question with CTO agent.
2. CTO performs intake and defines objective + definition of done.
3. CTO routes product-discovery work to Head of Product Engineering.
4. CTO routes technical feasibility and delivery planning to VP Engineering.
5. Leaders delegate through manager layer and then to specialists.
6. Every handoff uses `.github/agents/shared/handoff-contract.md`.
7. Every update uses `.github/agents/shared/status-contract.md`.
8. Hard decision gates must be GREEN before implementation starts: Requirement, UX, Architecture.
9. Once coding begins, shared in-repo artifacts in `docs/specs/<initiative>/` become product source of truth.
10. Blocked work escalates to immediate manager first, then leader, then CTO.

## Tooling Policy

- Strategic, leadership, manager, and spec-authoring agents include `edit` so they can update shared artifacts, decision docs, and status reports.
- Implementation agents include both `edit` and `execute` so they can change code and validate it.
- Non-implementation roles should not receive `execute` unless they are expected to run builds, tests, or automation directly.
