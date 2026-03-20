import { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Radio,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
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

interface FormValues {
  amount: number;
  dependentCount: number;
  regionalMinimumWage: number;
}

interface BreakdownRow {
  key: string;
  label: string;
  value: number;
  isNegative?: boolean;
  isSummary?: boolean;
}

interface TaxRow {
  key: string;
  bracket: string;
  rate: string;
  taxableAmount: number;
  taxAmount: number;
}

const breakdownColumns: ColumnsType<BreakdownRow> = [
  {
    title: 'Khoản mục',
    dataIndex: 'label',
    key: 'label',
  },
  {
    title: 'Giá trị',
    dataIndex: 'value',
    key: 'value',
    align: 'right',
    render: (value: number, record) => (
      <Text
        strong={record.isSummary}
        type={record.isNegative ? 'danger' : 'success'}
        className={record.isSummary ? styles.summaryText : undefined}
      >
        {record.isNegative ? '-' : ''}
        {formatVnd(value)}
      </Text>
    ),
  },
];

const employerColumns: ColumnsType<BreakdownRow> = [
  {
    title: 'Khoản mục',
    dataIndex: 'label',
    key: 'label',
  },
  {
    title: 'Giá trị',
    dataIndex: 'value',
    key: 'value',
    align: 'right',
    render: (value: number, record) => (
      <Text strong={record.isSummary} className={record.isSummary ? styles.summaryText : undefined}>
        {formatVnd(value)}
      </Text>
    ),
  },
];

const taxColumns: ColumnsType<TaxRow> = [
  {
    title: 'Bậc thuế',
    dataIndex: 'bracket',
    key: 'bracket',
  },
  {
    title: 'Thuế suất',
    dataIndex: 'rate',
    key: 'rate',
    align: 'center',
    render: (value: string) => <Tag color="blue">{value}</Tag>,
  },
  {
    title: 'Lương chịu thuế ở bậc',
    dataIndex: 'taxableAmount',
    key: 'taxableAmount',
    align: 'right',
    render: (value: number) => formatVnd(value),
  },
  {
    title: 'Số tiền nộp',
    dataIndex: 'taxAmount',
    key: 'taxAmount',
    align: 'right',
    render: (value: number) => <Text type="danger">-{formatVnd(value)}</Text>,
  },
];

export function GrossNetSalaryPage() {
  const [mode, setMode] = useState<SalaryConversionMode>('gross-to-net');
  const [result, setResult] = useState<SalaryCalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm<FormValues>();

  const amountLabel = mode === 'gross-to-net' ? 'Lương Gross (VNĐ)' : 'Lương Net mục tiêu (VNĐ)';

  const breakdownRows = useMemo<BreakdownRow[]>(() => {
    if (!result) return [];

    return [
      { key: 'gross', label: 'Lương Gross', value: result.grossSalary },
      {
        key: 'si-emp',
        label: 'BHXH người lao động',
        value: result.employeeInsurance.socialInsurance,
        isNegative: true,
      },
      {
        key: 'hi-emp',
        label: 'BHYT người lao động',
        value: result.employeeInsurance.healthInsurance,
        isNegative: true,
      },
      {
        key: 'ui-emp',
        label: 'BHTN người lao động',
        value: result.employeeInsurance.unemploymentInsurance,
        isNegative: true,
      },
      {
        key: 'self-deduction',
        label: 'Giảm trừ bản thân',
        value: result.familyDeduction.selfDeduction,
        isNegative: true,
      },
      {
        key: 'dependent-deduction',
        label: `Giảm trừ người phụ thuộc (${result.familyDeduction.dependentCount})`,
        value: result.familyDeduction.dependentDeduction,
        isNegative: true,
      },
      { key: 'taxable-income', label: 'Thu nhập chịu thuế', value: result.taxableIncome },
      {
        key: 'pit',
        label: 'Thuế TNCN',
        value: result.personalIncomeTax,
        isNegative: true,
      },
      {
        key: 'net',
        label: 'Lương Net',
        value: result.netSalary,
        isSummary: true,
      },
    ];
  }, [result]);

  const employerRows = useMemo<BreakdownRow[]>(() => {
    if (!result) return [];

    return [
      { key: 'gross', label: 'Lương Gross', value: result.grossSalary },
      {
        key: 'si-company',
        label: 'BHXH NSDLĐ đóng',
        value: result.employerInsurance.socialInsurance,
      },
      {
        key: 'acc-company',
        label: 'BH Tai nạn NSDLĐ đóng',
        value: result.employerInsurance.accidentInsurance,
      },
      {
        key: 'hi-company',
        label: 'BHYT NSDLĐ đóng',
        value: result.employerInsurance.healthInsurance,
      },
      {
        key: 'ui-company',
        label: 'BHTN NSDLĐ đóng',
        value: result.employerInsurance.unemploymentInsurance,
      },
      {
        key: 'total-company',
        label: 'Tổng chi phí doanh nghiệp',
        value: result.employerTotalCost,
        isSummary: true,
      },
    ];
  }, [result]);

  const taxRows = useMemo<TaxRow[]>(() => {
    if (!result) return [];

    return result.taxBreakdown.map((detail) => ({
      key: `tax-bracket-${detail.bracket}`,
      bracket: `Bậc ${detail.bracket}`,
      rate: `${(detail.taxRate * 100).toFixed(0)}%`,
      taxableAmount: detail.taxableIncomeInBracket,
      taxAmount: detail.taxInBracket,
    }));
  }, [result]);

  const handleSubmit = (values: FormValues) => {
    if (values.amount <= 0) {
      setError('Số tiền lương phải lớn hơn 0.');
      setResult(null);
      return;
    }

    if (values.regionalMinimumWage <= 0) {
      setError('Lương tối thiểu vùng phải lớn hơn 0.');
      setResult(null);
      return;
    }

    if (values.dependentCount < 0) {
      setError('Số người phụ thuộc không được âm.');
      setResult(null);
      return;
    }

    const payload = {
      amount: values.amount,
      dependentCount: values.dependentCount,
      regionalMinimumWage: values.regionalMinimumWage,
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

      <Card size="small">
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <PageSectionTitle>Thông tin đầu vào</PageSectionTitle>

          <Radio.Group
            value={mode}
            onChange={(event) => setMode(event.target.value)}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="gross-to-net">Gross → Net</Radio.Button>
            <Radio.Button value="net-to-gross">Net → Gross</Radio.Button>
          </Radio.Group>

          <Form<FormValues>
            form={form}
            layout="vertical"
            initialValues={{
              amount: 20_000_000,
              dependentCount: 0,
              regionalMinimumWage: VIETNAM_2026_DEFAULT_REGION_I_MINIMUM_WAGE,
            }}
            onFinish={handleSubmit}
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} md={8}>
                <Form.Item<FormValues> name="amount" label={amountLabel} required>
                  <InputNumber style={{ width: '100%' }} min={0} precision={0} />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item<FormValues> name="dependentCount" label="Số người phụ thuộc" required>
                  <InputNumber style={{ width: '100%' }} min={0} precision={0} />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item<FormValues>
                  name="regionalMinimumWage"
                  label="Lương tối thiểu vùng (cho trần BHTN)"
                  required
                >
                  <InputNumber style={{ width: '100%' }} min={0} precision={0} />
                </Form.Item>
              </Col>
            </Row>

            <Space>
              <Button type="primary" htmlType="submit">
                Chuyển đổi
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  setResult(null);
                  setError(null);
                }}
              >
                Reset
              </Button>
            </Space>
          </Form>

          <Alert
            type="info"
            showIcon
            message={`Giảm trừ gia cảnh: bản thân ${formatVnd(VIETNAM_2026_FAMILY_DEDUCTION.self)}; người phụ thuộc ${formatVnd(VIETNAM_2026_FAMILY_DEDUCTION.dependent)}/người.`}
          />
        </Space>
      </Card>

      <ErrorAlert error={error} title="Lỗi dữ liệu đầu vào" />

      {result && (
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <PageSectionTitle>Bảng Diễn giải chi tiết (VNĐ)</PageSectionTitle>
            <Table
              rowKey="key"
              columns={breakdownColumns}
              dataSource={breakdownRows}
              pagination={false}
              className={styles.resultTable}
              rowClassName={(record) => (record.isSummary ? styles.summaryRow : '')}
            />
          </div>

          <div>
            <PageSectionTitle>Bảng Chi tiết Thuế TNCN (*)</PageSectionTitle>
            <Table
              rowKey="key"
              columns={taxColumns}
              dataSource={taxRows}
              pagination={false}
              className={styles.resultTable}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <Text strong>Tổng Thuế TNCN</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    <Text strong type="danger">
                      -{formatVnd(result.personalIncomeTax)}
                    </Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </div>

          <div>
            <PageSectionTitle>Bảng Người sử dụng lao động trả (VNĐ)</PageSectionTitle>
            <Table
              rowKey="key"
              columns={employerColumns}
              dataSource={employerRows}
              pagination={false}
              className={styles.resultTable}
              rowClassName={(record) => (record.isSummary ? styles.summaryRow : '')}
            />
          </div>

          {result.grossUpDetails && (
            <Alert
              type="warning"
              showIcon
              title="Thông tin Gross-up"
              description={
                <Space orientation="vertical" size={4}>
                  <Text>
                    Phân đoạn bảo hiểm: <Text strong>{result.grossUpDetails.selectedInsuranceSegment}</Text>
                  </Text>
                  <Text>
                    Bậc thuế chọn:{' '}
                    <Text strong>
                      {result.grossUpDetails.selectedTaxBracket || 'Không phát sinh thuế'}
                    </Text>
                  </Text>
                  <Text>
                    Sai số làm tròn Net: <Text strong>{formatVnd(result.grossUpDetails.netDifference)}</Text>
                  </Text>
                </Space>
              }
            />
          )}
        </Space>
      )}
    </FeatureCard>
  );
}

