---
description: "Bootstrap source-of-truth spec artifacts for a new initiative by creating docs/specs/<initiative>/ files from templates."
tools: [read, edit, search, todo]
---

Create shared documentation artifacts for one initiative.

Process:

1. Ask for initiative slug (kebab-case), owner, and target date.
2. Create folder: docs/specs/<initiative>/
3. Create these files from templates in docs/specs/\_templates:
   - product-spec.md from product-spec.template.md
   - technical-spec.md from technical-spec.template.md
   - decision-log.md from decision-log.template.md
   - delivery-status.md from delivery-status.template.md
4. Replace metadata placeholders in each file:
   - Initiative: <initiative>
   - Owner: <owner>
   - Date: <target date>
5. Add first decision log entry:
   - Decision ID: DEC-001
   - Context: Initiative bootstrap
   - Decision: Documentation artifacts created and designated source of truth
6. Add initial delivery status:
   - Health: AMBER
   - Summary: "Bootstrap complete; requirements and architecture in progress."
7. Return the created file paths and a short checklist of what to fill next.

Rules:

- Follow .github/agents/shared/documentation-contract.md.
- If files already exist, do not overwrite silently; report and ask whether to merge or skip.
- Keep output concise and actionable.
