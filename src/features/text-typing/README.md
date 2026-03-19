# Text Typing Feature

## Purpose

The text-typing feature helps users measure their current typing speed in words per minute (WPM) while they type free-form text.

## User flow

1. Open the **Text Typing** page from the sidebar.
2. Start typing in the text area.
3. View real-time stats for:
   - total word count
   - elapsed time in minutes
   - current WPM
4. Click **Reset** to clear the session and start over.

Behavior details:

- Typing timer starts at the first non-empty input.
- Word count is computed by splitting trimmed text on whitespace.
- WPM uses the formula `wordCount / elapsedMinutes` and updates every second.

## Key technical notes

- Main page component: `pages/TextTypingPage.tsx`
- Public feature export: `index.ts`
- Route registration: `src/router/index.tsx` at path `/text-typing`
- Sidebar navigation item: `src/constants/menuConfig.tsx`
- State and calculations:
  - local React state stores `text`, `startTime`, and `now`
  - `setInterval` updates `now` every second once typing has started
  - derived values (`wordCount`, `elapsedMinutes`, `wpm`) use `useMemo`
