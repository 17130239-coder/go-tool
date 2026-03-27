import {
  VIETNAM_2026_BASE_SALARY,
  VIETNAM_2026_DEFAULT_REGION_I_MINIMUM_WAGE,
  VIETNAM_2026_EMPLOYEE_INSURANCE_RATES,
  VIETNAM_2026_EMPLOYER_INSURANCE_RATES,
  VIETNAM_2026_FAMILY_DEDUCTION,
  VIETNAM_2026_SOCIAL_HEALTH_INSURANCE_CAP_MULTIPLIER,
  VIETNAM_2026_TAX_BRACKETS,
  VIETNAM_2026_UNEMPLOYMENT_INSURANCE_CAP_MULTIPLIER,
} from './GrossNetSalaryConstant';

import type {
  EmployeeInsuranceBreakdown,
  EmployerInsuranceBreakdown,
  FamilyDeductionBreakdown,
  GrossUpDetails,
  InsuranceCaps,
  SalaryCalculationResult,
  SalaryCalculatorInput,
  TaxBracketDefinition,
  TaxBracketDetail,
} from './GrossNetSalaryType';

interface InsuranceLinearSegment {
  key: string;
  lowerInclusive: number;
  upperInclusive: number;
  slope: number;
  intercept: number;
}

interface GrossFormulaCandidate {
  gross: number;
  taxBracket: TaxBracketDefinition | null;
  insuranceSegment: InsuranceLinearSegment;
  netDifference: number;
}

interface GrossComputationSnapshot {
  employeeInsurance: EmployeeInsuranceBreakdown;
  taxableIncomeBeforeFamilyDeduction: number;
  taxableIncome: number;
  personalIncomeTax: number;
  taxBreakdown: TaxBracketDetail[];
  netSalary: number;
}

const roundVnd = (value: number) => Math.round(value);

const normalizeInput = (input: SalaryCalculatorInput): SalaryCalculatorInput => ({
  amount: Math.max(0, roundVnd(input.amount)),
  dependentCount: Math.max(0, Math.floor(input.dependentCount)),
  regionalMinimumWage: Math.max(
    0,
    roundVnd(input.regionalMinimumWage || VIETNAM_2026_DEFAULT_REGION_I_MINIMUM_WAGE),
  ),
});

const calculateInsuranceCaps = (regionalMinimumWage: number): InsuranceCaps => ({
  socialHealthInsuranceCap:
    VIETNAM_2026_BASE_SALARY * VIETNAM_2026_SOCIAL_HEALTH_INSURANCE_CAP_MULTIPLIER,
  unemploymentInsuranceCap:
    regionalMinimumWage * VIETNAM_2026_UNEMPLOYMENT_INSURANCE_CAP_MULTIPLIER,
});

const calculateFamilyDeduction = (dependentCount: number): FamilyDeductionBreakdown => {
  const selfDeduction = VIETNAM_2026_FAMILY_DEDUCTION.self;
  const dependentDeduction = VIETNAM_2026_FAMILY_DEDUCTION.dependent * dependentCount;

  return {
    dependentCount,
    selfDeduction,
    dependentDeduction,
    totalDeduction: selfDeduction + dependentDeduction,
  };
};

const calculateEmployeeInsuranceFromGross = (
  grossSalary: number,
  caps: InsuranceCaps,
): EmployeeInsuranceBreakdown => {
  const baseForSocialAndHealth = Math.min(grossSalary, caps.socialHealthInsuranceCap);
  const baseForUnemployment = Math.min(grossSalary, caps.unemploymentInsuranceCap);

  const socialInsurance = roundVnd(
    baseForSocialAndHealth * VIETNAM_2026_EMPLOYEE_INSURANCE_RATES.socialInsurance,
  );
  const healthInsurance = roundVnd(
    baseForSocialAndHealth * VIETNAM_2026_EMPLOYEE_INSURANCE_RATES.healthInsurance,
  );
  const unemploymentInsurance = roundVnd(
    baseForUnemployment * VIETNAM_2026_EMPLOYEE_INSURANCE_RATES.unemploymentInsurance,
  );

  return {
    baseForSocialAndHealth,
    baseForUnemployment,
    socialInsurance,
    healthInsurance,
    unemploymentInsurance,
    total: socialInsurance + healthInsurance + unemploymentInsurance,
  };
};

