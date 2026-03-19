# Base Project Architecture

## 1. Project Goal
Create a clean and scalable admin web application with feature-based modules and clear coding conventions for a new team.

## 2. Tech Stack

### 2.1 Initialization
```bash
pnpm create vite@latest . --template react-ts
```

### 2.2 Core
- pnpm
- React 18.x
- TypeScript 5.x
- Vite 5.x

### 2.3 Data Fetching
- Axios 1.x for HTTP requests

### 2.4 Server State
- @tanstack/react-query 5.x for server state and caching

### 2.5 Client State
- Zustand 4.x for global app state only
- React useState for local page/component state

### 2.6 UI Library
- Ant Design 5.x
- @ant-design/icons 5.x

### 2.7 Routing
- react-router-dom 6.x

### 2.8 Styling
- CSS Modules (*.module.css)
- clsx

### 2.9 Utilities
- Day.js
- query-string

### 2.10 Code Quality
- ESLint + Prettier
- Husky + lint-staged

## 3. Must-Have Features
- Multi-language support (default: English)
- Theme mode: Light, Dark, System
- Protected routes for admin pages

## 4. Folder Structure
Feature names below are examples only, not the real project modules.

```text
src/
├── api/
│   └── axiosClient.ts
├── assets/
├── components/
│   ├── layout/
│   ├── ui/
│   └── PrivateRoute.tsx
├── config/
├── constants/
├── hooks/
├── router/
│   └── index.tsx
├── store/
│   └── index.ts
├── types/
│   └── index.ts
├── utils/
└── features/
    ├── auth/
    ├── category/
    ├── dashboard/
    ├── permission/
```

### 4.1 Example Feature Structure (Inside features)
This is an example of how one feature can be organized.

```text
features/
└── category/
    ├── index.ts
    ├── types.ts
    ├── api/
    │   ├── categoryApi.ts
    │   └── useCategory.ts
    ├── components/
    │   ├── CategoryForm.tsx
    │   ├── CategoryFilter.tsx
    │   └── CategoryTable.tsx
    ├── pages/
    │   ├── ListPage.tsx
    │   ├── AddPage.tsx
    │   └── DetailPage.tsx
    └── Category.module.css
```

## 5. Feature Template
```text
features/<feature-name>/
├── index.ts
├── types.ts
├── api/
├── components/
├── pages/
└── <FeatureName>.module.css
```

## 6. Naming Rules
- Folder names: kebab-case
- Component files: PascalCase
- Utility files: camelCase
- Hooks: useXxx
- CSS modules: ComponentName.module.css

## 7. Basic Architecture Rules
- Keep feature logic inside each feature folder.
- Use shared folders only for reusable cross-feature code.
- Keep page files thin; move reusable logic into hooks/services.
- Do not import private code directly from another feature.

## 8. Commit Convention
Use Conventional Commits format:

```text
type(scope): subject
```

Examples:
- feat(album): add album status filter
- fix(auth): retry token refresh
- refactor(router): split route config

## 9. Done Checklist
- Lint passes
- Type check passes
- No obvious runtime console errors
- New code follows folder and naming conventions
- Mandatory coding checklist is satisfied

## 10. State Management Rules

### 10.1 Zustand (Global State Only)
Use Zustand only for global state shared across multiple pages/features.

Examples:
- Current user/session summary
- Global theme mode
- Global language selection
- Sidebar collapsed state

### 10.2 useState (Local State)
Use React useState for page-level and component-level state.

Examples:
- Modal open/close state
- Local filter panel state
- Form step/tab index
- Temporary input/UI toggles

### 10.3 State Boundaries
- Do not store one-page-only state in Zustand.
- Do not duplicate React Query server data in Zustand.
- Keep local state close to the component that owns it.

## 11. Page Error and Loading Standards

### 11.1 Required States for Every Async Page
Every page that fetches data must explicitly handle:
- Loading state
- Error state
- Empty state
- Success state

### 11.5 UX Rules
- Never show blank screens during loading/error.
- Always provide recovery actions (Retry, Back, Reload).
- Use consistent error layout and copy across all pages.
- Stop infinite loading states; surface timeout/failure feedback.

## 12. Access Control Matrix (Frontend Scope)

### 12.1 Scope
This section is frontend-only. It defines UI route and action visibility rules based on permissions.

### 12.2 Role Definitions
- Super Admin: full UI access
- Admin: manage content and operations
- Editor: create/update content
- Viewer: read-only access

### 12.3 Permission Key Format
Use this key format in frontend permission checks:

```text
<resource>.<action>
```

Examples:
- category.view
- category.create
- category.update
- category.delete
- user.manage
- permission.manage

