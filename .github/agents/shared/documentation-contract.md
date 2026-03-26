# Documentation Artifact Contract

This contract is mandatory once implementation starts.

## Core Rule

In-repo documentation/specification is the product source of truth.
Code is the delivery artifact that must trace back to approved docs.

## Required Shared Artifacts

Create and maintain these files for each initiative:

1. `docs/specs/<initiative>/product-spec.md`
2. `docs/specs/<initiative>/technical-spec.md`
3. `docs/specs/<initiative>/decision-log.md`
4. `docs/specs/<initiative>/delivery-status.md`

## Quality Rules

1. Do not start coding until product-spec and technical-spec exist.
2. Every major code change references a spec section or decision log entry.
3. If code and docs conflict, update docs first, then code.
4. Agents update delivery-status at every status report checkpoint.

## Ownership

1. Product Owner Agent owns product-spec quality and acceptance traceability.
2. VP Engineering Agent owns technical-spec quality and feasibility traceability.
3. Vision-to-Execution CTO Agent approves conflicts and final source-of-truth decisions.