const calculateEmployerInsuranceFromGross = (
  grossSalary: number,
  caps: InsuranceCaps,
): EmployerInsuranceBreakdown => {
  const baseForSocialHealthAndAccident = Math.min(grossSalary, caps.socialHealthInsuranceCap);
  const baseForUnemployment = Math.min(grossSalary, caps.unemploymentInsuranceCap);

  const socialInsurance = roundVnd(
    baseForSocialHealthAndAccident * VIETNAM_2026_EMPLOYER_INSURANCE_RATES.socialInsurance,
  );
  const accidentInsurance = roundVnd(
    baseForSocialHealthAndAccident * VIETNAM_2026_EMPLOYER_INSURANCE_RATES.accidentInsurance,
  );
  const healthInsurance = roundVnd(
    baseForSocialHealthAndAccident * VIETNAM_2026_EMPLOYER_INSURANCE_RATES.healthInsurance,
  );
  const unemploymentInsurance = roundVnd(
    baseForUnemployment * VIETNAM_2026_EMPLOYER_INSURANCE_RATES.unemploymentInsurance,
  );

  return {
    baseForSocialHealthAndAccident,
    baseForUnemployment,
    socialInsurance,
    accidentInsurance,
    healthInsurance,
    unemploymentInsurance,
    total: socialInsurance + accidentInsurance + healthInsurance + unemploymentInsurance,
  };
};

const calculateProgressiveTax = (
  taxableIncome: number,
): { totalTax: number; bracketDetails: TaxBracketDetail[] } => {
  const income = Math.max(0, taxableIncome);
  const bracketDetails: TaxBracketDetail[] = VIETNAM_2026_TAX_BRACKETS.map((bracket) => {
    const upperBound = bracket.upperBound ?? Number.POSITIVE_INFINITY;
    const taxableIncomeInBracket = Math.max(0, Math.min(income, upperBound) - bracket.lowerBound);

    return {
      bracket: bracket.bracket,
      taxRate: bracket.taxRate,
      lowerBound: bracket.lowerBound,
      upperBound: bracket.upperBound,
      taxableIncomeInBracket,
      taxInBracket: roundVnd(taxableIncomeInBracket * bracket.taxRate),
    };
  });

  return {
    totalTax: bracketDetails.reduce((sum, detail) => sum + detail.taxInBracket, 0),
    bracketDetails,
  };
};

const computeSnapshotFromGross = (
  grossSalary: number,
  familyDeductionTotal: number,
  caps: InsuranceCaps,
): GrossComputationSnapshot => {
  const employeeInsurance = calculateEmployeeInsuranceFromGross(grossSalary, caps);
  const taxableIncomeBeforeFamilyDeduction = Math.max(0, grossSalary - employeeInsurance.total);
  const taxableIncome = Math.max(0, taxableIncomeBeforeFamilyDeduction - familyDeductionTotal);
  const progressiveTax = calculateProgressiveTax(taxableIncome);
  const netSalary = grossSalary - employeeInsurance.total - progressiveTax.totalTax;

  return {
    employeeInsurance,
    taxableIncomeBeforeFamilyDeduction,
    taxableIncome,
    personalIncomeTax: progressiveTax.totalTax,
    taxBreakdown: progressiveTax.bracketDetails,
    netSalary,
  };
};

