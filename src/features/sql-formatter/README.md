# SQL Formatter Feature

## Purpose
The SQL Formatter feature provides a powerful tool for formatting, beautifying, and minifying SQL queries. It supports multiple SQL dialects and offers extensive formatting options to match different coding standards and preferences.

## User Flow

1. **Input SQL**: User pastes or types SQL query into the input textarea
2. **Real-time Validation**: As the user types, the system validates SQL syntax and shows errors immediately
3. **Configure Format Options**:
   - **SQL Dialect**: Standard SQL, MySQL, PostgreSQL, T-SQL, PL/SQL
   - **Indentation**: 2 or 4 spaces
   - **Keyword Case**: UPPERCASE, lowercase, or preserve original
   - **Lines Between Queries**: 1, 2, or 3 blank lines
4. **Actions**:
   - **Format**: Beautifies SQL with proper indentation and keyword casing
   - **Minify**: Compresses SQL by removing unnecessary whitespace
   - **Clear**: Resets both input and output
5. **Output & Copy**: Formatted/minified SQL appears in the output area with a copy button

## Key Features

- **Multi-dialect support**: Standard SQL, MySQL, PostgreSQL, T-SQL (SQL Server), PL/SQL (Oracle)
- **Real-time validation** with error feedback
- **Configurable indentation** (2 or 4 spaces)
- **Keyword casing options** (UPPERCASE, lowercase, preserve)
- **Adjustable line spacing** between queries
- **Minify option** for compact SQL
- **Copy to clipboard** functionality
- **Monospace output** for better readability

## Technical Notes

### Architecture
- **Utilities**: SQL operations (format, minify, validate) in `src/utils/sqlFormatter.ts`
- **Page Component**: `SqlFormatterPage.tsx` manages UI state and user interactions
- **Types**: shared formatter types from `src/types/formatter.ts` (re-exported by feature `types.ts`)
- **External Library**: Uses `sql-formatter` npm package for robust SQL parsing and formatting
- **Shared UI primitives**:
  - `FeatureCard` and `PageHeader` for consistent page shell
  - `PageSectionTitle` for consistent section labels
  - `ErrorAlert` for standardized error rendering

### SQL Formatter Library
- **Package**: `sql-formatter` v15.7.2
- **Features**: Supports multiple SQL dialects, configurable formatting options
- **Error Handling**: Provides clear syntax error messages

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
- Local React state for input, output, error, and format options
- No server state or global state needed (pure client-side transformation)
- Real-time validation on input change

### Dependencies
- **sql-formatter**: Core SQL parsing and formatting library
- **Ant Design components**: Input.TextArea, Button, Space, Radio, Typography, Select
- **Icons**: @ant-design/icons (FormatPainterOutlined, CompressOutlined, CopyOutlined, ClearOutlined, DatabaseOutlined)
- **Browser API**: navigator.clipboard via shared copy hook

### Utilities API

```typescript
// Format with custom options
formatSQL(input: string, options: FormatterOptions): FormatterResult

// Minify SQL
minifySQL(input: string): FormatterResult

// Validate SQL syntax
validateSQL(input: string): FormatterResult
```

All functions return a `FormatterResult` with:
- `success: boolean` - Whether the operation succeeded
- `formatted?: string` - The formatted/minified output (on success)
- `error?: string` - Error message (on failure)

### FormatterOptions

```typescript
interface FormatterOptions {
  language: 'sql' | 'mysql' | 'postgresql' | 'tsql' | 'plsql';
  indent: number;
  keywordCase: 'upper' | 'lower' | 'preserve';
  linesBetweenQueries: number;
}
```

## Future Enhancements
- Syntax highlighting in input/output
- SQL query analysis and optimization suggestions
- Query execution plan visualization
- Schema validation
- Save/load from file
- Dark mode syntax highlighting
- Support for more SQL dialects (SQLite, MariaDB, etc.)
- Query beautification presets (company style guides)
