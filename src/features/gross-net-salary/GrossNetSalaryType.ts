export type SalaryConversionMode = 'gross-to-net' | 'net-to-gross';

export type TaxBracketId = 1 | 2 | 3 | 4 | 5;

export interface SalaryCalculatorInput {
  amount: number;
  dependentCount: number;
  regionalMinimumWage: number;
}

export interface InsuranceCaps {
  socialHealthInsuranceCap: number;
  unemploymentInsuranceCap: number;
}

export interface EmployeeInsuranceBreakdown {
  baseForSocialAndHealth: number;
  baseForUnemployment: number;
  socialInsurance: number;
  healthInsurance: number;
  unemploymentInsurance: number;
  total: number;
}

export interface EmployerInsuranceBreakdown {
  baseForSocialHealthAndAccident: number;
  baseForUnemployment: number;
  socialInsurance: number;
  accidentInsurance: number;
  healthInsurance: number;
  unemploymentInsurance: number;
  total: number;
}

export interface FamilyDeductionBreakdown {
  dependentCount: number;
  selfDeduction: number;
  dependentDeduction: number;
  totalDeduction: number;
}

export interface TaxBracketDefinition {
  bracket: TaxBracketId;
  lowerBound: number;
  upperBound: number | null;
  taxRate: number;
  quickDeduction: number;
}

export interface TaxBracketDetail {
  bracket: TaxBracketId;
  taxRate: number;
  lowerBound: number;
  upperBound: number | null;
  taxableIncomeInBracket: number;
  taxInBracket: number;
}

export interface GrossUpDetails {
  targetNetSalary: number;
  selectedTaxBracket: TaxBracketId | 0;
  selectedTaxRate: number;
  selectedQuickDeduction: number;
  selectedInsuranceSegment: string;
  netDifference: number;
}

export interface SalaryCalculationResult {
  mode: SalaryConversionMode;
  inputAmount: number;
  grossSalary: number;
  netSalary: number;
  insuranceCaps: InsuranceCaps;
  employeeInsurance: EmployeeInsuranceBreakdown;
  employerInsurance: EmployerInsuranceBreakdown;
  familyDeduction: FamilyDeductionBreakdown;
  taxableIncomeBeforeFamilyDeduction: number;
  taxableIncome: number;
  personalIncomeTax: number;
  taxBreakdown: TaxBracketDetail[];
  employerTotalCost: number;
  grossUpDetails?: GrossUpDetails;
}

