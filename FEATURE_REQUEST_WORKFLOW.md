# Feature Request Workflow

## 1) Goal

This document defines the standard workflow for handling a **new feature request** in `go-tool` to ensure:

- Clear scope and expectations
- Consistent architecture and coding standards
- Reliable quality gates
- Predictable delivery flow (PR -> merge -> deploy verification)

## 2) When to Use This Workflow

Use this workflow for any request that introduces a new feature or a significant feature expansion, such as:

- New page/tool
- New flow in an existing feature
- Major behavior or UX change

## 3) End-to-End Workflow

1. Capture request and confirm scope
2. Break down tasks and create implementation plan
3. Create a dedicated branch from `main`
4. Implement using feature-first architecture
5. Update feature documentation
6. Run quality gates (lint/typecheck/build)
7. Commit, push, and open PR
8. Merge into `main`
9. Verify deployment success (Vercel)
10. Close the task

## 4) Step-by-Step Process

### Step 1 - Request Intake

- Confirm:
  - What feature is requested
  - In-scope vs out-of-scope items
  - Expected behavior and UX
- Resolve material ambiguities early.
- If not blocked, proceed with reasonable assumptions.

### Step 2 - Planning

- Create a concise plan including:
  - Problem statement
  - Approach
  - Task list
- Order tasks by dependencies.

### Step 3 - Branching

Create a branch from `main`:

```bash
git checkout main
git pull
git checkout -b feat/<short-topic>
```

Naming conventions:

- `feat/<topic>` for features
- `fix/<topic>` for bug fixes
- `docs/<topic>` for documentation

### Step 4 - Implementation

- Follow feature-first structure:
  - `src/features/<feature>/...`
- Prefer Ant Design components for UI structure and interactions.
- Reuse shared hooks/components/utilities before adding new ones.
- Update routing/menu when adding a new page.
- Export feature public API via `src/features/<feature>/index.ts`.

### Step 5 - Documentation

Create or update:

- `src/features/<feature>/README.md`

Minimum content:

- Purpose
- User flow
- Key technical notes

### Step 6 - Quality Gates

Run all required checks:

```bash
pnpm lint --quiet
pnpm typecheck
pnpm build
```

- Do not proceed to merge while any check fails.

### Step 7 - Commit and PR

Use Conventional Commits:

```text
feat(scope): short summary
```

- Push branch and open PR to `main`.
- PR description should include:
  - Change summary
  - Validation commands executed
  - Behavior/UX impact (if any)

### Step 8 - Merge

- Merge after checks are stable/green.
- Prefer squash merge for a clean history.

### Step 9 - Deployment Verification (Required)

- After merge, verify deployment for the latest commit.
- For this repository, confirm **Vercel status = success**.
- Only mark the task complete after deployment succeeds.

## 5) Definition of Done (Feature Request)

A feature request is done only when all are true:

- Requested scope is fully implemented
- Code follows repository conventions
- Feature documentation is updated
- `pnpm lint --quiet` passes
- `pnpm typecheck` passes
- `pnpm build` passes
- PR is merged into `main`
- Vercel deployment is verified as successful

## 6) Quick Checklist (Copy/Paste)

```text
[ ] Scope confirmed
[ ] Plan created
[ ] Branch created from main
[ ] Feature implemented
[ ] Feature README updated
[ ] lint pass
[ ] typecheck pass
[ ] build pass
[ ] PR created
[ ] PR merged
[ ] Vercel deployment success
```

## 7) Repository Notes

- UI preference: prioritize Ant Design components.
- Use Zustand for global shared state; keep local UI state in component/page state.
- Avoid duplicating logic when shared helpers already exist.
