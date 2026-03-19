# Color Converter Feature

## Purpose

The Color Converter feature provides a powerful utility to convert colors between different formats (HEX, RGB, RGBA, HSL, HSLA). Users can input a color in any supported format and instantly see all equivalent representations.

## User Flow

1. Open **Color Converter** from the sidebar
2. Enter a color value in any format:
   - HEX: `#3B82F6`, `#F00`, `#FF0000AA`
   - RGB: `rgb(59, 130, 246)`
   - RGBA: `rgba(59, 130, 246, 0.5)`
   - HSL: `hsl(217, 91%, 60%)`
   - HSLA: `hsla(217, 91%, 60%, 0.8)`
3. View the color preview box with the converted color
4. See all format conversions displayed automatically
5. Click "Copy" button next to any format to copy to clipboard

## Key Features

- **Multi-format parsing**: Supports HEX (3, 4, 6, 8 digits), RGB, RGBA, HSL, HSLA
- **Real-time conversion**: Converts as you type
- **Visual preview**: Large color preview box
- **Copy functionality**: Individual copy buttons for each format
- **Error validation**: Clear error messages for invalid inputs
- **Monospace display**: Easy-to-read format outputs

## Key Technical Notes

### Architecture
- Main page component: `pages/ColorConverterPage.tsx`
- Color utilities: `src/utils/colorConverter.ts`
- Public export: `index.ts`
- Route path: `/random-color` (maintained for backward compatibility)
- Sidebar menu integration: `src/constants/menuConfig.tsx`

### Color Conversion Logic
- **Parsing**: Regex-based parsing for all input formats
- **HEX**: Supports 3, 4, 6, and 8-digit formats with alpha channel
- **RGB ↔ HSL**: Mathematical conversion using standard algorithms
- **Alpha channel**: Preserved across all format conversions
- **Rounding**: RGB values rounded to integers, HSL to whole percentages

### Utilities API

```typescript
// Parse any color format to RGBA
parseColor(input: string): ParsedColor | null

// Convert to all formats
convertColor(input: string): ColorFormats | null

// Validate color input
isValidColor(input: string): boolean
```

### State Management
- Local React state for input, converted formats, error, and copied status
- Real-time validation on input change
- No server state needed (pure client-side transformation)

## Future Enhancements
- Color picker UI
- Color palette generation
- Gradient generator
- Color accessibility checker (WCAG contrast ratios)
- Named CSS colors support
- Color harmonies (complementary, triadic, etc.)
