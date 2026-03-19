export type ConventionType =
  | 'camelCase'
  | 'kebabCase'
  | 'snakeCase'
  | 'pascalCase'
  | 'constantCase';

export interface ConvertResult {
  type: ConventionType;
  value: string;
}
