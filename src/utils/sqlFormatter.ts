import { format } from 'sql-formatter';
import type { FormatterOptions, FormatterResult } from '../features/sql-formatter/types';

/**
 * Format SQL with specified options
 */
export function formatSQL(input: string, options: FormatterOptions): FormatterResult {
  if (!input.trim()) {
    return {
      success: false,
      error: 'Input is empty',
    };
  }

  try {
    const formatted = format(input, {
      language: options.language,
      tabWidth: options.indent,
      keywordCase: options.keywordCase,
      linesBetweenQueries: options.linesBetweenQueries,
    });

    return {
      success: true,
      formatted,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid SQL syntax';

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Minify SQL by removing extra whitespace
 */
export function minifySQL(input: string): FormatterResult {
  if (!input.trim()) {
    return {
      success: false,
      error: 'Input is empty',
    };
  }

  try {
    // Simple minification: remove extra whitespace and newlines
    const minified = input
      .replace(/\s+/g, ' ')
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      .replace(/,\s+/g, ',')
      .trim();

    return {
      success: true,
      formatted: minified,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error minifying SQL';

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Validate SQL syntax
 */
export function validateSQL(input: string): FormatterResult {
  if (!input.trim()) {
    return {
      success: true,
    };
  }

  try {
    // Try to format with sql-formatter as a validation check
    format(input, { language: 'sql' });
    return {
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid SQL syntax';

    return {
      success: false,
      error: errorMessage,
    };
  }
}
