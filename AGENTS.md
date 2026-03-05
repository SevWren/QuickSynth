# Repository Guidelines

## Project Structure & Module Organization
- Root scripts:
  - `src/quicksynth.js`: readable development source with comments.
  - `dist/quicksynth.bookmarklet.js`: single-line bookmarklet payload for installation.
- `assets/`: screenshots and media used by documentation.
- `VERSION`: current project version (single source of truth).
- `README.md`: user-facing install/usage guide.

Keep functional changes in `src/quicksynth.js` first, then propagate to the bookmarklet build artifact in `dist/`.

## Versioning
- Do not encode versions in filenames.
- Update root `VERSION` for each release, keep `@version` in `src/quicksynth.js` aligned, and add a matching entry in `README.md` changelog.

## Build, Test, and Development Commands
This repository has no package manager or automated build pipeline.
- `powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\build-bookmarklet.ps1`: build `dist/quicksynth.bookmarklet.js` from `src/quicksynth.js`.
- `powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\validate-bookmarklet.ps1`: validate bookmarklet output format and structure.
- `Get-Content .\dist\quicksynth.bookmarklet.js`: inspect generated output.
- `git diff`: review exact code changes before commit.

Validation is primarily manual in-browser:
1. Copy bookmarklet code from `dist/quicksynth.bookmarklet.js`.
2. Install as a bookmark.
3. Test selected text, full-page fallback, each AI target, and clipboard behavior.

## Coding Style & Naming Conventions
- Use 4-space indentation and semicolons in development source.
- Prefer `const`/`let`; avoid `var`.
- Use descriptive camelCase names in dev code (`selectedText`, `aiOptions`, `detailedPrompt`).
- Keep bookmarklet output minified and single-line; do not hand-format it for readability.
- Preserve defensive checks (popup uniqueness, clipboard error handling, try/catch wrapper).

## Testing Guidelines
- No formal test framework is configured.
- For each change, run manual regression checks on at least one content-heavy page and one minimal page.
- Confirm prompt assembly includes source URL and edited text.
- If adding a new AI option, verify name, URL, and default-selection behavior.

## Commit & Pull Request Guidelines
- Recent history includes informal messages (`misc`, `Update README.md`, `Resolve merge conflicts`).
- Prefer clear, imperative commit messages, e.g.:
  - `feat: add Claude target option`
  - `fix: handle empty selection fallback`
  - `docs: update bookmarklet install steps`
- PRs should include:
  - Purpose and behavior change summary.
  - Manual test steps performed.
  - Updated screenshots in `assets/` when UI changes.
  - Linked issue (if applicable).
