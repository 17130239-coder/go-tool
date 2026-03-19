import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

interface PageErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function PageError({ message, onRetry }: PageErrorProps) {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '40px 0' }}>
      <Result
        status="error"
        title="Something went wrong"
        subTitle={message || 'Something went wrong'}
        extra={[
          onRetry && (
            <Button type="primary" key="retry" onClick={onRetry}>
              Retry
            </Button>
          ),
          <Button key="back" onClick={() => navigate(-1)}>
            Back
          </Button>,
        ].filter(Boolean)}
      />
    </div>
  );
}
