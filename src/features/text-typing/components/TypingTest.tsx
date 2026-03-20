import { useLayoutEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { Button, Card, Flex, Space, Statistic, Typography } from 'antd';
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

function getOffsetWithinAncestor(node: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let current: HTMLElement | null = node;

  while (current && current !== ancestor) {
    x += current.offsetLeft;
    y += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }

  return { x, y };
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
  const caretRef = useRef<HTMLSpanElement | null>(null);

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

    const slotWrapNode = targetNode.parentElement as HTMLSpanElement | null;
    if (!slotWrapNode) return;

    const { x: xBase, y: yBase } = getOffsetWithinAncestor(slotWrapNode, container);
    const targetWidth = slotWrapNode.offsetWidth;
    const targetHeight = slotWrapNode.offsetHeight || targetNode.getBoundingClientRect().height || 32;
    const x = anchorToLastChar ? xBase + targetWidth - 1 : xBase - 1;
    const y = yBase + targetHeight * 0.08;

    const revealTop = y - targetHeight * 0.65;
    const revealBottom = y + targetHeight * 1.35;
    const viewportTop = container.scrollTop;
    const viewportBottom = viewportTop + container.clientHeight;
    if (revealBottom > viewportBottom) {
      container.scrollTop = revealBottom - container.clientHeight;
    } else if (revealTop < viewportTop) {
      container.scrollTop = Math.max(0, revealTop);
    }

    const caretNode = caretRef.current;
    if (!caretNode) return;
    caretNode.style.left = `${Math.round(x)}px`;
    caretNode.style.top = `${Math.round(y)}px`;
    caretNode.style.height = `${Math.max(20, targetHeight * 0.84)}px`;
  }, [currentCharIndex, currentWordIndex, status, typedWords, visibleWords]);

  const remainingSeconds = Math.max(0, Math.ceil(remainingTimeMs / 1000));
  const wordProgress = Math.min(currentWordIndex + (typedWords[currentWordIndex] ? 1 : 0), wordLimit);

  return (
    <Card className={styles.card} size="small">
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <Flex className={styles.toolbar}>
          <Flex className={styles.modeGroup}>
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
          </Flex>

          <Flex className={styles.modeGroup}>
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
          </Flex>
          <Button className={styles.restartButton} onClick={() => restart()}>Restart</Button>
        </Flex>

        <Flex className={styles.meta}>
          <Text className={styles.metaText}>
            {mode.type === 'time' ? `Time left: ${remainingSeconds}s` : `Words: ${wordProgress}/${wordLimit}`}
          </Text>
          <Text className={styles.metaText}>Shortcut: Tab + Enter to restart</Text>
          {restartArmed && <Text className={styles.restartArmed}>Restart armed. Press Enter.</Text>}
        </Flex>

        <div className={styles.liveMetrics}>
          <Statistic title="WPM" value={metrics.wpm} precision={1} />
          <Statistic title="Raw WPM" value={metrics.rawWpm} precision={1} />
          <Statistic title="Accuracy" value={metrics.accuracy} precision={1} suffix="%" />
        </div>

        <div className={styles.wordsContainer} ref={wordsContainerRef}>
          {status !== 'finished' && (
            <span
              ref={caretRef}
              className={`${styles.caretFloating} ${styles.caretSmooth} ${status === 'idle' ? styles.caretBlink : ''}`}
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
          <Card className={styles.metrics} size="small">
            <Title level={5}>Result</Title>
            <Space size="large" wrap>
              <Statistic title="WPM" value={metrics.wpm} precision={2} />
              <Statistic title="Raw WPM" value={metrics.rawWpm} precision={2} />
              <Statistic title="Accuracy (%)" value={metrics.accuracy} precision={2} />
            </Space>
          </Card>
        )}
      </Space>
    </Card>
  );
}
