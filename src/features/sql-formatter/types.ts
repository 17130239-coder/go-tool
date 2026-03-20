export type {
  SqlFormatterOptions as FormatterOptions,
  FormatterResult,
  KeywordCase,
  SqlLanguage,
  IndentSize,
} from '../formatter/types';

export interface SqlAiPromptResult {
  success: boolean;
  prompt?: string;
  suggestions?: string[];
  error?: string;
}
