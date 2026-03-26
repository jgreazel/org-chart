# MVP UX and Accessibility Operational Checklist

## Metadata

- Initiative: pokemon-team-builder
- Date: 2026-03-25
- Owner: Product Engineering Manager - Web Agent
- Purpose: Provide binary pass/fail UX and accessibility checks for hard gate closure.

## Scope

- Mobile baseline viewport: 375x667
- Desktop validation viewport: 1440x900
- Acceptance criteria coverage: AC-5 and AC-6

## Primary Interaction Inventory

1. Pokemon search and selection
2. Add Pokemon to team slot
3. Remove Pokemon from team slot
4. Generation selection for gym viability
5. Gym results reveal
6. Type badge interaction
7. Share URL flow
8. Ad-visible and ad-disabled entry paths

## Pass and Fail Rules

- PASS: all checks are PASS with evidence.
- FAIL: any check is FAIL, PARTIAL, or NOT TESTABLE.

## Operational Checks

| ID     | Check                                    | Method                               | Pass Criteria                                                                              | Result    |
| ------ | ---------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------ | --------- |
| UX-001 | Mobile layout integrity at 375px         | Manual responsive test               | No horizontal scrolling on primary screens. No clipped or overlapping actionable controls. | PASS/FAIL |
| UX-002 | Desktop layout integrity at 1440px       | Manual responsive test               | Primary interactions remain visible and operable with no layout breakage.                  | PASS/FAIL |
| UX-003 | Team flow usability on mobile            | Task run at 375px                    | User can search, add, and remove Pokemon without blocked steps.                            | PASS/FAIL |
| UX-004 | Gym viability flow usability on mobile   | Task run at 375px                    | User can select generation and view results without hidden/blocked controls.               | PASS/FAIL |
| UX-005 | Keyboard-only navigation completeness    | Keyboard-only run                    | Primary interactions complete with Tab/Shift+Tab/Enter/Space/Escape only.                  | PASS/FAIL |
| UX-006 | Focus order and stability                | Keyboard-only run                    | Focus follows logical order, no trap, and no loss after dynamic updates.                   | PASS/FAIL |
| UX-007 | Visible focus indicator coverage         | Keyboard-only run                    | All interactive elements show clear visible focus at 375px and 1440px.                     | PASS/FAIL |
| UX-008 | Search input accessible name             | Accessibility tree and SR spot check | Search has a programmatic label and announced purpose is correct.                          | PASS/FAIL |
| UX-009 | Add/remove control accessible names      | Accessibility tree and keyboard run  | Action controls expose descriptive names, including icon-only controls.                    | PASS/FAIL |
| UX-010 | Generation and reveal control labeling   | Accessibility tree inspection        | Selector and reveal controls have explicit labels and valid roles.                         | PASS/FAIL |
| UX-011 | Dynamic updates discoverability          | Screen reader spot check             | Result changes are announced or immediately discoverable through focus progression.        | PASS/FAIL |
| UX-012 | Type badge semantics                     | Accessibility tree inspection        | Interactive badges use interactive semantics. Non-interactive badges are not focusable.    | PASS/FAIL |
| UX-013 | WCAG AA text contrast on core views      | Contrast measurement                 | Normal text >= 4.5:1, large text >= 3:1.                                                   | PASS/FAIL |
| UX-014 | WCAG AA contrast for badges/chips        | Contrast measurement                 | Badge text/icons meet AA contrast in default and active states.                            | PASS/FAIL |
| UX-015 | Required animations exist                | Interaction run                      | Add/remove, gym reveal, and type badge animations all trigger as defined.                  | PASS/FAIL |
| UX-016 | Animation does not block task completion | Manual and keyboard run              | Motion does not prevent input, hide controls, or delay critical state feedback.            | PASS/FAIL |
| UX-017 | Reduced-motion compatibility             | Reduced-motion enabled run           | Non-essential motion is minimized/removed while preserving information clarity.            | PASS/FAIL |
| UX-018 | Touch-target viability at 375px          | Manual tap test                      | Primary targets are consistently tappable without precision-only interaction.              | PASS/FAIL |

## Evidence Requirements

1. Capture screenshot or short recording for each FAIL or borderline check.
2. Record browser/device profile per run.
3. Log exact page/state and reproduction steps for each failure.
4. Attach completed checklist to delivery status before gate decision.

## Gate Decision Rule

- UX Gate is GREEN only when all checks are PASS.
- UX Gate is AMBER if any check is FAIL, PARTIAL, or NOT TESTABLE.
- UX Gate is RED if any of UX-003, UX-004, UX-005, UX-013, or UX-015 fails.
