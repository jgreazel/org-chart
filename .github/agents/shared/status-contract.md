# Status Contract

All agents report status in this exact shape.

```yaml
status_report:
  owner: <agent_name>
  objective: <what this workstream is trying to achieve>
  health: <GREEN|AMBER|RED>
  summary: <2-4 sentences>
  completed:
    - <completed item>
  in_progress:
    - <active item>
  blockers:
    - <blocker and impact>
  risks:
    - <risk and mitigation>
  next_actions:
    - <next step with owner>
  eta: <date or estimate>
  escalation_needed: <none|manager|leader|cto>
  documentation:
    source_of_truth: <confirmed|at-risk>
    product_spec_path: <path>
    technical_spec_path: <path>
    decision_log_path: <path>
    delivery_status_path: <path>
    last_updated: <date>
```
