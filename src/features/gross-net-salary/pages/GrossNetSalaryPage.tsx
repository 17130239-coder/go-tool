import { useMemo, useState } from 'react';
import { Button, InputNumber, Radio, Space, Typography } from 'antd';
import { ErrorAlert, FeatureCard, PageHeader, PageSectionTitle } from '../../../components/shared';
import {
  VIETNAM_2026_DEFAULT_REGION_I_MINIMUM_WAGE,
  VIETNAM_2026_FAMILY_DEDUCTION,
} from '../constants';
import { calculateGrossToNet, calculateNetToGross } from '../salaryCalculator';
import type { SalaryCalculationResult, SalaryConversionMode } from '../types';
import styles from '../GrossNetSalary.module.css';

const { Text } = Typography;

const vndFormatter = new Intl.NumberFormat('vi-VN');

const formatVnd = (value: number) => `${vndFormatter.format(Math.round(value))} VNĐ`;

interface BreakdownRow {
  label: string;
  value: number;
  isNegative?: boolean;
  isSummary?: boolean;
}

export function GrossNetSalaryPage() {
  const [mode, setMode] = useState<SalaryConversionMode>('gross-to-net');
  const [amount, setAmount] = useState<number>(20_000_000);
  const [dependentCount, setDependentCount] = useState<number>(0);
  const [regionalMinimumWage, setRegionalMinimumWage] = useState<number>(
    VIETNAM_2026_DEFAULT_REGION_I_MINIMUM_WAGE,
  );
  const [result, setResult] = useState<SalaryCalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const amountLabel = mode === 'gross-to-net' ? 'Lương Gross (VNĐ)' : 'Lương Net mục tiêu (VNĐ)';

  const breakdownRows = useMemo<BreakdownRow[]>(() => {
    if (!result) {
      return [];
    }

    return [
      { label: 'Lương Gross', value: result.grossSalary },
      {
        label: 'BHXH người lao động',
        value: result.employeeInsurance.socialInsurance,
        isNegative: true,
      },
      {
        label: 'BHYT người lao động',
        value: result.employeeInsurance.healthInsurance,
        isNegative: true,
      },
      {
        label: 'BHTN người lao động',
        value: result.employeeInsurance.unemploymentInsurance,
        isNegative: true,
      },
      {
        label: 'Giảm trừ bản thân',
        value: result.familyDeduction.selfDeduction,
        isNegative: true,
      },
      {
        label: `Giảm trừ người phụ thuộc (${result.familyDeduction.dependentCount})`,
        value: result.familyDeduction.dependentDeduction,
        isNegative: true,
      },
      { label: 'Thu nhập chịu thuế', value: result.taxableIncome },
      {
        label: 'Thuế TNCN',
        value: result.personalIncomeTax,
        isNegative: true,
      },
      {
        label: 'Lương Net',
        value: result.netSalary,
        isSummary: true,
      },
    ];
  }, [result]);

  const employerRows = useMemo<BreakdownRow[]>(() => {
    if (!result) {
      return [];
    }

    return [
      { label: 'Lương Gross', value: result.grossSalary },
      {
        label: 'BHXH NSDLĐ đóng',
        value: result.employerInsurance.socialInsurance,
      },
      {
        label: 'BH Tai nạn NSDLĐ đóng',
        value: result.employerInsurance.accidentInsurance,
      },
      {
        label: 'BHYT NSDLĐ đóng',
        value: result.employerInsurance.healthInsurance,
      },
      {
        label: 'BHTN NSDLĐ đóng',
        value: result.employerInsurance.unemploymentInsurance,
      },
      {
        label: 'Tổng chi phí doanh nghiệp',
        value: result.employerTotalCost,
        isSummary: true,
      },
    ];
  }, [result]);

  const handleConvert = () => {
    if (amount <= 0) {
      setError('Số tiền lương phải lớn hơn 0.');
      setResult(null);
      return;
    }

    if (regionalMinimumWage <= 0) {
      setError('Lương tối thiểu vùng phải lớn hơn 0.');
      setResult(null);
      return;
    }

    if (dependentCount < 0) {
      setError('Số người phụ thuộc không được âm.');
      setResult(null);
      return;
    }

    const payload = {
      amount,
      dependentCount,
      regionalMinimumWage,
    };

    const calculationResult =
      mode === 'gross-to-net' ? calculateGrossToNet(payload) : calculateNetToGross(payload);

    setResult(calculationResult);
    setError(null);
  };

  return (
    <FeatureCard>
      <PageHeader
        title="Gross ↔ Net Salary (VN 2026)"
        description="Tính lương theo chuẩn 2026: bảo hiểm, giảm trừ gia cảnh, thuế TNCN 5 bậc và chi phí doanh nghiệp."
      />

      <div>
        <PageSectionTitle>Thông tin đầu vào</PageSectionTitle>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Radio.Group
            value={mode}
            onChange={(event) => setMode(event.target.value)}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="gross-to-net">Gross → Net</Radio.Button>
            <Radio.Button value="net-to-gross">Net → Gross</Radio.Button>
          </Radio.Group>

          <div className={styles.formGrid}>
            <div>
              <Text type="secondary">{amountLabel}</Text>
              <div className="mt-8">
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={0}
                  value={amount}
                  onChange={(value) => setAmount(Math.max(0, value ?? 0))}
                />
              </div>
            </div>

            <div>
              <Text type="secondary">Số người phụ thuộc</Text>
              <div className="mt-8">
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={0}
                  value={dependentCount}
                  onChange={(value) => setDependentCount(Math.max(0, Math.floor(value ?? 0)))}
                />
              </div>
            </div>

            <div>
              <Text type="secondary">Lương tối thiểu vùng (dùng cho trần BHTN)</Text>
              <div className="mt-8">
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={0}
                  value={regionalMinimumWage}
                  onChange={(value) => setRegionalMinimumWage(Math.max(0, value ?? 0))}
                />
              </div>
            </div>
          </div>

          <div>
            <Button type="primary" onClick={handleConvert}>
              Chuyển đổi
            </Button>
          </div>

          <Text className={styles.hint}>
            Giảm trừ gia cảnh đang áp dụng: bản thân {formatVnd(VIETNAM_2026_FAMILY_DEDUCTION.self)},
            người phụ thuộc {formatVnd(VIETNAM_2026_FAMILY_DEDUCTION.dependent)}/người.
          </Text>
        </Space>
      </div>

      <ErrorAlert error={error} title="Lỗi dữ liệu đầu vào" />

      {result && (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <PageSectionTitle>Bảng Diễn giải chi tiết (VNĐ)</PageSectionTitle>
            <div className={styles.tableCard}>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Khoản mục</th>
                      <th>Giá trị</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdownRows.map((row) => (
                      <tr key={row.label} className={row.isSummary ? styles.summaryRow : undefined}>
                        <td>{row.label}</td>
                        <td className={row.isNegative ? styles.negative : styles.positive}>
                          {row.isNegative ? '-' : ''}
                          {formatVnd(row.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <PageSectionTitle>Bảng Chi tiết Thuế TNCN (*)</PageSectionTitle>
            <div className={styles.tableCard}>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Bậc thuế</th>
                      <th>Thuế suất</th>
                      <th>Lương chịu thuế ở bậc</th>
                      <th>Số tiền nộp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.taxBreakdown.map((detail) => (
                      <tr key={detail.bracket}>
                        <td>Bậc {detail.bracket}</td>
                        <td>{(detail.taxRate * 100).toFixed(0)}%</td>
                        <td>{formatVnd(detail.taxableIncomeInBracket)}</td>
                        <td className={styles.negative}>-{formatVnd(detail.taxInBracket)}</td>
                      </tr>
                    ))}
                    <tr className={styles.summaryRow}>
                      <td colSpan={3}>Tổng Thuế TNCN</td>
                      <td className={styles.negative}>-{formatVnd(result.personalIncomeTax)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <PageSectionTitle>Bảng Người sử dụng lao động trả (VNĐ)</PageSectionTitle>
            <div className={styles.tableCard}>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Khoản mục</th>
                      <th>Giá trị</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employerRows.map((row) => (
                      <tr key={row.label} className={row.isSummary ? styles.summaryRow : undefined}>
                        <td>{row.label}</td>
                        <td>{formatVnd(row.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {result.grossUpDetails && (
            <Text className={styles.hint}>
              Gross-up áp dụng theo phân đoạn bảo hiểm: {result.grossUpDetails.selectedInsuranceSegment}
              ; bậc thuế chọn: {result.grossUpDetails.selectedTaxBracket || 'Không phát sinh thuế'}.
              Sai số làm tròn Net: {formatVnd(result.grossUpDetails.netDifference)}.
            </Text>
          )}
        </Space>
      )}
    </FeatureCard>
  );
}

