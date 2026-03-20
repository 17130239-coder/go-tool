export type {
  SqlFormatterOptions as FormatterOptions,
  FormatterResult,
  KeywordCase,
  SqlLanguage,
} from '../../types';

export interface SqlAiPromptResult {
  success: boolean;
  prompt?: string;
  suggestions?: string[];
  error?: string;
}
