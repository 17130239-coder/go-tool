# Go Tool

A modular, feature-rich developer toolbox built with React + TypeScript. Each tool is a self-contained feature module that plugs into a shared layout with auto-generated routing, sidebar navigation, and command palette search.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 5.9 |
| Bundler | Vite 8 |
| UI Library | Ant Design 6 + @ant-design/icons |
| Routing | React Router DOM 7 (lazy routes) |
| State | Zustand 5 (persisted to localStorage) |
| Server State | TanStack Query 5 (ready to use) |
| HTTP Client | Axios |
| CSS | Vanilla CSS + CSS Modules |
| Linting | ESLint 9 (flat config) + Prettier 3 |
| Git Hooks | Husky 9 + lint-staged + Commitlint |

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Type-check
pnpm typecheck

# Production build
pnpm build

# Preview production build
pnpm preview
```

---

## Architecture Overview

### Single Source of Truth

Every page in the app is defined once in `constants/menuConfig.tsx`. Adding a single entry there automatically creates:

- ✅ A lazy-loaded route
- ✅ A sidebar navigation link
- ✅ A command palette search result (Cmd/Ctrl + K)
- ✅ A page title in the browser tab
- ✅ Tool analytics tracking (recently used)

### Data Flow

```
  menuConfig.tsx (data + types)
       │
       ├──▶ buildRoutes()         → React Router (lazy-loaded pages)
       ├──▶ buildSidebarMenuConfig()  → Sidebar component
       ├──▶ buildVisibleNavigableMenuItems() → Command Palette
       └──▶ findNavigableItemByPath()  → Page title (usePageTitle)
```

### Key Files

| File | Responsibility |
|---|---|
| `constants/menuConfig.tsx` | Page definitions — the single source of truth |
| `constants/appConfig.ts` | App-wide constants (title, assets, layout dimensions) |
| `utils/menuUtil.ts` | Functions that consume menuConfig (routing, sidebar, search) |
| `store/index.ts` | Global state: theme, sidebar, favorites, tool ordering |
| `router/index.tsx` | Router setup (calls `buildRoutes()`) |
| `App.tsx` | Root component: ConfigProvider → QueryClient → Router |

### State Management

- **Global state** — Zustand with `persist` middleware → localStorage
- **Persisted keys** — theme, sidebar collapsed, favorites, recent usage, tool ordering
- **Feature state** — React hooks (`useState`, `useMemo`) — never Zustand
- **Server state** — TanStack Query (configured and ready, add queries per feature)

---

## Folder Structure

```
src/
├── assets/                     # Static images, SVGs
├── components/
│   ├── layout/                 # App shell
│   │   ├── MainLayout.tsx      # Root layout (sidebar + header + content)
│   │   ├── Sidebar.tsx         # Collapsible sidebar with favorites
│   │   ├── Header.tsx          # Top bar (breadcrumbs, search, theme toggle)
│   │   ├── CommandPalette.tsx  # Cmd+K fuzzy search modal
│   │   ├── HiddenToolRouteGuard.tsx  # Redirects hidden tools to dashboard
│   │   └── KeyboardShortcutsModal.tsx
│   ├── shared/                 # Reusable UI components (barrel-exported)
│   │   ├── index.ts            # Barrel: export * from './...'
│   │   ├── FeatureCard.tsx     # Top-level wrapper card for feature pages
│   │   ├── PageHeader.tsx      # Page title + description
│   │   ├── PageSectionTitle.tsx # Bold section label inside cards
│   │   ├── CopyButton.tsx      # Copy/Copied! button
│   │   ├── ResultField.tsx     # Labelled read-only input + copy button
│   │   └── ErrorAlert.tsx      # Conditional error banner
│   └── ui/                     # Low-level primitives
│       ├── PageLoader.tsx      # Full-page spinner (lazy route transitions)
│       ├── PageError.tsx       # Error state with retry/back buttons
│       └── PageEmpty.tsx       # Empty state placeholder
├── constants/
│   ├── appConfig.ts            # App title, asset paths, layout dimensions
│   └── menuConfig.tsx          # Menu/page definitions (single source of truth)
├── features/                   # Feature modules (see convention below)
│   ├── dashboard/
│   ├── naming-converter/
│   ├── random-number/
│   ├── random-color/
│   ├── text-typing/
│   ├── gross-net-salary/
│   └── sidebar-settings/
├── hooks/                      # Shared hooks (barrel-exported)
│   ├── index.ts                # Barrel: export * from './...'
│   ├── useBreadcrumb.ts        # Breadcrumb trail from current route
│   ├── useCopyToClipboard.ts   # Clipboard API wrapper
│   ├── useCopyWithFeedback.ts  # Copy + per-key "Copied!" feedback
│   ├── usePageTitle.ts         # Syncs document.title with route
│   ├── useResolvedTheme.ts     # Resolves system/light/dark preference
│   └── useToolAnalytics.ts     # Records tool visits for dashboard
├── router/
│   └── index.tsx               # createBrowserRouter + buildRoutes()
├── store/
│   └── index.ts                # Zustand store (theme, sidebar, tools)
├── styles/
│   └── spacing.css             # Utility CSS classes
├── utils/
│   └── menuUtil.ts             # Route builder, sidebar builder, path helpers
├── App.tsx                     # Root: ConfigProvider + QueryClient + Router
├── App.css                     # Global app styles
├── main.tsx                    # Entry point (StrictMode + createRoot)
└── index.css                   # CSS reset / base styles
```

### Import Conventions

- **Shared hooks** — `import { useCopyWithFeedback } from '../../hooks'` (barrel)
- **Shared components** — `import { FeatureCard, PageHeader } from '../../components/shared'` (barrel)
- **Feature files** — `import { convertAll } from './NamingConverterUtil'` (direct, no barrel)

---

## Feature Module Convention

Each feature lives in `src/features/{feature-name}/`:

```
src/features/my-feature/
├── MyFeaturePage.tsx           # Page component (named export, lazy-loaded)
├── MyFeatureType.ts            # Types and interfaces
├── MyFeatureConstant.ts        # Constants
├── MyFeatureUtil.ts            # Pure utility functions
├── MyFeatureDoc.md             # Feature documentation
├── MyFeature.module.css        # Scoped CSS Modules (optional)
├── components/                 # Feature-specific components (optional)
└── hooks/                      # Feature-specific hooks (optional)
```

### Rules

1. **No barrel files** (`index.ts`) inside features — import specific files directly
2. **One `Page` component** per feature — the lazy-loaded route entry point
3. **Named exports only** — no `export default` (except `App.tsx`)
4. **Export name = file name** — e.g. `RandomNumberPage.tsx` exports `RandomNumberPage`

---

## Adding a New Feature

### 1. Create the feature directory

```bash
mkdir -p src/features/my-feature
```

### 2. Create the page component

```tsx
// src/features/my-feature/MyFeaturePage.tsx
import { FeatureCard, PageHeader } from '../../components/shared';

