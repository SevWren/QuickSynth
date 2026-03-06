# Prompt Library Blueprint

This folder is the canonical prompt library for QuickSynth.

## Goals
- Store prompt text outside implementation code.
- Make prompts auditable, versioned, and easy to extend.
- Define a standard structure for current and future prompt sets.

## Structure
```text
docs/prompts/
  README.md
  catalog.yaml
  governance.md
  current/
    detailed-format.md
    simple-summary.md
    translate-english.md
  future/
    research-outline.md
    fact-check.md
    sentiment-analysis.md
  _templates/
    prompt-template.md
```

## Usage Model
- `current/` contains prompts currently wired into the bookmarklet UI.
- `future/` contains candidate prompts for potential product additions.
- `_templates/` contains authoring templates and metadata conventions.
- `catalog.yaml` is the index of prompt IDs, status, ownership, and rollout state.

## Integration Note
- The bookmarklet currently embeds prompt strings in `src/quicksynth.js`.
- Prompt text in this folder should be treated as source-of-truth docs for review and curation.
- If/when prompts are loaded from files at build time, keep prompt IDs aligned with `catalog.yaml`.