const getInsuranceLinearSegments = (caps: InsuranceCaps): InsuranceLinearSegment[] => {
  const socialHealthCap = caps.socialHealthInsuranceCap;
  const unemploymentCap = caps.unemploymentInsuranceCap;
  const socialHealthRate =
    VIETNAM_2026_EMPLOYEE_INSURANCE_RATES.socialInsurance +
    VIETNAM_2026_EMPLOYEE_INSURANCE_RATES.healthInsurance;
  const unemploymentRate = VIETNAM_2026_EMPLOYEE_INSURANCE_RATES.unemploymentInsurance;
  const fullRate = socialHealthRate + unemploymentRate;

  if (socialHealthCap <= unemploymentCap) {
    return [
      {
        key: 'below-all-caps',
        lowerInclusive: 0,
        upperInclusive: socialHealthCap,
        slope: fullRate,
        intercept: 0,
      },
      {
        key: 'social-health-cap-reached',
        lowerInclusive: socialHealthCap,
        upperInclusive: unemploymentCap,
        slope: unemploymentRate,
        intercept: socialHealthCap * socialHealthRate,
      },
      {
        key: 'all-caps-reached',
        lowerInclusive: unemploymentCap,
        upperInclusive: Number.POSITIVE_INFINITY,
        slope: 0,
        intercept: socialHealthCap * socialHealthRate + unemploymentCap * unemploymentRate,
      },
    ];
  }

  return [
    {
      key: 'below-all-caps',
      lowerInclusive: 0,
      upperInclusive: unemploymentCap,
      slope: fullRate,
      intercept: 0,
    },
    {
      key: 'unemployment-cap-reached',
      lowerInclusive: unemploymentCap,
      upperInclusive: socialHealthCap,
      slope: socialHealthRate,
      intercept: unemploymentCap * unemploymentRate,
    },
    {
      key: 'all-caps-reached',
      lowerInclusive: socialHealthCap,
      upperInclusive: Number.POSITIVE_INFINITY,
      slope: 0,
      intercept: socialHealthCap * socialHealthRate + unemploymentCap * unemploymentRate,
    },
  ];
};

const findTaxBracketByTaxableIncome = (taxableIncome: number): TaxBracketDefinition | null => {
  if (taxableIncome <= 0) {
    return null;
  }

  for (const bracket of VIETNAM_2026_TAX_BRACKETS) {
    const upperBound = bracket.upperBound ?? Number.POSITIVE_INFINITY;
    if (taxableIncome > bracket.lowerBound && taxableIncome <= upperBound) {
      return bracket;
    }
  }

  return null;
};

const buildRoundedGrossCandidates = (rawGross: number): number[] => {
  const floor = Math.floor(rawGross);
  const ceil = Math.ceil(rawGross);
  const rounded = roundVnd(rawGross);

  return Array.from(
    new Set([floor, ceil, rounded - 1, rounded, rounded + 1].filter((value) => value >= 0)),
  );
};

const estimateGrossFromNetByGrossUp = (
  targetNetSalary: number,
  familyDeductionTotal: number,
  caps: InsuranceCaps,
): GrossFormulaCandidate | null => {
  const candidates: GrossFormulaCandidate[] = [];
  const insuranceSegments = getInsuranceLinearSegments(caps);

  const evaluateCandidate = (
    grossCandidate: number,
    insuranceSegment: InsuranceLinearSegment,
    assumedBracket: TaxBracketDefinition | null,
  ) => {
    if (
      grossCandidate < insuranceSegment.lowerInclusive ||
      grossCandidate > insuranceSegment.upperInclusive
    ) {
      return;
    }

    const snapshot = computeSnapshotFromGross(grossCandidate, familyDeductionTotal, caps);

    if (assumedBracket === null) {
      if (snapshot.taxableIncome > 0) {
        return;
      }
    } else {
      const upperBound = assumedBracket.upperBound ?? Number.POSITIVE_INFINITY;
      const isInsideAssumedBracket =
        snapshot.taxableIncome > assumedBracket.lowerBound && snapshot.taxableIncome <= upperBound;
      if (!isInsideAssumedBracket) {
        return;
      }
    }

    candidates.push({
      gross: grossCandidate,
      taxBracket: assumedBracket,
      insuranceSegment,
      netDifference: Math.abs(snapshot.netSalary - targetNetSalary),
    });
  };

  for (const insuranceSegment of insuranceSegments) {
    const denominatorWithoutTax = 1 - insuranceSegment.slope;
    if (denominatorWithoutTax > 0) {
      const grossRawWithoutTax = (targetNetSalary + insuranceSegment.intercept) / denominatorWithoutTax;
      for (const grossCandidate of buildRoundedGrossCandidates(grossRawWithoutTax)) {
        evaluateCandidate(grossCandidate, insuranceSegment, null);
      }
    }

    for (const taxBracket of VIETNAM_2026_TAX_BRACKETS) {
      const denominator = (1 - insuranceSegment.slope) * (1 - taxBracket.taxRate);
      if (denominator <= 0) {
        continue;
      }

      const constantComponent =
        -(1 - taxBracket.taxRate) * insuranceSegment.intercept +
        taxBracket.taxRate * familyDeductionTotal +
        taxBracket.quickDeduction;
      const grossRaw = (targetNetSalary - constantComponent) / denominator;

      for (const grossCandidate of buildRoundedGrossCandidates(grossRaw)) {
        evaluateCandidate(grossCandidate, insuranceSegment, taxBracket);
      }
    }
  }

  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((a, b) => {
    if (a.netDifference !== b.netDifference) {
      return a.netDifference - b.netDifference;
    }
    return a.gross - b.gross;
  });

  return candidates[0];
};

