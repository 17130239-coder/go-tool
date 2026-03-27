import type { TaxBracketDefinition } from './GrossNetSalaryType';

export const VIETNAM_2026_BASE_SALARY = 2_340_000;

export const VIETNAM_2026_FAMILY_DEDUCTION = {
  self: 15_500_000,
  dependent: 6_200_000,
} as const;

export const VIETNAM_2026_EMPLOYEE_INSURANCE_RATES = {
  socialInsurance: 0.08,
  healthInsurance: 0.015,
  unemploymentInsurance: 0.01,
} as const;

export const VIETNAM_2026_EMPLOYER_INSURANCE_RATES = {
  socialInsurance: 0.17,
  accidentInsurance: 0.005,
  healthInsurance: 0.03,
  unemploymentInsurance: 0.01,
} as const;

export const VIETNAM_2026_SOCIAL_HEALTH_INSURANCE_CAP_MULTIPLIER = 20;
export const VIETNAM_2026_UNEMPLOYMENT_INSURANCE_CAP_MULTIPLIER = 20;

export const VIETNAM_2026_DEFAULT_REGION_I_MINIMUM_WAGE = 4_960_000;

export const VIETNAM_2026_TAX_BRACKETS: TaxBracketDefinition[] = [
  {
    bracket: 1,
    lowerBound: 0,
    upperBound: 10_000_000,
    taxRate: 0.05,
    quickDeduction: 0,
  },
  {
    bracket: 2,
    lowerBound: 10_000_000,
    upperBound: 30_000_000,
    taxRate: 0.1,
    quickDeduction: 500_000,
  },
  {
    bracket: 3,
    lowerBound: 30_000_000,
    upperBound: 60_000_000,
    taxRate: 0.2,
    quickDeduction: 3_500_000,
  },
  {
    bracket: 4,
    lowerBound: 60_000_000,
    upperBound: 100_000_000,
    taxRate: 0.3,
    quickDeduction: 9_500_000,
  },
  {
    bracket: 5,
    lowerBound: 100_000_000,
    upperBound: null,
    taxRate: 0.35,
    quickDeduction: 14_500_000,
  },
];

