import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Input, Space, Statistic, Typography } from 'antd';

const { Title, Text } = Typography;

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function TextTypingPage() {
  const [text, setText] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [now, setNow] = useState<number>(0);

  const wordCount = useMemo(() => countWords(text), [text]);

  useEffect(() => {
    if (!startTime) return;

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [startTime]);

  const elapsedMinutes = useMemo(() => {
    if (!startTime) return 0;
    return (now - startTime) / 60000;
  }, [now, startTime]);

  const wpm = useMemo(() => {
    if (wordCount === 0 || elapsedMinutes <= 0) return 0;
    return Math.round((wordCount / elapsedMinutes) * 10) / 10;
  }, [elapsedMinutes, wordCount]);

  const onChangeText = (value: string) => {
    if (!startTime && value.trim().length > 0) {
      const timestamp = Date.now();
      setStartTime(timestamp);
      setNow(timestamp);
    }
    setText(value);
  };

  const onReset = () => {
    setText('');
    setStartTime(null);
    setNow(0);
  };

  return (
    <Card>
      <Title level={4}>Text Typing Speed</Title>
      <Text type="secondary">
        Type in the editor below to track words per minute (WPM) in real time.
      </Text>

      <Input.TextArea
        className="mt-16"
        rows={10}
        value={text}
        onChange={(event) => onChangeText(event.target.value)}
        placeholder="Start typing here..."
      />

      <div className="mt-24 mb-24">
        <Space size="large" wrap>
          <Statistic title="Words" value={wordCount} />
          <Statistic title="Elapsed (min)" value={elapsedMinutes} precision={2} />
          <Statistic title="WPM" value={wpm} precision={1} />
        </Space>
      </div>

      <Button onClick={onReset}>Reset</Button>
    </Card>
  );
}
