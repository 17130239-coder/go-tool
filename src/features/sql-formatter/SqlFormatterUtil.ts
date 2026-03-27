import { format } from 'sql-formatter';
import type { SqlFormatterOptions, FormatterResult } from '../formatter/FormatterType';
import type { SqlAiPromptResult } from './SqlFormatterType';


/**
 * Format SQL with specified options
 */
export function formatSQL(input: string, options: SqlFormatterOptions): FormatterResult {
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

const normalizeSqlInput = (input: string) =>
  input
    .replace(/\s+/g, ' ')
    .replace(/\s+,/g, ',')
    .trim();

const detectSqlPatterns = (input: string): string[] => {
  const loweredInput = input.toLowerCase();
  const patterns: string[] = [];

  if (/\bselect\s+\*/.test(loweredInput)) {
    patterns.push('Avoid `SELECT *`; prefer explicit columns for stability and performance.');
  }

  if (/\bwhere\b/.test(loweredInput) && !/\blimit\b/.test(loweredInput)) {
    patterns.push('Consider adding LIMIT/TOP when querying large tables in interactive workflows.');
  }

  if (/\border\s+by\b/.test(loweredInput) && !/\blimit\b/.test(loweredInput)) {
    patterns.push('If only top rows are needed, combine ORDER BY with LIMIT for efficiency.');
  }

  if (!/\bwhere\b/.test(loweredInput) && /\bupdate\b|\bdelete\b/.test(loweredInput)) {
    patterns.push('UPDATE/DELETE without WHERE can affect all rows; verify intended scope.');
  }

  if (/\bjoin\b/.test(loweredInput) && !/\bon\b/.test(loweredInput)) {
    patterns.push('Detected JOIN without explicit ON clause; verify join condition.');
  }

  if (!/\bgroup\s+by\b/.test(loweredInput) && /\bcount\s*\(/.test(loweredInput)) {
    patterns.push('For aggregate reports, confirm whether GROUP BY is required.');
  }

  return patterns;
};

export const buildSqlAiPrompt = (input: string): SqlAiPromptResult => {
  const normalizedInput = normalizeSqlInput(input);
  if (!normalizedInput) {
    return {
      success: false,
      error: 'Input SQL is empty.',
    };
  }

  const suggestions = detectSqlPatterns(normalizedInput);

  const prompt = [
    'You are a senior SQL reviewer.',
    'Please improve the SQL query below.',
    'Return 3 sections in this exact order:',
    '1) Improved SQL',
    '2) Explanation of changes (bullet list)',
    '3) Optional index suggestions',
    '',
    'Requirements:',
    '- Preserve original business logic unless explicitly unsafe.',
    '- Keep dialect compatibility where possible.',
    '- Prioritize readability, maintainability, and performance.',
    '',
    'SQL input:',
    normalizedInput,
  ].join('\n');

  return {
    success: true,
    prompt,
    suggestions,
  };
};

