# Text Typing Feature

## Purpose

The text-typing feature provides a reusable Monkeytype-like typing core with custom rendering (no visible `<input>` UI), caret tracking, and real-time typing metrics.

## User flow

1. Open the **Text Typing** page from the sidebar.
2. Select mode:
   - time mode: `15s` or `30s`
   - words mode: `10` or `25` words
3. Start typing directly on the keyboard:
   - first key starts the game (`idle` -> `typing`)
   - `Space` commits current word and moves to next
   - `Backspace` supports deleting backward, including moving back to previous unfinished/incorrect word
4. View live character feedback and moving caret.
5. On finish, view results:
   - WPM
   - Raw WPM
   - Accuracy
6. Restart with button or keyboard shortcut `Tab + Enter`.

Behavior details:

- Game status flow: `idle` -> `typing` -> `finished`.
- In time mode, game ends when countdown reaches `0`.
- In words mode, game ends when target word count is reached.
- Extra characters beyond original word length are marked as darker red.

## Key technical notes

- Main page component: `pages/TextTypingPage.tsx`
- Reusable typing component: `components/TypingTest.tsx`
- Logic hook: `hooks/useTypingTest.ts`
- Feature exports: `index.ts` (page + component + hook + types)
- Route registration: `src/router/index.tsx` at path `/text-typing`
- Sidebar navigation item: `src/constants/menuConfig.tsx`
- Page shell uses shared `PageHeader` for consistent feature-page structure
- Page shell is composed with shared `FeatureCard` and AntD-first section composition
- Route visits are tracked globally to power dashboard recent tools.
- Word generation: `words.ts` using internal dictionary and randomized list.
- Metrics formulas:
  - `WPM = (correctChars / 5) / elapsedMinutes`
  - `Raw WPM = (totalTypedChars / 5) / elapsedMinutes`
  - `Accuracy = (correctChars / totalTypedChars) * 100`
- Styling:
  - `TextTyping.module.css` uses monkeytype-inspired neutral/dark palette
  - blinking caret in `idle`, smooth caret movement via transform transition
  - AntD `Card` wrappers are used for test shell and final result panel
