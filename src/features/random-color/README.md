# Random Color Feature

## Purpose

The random-color feature provides a quick utility to generate random HEX colors for UI exploration and design tasks.

## User flow

1. Open **Random Color** from the sidebar.
2. Click **Random Color** button.
3. View the generated color preview block.
4. Read the generated HEX value from the readonly input.

## Key technical notes

- Main page component: `pages/RandomColorPage.tsx`
- Public export: `index.ts`
- Route path: `/random-color` (configured in `src/router/index.tsx`)
- Sidebar menu integration: `src/constants/menuConfig.tsx`
- Color generation:
  - random integer in `[0, 0xFFFFFF]`
  - convert to hex
  - `padStart(6, '0')`
  - uppercase format, final output as `#RRGGBB`
