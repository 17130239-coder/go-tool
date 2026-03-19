export type IndentSize = 2 | 4;
export type KeywordCase = 'upper' | 'lower' | 'preserve';
export type SqlLanguage = 'sql' | 'mysql' | 'postgresql' | 'tsql' | 'plsql';

export interface FormatterResult<T = string> {
  success: boolean;
  formatted?: T;
  error?: string;
}

export interface SqlFormatterOptions {
  language: SqlLanguage;
  indent: IndentSize;
  keywordCase: KeywordCase;
  linesBetweenQueries: number;
}

export interface JsonFormatterOptions {
  indentSize: IndentSize;
}
