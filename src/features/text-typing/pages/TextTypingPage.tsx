import { FeatureCard, PageHeader } from '../../../components/shared';
import { TypingTest } from '../components/TypingTest';

export function TextTypingPage() {
  return (
    <FeatureCard>
      <PageHeader
        title="Text Typing Speed"
        description="Monkeytype-like typing core with custom key handling and live metrics."
      />
      <TypingTest />
    </FeatureCard>
  );
}
