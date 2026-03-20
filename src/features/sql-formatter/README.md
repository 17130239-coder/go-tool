# SQL Formatter Feature

## Purpose
The SQL Formatter feature provides a powerful tool for formatting, beautifying, and minifying SQL queries. It supports multiple SQL dialects and offers extensive formatting options to match different coding standards and preferences.

## User Flow

1. **Input SQL**: User pastes or types SQL query into the input textarea.
2. **Real-time Validation**: As the user types, the system validates SQL syntax and shows errors immediately.
3. **Configure Format Options**:
   - **SQL Dialect**: Standard SQL, MySQL, PostgreSQL, T-SQL, PL/SQL
   - **Indentation**: 2 or 4 spaces
   - **Keyword Case**: UPPERCASE, lowercase, or preserve original
   - **Lines Between Queries**: 1, 2, or 3 blank lines
4. **Classic Actions**:
   - **Format**: Beautifies SQL with proper indentation and keyword casing
   - **Minify**: Compresses SQL by removing unnecessary whitespace
   - **Clear**: Resets both input and output
5. **AI Assistant Actions**:
   - **Generate AI Prompt**: Builds a reusable AI prompt from current SQL input
   - **Detected SQL Suggestions**: Shows quick heuristics (risk/quality hints)
   - **Copy Prompt**: Copies generated prompt for use in LLM tools

## Key Features

- **Multi-dialect support**: Standard SQL, MySQL, PostgreSQL, T-SQL (SQL Server), PL/SQL (Oracle)
- **Real-time validation** with error feedback
- **Configurable indentation** (2 or 4 spaces)
- **Keyword casing options** (UPPERCASE, lowercase, preserve)
- **Adjustable line spacing** between queries
- **Minify option** for compact SQL
- **Copy to clipboard** functionality
- **AI-ready prompt generator** with contextual checklist
- **Rule-based SQL hints** for common anti-patterns

## Technical Notes

### Architecture
- **Utilities**: SQL operations (format, minify, validate) in `src/utils/sqlFormatter.ts`
- **AI helper**: Prompt + heuristic suggestions in `src/features/sql-formatter/aiHelper.ts`
- **Page Component**: `SqlFormatterPage.tsx` manages UI state and user interactions
- **Types**: shared formatter types from `src/types/formatter.ts`; feature-level AI result type in `src/features/sql-formatter/types.ts`
- **External Library**: Uses `sql-formatter` npm package for robust SQL parsing and formatting
- **Shared UI primitives**:
  - `FeatureCard` and `PageHeader` for consistent page shell
  - `PageSectionTitle` for consistent section labels
  - `ErrorAlert` for standardized error rendering
  - AntD `Card` + `Flex` wrappers for format options and AI assistant panels

### AI Helper behavior
- Input is normalized before prompt generation.
- Heuristic checks detect patterns such as:
  - `SELECT *`
  - `UPDATE`/`DELETE` without `WHERE`
  - `JOIN` without `ON`
  - `ORDER BY` / `WHERE` without limiting rows
  - aggregate usage without `GROUP BY`
- Output includes:
  - AI prompt text (`prompt`)
  - suggestion list (`suggestions`)
  - validation/error state (`success`, `error`)

### Format Options

#### SQL Dialects
- `sql`: Standard SQL (ANSI)
- `mysql`: MySQL-specific syntax
- `postgresql`: PostgreSQL-specific syntax
- `tsql`: T-SQL (Microsoft SQL Server)
- `plsql`: PL/SQL (Oracle Database)

#### Keyword Case
- `upper`: Keywords in UPPERCASE (SELECT, FROM, WHERE)
- `lower`: Keywords in lowercase (select, from, where)
- `preserve`: Keep original casing

#### Indentation
- 2 spaces (default)
- 4 spaces

#### Lines Between Queries
- 1, 2, or 3 blank lines between separate SQL statements

### Error Handling
- Uses try/catch around sql-formatter library calls
- Extracts error messages from library exceptions
- Displays errors through shared `ErrorAlert` component with consistent style
- Disables action buttons when validation fails

### State Management
- Local React state for input, output, error, format options, and AI prompt state
- No server state or global state needed (pure client-side transformation)
- Real-time validation on input change

### Dependencies
- **sql-formatter**: Core SQL parsing and formatting library
- **Ant Design components**: Input.TextArea, Button, Space, Radio, Typography, Select, Alert, Divider
- **Browser API**: navigator.clipboard via shared copy hook

## Utilities API

```typescript
// Format with custom options
formatSQL(input: string, options: FormatterOptions): FormatterResult

// Minify SQL
minifySQL(input: string): FormatterResult

// Validate SQL syntax
validateSQL(input: string): FormatterResult

// Build AI prompt + heuristic suggestions
buildSqlAiPrompt(input: string): SqlAiPromptResult
```

## Future Enhancements
- Syntax highlighting in input/output
- Query execution plan visualization
- Schema-aware linting (table/index metadata)
- Save/load from file
- Dark mode syntax highlighting
- Support for more SQL dialects (SQLite, MariaDB, etc.)
- Query beautification presets (company style guides)
