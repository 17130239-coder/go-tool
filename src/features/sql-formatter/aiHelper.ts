import type { SqlAiPromptResult } from './types';

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

