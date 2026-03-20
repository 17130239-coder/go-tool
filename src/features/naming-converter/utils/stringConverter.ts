/**
 * Removes Vietnamese diacritics and accents
 * e.g., 'tôi là một chu cá' -> 'toi la mot chu ca'
 */
export function removeDiacritics(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD') // Decompose into base chars + combining accents
    .replace(/[\u0300-\u036f]/g, '') // Remove all combining accents
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

/**
 * Splits a mixed-format string into individual lowercased words
 * e.g., 'hereYou-are_now ' -> ['here', 'you', 'are', 'now']
 */
export function parseToWords(str: string): string[] {
  if (!str) return [];

  const cleanStr = removeDiacritics(str);

  // Match:
  // 1. Sequences of UPPERCASE letters (followed by an upper/lower or end of string)
  // 2. A capital letter followed by lowercase (PascalCase / camelCase boundary)
  // 3. Sequences of lowercase/digits
  const matches = cleanStr.match(/[A-Z][a-z0-9]+|[A-Z]+(?=[A-Z][a-z0-9]|\b)|[a-z0-9]+/g);

  return matches ? matches.map((w) => w.toLowerCase()) : [];
}

export function toCamelCase(words: string[]): string {
  if (words.length === 0) return '';
  return words[0] + words.slice(1).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

export function toPascalCase(words: string[]): string {
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

export function toSnakeCase(words: string[]): string {
  return words.join('_');
}

export function toKebabCase(words: string[]): string {
  return words.join('-');
}

export function toConstantCase(words: string[]): string {
  return words.join('_').toUpperCase();
}

/**
 * Converts a string into all available conventions
 */
export function convertAll(input: string) {
  const words = parseToWords(input);
  return {
    camelCase: toCamelCase(words),
    pascalCase: toPascalCase(words),
    snakeCase: toSnakeCase(words),
    kebabCase: toKebabCase(words),
    constantCase: toConstantCase(words),
  };
}
