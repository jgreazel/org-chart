# Status Contract

All agents report status in this shape. **Status reports are only valid when accompanied by actual work output (files created/modified).**

```yaml
status_report:
  owner: <agent_name>
  task: <what was asked>
  health: <GREEN|AMBER|RED>
  files_changed:
    - <path to file created or modified>
  completed:
    - <what was done>
  in_progress:
    - <what is actively being worked on>
  blockers:
    - <blocker — must include your proposed resolution>
  next_actions:
    - <concrete next step with owner>
```

## Rules

- A status report with zero files_changed is a failure. Investigate why and fix it.
- AMBER and RED health do not halt work. They signal that course correction is needed while continuing.
- Blockers must always include the agent's proposed resolution. "I'm blocked" without a proposal is not acceptable.
