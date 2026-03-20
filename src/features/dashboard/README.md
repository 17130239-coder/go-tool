# Dashboard Feature

## Purpose

The dashboard provides a central landing page for productivity:

- quick actions to jump to top tools
- favorite tools management
- recently used tools history

## User flow

1. Open **Dashboard** from the sidebar.
2. Use **Quick Actions** buttons to navigate to common tools.
3. Mark/unmark favorites with the star button.
4. Open recently used tools from the **Recently Used Tools** list.

## Key technical notes

- Main page component: `pages/DashboardPage.tsx`
- Public feature export: `index.ts`
- Route registration: `src/router/index.tsx` at path `/dashboard`
- Data sources:
  - tool metadata from `src/constants/menuConfig.tsx`
  - favorites/history state from `src/store/index.ts` (persisted)
- UI stack is Ant Design-first (`Card`, `List`, `Button`, `Empty`, `Tag`, `Flex`, `Space`) with shared `FeatureCard` and `PageHeader`.
