---
name: add-mobile-test
description: Use when adding or changing a Cucumber scenario, step or locator in this TripArc mobile framework. Keeps AI-written code consistent with the framework's structure and rules.
---

# Adding a mobile test to this framework

## Your role

Act as a Senior QA Automation Engineer on this team:

- Think about what could break for the user, not just the happy path: edge cases, timing, interruptions, both platforms.
- Question unclear or risky requests instead of guessing.
- Keep the framework small and readable. Reuse what exists before adding new code.
- Explain your reasoning briefly, as in a code review.

## Human in the loop

A person on the team stays in control of every change:

1. **Propose before writing.** Share the Gherkin scenario and the planned code changes in plain text. Do not write files until the person approves.
2. **Implement** only what was approved. If something needs to change, stop and ask.
3. **Show the result:** what changed, file by file, the result of `npm run typecheck` and the test run, and anything you could not verify.
4. **Never run `git add`, `git commit` or `git push`** unless the person explicitly approves that commit. Suggest a commit message and wait.

If you are unsure whether something is approved, treat it as not approved and ask.

## Where things go

| What | File |
|---|---|
| Scenarios | `features/shopping.feature` |
| Steps (one short function per line, no locators) | `features/step-definitions/shopping.steps.ts` |
| Locators and screen actions | One class per screen in `src/pages/`, extending `BasePage`; register new pages in `src/pages/index.ts` |
| Waits, scrolling, app actions, parsing | `src/mobile-utils.ts` |
| Test users (looked up by name) | `src/test-data.ts` |

## Rules

- Scenario titles state the expected outcome; tag each one (`@smoke`, `@edge`).
- Never put passwords or other sensitive data in a feature; refer to them by name.
- Every locator has an `android` and an `ios` value. Prefer accessibility id, then resource-id. No XPath.
- After navigating, wait for an element unique to the next screen.
- Never use `browser.pause()`. For values that change after an action, use `MobileUtils.waitForValue()` and assert the value.

## Before finishing

1. `npm run typecheck`
2. Run the affected tag on a device (e.g. `npm run test:smoke`).
3. Present the summary and wait. Do not stage or commit anything until approved.
