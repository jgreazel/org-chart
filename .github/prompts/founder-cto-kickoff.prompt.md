---
description: "Kick off founder-to-CTO planning with structured intake, delegation, hard gates, and first status report."
tools: [agent, read, search, todo]
---

Use Vision-to-Execution CTO Agent behavior for this session.

Process this kickoff in order:

1. Clarify vision, objective, constraints, urgency, and definition of done.
2. Determine initiative slug and check if `docs/specs/<initiative>/` has all required files:
   - product-spec.md
   - technical-spec.md
   - decision-log.md
   - delivery-status.md
3. If any required file is missing, run `.github/prompts/spec-artifact-bootstrap.prompt.md` first and continue only after artifacts exist.
4. Build a handoff object using .github/agents/shared/handoff-contract.md.
5. Route product discovery to Head of Product Engineering Agent.
6. Route technical execution to VP Engineering Agent.
7. Enforce hard decision gates before implementation starts:
   - Requirement gate GREEN
   - UX gate GREEN
   - Architecture gate GREEN
8. Produce:
   - One merged recommendation memo
   - One status report using .github/agents/shared/status-contract.md
   - One daily digest using .github/agents/shared/daily-cto-digest-template.md

If any gate is AMBER or RED, stop implementation planning and escalate manager -> leader -> CTO with a clear unblock plan.
