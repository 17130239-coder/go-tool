# Sidebar Settings Feature

## Purpose

The sidebar-settings feature allows users to customize the tool navigation in the sidebar.

Users can decide which tools are visible and adjust the display order of tools without changing source code.

## User flow

1. Open **Sidebar Settings** from the sidebar under the **Settings** group.
2. Use the **Visible/Hidden** switch to toggle each tool.
3. Use **up/down** buttons to reorder tools.
4. See changes reflected immediately in the sidebar menu.
5. Use **Reset to default** to restore the original visibility and order.

## Key technical notes

- Main page component: `pages/SidebarSettingsPage.tsx`
- Public feature export: `index.ts`
- Route registration: `src/router/index.tsx` at path `/settings/sidebar`
- Sidebar item registration: `src/constants/menuConfig.tsx`
- Persisted state is stored in global app store (`go-tool-storage`) via:
  - `hiddenToolPaths`
  - `toolOrderPaths`
- Shared menu helper `buildSidebarMenuConfig` applies these preferences before rendering sidebar menu items.
