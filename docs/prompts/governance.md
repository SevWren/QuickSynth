# Prompt Governance

## Standards
- Assign each prompt a stable `id` in `catalog.yaml`.
- Keep prompt wording in markdown files, not only in implementation code.
- Use clear, task-focused instructions with minimal ambiguity.
- Prefer deterministic output constraints when UX depends on structure.

## Change Control
- Any prompt change should include:
  - rationale
  - expected behavior change
  - regression test notes (manual, for this repo)
- Update `catalog.yaml` and prompt file together.

## Quality Checklist
- Scope: prompt matches intended task.
- Safety: avoid instructions that encourage fabrication.
- Length: avoid unnecessary verbosity.
- Output contract: format requirements are explicit.
- Compatibility: prompt works across supported AI providers.

## Lifecycle States
- `active`: currently used by bookmarklet UI.
- `candidate`: documented for potential future use.
- `deprecated`: retained for history but not used.

## Implementation Alignment
- Current source constants in `src/quicksynth.js`:
  - `detailedPrompt`
  - `simplePrompt`
  - `translatePrompt`
- If constants diverge from prompt docs, treat as documentation drift and reconcile in the next update.