export function MyFeaturePage() {
  return (
    <FeatureCard>
      <PageHeader title="My Feature" description="What this feature does." />
      {/* Your feature UI here */}
    </FeatureCard>
  );
}
```

### 3. Register in `menuConfig.tsx`

Add one entry to `MENU_CONFIG` — everything else is automatic:

```tsx
{
  key: '/my-feature',
  label: 'My Feature',
  icon: <SomeOutlined />,
  path: '/my-feature',
  description: 'Brief description for command palette.',
  keywords: ['search', 'terms'],
  isTool: true,
  lazyComponent: () =>
    import('../features/my-feature/MyFeaturePage').then((m) => ({
      default: m.MyFeaturePage,
    })),
},
```

### 4. Verify and commit

```bash
pnpm typecheck && pnpm build
git add -A && git commit -m "feat(my-feature): add my feature page"
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Cmd/Ctrl + K` | Open command palette |
| `?` | Open keyboard shortcuts help |
| `Esc` | Close active modal |

---

## Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start Vite dev server with HMR |
| `pnpm build` | Type-check + production build |
| `pnpm preview` | Preview production build locally |
| `pnpm typecheck` | Type-check without emitting |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Auto-fix lint errors |
| `pnpm format` | Format all source files with Prettier |

---

## Git Workflow

### Commit Convention (Conventional Commits)

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

### Pre-commit Hooks (Automatic)

Husky + lint-staged run on every commit:
1. **ESLint** — auto-fixes staged `.ts/.tsx` files
2. **Prettier** — auto-formats staged files
3. **Commitlint** — validates commit message format

---

## Deployment

### Vercel

**`vercel.json`**:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

After merge to `main`:
- `CI` workflow runs checks (`pnpm lint --quiet`, `pnpm typecheck`, `pnpm build`)
- `CD (Vercel)` deploys to production **only after CI succeeds** on `main`

### Manual

```bash
pnpm build    # Output in dist/
```

The `dist/` folder is a static SPA — deploy to any static host (Netlify, Cloudflare Pages, S3, etc.).

### GitHub Actions setup

Workflows in this repo:
- `.github/workflows/ci.yml`
- `.github/workflows/cd-vercel.yml`

Required repository secrets for CD:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Recommended branch protection for `main`:
- Require a pull request before merging
- Require status checks to pass
- Select `CI / Lint, Typecheck, Build`
