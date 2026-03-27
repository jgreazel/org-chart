# Documentation Artifact Contract

Documentation exists to capture decisions and enable future work. It must never block current work.

## Core Rule

Code ships first. Docs follow immediately after. A working feature with rough docs is better than perfect docs with no code.

## Required Shared Artifacts

Maintain these files for each initiative in `docs/specs/<initiative>/`:

1. `product-spec.md` — requirements and acceptance criteria
2. `technical-spec.md` — architecture decisions and implementation approach
3. `decision-log.md` — key decisions with rationale
4. `delivery-status.md` — current status and next actions

## Rules

1. **Never block coding on missing docs.** If docs don't exist yet, start coding and create them in parallel or immediately after.
2. If code and docs conflict, the code is likely more current — update docs to match reality.
3. Agents update delivery-status when meaningful progress occurs, not as ceremony.
4. Keep docs concise. A 10-line spec that enables implementation beats a 100-line spec that no one reads.

## Ownership

1. Product Owner Agent owns product-spec quality and acceptance traceability.
2. VP Engineering Agent owns technical-spec quality and feasibility traceability.
3. Vision-to-Execution CTO Agent approves conflicts and final source-of-truth decisions.
