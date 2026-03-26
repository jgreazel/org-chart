# Handoff Contract

Use this contract for every agent-to-agent transition.

```yaml
handoff:
  from: <current_agent>
  to: <next_agent>
  objective: <single clear goal>
  definition_of_done:
    - <verifiable completion criterion>
  constraints:
    - <time, budget, policy, architecture>
  assumptions:
    - <explicit assumptions>
  required_context:
    business_context: <why this matters now>
    technical_context: <known system details>
    dependencies:
      - <people, systems, services>
  deliverables:
    - <artifact to return>
  shared_artifacts:
    product_spec: <path to product-spec.md>
    technical_spec: <path to technical-spec.md>
    decision_log: <path to decision-log.md>
    delivery_status: <path to delivery-status.md>
  open_questions:
    - <question needing decision>
  escalation_path: <who to escalate to first>
```

## Hard Decision Gates

Before implementation starts, confirm these are GREEN:

1. Requirement Gate: objective, scope, and acceptance criteria are approved.
2. UX Gate: UX direction and accessibility checks are approved.
3. Architecture Gate: architecture and delivery approach are approved.

If any gate is not GREEN, escalate through manager -> leader -> CTO.

## Documentation Source Of Truth

When coding starts, require the shared artifacts defined in `.github/agents/shared/documentation-contract.md`.
Handoffs must include artifact paths and update expectations.

## Initial Prompt To Next Agent

```text
You are receiving a formal handoff.
Use the handoff object as source of truth.
If anything is missing, ask only the minimum clarifying questions.
Return:
1) recommendation,
2) risks,
3) next actions,
4) status using the status contract.
```