const buildResultFromGross = (
  mode: SalaryCalculationResult['mode'],
  rawInput: SalaryCalculatorInput,
  grossSalary: number,
  grossUpDetails?: GrossUpDetails,
): SalaryCalculationResult => {
  const caps = calculateInsuranceCaps(rawInput.regionalMinimumWage);
  const familyDeduction = calculateFamilyDeduction(rawInput.dependentCount);
  const snapshot = computeSnapshotFromGross(grossSalary, familyDeduction.totalDeduction, caps);
  const employerInsurance = calculateEmployerInsuranceFromGross(grossSalary, caps);

  return {
    mode,
    inputAmount: rawInput.amount,
    grossSalary,
    netSalary: snapshot.netSalary,
    insuranceCaps: caps,
    employeeInsurance: snapshot.employeeInsurance,
    employerInsurance,
    familyDeduction,
    taxableIncomeBeforeFamilyDeduction: snapshot.taxableIncomeBeforeFamilyDeduction,
    taxableIncome: snapshot.taxableIncome,
    personalIncomeTax: snapshot.personalIncomeTax,
    taxBreakdown: snapshot.taxBreakdown,
    employerTotalCost: grossSalary + employerInsurance.total,
    grossUpDetails,
  };
};

export const calculateGrossToNet = (input: SalaryCalculatorInput): SalaryCalculationResult => {
  const normalizedInput = normalizeInput(input);
  return buildResultFromGross('gross-to-net', normalizedInput, normalizedInput.amount);
};

export const calculateNetToGross = (input: SalaryCalculatorInput): SalaryCalculationResult => {
  const normalizedInput = normalizeInput(input);
  const caps = calculateInsuranceCaps(normalizedInput.regionalMinimumWage);
  const familyDeduction = calculateFamilyDeduction(normalizedInput.dependentCount);
  const grossEstimate = estimateGrossFromNetByGrossUp(
    normalizedInput.amount,
    familyDeduction.totalDeduction,
    caps,
  );

  const grossSalary = grossEstimate?.gross ?? normalizedInput.amount;
  const result = buildResultFromGross('net-to-gross', normalizedInput, grossSalary);
  const resolvedBracket = grossEstimate?.taxBracket ?? findTaxBracketByTaxableIncome(result.taxableIncome);
  const resolvedSegment =
    grossEstimate?.insuranceSegment.key ??
    getInsuranceLinearSegments(caps).find(
      (segment) => grossSalary >= segment.lowerInclusive && grossSalary <= segment.upperInclusive,
    )?.key ??
    'unknown';

  result.grossUpDetails = {
    targetNetSalary: normalizedInput.amount,
    selectedTaxBracket: resolvedBracket?.bracket ?? 0,
    selectedTaxRate: resolvedBracket?.taxRate ?? 0,
    selectedQuickDeduction: resolvedBracket?.quickDeduction ?? 0,
    selectedInsuranceSegment: resolvedSegment,
    netDifference: Math.abs(result.netSalary - normalizedInput.amount),
  };

  return result;
};

