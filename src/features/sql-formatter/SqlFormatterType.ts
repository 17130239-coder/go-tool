export type {
  KeywordCase,
  SqlLanguage,
  IndentSize,
  FormatterResult,
} from '../formatter/FormatterType';

export interface SqlAiPromptResult {
  success: boolean;
  prompt?: string;
  suggestions?: string[];
  error?: string;
}
