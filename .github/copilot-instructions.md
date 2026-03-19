# Copilot Instructions for `go-tool`

## Build, lint, type-check, format

- Install deps: `pnpm install`
- Dev server: `pnpm dev`
- Production build: `pnpm build` (runs `tsc -b` then Vite build)
- Lint: `pnpm lint`
- Auto-fix lint: `pnpm lint:fix`
- Type-check only: `pnpm typecheck`
- Format source files: `pnpm format`
- Preview production build: `pnpm preview`
- Complete flow (check + commit + push): `pnpm complete "type(scope): message"`  
  Optional: `pnpm complete "type(scope): message" <remote> <branch>`

This repo currently has no `test` script and no test files, so there is no single-test command configured yet.

## High-level architecture

- App entry is `src/main.tsx`, which renders `App`.
- `src/App.tsx` wires three top-level providers:
  - Ant Design `ConfigProvider` for theme algorithm
  - React Query `QueryClientProvider` (single `QueryClient` instance)
  - React Router `RouterProvider`
- Theme behavior is centralized in `App` + Zustand store:
  - `themeMode` lives in `src/store/index.ts` and is persisted (`go-tool-storage`)
  - `App` syncs `body[data-theme]` and Ant Design algorithm (`light` / `dark` / `system`)
- Routing is declared in `src/router/index.tsx` under `MainLayout`:
  - `MainLayout` composes `Sidebar` + `Header` + routed content outlet
  - Current real feature route is `naming-converter`; other routes are placeholders
- Navigation metadata is centralized in `src/constants/menuConfig.tsx` and reused by:
  - `Sidebar` to render AntD menu tree
  - `useBreadcrumb` hook to derive breadcrumb labels from the same config
- Async page state UI is standardized via `src/components/ui/AsyncBoundary.tsx` + `PageLoader`, `PageError`, `PageEmpty`.
- Current implemented feature (`src/features/naming-converter`) keeps page UI in feature folder and uses shared converter utilities from `src/utils/stringConverter.ts`.

## Key repository conventions

- Follow feature-first organization from `GUIDE.md`: keep domain logic in `src/features/<feature>`, and keep shared cross-feature code in shared folders (`components`, `hooks`, `utils`, etc.).
- Export feature public API through feature `index.ts` files (example: `src/features/naming-converter/index.ts`).
- Naming rules from `GUIDE.md`:
  - folders: kebab-case
  - React component files: PascalCase
  - hooks: `useXxx`
  - utility files: camelCase
  - CSS modules: `ComponentName.module.css`
- State boundaries:
  - Zustand is for global app state only (theme mode, sidebar collapsed)
  - Keep page/component-local state in React state
  - Do not duplicate server state into Zustand
- Shared spacing utilities are globally imported in `src/index.css` (`@import './styles/spacing.css'`) and used as utility classes (e.g. `mb-24`, `mx-auto`) in components.
- Lint/type constraints are intentionally strict:
  - `@typescript-eslint/no-explicit-any`: error
  - `@typescript-eslint/no-unused-vars`: error (except args prefixed with `_`)
  - `no-console`: warn, only `console.warn` and `console.error` allowed
- Commit workflow is enforced with Husky:
  - pre-commit runs `pnpm lint-staged`
  - commit-msg runs commitlint (`conventional` config), so use Conventional Commits.
- A helper script exists at `bin/complete.sh` and is exposed as `pnpm complete`; it runs lint + typecheck, stages all changes, commits, then pushes current branch.
