# Handoff Contract

Use this contract for every agent-to-agent delegation. Keep it lightweight — the goal is to enable fast delegation, not to create bureaucracy.

```yaml
handoff:
  from: <current_agent>
  to: <next_agent>
  task: <what to do — one sentence>
  files_to_change:
    - <exact file path to create or edit>
  done_when:
    - <observable result — a file exists, a test passes, a feature works>
  context: <1-2 sentences of relevant background>
  escalation: <who to ask if stuck>
```

## Rules

1. **Keep handoffs small and specific.** One task per handoff. If the work is big, split it into multiple handoffs.
2. **Always specify file paths.** The receiving agent must know exactly which files to touch.
3. **Do not block on missing information.** If context is incomplete, the receiving agent makes a reasonable assumption, documents it in a code comment, and proceeds.
4. **No gate-checking before execution.** Quality gates (Requirement, UX, Architecture) are concurrent review checkpoints — they never block implementation from starting.

## Quality Checkpoints (Non-Blocking)

These run in parallel with implementation. Flag issues but do not halt work:

- Requirement checkpoint: Are we building the right thing? If unclear, build the most reasonable interpretation and flag the ambiguity.
- UX checkpoint: Is the interface usable and accessible? If not, fix it in-flight.
- Architecture checkpoint: Is the approach sound? If not, course-correct without stopping.

## Documentation

Update `docs/specs/<initiative>/` artifacts as work progresses. Docs follow code — they are never a pre-condition for code.

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
