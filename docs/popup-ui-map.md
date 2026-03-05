# Popup UI Map

This document maps the QuickSynth popup UI to code locations in `src/quicksynth.js`.

## Layout Overview
- The popup is a 3-column container created in the `try` block:
  - Text panel (`Selected Text`)
  - AI list panel (`Select AI Assistant`)
  - Action panel (`Processing Options`)

## Section-to-Code Mapping
- Root containers:
  - `overlay` (`overlayId`) for modal backdrop and outside-click close
  - `popup` (`popupId`) as the main dialog container
- Text panel:
  - `textPanel`, `textPanelHeader`, `textPanelHeaderCharCount`, `textArea`
  - Character count updates on `textArea` `input` events
- AI selection panel:
  - `aiSelectionPanel`, `aiListContainer`
  - Data source: `aiOptions` array (`name`, `url`)
  - Default selection: `defaultAiName` + `defaultAiIndex`, then `setTimeout(...click())`
- Processing options panel:
  - `selectedAiDisplay`
  - Prompt actions: `detailedButton`, `simpleButton`, `translateButton`
  - Manual action: `manualCopyButton`

## State Variables
- `selectedAi`: currently selected AI option object.
- `selectedAiElement`: currently highlighted AI DOM element.
- `textArea`: editable captured page text.
- `textPanelHeaderCharCount`: live character count badge.

## Action Flow
1. User clicks bookmarklet.
2. Script captures selected text or falls back to `document.body` text.
3. Popup renders and applies default AI selection.
4. User edits text and chooses a prompt button.
5. `handleAction(prompt, actionName)` composes payload:
   - selected prompt
   - source URL context
   - edited text
6. Payload is copied to clipboard via `navigator.clipboard.writeText`.
7. Selected AI URL opens in a new tab (`window.open`), then popup closes.

## Update Checklist
- When adding an AI service:
  - update `aiOptions`
  - verify default-selection behavior is still valid
- When changing UI sections:
  - keep labels and variable names aligned
  - update this map with renamed containers/state
- After UI logic changes:
  - run `tools/build-bookmarklet.ps1`
  - run `tools/validate-bookmarklet.ps1`
