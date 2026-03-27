# Project Setup Guide

A step-by-step guide to create a new project with the same architecture, toolchain, and conventions as this one.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Bundler | Vite 8 |
| UI Library | Ant Design 6 |
| Routing | React Router DOM 7 (lazy routes) |
| State | Zustand 5 (persisted via `zustand/middleware`) |
| Server State | TanStack Query 5 |
| HTTP Client | Axios |
| Drag & Drop | @dnd-kit |
| CSS | Vanilla CSS + CSS Modules (`.module.css`) |
| Package Manager | pnpm |
| Linting | ESLint 9 (flat config) |
| Formatting | Prettier 3 |
| Git Hooks | Husky 9 + lint-staged |
| Commits | Commitlint (Conventional Commits) |

---

## Prerequisites

```bash
node --version    # >= 20
pnpm --version    # >= 9
git --version
```

---

## Step 1: Scaffold the Project

```bash
pnpm create vite@latest my-app -- --template react-ts
cd my-app
```

This generates: `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `package.json`, and the `src/` folder.

---

## Step 2: Install Dependencies

```bash
# Runtime
pnpm add react react-dom react-router-dom antd @ant-design/icons
pnpm add zustand @tanstack/react-query axios
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
pnpm add clsx dayjs query-string sql-formatter

# Dev
pnpm add -D prettier eslint-plugin-import eslint-plugin-jsx-a11y
pnpm add -D eslint-plugin-react-hooks eslint-plugin-react-refresh typescript-eslint globals
pnpm add -D husky lint-staged @commitlint/cli @commitlint/config-conventional
pnpm add -D @types/node
```

---

## Step 3: Root Config Files

### `tsconfig.json` (project references root)

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

### `tsconfig.app.json` (application source)

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

### `tsconfig.node.json` (Vite config / Node scripts)

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

### `vite.config.ts`

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon-light.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `.gitignore`

```gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
.vercel
```

---

## Step 4: Configure ESLint

Replace `eslint.config.js`:

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

---

## Step 5: Configure Prettier

Create `.prettierrc`:

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

---

## Step 6: Configure Git Hooks

```bash
git init
pnpm exec husky init
```

### `.husky/pre-commit`

```sh
pnpm exec lint-staged
```

### `.husky/commit-msg`

```sh
pnpm exec commitlint --edit $1
```

### `commitlint.config.cjs`

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

### `lint-staged` (inside `package.json`)

```json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{css,json,md}": ["prettier --write"]
}
```

---

## Step 7: `package.json` Scripts

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

## Step 8: Source Directory Structure

```
src/
├── api/                    # HTTP client setup
│   └── axiosClient.ts      # Axios instance with interceptors
├── assets/                 # Static images, SVGs
├── components/
│   ├── layout/             # App shell: MainLayout, Sidebar, Header
│   │   ├── MainLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── router/             # Route-level components
│   │   └── HiddenToolRouteGuard.tsx
│   ├── shared/             # Reusable UI (barrel-exported via index.ts)
│   │   ├── index.ts        # ← barrel re-exports all shared components
│   │   ├── FeatureCard.tsx
│   │   ├── PageHeader.tsx
│   │   ├── PageSectionTitle.tsx
│   │   ├── ErrorAlert.tsx
│   │   ├── CopyButton.tsx
│   │   ├── ResultField.tsx
│   │   ├── InputSection.tsx
│   │   ├── OutputSection.tsx
│   │   └── FormatterActions.tsx
│   └── ui/                 # Low-level primitives
│       ├── PageLoader.tsx
│       ├── PageError.tsx
│       └── PageEmpty.tsx
├── constants/
│   └── menuConfig.tsx       # Menu items, tool paths, navigation config
├── features/               # Feature modules (see convention below)
│   └── formatter/          # Shared cross-feature types
│       └── FormatterType.ts
├── hooks/                  # Global shared hooks (barrel-exported)
│   ├── index.ts            # ← barrel re-exports all hooks
│   ├── useBreadcrumb.ts
│   ├── useCopyToClipboard.ts
│   ├── useInputOutput.ts
│   ├── usePageTitle.ts
│   └── useResolvedTheme.ts
├── router/
│   └── index.tsx           # createBrowserRouter with lazy routes
├── store/
│   └── index.ts            # Zustand store with persist middleware
├── styles/
│   └── spacing.css         # Utility CSS classes (m-*, p-*, w-full, etc.)
├── types/
│   └── index.ts            # Global TypeScript types (ThemeMode, etc.)
├── App.tsx                 # Root component (ConfigProvider + QueryClient + Router)
├── App.css                 # Global app styles
├── main.tsx                # Entry point (createRoot)
└── index.css               # CSS reset / base styles
```

> **Barrel Export Pattern:**
> - `src/hooks/index.ts` and `src/components/shared/index.ts` use `export * from './...'` to allow consumers to import from `'../../hooks'` or `'../../components/shared'` cleanly.
> - Feature modules do **NOT** use barrel exports — always import the specific file directly.

---

## Step 9: Feature Module Convention

Each feature lives in `src/features/{feature-name}/` and follows strict naming:

```
src/features/my-feature/
├── MyFeaturePage.tsx       # Main page component (named export)
├── MyFeatureType.ts        # TypeScript interfaces and types
├── MyFeatureConstant.ts    # Constants for this feature
├── MyFeatureUtil.ts        # Utility functions and pure logic
├── MyFeatureDoc.md         # Feature documentation
├── MyFeature.module.css    # CSS Modules (optional)
├── components/             # Feature-specific components (kept nested)
│   └── MyComponent.tsx
└── hooks/                  # Feature-specific hooks (kept nested)
    └── useMyHook.ts