### 12.4 Example Matrix
| Resource | Action | Permission Key | Super Admin | Admin | Editor | Viewer |
|---|---|---|---|---|---|---|
| Dashboard | View | dashboard.view | Allow | Allow | Allow | Allow |
| Category | View | category.view | Allow | Allow | Allow | Allow |
| Category | Create | category.create | Allow | Allow | Allow | Deny |
| Category | Update | category.update | Allow | Allow | Allow | Deny |
| Category | Delete | category.delete | Allow | Allow | Deny | Deny |
| User | View | user.view | Allow | Allow | Deny | Deny |
| User | Manage | user.manage | Allow | Deny | Deny | Deny |
| Permission | Manage | permission.manage | Allow | Deny | Deny | Deny |

### 12.5 Frontend Enforcement Rules
- Route-level guard: block page access when permission is missing.
- Action-level guard: hide or disable buttons when permission is missing.
- Keep permission checks centralized (for example, in auth store + utility helpers).

### 12.6 Route Guard Example
```text
FUNCTION hasPermission(userPermissions, requiredPermission):
    RETURN requiredPermission IN userPermissions

FUNCTION routeGuard(requiredPermission, userPermissions):
    IF hasPermission(userPermissions, requiredPermission) IS FALSE:
        REDIRECT TO "forbidden page"
    ELSE:
        ALLOW ROUTE ACCESS
```

### 12.7 Action Guard Example
```text
SET canDeleteCategory = hasPermission(currentUser.permissions, "category.delete")

IF canDeleteCategory:
    SHOW "Delete" button
ELSE:
    HIDE BUTTON OR SHOW DISABLED BUTTON
```

## 13. Mandatory Coding Checklist
All code changes must follow this checklist before merge.

### 13.1 Airbnb Convention
- Code style must follow Airbnb JavaScript/TypeScript conventions.
- ESLint rules should enforce Airbnb-compatible standards.

### 13.2 100% TypeScript, No any
- Use TypeScript for all source code files.
- Do not use any type.
- If a type is unknown, use unknown and narrow it explicitly.

### 13.3 No Unused Imports
- Do not keep unused imports.
- Remove unused variables and dead code where possible.
- Lint must fail when unused imports exist.

### 13.4 Readability and Spacing
- Keep a blank line between logical code blocks.
- Keep functions and condition branches visually separated.
- Keep formatting consistent with Prettier rules.

### 13.5 Pre-Merge Validation
- Run lint and fix all violations.
- Run type-check and fix all errors.
- Ensure no file violates the rules above.

## 14. Spacing Utility System (Reduce CSS Duplication)

### 14.1 Goal
Use shared spacing utilities for common margin/padding patterns instead of repeating custom CSS in each component.

### 14.2 Spacing Scale
Use a fixed spacing scale:
- 0
- 4
- 8
- 12
- 16
- 24
- 32

### 14.3 Utility Naming Convention
Use short and consistent utility names.

Examples:
- p-8: padding 8px
- px-16: horizontal padding 16px
- py-12: vertical padding 12px
- m-8: margin 8px
- mt-16: margin-top 16px
- mb-24: margin-bottom 24px
- mx-auto: horizontal auto margin

### 14.4 Usage Rule
- Use utility classes for spacing/layout primitives.
- Use CSS Modules for component-specific visual styles.
- Avoid adding new one-off spacing values unless necessary.

### 14.5 Example (Pseudo)
```text
Card container:
    class = "p-16 mb-24"

Filter row:
    class = "mb-12"

Submit button wrapper:
    class = "mt-16"
```

### 14.6 Do and Do Not
- Do: reuse existing spacing utilities first.
- Do: keep spacing values aligned with the defined scale.
- Do Not: repeat margin/padding declarations across many CSS module files.
- Do Not: mix random spacing values without design reason.

## 15. Website Layout Specification

### 15.1 Core Layout (Required)
Main layout must have 3 areas:
- Sidebar: contains navigation links to each page.
- Header: contains user avatar and account actions.
- Content: renders page-specific content.

### 15.2 Sidebar Requirements
- Show clear menu groups by domain (for example: Dashboard, Content, User, Settings).
- Highlight active route.
- Support collapsed/expanded states.
- Hide menu items that user does not have permission to access.

### 15.3 Header Requirements
- Show user avatar at top-right.
- Avatar menu should include at least: Profile, Change language, Change theme, Logout.
- Show current page title or breadcrumb.

### 15.4 Content Area Requirements
- Keep consistent page padding and spacing across all pages.
- Render required async states: Loading, Error, Empty, Success.
- Provide page-level action area for common actions (Create, Save, Filter, Refresh).

### 15.5 Recommended UX Enhancements
- Add global search/command shortcut.
- Add unsaved changes warning on form pages.
- Add confirm modal for destructive actions.

### 15.6 Responsive Behavior
- Desktop: fixed sidebar + full header + content.
- Tablet/Mobile: sidebar becomes drawer.
- Keep header actions accessible on small screens.
- For dense tables on mobile, support horizontal scroll.

### 15.7 Accessibility Baseline
- Sidebar and menu items must be keyboard navigable.
- Provide visible focus states.
- Use semantic landmarks for layout (nav, header, main).
- Ensure text and icon contrast is accessible.
