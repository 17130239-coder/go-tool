# JSON Formatter Feature

## Purpose
The JSON Formatter feature provides a simple, intuitive interface for validating, formatting, and minifying JSON data. It helps developers quickly clean up JSON from various sources (APIs, logs, configs) and ensures valid JSON structure.

## User Flow

1. **Input JSON**: User pastes or types JSON into the input textarea
2. **Real-time Validation**: As the user types, the system validates the JSON and shows errors immediately
3. **Format Options**: User selects indentation preference (2 or 4 spaces)
4. **Actions**:
   - **Format**: Beautifies JSON with proper indentation
   - **Minify**: Compresses JSON by removing all whitespace
   - **Clear**: Resets both input and output
5. **Output & Copy**: Formatted/minified JSON appears in the output area with a copy button for easy clipboard access

## Key Features

- **Real-time validation** with error feedback
- **Configurable indentation** (2 or 4 spaces)
- **Minify option** for compact JSON
- **Copy to clipboard** functionality
- **Clear error messages** with line/column information from JSON.parse
- **Monospace output** for better readability

## Technical Notes

### Architecture
- **Utilities**: JSON operations (format, minify, validate) in `src/utils/jsonFormatter.ts`
- **Page Component**: `JsonFormatterPage.tsx` manages UI state and user interactions
- **Types**: Type definitions in `types.ts` for formatter options and results

### Error Handling
- Uses try/catch around `JSON.parse()` to capture syntax errors
- Extracts error messages from native Error objects
- Displays errors in an Ant Design Alert component with "error" status
- Disables action buttons when validation fails

### State Management
- Local React state for input, output, error, indentSize, and copied status
- No server state or global state needed (pure client-side transformation)

### Dependencies
- **Ant Design components**: Card, Input.TextArea, Button, Space, Radio, Alert, Typography
- **Icons**: @ant-design/icons (FormatPainterOutlined, CompressOutlined, CopyOutlined, ClearOutlined)
- **Browser API**: navigator.clipboard for copy functionality

### Utilities API

```typescript
// Format with custom indent
formatJSON(input: string, options: FormatterOptions): FormatterResult

// Minify JSON
minifyJSON(input: string): FormatterResult

// Validate without formatting
validateJSON(input: string): FormatterResult
```

All functions return a `FormatterResult` with:
- `success: boolean` - Whether the operation succeeded
- `formatted?: string` - The formatted/minified output (on success)
- `error?: string` - Error message (on failure)

## Future Enhancements
- Syntax highlighting in input/output
- JSON schema validation
- JSON to YAML/XML conversion
- Tree view for nested structures
- Save/load from file
