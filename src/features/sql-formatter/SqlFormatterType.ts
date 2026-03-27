export type {
  SqlFormatterOptions as FormatterOptions,
  FormatterResult,
  KeywordCase,
  SqlLanguage,
  IndentSize,
} from '../formatter/FormatterType';

export interface SqlAiPromptResult {
  success: boolean;
  prompt?: string;
  suggestions?: string[];
  error?: string;
}
