# Sidebar Settings Feature

## Purpose

The sidebar-settings feature allows users to customize the tool navigation in the sidebar.

Users can decide which tools are visible and adjust the display order of tools without changing source code.

## User flow

1. Open **Sidebar Settings** from the sidebar under the **Settings** group.
2. Use drag handle in the Ant Design table to reorder tools.
3. Use the **Visible/Hidden** switch to toggle each tool.
4. See changes reflected immediately in the sidebar menu.
5. Hidden tools are also blocked for direct URL access and redirected to Dashboard.
6. Use **Reset to default** to restore the original visibility and order.

## Key technical notes

- Main page component: `pages/SidebarSettingsPage.tsx`
- Public feature export: `index.ts`
- Route registration: `src/router/index.tsx` at path `/settings/sidebar`
- Sidebar item registration: `src/constants/menuConfig.tsx`
- Persisted state is stored in global app store (`go-tool-storage`) via:
  - `hiddenToolPaths`
  - `toolOrderPaths`
- Shared menu helpers apply preferences across sidebar, dashboard, and command palette.
- Route-level guard (`HiddenToolRouteGuard`) prevents direct URL access to hidden tool routes.
