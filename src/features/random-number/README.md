# Random Number Feature

## Purpose

The random-number feature provides a simple utility page to generate a random integer within a user-defined range.

It is designed for quick manual number generation tasks while enforcing a non-negative minimum boundary.

## User flow

1. Open the **Random Number** page from the sidebar.
2. Set `Min` and `Max` values using number inputs.
3. Click **Random Number** to generate a value.
4. Read the generated value in the result area.

Behavior details:

- `Min` cannot be below `0`.
- `Max` also enforces non-negative input.
- Generate button is disabled when `Max < Min`.
- Generated value is an integer in inclusive range `[Min, Max]`.

## Key technical notes

- Main page component: `pages/RandomNumberPage.tsx`
- Public feature export: `index.ts`
- Route registration: `src/router/index.tsx` at path `/random-number`
- Sidebar navigation item: `src/constants/menuConfig.tsx`
- Shared UI primitives:
  - `FeatureCard` and `PageHeader` for consistent page shell
  - `ErrorAlert` for standardized validation error display
  - AntD `Card` + `Statistic` for structured input/result sections
- Implementation details:
  - local React state holds `min`, `max`, and `result`
  - range validation uses `max >= min`
  - random generator formula: `Math.floor(Math.random() * (max - min + 1)) + min`
- UI stack uses Ant Design components (`InputNumber`, `Button`, `Typography`, `Space`, `Card`, `Flex`, `Statistic`) with AntD-first section composition.
