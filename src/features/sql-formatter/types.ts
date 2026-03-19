export type IndentStyle = 'standard' | 'tabularLeft' | 'tabularRight';
export type KeywordCase = 'upper' | 'lower' | 'preserve';

export interface FormatterOptions {
  language: 'sql' | 'mysql' | 'postgresql' | 'tsql' | 'plsql';
  indent: number;
  keywordCase: KeywordCase;
  linesBetweenQueries: number;
}

export interface FormatterResult {
  success: boolean;
  formatted?: string;
  error?: string;
}
