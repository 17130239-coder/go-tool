export type IndentSize = 2 | 4;

export interface FormatterOptions {
  indentSize: IndentSize;
}

export interface FormatterResult {
  success: boolean;
  formatted?: string;
  error?: string;
}
