# Naming Converter Feature

## Purpose

The naming-converter feature lets users paste or type a string and instantly transform it into multiple naming conventions used in source code:

- `camelCase`
- `kebab-case`
- `snake_case`
- `PascalCase`
- `CONSTANT_CASE`

It is intended as a quick utility page for developers working with variable names, file names, or API field mappings.

## User flow

1. Open the **Naming Converter** page from the sidebar.
2. Enter text in the input area.
3. View converted outputs rendered in result rows.
4. Copy any output format with the row copy button.

Behavior details:

- Empty input returns empty outputs.
- Copy action is disabled when a row value is empty.
- Copy behavior uses shared clipboard hook with temporary "Copied!" button state.

## Key technical notes

- Main page component: `pages/ConverterPage.tsx`
- Result row UI and copy behavior: `components/ResultRow.tsx`
- Shared UI primitives:
  - `FeatureCard` and `PageHeader` for consistent page structure
  - AntD `Card` + `Flex` layout for each result row
  - shared `CopyButton` in result rows
- Shared behavior hook: `useCopyToClipboard` for consistent copy feedback handling
- Public feature export: `index.ts`
- Conversion logic is centralized in shared utility: `src/utils/stringConverter.ts`
- Route visits are tracked globally to power dashboard recent tools.
- Conversion pipeline in utility:
  - normalize diacritics (including Vietnamese `đ`/`Đ`)
  - parse mixed input into lowercase word tokens
  - map tokens to each target naming convention
- UI implementation:
  - Ant Design-first structure (`Input.TextArea`, `Card`, `Flex`, `Typography`)
  - no feature-specific CSS module needed for row layout
