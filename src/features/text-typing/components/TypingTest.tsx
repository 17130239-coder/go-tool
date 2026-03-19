import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Button, Card, Space, Statistic, Typography } from 'antd';
import { useTypingTest } from '../hooks/useTypingTest';
import type { CaretPosition, ModeOption } from '../types';
import styles from '../TextTyping.module.css';

const { Text, Title } = Typography;

const TIME_OPTIONS: ModeOption[] = [
  { type: 'time', value: 15 },
  { type: 'time', value: 30 },
];

const WORD_OPTIONS: ModeOption[] = [
  { type: 'words', value: 10 },
  { type: 'words', value: 25 },
];

function isSameMode(left: ModeOption, right: ModeOption) {
  return left.type === right.type && left.value === right.value;
}

export function TypingTest() {
  const {
    status,
    words,
    typedWords,
    currentWordIndex,
    currentCharIndex,
    metrics,
    remainingTimeMs,
    mode,
    restartArmed,
    restart,
    setModeAndRestart,
  } = useTypingTest();

  const wordLimit = mode.type === 'words' ? mode.value : words.length;
  const visibleWords = useMemo(() => words.slice(0, wordLimit), [wordLimit, words]);
  const wordsContainerRef = useRef<HTMLDivElement | null>(null);
  const slotRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const [caret, setCaret] = useState<CaretPosition>({ x: 0, y: 0, height: 32 });

  useLayoutEffect(() => {
    if (status === 'finished') return;

    const currentWord = visibleWords[currentWordIndex];
    if (!currentWord) return;

    const typedWord = typedWords[currentWordIndex] ?? '';
    const maxLength = Math.max(currentWord.length, typedWord.length);
    const activeSlotIndex = Math.min(currentCharIndex, maxLength);
    const anchorToLastChar = activeSlotIndex === currentWord.length
      && typedWord.length <= currentWord.length
      && currentWord.length > 0;
    const targetSlot = anchorToLastChar ? currentWord.length - 1 : activeSlotIndex;
    const targetNode = slotRefs.current[`${currentWordIndex}-slot-${targetSlot}`];
    const container = wordsContainerRef.current;
    if (!targetNode || !container) return;

    const targetRect = targetNode.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const leftBase = targetRect.left - containerRect.left;
    const x = anchorToLastChar ? leftBase + targetRect.width - 1 : leftBase - 1;
    const y = targetRect.top - containerRect.top + targetRect.height * 0.08;

    setCaret({
      x,
      y,
      height: targetRect.height * 0.84,
    });
  }, [currentCharIndex, currentWordIndex, status, typedWords, visibleWords]);

  const remainingSeconds = Math.max(0, Math.ceil(remainingTimeMs / 1000));
  const wordProgress = Math.min(currentWordIndex + (typedWords[currentWordIndex] ? 1 : 0), wordLimit);

  return (
    <Card className={styles.card}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div className={styles.toolbar}>
          <div className={styles.modeGroup}>
            <Text className={styles.modeLabel}>time</Text>
            <Space size={8}>
              {TIME_OPTIONS.map((option) => (
                <Button
                  key={`${option.type}-${option.value}`}
                  type={isSameMode(mode, option) ? 'primary' : 'text'}
                  className={!isSameMode(mode, option) ? styles.modeButton : undefined}
                  size="small"
                  onClick={() => setModeAndRestart(option)}
                >
                  {option.value}s
                </Button>
              ))}
            </Space>
          </div>

          <div className={styles.modeGroup}>
            <Text className={styles.modeLabel}>words</Text>
            <Space size={8}>
              {WORD_OPTIONS.map((option) => (
                <Button
                  key={`${option.type}-${option.value}`}
                  type={isSameMode(mode, option) ? 'primary' : 'text'}
                  className={!isSameMode(mode, option) ? styles.modeButton : undefined}
                  size="small"
                  onClick={() => setModeAndRestart(option)}
                >
                  {option.value}
                </Button>
              ))}
            </Space>
          </div>
          <Button className={styles.restartButton} onClick={() => restart()}>Restart</Button>
        </div>

        <div className={styles.meta}>
          <Text className={styles.metaText}>
            {mode.type === 'time' ? `Time left: ${remainingSeconds}s` : `Words: ${wordProgress}/${wordLimit}`}
          </Text>
          <Text className={styles.metaText}>Shortcut: Tab + Enter to restart</Text>
          {restartArmed && <Text className={styles.restartArmed}>Restart armed. Press Enter.</Text>}
        </div>

        <div className={styles.liveMetrics}>
          <Statistic title="WPM" value={metrics.wpm} precision={1} />
          <Statistic title="Raw WPM" value={metrics.rawWpm} precision={1} />
          <Statistic title="Accuracy" value={metrics.accuracy} precision={1} suffix="%" />
        </div>

        <div className={styles.wordsContainer} ref={wordsContainerRef}>
          {status !== 'finished' && (
            <span
              className={`${styles.caretFloating} ${styles.caretSmooth} ${status === 'idle' ? styles.caretBlink : ''}`}
              style={{
                left: `${caret.x}px`,
                top: `${caret.y}px`,
                height: `${caret.height}px`,
              }}
            />
          )}

          {visibleWords.map((word, wordIndex) => {
            const typedWord = typedWords[wordIndex] ?? '';
            const maxLength = Math.max(word.length, typedWord.length);
            return (
              <span key={`${word}-${wordIndex}`} className={styles.word}>
                {Array.from({ length: maxLength + 1 }, (_, slotIndex) => {
                  const sourceChar = word[slotIndex];
                  const typedChar = typedWord[slotIndex];
                  const isWithinWord = slotIndex < word.length;

                  let charNode: ReactNode = null;
                  if (isWithinWord) {
                    let className = styles.charUntyped;
                    if (typedChar !== undefined) {
                      className = typedChar === sourceChar ? styles.charCorrect : styles.charWrong;
                    } else if (wordIndex < currentWordIndex || status === 'finished') {
                      className = styles.charSkipped;
                    }

                    charNode = <span className={`${styles.char} ${className}`}>{sourceChar}</span>;
                  } else if (typedChar !== undefined) {
                    charNode = <span className={`${styles.char} ${styles.charExtra}`}>{typedChar}</span>;
                  }

                  return (
                    <span key={`${wordIndex}-slot-wrap-${slotIndex}`} className={styles.slotWrap}>
                      <span
                        ref={(node) => {
                          slotRefs.current[`${wordIndex}-slot-${slotIndex}`] = node;
                        }}
                        className={styles.caretSlot}
                        aria-hidden
                      />
                      {charNode}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </div>

        {status === 'finished' && (
          <div className={styles.metrics}>
            <Title level={5}>Result</Title>
            <Space size="large" wrap>
              <Statistic title="WPM" value={metrics.wpm} precision={2} />
              <Statistic title="Raw WPM" value={metrics.rawWpm} precision={2} />
              <Statistic title="Accuracy (%)" value={metrics.accuracy} precision={2} />
            </Space>
          </div>
        )}
      </Space>
    </Card>
  );
}
