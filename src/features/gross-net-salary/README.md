# Gross ↔ Net Salary Feature (Vietnam 2026)

## Purpose

This feature converts **Gross ↔ Net** salary using Vietnam payroll assumptions effective from **01/01/2026**. It computes employee insurance, family deductions, progressive PIT, and employer total cost with fully traceable intermediate values.

## User flow

1. Open **Gross ↔ Net Salary** from the sidebar.
2. Select conversion mode:
   - `Gross → Net`
   - `Net → Gross`
3. Enter:
   - salary amount
   - dependent count
   - regional minimum wage (for unemployment insurance cap)
4. Click **Chuyển đổi**.
5. Review three output tables:
   - detailed salary breakdown
   - PIT by bracket
   - employer payment breakdown

## Key technical notes

- Main page: `pages/GrossNetSalaryPage.tsx`
- Feature public API: `index.ts`
- Core calculator: `salaryCalculator.ts`
- Constants source: `constants.ts`
- Types: `types.ts`

### UI implementation (Ant Design-first)

The page now prioritizes Ant Design components over custom markup:

- Input area: `Form`, `InputNumber`, `Radio.Group`, `Button`, `Alert`, `Card`
- Result rendering: three AntD `Table` components with typed column definitions
- PIT total row: AntD `Table.Summary`
- Gross-up diagnostics: AntD `Alert`
- Status indicators: `Typography.Text` (`success` / `danger`) and `Tag`

Only minimal CSS module styling remains for table summary-row background and small typography adjustments.

### 2026 constants implemented

- Base salary: `2,340,000`
- Family deduction:
  - self: `15,500,000`
  - dependent: `6,200,000` per person
- Employee insurance:
  - BHXH: `8%`
  - BHYT: `1.5%`
  - BHTN: `1%`
- Employer insurance:
  - BHXH: `17%`
  - Accident insurance: `0.5%`
  - BHYT: `3%`
  - BHTN: `1%`
- Insurance caps:
  - BHXH/BHYT base cap: `20 × base salary`
  - BHTN base cap: `20 × regional minimum wage`

### PIT brackets (2026, 5 levels)

1. Up to `10,000,000`: `5%`
2. `>10,000,000` to `30,000,000`: `10%`
3. `>30,000,000` to `60,000,000`: `20%`
4. `>60,000,000` to `100,000,000`: `30%`
5. `>100,000,000`: `35%`

### Calculation model

- **Gross → Net**
  1. Calculate employee insurance by capped base
  2. Subtract family deduction
  3. Compute taxable income
  4. Apply progressive PIT by 5 brackets
  5. Derive net salary

- **Net → Gross**
  - Uses formula-based **gross-up** (segment by insurance caps + tax bracket assumptions)
  - Solves gross analytically per segment/bracket candidate
  - Verifies candidate by recomputing net and picking minimal rounding difference
  - Does not use simple while-loop search

### Returned data richness

The calculator returns a rich object including:

- insurance caps
- employee insurance breakdown (BHXH/BHYT/BHTN)
- employer insurance breakdown
- family deduction breakdown
- taxable income before/after family deduction
- PIT total and per-bracket details
- employer total payout
- gross-up diagnostics for Net → Gross
