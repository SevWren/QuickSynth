---
name: bookmarklet-code-review
description: Review JavaScript bookmarklet code for correctness, robustness, security, and maintainability. Use when asked to analyze bookmarklet snippets/files, perform pre-PR quality checks, triage bookmarklet bugs, or produce a structured risk report with severity and fixes.
---

# Bookmarklet Code Review Skill

Analyze JavaScript bookmarklet code and return a structured, actionable findings report.

## Inputs
- Accept either a code snippet or repository files.
- Prefer readable source over minified output when both exist.
- If line numbers are unavailable, use `N/A`.

## Review Workflow
1. Identify intent.
- Summarize what the bookmarklet is supposed to do.
- Note key DOM interactions, clipboard use, navigation, and network touchpoints.

2. Check syntax and obvious defects.
- Flag parse errors, typos, and invalid API calls.

3. Check runtime reliability.
- Verify null/undefined guards before property access.
- Identify brittle selectors and assumptions about page structure.
- Detect scope leakage or accidental globals.
- Flag unsafe type coercion or unhandled edge cases.

4. Check logic and control flow.
- Validate branch conditions, loops, and fallbacks.
- Detect dead paths, contradictory behavior, and regressions.

5. Check security and privacy.
- Flag XSS risks (`innerHTML`, `document.write`, unsanitized HTML).
- Flag dynamic code execution (`eval`, `new Function`, string timers).
- Flag risky data exfiltration or third-party sends without clear user intent.
- Validate `postMessage` origin handling when present.
- Note patterns likely blocked by CSP.

6. Check bookmarklet-specific constraints.
- Confirm IIFE scoping and `javascript:` compatibility.
- Note bookmarklet length risk and minification concerns.
- Flag use of extension-only APIs (`chrome.*`).
- Note disruptive UX (`alert`/`prompt`/`confirm`) when excessive.

7. Check performance.
- Flag repeated expensive DOM queries and blocking operations.

## Output Format
Return findings sorted by severity (highest first). For each finding, include:
- `ISSUE_ID`: sequential (`E001`, `W002`, `S003`)
- `SEVERITY`: `CRITICAL | HIGH | MEDIUM | LOW | INFO`
- `LINE_NUMBER`: specific line(s) or `N/A`
- `CATEGORY`: `Syntax Error | Runtime Error | Logical Flaw | Security Vulnerability | Best Practice | Performance | Bookmarklet Specific`
- `DESCRIPTION`: what is wrong
- `IMPACT`: consequence if not fixed
- `SUGGESTED_FIX`: concrete remediation (include code when useful)

If no material issues exist, state "No findings" and include residual risks or testing gaps.
