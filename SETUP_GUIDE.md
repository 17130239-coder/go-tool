# Project Setup Guide

A comprehensive guide to scaffold, develop, and maintain a React + TypeScript project with this architecture.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Initial Setup](#initial-setup)
3. [Source Structure](#source-structure)
4. [Architecture Overview](#architecture-overview)
5. [Feature Module Convention](#feature-module-convention)
6. [Developing a New Feature](#developing-a-new-feature)
7. [Maintaining an Existing Feature](#maintaining-an-existing-feature)
8. [Git Workflow](#git-workflow)
9. [Code Quality Workflow](#code-quality-workflow)
10. [Deployment](#deployment)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript 5.9 |
| Bundler | Vite 8 |
| UI Library | Ant Design 6 |
| Routing | React Router DOM 7 (lazy routes) |
| State | Zustand 5 (persisted to localStorage) |
| Server State | TanStack Query 5 |
| HTTP Client | Axios |
| CSS | Vanilla CSS + CSS Modules |
| Linting | ESLint 9 (flat config) + Prettier 3 |
| Git Hooks | Husky 9 + lint-staged + Commitlint |

---

## Initial Setup

### 1. Scaffold

```bash
pnpm create vite@latest my-app -- --template react-ts
cd my-app
```

### 2. Install Dependencies

```bash
# Runtime
pnpm add react react-dom react-router-dom
pnpm add antd @ant-design/icons
pnpm add zustand @tanstack/react-query axios
pnpm add clsx dayjs

# Dev
pnpm add -D prettier eslint-plugin-import eslint-plugin-jsx-a11y
pnpm add -D eslint-plugin-react-hooks eslint-plugin-react-refresh typescript-eslint globals
pnpm add -D husky lint-staged @commitlint/cli @commitlint/config-conventional
pnpm add -D @types/node
```

### 3. TypeScript Config

**`tsconfig.json`** (project references root):
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

**`tsconfig.app.json`**:
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2023",
    "useDefineForClassFields": true,
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

**`tsconfig.node.json`**:
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

### 4. ESLint

**`eslint.config.js`**:
```js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]);
```

### 5. Prettier

**`.prettierrc`**:
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### 6. Git Hooks

```bash
git init && pnpm exec husky init
```

**`.husky/pre-commit`**: `pnpm exec lint-staged`
**`.husky/commit-msg`**: `pnpm exec commitlint --edit $1`

**`commitlint.config.cjs`**:
```js
module.exports = { extends: ['@commitlint/config-conventional'] };
```

Add to **`package.json`**:
```json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{css,json,md}": ["prettier --write"]
}
```

### 7. Scripts

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "typecheck": "tsc --noEmit",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write \"src/**/*.{ts,tsx,css,json}\"",
  "prepare": "husky"
}
```

---

## Source Structure

```
src/
├── assets/                 # Static images, SVGs
├── components/
│   ├── layout/             # App shell (MainLayout, Sidebar, Header, CommandPalette)
│   ├── shared/             # Reusable UI (barrel-exported via index.ts)
│   └── ui/                 # Low-level primitives (PageLoader, PageError, PageEmpty)
├── constants/              # App-wide constants and menu config (data only)
├── features/               # Feature modules (see convention below)
├── hooks/                  # Shared hooks (barrel-exported via index.ts)
├── router/                 # createBrowserRouter — routes auto-generated from config
├── store/                  # Zustand store with persist middleware
├── styles/                 # Utility CSS (spacing helpers, etc.)
├── utils/                  # Shared utility functions (menuUtil, etc.)
├── App.tsx                 # Root (ConfigProvider + QueryClient + Router)
├── App.css                 # Global app styles
├── main.tsx                # Entry point
└── index.css               # CSS reset / base styles
```

### Barrel Exports

`hooks/index.ts` and `components/shared/index.ts` use `export * from './...'` for clean imports:
```ts
// src/hooks/index.ts
export * from './useCopyToClipboard';
export * from './usePageTitle';
```

> **Feature modules do NOT use barrel exports** — always import the specific file directly.

---

## Architecture Overview

### Data Flow: How a page becomes visible

```
  MENU_CONFIG (constants/menuConfig.tsx)
       │
       │  lazyComponent, path, label, icon, isTool
       │
       ├──▶ buildRoutes()  (utils/menuUtil.ts)  ──▶  React Router  ──▶  Lazy-loaded page
       │
       ├──▶ buildSidebarMenuConfig()  ──▶  Sidebar component
       │
       └──▶ buildVisibleNavigableMenuItems()  ──▶  Command Palette (Cmd+K)
```

**Single source of truth:** `MENU_CONFIG` is the only place where pages are defined.
Adding a new entry there automatically creates the route, sidebar link, and command palette entry.

### Key Files

| File | Responsibility |
|---|---|
| `constants/menuConfig.tsx` | Page definitions (data + types) |
| `utils/menuUtil.ts` | Functions that consume the config (routing, sidebar, search) |
| `store/index.ts` | Global state (theme, sidebar, favorites, tool ordering) |
| `router/index.tsx` | Router setup (calls `buildRoutes()`) |
| `constants/appConfig.ts` | App-wide constants (app name, etc.) |

### State Management Pattern

- **Zustand** with `persist` middleware for global state
- `partialize` limits which keys are saved to localStorage
- Actions are never persisted — they are recreated by Zustand on load
- Feature-level state stays in React hooks (no Zustand for local form state)

---

## Feature Module Convention

Each feature lives in `src/features/{feature-name}/`:

```
src/features/my-feature/
├── MyFeaturePage.tsx       # Page component (named export, lazy-loaded)
├── MyFeatureType.ts        # Types and interfaces
├── MyFeatureConstant.ts    # Constants
├── MyFeatureUtil.ts        # Utility functions and pure logic
├── MyFeatureDoc.md         # Documentation
├── MyFeature.module.css    # Scoped styles (optional)
├── components/             # Feature-specific components (optional)
└── hooks/                  # Feature-specific hooks (optional)
```

### Rules

1. **No `index.ts` barrel files** inside features — always import specific files
2. **One `Page` component per feature** — this is the lazy-loaded route entry point
3. **Named exports** for everything — no `export default`
4. **Hooks and components** stay in their subdirectories, not at the feature root
5. **Core files at the root** — `Page`, `Type`, `Constant`, `Util`, `Doc`

---

## Developing a New Feature

Follow these steps whenever you add a new page or tool:

### Step 1: Create the feature directory

```bash
mkdir -p src/features/my-feature
```

### Step 2: Create the core files

| File | Content |
|---|---|
| `MyFeaturePage.tsx` | Page component with `export function MyFeaturePage()` |
| `MyFeatureType.ts` | Types and interfaces |
| `MyFeatureConstant.ts` | Constants (if needed) |
| `MyFeatureUtil.ts` | Pure utility functions (if needed) |
| `MyFeatureDoc.md` | Feature documentation |

### Step 3: Register in `constants/menuConfig.tsx`

Add a new entry to the appropriate group in `MENU_CONFIG`:

```tsx
{
  key: '/my-feature',
  label: 'My Feature',
  icon: <SomeOutlined />,
  path: '/my-feature',
  description: 'What this feature does.',
  keywords: ['search', 'terms'],
  isTool: true,  // set true if it should be hideable/reorderable
  lazyComponent: () =>
    import('../features/my-feature/MyFeaturePage').then((m) => ({
      default: m.MyFeaturePage,
    })),
},
```

**That's it.** The route, sidebar link, command palette searchability, page title, and tool analytics are all handled automatically.

### Step 4: Verify

```bash
pnpm typecheck && pnpm build
pnpm dev  # test in browser
```

### Step 5: Commit

```bash
git add -A
git commit -m "feat(my-feature): add my feature page"
git push origin main
```

---

## Maintaining an Existing Feature

### Modifying a feature

1. Make changes to the feature files in `src/features/{feature-name}/`
2. If changing the page component name, update the `lazyComponent` in `menuConfig.tsx`
3. Run `pnpm typecheck` to catch type errors
4. Run `pnpm build` to validate the production bundle
5. Commit with a descriptive message: `fix(my-feature): resolve edge case`

### Removing a feature

1. Delete the feature directory: `rm -rf src/features/{feature-name}/`
2. Remove the entry from `MENU_CONFIG` in `constants/menuConfig.tsx`
3. Remove any unused icon imports in `menuConfig.tsx`
4. If the feature had shared dependencies (hooks, components), check for orphaned code:
   ```bash
   grep -rn "feature-name" src/
   ```
5. Run `pnpm typecheck && pnpm build`
6. Commit: `refactor: remove my-feature`

### Adding shared hooks or components

- **Shared hooks** → `src/hooks/` + add to `hooks/index.ts` barrel
- **Shared components** → `src/components/shared/` + add to `shared/index.ts` barrel
- **Feature-specific** → `src/features/{feature-name}/hooks/` or `components/`
- **Utility functions** → `src/utils/`

---

## Git Workflow

### Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code, always deployable |
| `feat/{name}` | New features (branch from `main`) |
| `fix/{name}` | Bug fixes (branch from `main`) |
| `refactor/{name}` | Code improvements (branch from `main`) |

### Workflow

```
1. Create a branch
   git checkout -b feat/my-feature

2. Develop (small, focused commits)
   git add -A
   git commit -m "feat(my-feature): add page scaffold"
   git commit -m "feat(my-feature): implement core logic"

3. Verify before pushing
   pnpm typecheck && pnpm build

4. Push and create PR
   git push origin feat/my-feature
   # Create Pull Request on GitHub

5. After review, merge to main
   git checkout main
   git pull origin main
```

### Commit Convention (Conventional Commits)

Every commit message must follow this format:

```
<type>(<scope>): <description>
```

| Type | When to use |
|---|---|
| `feat` | New feature or page |
| `fix` | Bug fix |
| `refactor` | Code restructuring (no behaviour change) |
| `docs` | Documentation only |
| `style` | Formatting, whitespace (no logic change) |
| `chore` | Tooling, dependencies, CI |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |

**Examples:**
```
feat(random-color): add HSL color support
fix(sidebar): resolve collapsed icon alignment
refactor(store): extract theme logic to hook
docs: update setup guide
chore: upgrade antd to v6.2
```

### Pre-commit Hooks (Automatic)

Husky + lint-staged run automatically on every commit:
1. **ESLint** — auto-fixes lint issues on staged `.ts/.tsx` files
2. **Prettier** — auto-formats staged files
3. **Commitlint** — validates commit message format

If any step fails, the commit is blocked until the issue is fixed.

---

## Code Quality Workflow

### Before every commit

These run automatically via Husky, but you can run them manually:

```bash
pnpm lint        # Check for lint errors
pnpm lint:fix    # Auto-fix lint errors
pnpm format      # Format all source files
pnpm typecheck   # Type-check without emitting
pnpm build       # Full production build (typecheck + bundle)
```

### Code review checklist

When reviewing your own or others' code:

- [ ] No `any` types (ESLint enforces this)
- [ ] No `console.log` (only `console.warn` / `console.error` allowed)
- [ ] No unused imports or variables (TypeScript strict mode)
- [ ] Feature-specific code stays inside `src/features/`
- [ ] Shared code lives in `hooks/`, `components/shared/`, or `utils/`
- [ ] JSDoc on all exported functions and components
- [ ] `pnpm typecheck && pnpm build` passes with zero errors

### Keeping dependencies up to date

```bash
pnpm outdated           # Check for outdated packages
pnpm update             # Update within semver ranges
pnpm update --latest    # Update to latest (may have breaking changes)
pnpm typecheck && pnpm build  # Always verify after updating
```

---

## Deployment

### Vercel (Recommended)

**`vercel.json`**:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Push to `main` → Vercel auto-deploys.

### Manual Build

```bash
pnpm build       # Output in dist/
pnpm preview     # Preview the production build locally
```

The `dist/` folder can be deployed to any static hosting (Netlify, Cloudflare Pages, S3, etc.).

---

## App Entry Point Reference

```tsx
// src/App.tsx
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import { useResolvedTheme } from './hooks';

const queryClient = new QueryClient();

export default function App() {
  const { resolvedTheme } = useResolvedTheme();

  useEffect(() => {
    document.body.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  return (
    <ConfigProvider
      theme={{ algorithm: resolvedTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ConfigProvider>
  );
}
```
