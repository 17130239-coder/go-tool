import { Button, Card, Flex, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

interface PageErrorProps {
  message?: string;
  onRetry?: () => void;
}

/** Full-page error state with optional retry and back buttons. Used as `errorElement` in routes. */
export function PageError({
  message = 'Failed to load page.',
  onRetry,
}: PageErrorProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <Flex className="py-32">
        <Result
          status="error"
          title="Something went wrong"
          subTitle={message}
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
          style={{ width: '100%' }}
        />
      </Flex>
    </Card>
  );
}
