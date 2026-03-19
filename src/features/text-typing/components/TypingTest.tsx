import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Button, Card, Space, Statistic, Typography } from 'antd';
import { useTypingTest } from '../hooks/useTypingTest';
import type { ModeOption } from '../types';
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

        <div className={styles.wordsContainer}>
          {visibleWords.map((word, wordIndex) => {
            const typedWord = typedWords[wordIndex] ?? '';
            const maxLength = Math.max(word.length, typedWord.length);
            const activeSlotIndex = Math.min(currentCharIndex, maxLength);
            const anchorToLastChar = activeSlotIndex === word.length && typedWord.length <= word.length && word.length > 0;
            return (
              <span key={`${word}-${wordIndex}`} className={styles.word}>
                {Array.from({ length: maxLength + 1 }, (_, slotIndex) => {
                  const sourceChar = word[slotIndex];
                  const typedChar = typedWord[slotIndex];
                  const isWithinWord = slotIndex < word.length;

                  let charNode: ReactNode = null;
                  if (isWithinWord) {
                      let className = styles.charUntyped;
                      const isCurrentTarget = status !== 'finished'
                        && wordIndex === currentWordIndex
                        && (
                          (anchorToLastChar && slotIndex === word.length - 1)
                          || (!anchorToLastChar && slotIndex === activeSlotIndex)
                        );
                      if (typedChar !== undefined) {
                        className = typedChar === sourceChar ? styles.charCorrect : styles.charWrong;
                      } else if (wordIndex < currentWordIndex || status === 'finished') {
                        className = styles.charSkipped;
                      }

                      charNode = (
                        <span className={`${styles.char} ${className} ${isCurrentTarget ? styles.charActive : ''}`}>
                          {sourceChar}
                        </span>
                      );
                    } else if (typedChar !== undefined) {
                      const isCurrentTarget = status !== 'finished'
                        && wordIndex === currentWordIndex
                        && !anchorToLastChar
                        && slotIndex === activeSlotIndex;
                      charNode = (
                        <span className={`${styles.char} ${styles.charExtra} ${isCurrentTarget ? styles.charActive : ''}`}>
                          {typedChar}
                        </span>
                      );
                    }

                  return (
                    <span key={`${wordIndex}-slot-wrap-${slotIndex}`} className={styles.slotWrap}>
                      {status !== 'finished'
                        && wordIndex === currentWordIndex
                        && (
                          (anchorToLastChar && slotIndex === word.length - 1)
                          || (!anchorToLastChar && slotIndex === activeSlotIndex)
                        ) && (
                          <span
                            className={`${styles.caretInline} ${status === 'idle' ? styles.caretBlink : ''} ${anchorToLastChar ? styles.caretInlineAfterChar : ''}`}
                          />
                        )}
                      {!charNode && <span className={styles.slotProbe} aria-hidden />}
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
