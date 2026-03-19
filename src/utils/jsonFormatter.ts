import type { JsonFormatterOptions, FormatterResult } from '../types';

/**
 * Validates and formats JSON with specified indentation
 */
export function formatJSON(input: string, options: JsonFormatterOptions): FormatterResult {
  if (!input.trim()) {
    return {
      success: false,
      error: 'Input is empty',
    };
  }

  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, options.indentSize);
    
    return {
      success: true,
      formatted,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Minifies JSON by removing all whitespace
 */
export function minifyJSON(input: string): FormatterResult {
  if (!input.trim()) {
    return {
      success: false,
      error: 'Input is empty',
    };
  }

  try {
    const parsed = JSON.parse(input);
    const minified = JSON.stringify(parsed);
    
    return {
      success: true,
      formatted: minified,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Validates JSON without formatting
 */
export function validateJSON(input: string): FormatterResult {
  if (!input.trim()) {
    return {
      success: true,
    };
  }

  try {
    JSON.parse(input);
    return {
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}
