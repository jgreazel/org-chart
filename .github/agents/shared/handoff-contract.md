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
    - <time, budget, policy, architecture, compliance>
  assumptions:
    - <explicit assumptions>
  required_context:
    business_context: <why this matters now>
    technical_context: <known system details>
    dependencies:
      - <people, systems, services>
  deliverables:
    - <artifact to return>
  open_questions:
    - <question needing decision>
  escalation_path: <who to escalate to first>
```

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