```

> **Rules:**
> - **No `index.ts`** barrel files inside features — always import directly, e.g. `import { MyFeaturePage } from './MyFeaturePage'`.
> - **Hooks and components** inside a feature stay in their respective `hooks/` and `components/` subdirectories.
> - Only **one Page file** per feature — it is the lazy-loaded route entry point.
> - Cross-feature shared types (e.g. `FormatterType.ts`) go in a dedicated shared feature under `src/features/formatter/`.

---

## Step 10: Router Setup (Lazy Loading)

Use `createBrowserRouter` with lazy-loaded per-route in `src/router/index.tsx`:

```tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { PageError } from '../components/ui/PageError';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <PageError />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: 'my-feature',
        errorElement: <PageError />,
        lazy: async () => {
          const { MyFeaturePage } = await import('../features/my-feature/MyFeaturePage');
          return { Component: MyFeaturePage };
        },
      },
    ],
  },
]);
```

---

## Step 11: Global State with Zustand

Create `src/store/index.ts`:

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: AppState['themeMode']) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      themeMode: 'system',
      setThemeMode: (mode) => set({ themeMode: mode }),
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    {
      name: 'my-app-storage',
      partialize: (state) => ({
        themeMode: state.themeMode,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);
```

---

## Step 12: Bootstrap `App.tsx`

```tsx
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

---

## Step 13: CSS Strategy

This project uses **vanilla CSS** with three layers:

| Layer | Location | Usage |
|---|---|---|
| **Global styles** | `index.css`, `App.css` | Resets, CSS variables, global rules |
| **Utility classes** | `styles/spacing.css` | Spacing helpers: `.m-8`, `.p-16`, `.mb-24`, `.w-full` |
| **CSS Modules** | `{Feature}.module.css` | Feature-scoped styles via `import styles from './MyFeature.module.css'` |

Import `spacing.css` in `index.css` or `App.css`:

```css
@import './styles/spacing.css';
```

---

## Step 14: Vercel Deployment (Optional)

Create `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(feature): add new tool page
fix(router): resolve lazy load error
refactor(store): simplify state shape
chore: update dependencies
docs: add setup guide
```

**Types:** `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `perf`

---

## Adding a New Feature — Checklist

1. Create `src/features/{feature-name}/` directory
2. Add core files: `{Feature}Page.tsx`, `{Feature}Type.ts`, `{Feature}Constant.ts`, `{Feature}Util.ts`, `{Feature}Doc.md`
3. Add optional: `{Feature}.module.css`, `components/`, `hooks/`
4. Register a lazy route in `src/router/index.tsx`
5. Add a menu item in `src/constants/menuConfig.tsx`
6. Run `pnpm typecheck && pnpm build` to verify
