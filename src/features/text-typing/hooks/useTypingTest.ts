import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_DICTIONARY, generateWords } from '../words';
import type { GameStatus, ModeOption, TypingMetrics } from '../types';

const TIMER_INTERVAL_MS = 100;
const DEFAULT_WORD_COUNT = 60;

export function useTypingTest(initialMode: ModeOption = { type: 'time', value: 30 }) {
  const [mode, setMode] = useState<ModeOption>(initialMode);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [words, setWords] = useState<string[]>(() => generateWords(DEFAULT_DICTIONARY, DEFAULT_WORD_COUNT));
  const [typedWords, setTypedWords] = useState<string[]>(() => words.map(() => ''));
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [startAt, setStartAt] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [remainingTimeMs, setRemainingTimeMs] = useState(
    mode.type === 'time' ? mode.value * 1000 : 0,
  );
  const [restartArmed, setRestartArmed] = useState(false);

  const tickerRef = useRef<number | null>(null);
  const wordsRef = useRef(words);
  const typedWordsRef = useRef(typedWords);
  const statusRef = useRef(status);
  const modeRef = useRef(mode);
  const startAtRef = useRef<number | null>(startAt);

  useEffect(() => {
    wordsRef.current = words;
  }, [words]);

  useEffect(() => {
    typedWordsRef.current = typedWords;
  }, [typedWords]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    startAtRef.current = startAt;
  }, [startAt]);

  const stopTicker = useCallback(() => {
    if (tickerRef.current !== null) {
      window.clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
  }, []);

  const finishGame = useCallback(() => {
    stopTicker();
    setStatus('finished');
  }, [stopTicker]);

  const startTicker = useCallback(() => {
    stopTicker();
    tickerRef.current = window.setInterval(() => {
      const currentStart = startAtRef.current;
      if (!currentStart) return;
      const elapsed = Date.now() - currentStart;
      setElapsedMs(elapsed);

      const currentMode = modeRef.current;
      if (currentMode.type === 'time') {
        const totalTime = currentMode.value * 1000;
        const remaining = Math.max(0, totalTime - elapsed);
        setRemainingTimeMs(remaining);
        if (remaining <= 0) {
          finishGame();
        }
      }
    }, TIMER_INTERVAL_MS);
  }, [finishGame, stopTicker]);

  const rebuildWords = useCallback((nextMode: ModeOption) => {
    const count = nextMode.type === 'words' ? Math.max(nextMode.value + 10, DEFAULT_WORD_COUNT) : DEFAULT_WORD_COUNT;
    const nextWords = generateWords(DEFAULT_DICTIONARY, count);
    setWords(nextWords);
    setTypedWords(nextWords.map(() => ''));
  }, []);

  const restart = useCallback((nextMode?: ModeOption) => {
    const modeToApply = nextMode ?? modeRef.current;
    setMode(modeToApply);
    rebuildWords(modeToApply);
    setStatus('idle');
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setStartAt(null);
    setElapsedMs(0);
    setRestartArmed(false);
    setRemainingTimeMs(modeToApply.type === 'time' ? modeToApply.value * 1000 : 0);
    stopTicker();
  }, [rebuildWords, stopTicker]);

  const ensureStarted = useCallback(() => {
    if (statusRef.current !== 'idle') return;
    const now = Date.now();
    setStatus('typing');
    setStartAt(now);
    setElapsedMs(0);
    if (modeRef.current.type === 'time') {
      setRemainingTimeMs(modeRef.current.value * 1000);
    }
    startTicker();
  }, [startTicker]);

  const setTypedValueAtIndex = useCallback((wordIndex: number, value: string) => {
    setTypedWords((previous) => {
      const next = [...previous];
      next[wordIndex] = value;
      return next;
    });
  }, []);

  const handleSpace = useCallback(() => {
    if (statusRef.current === 'finished') return;
    ensureStarted();

    const nextWord = currentWordIndex + 1;
    if (nextWord >= wordsRef.current.length) {
      finishGame();
      return;
    }

    setCurrentWordIndex(nextWord);
    setCurrentCharIndex(typedWordsRef.current[nextWord].length);

    const currentMode = modeRef.current;
    if (currentMode.type === 'words' && nextWord >= currentMode.value) {
      finishGame();
    }
  }, [currentWordIndex, ensureStarted, finishGame]);

  const handleBackspace = useCallback(() => {
    if (statusRef.current === 'finished') return;
    const currentTyped = typedWordsRef.current[currentWordIndex] ?? '';

    if (currentTyped.length > 0) {
      const nextTyped = currentTyped.slice(0, -1);
      setTypedValueAtIndex(currentWordIndex, nextTyped);
      setCurrentCharIndex(Math.max(0, nextTyped.length));
      return;
    }

    if (currentWordIndex === 0) return;

    const previousIndex = currentWordIndex - 1;
    const previousWord = wordsRef.current[previousIndex] ?? '';
    const previousTyped = typedWordsRef.current[previousIndex] ?? '';
    const canGoBack = previousTyped.length !== previousWord.length || previousTyped !== previousWord;
    if (!canGoBack) return;

    setCurrentWordIndex(previousIndex);
    setCurrentCharIndex(previousTyped.length);
  }, [currentWordIndex, setTypedValueAtIndex]);

  const handleCharacter = useCallback((char: string) => {
    if (statusRef.current === 'finished') return;
    ensureStarted();
    const currentTyped = typedWordsRef.current[currentWordIndex] ?? '';
    const nextTyped = `${currentTyped}${char}`;
    setTypedValueAtIndex(currentWordIndex, nextTyped);
    setCurrentCharIndex(nextTyped.length);
  }, [currentWordIndex, ensureStarted, setTypedValueAtIndex]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      setRestartArmed(true);
      return;
    }

    if (event.key === 'Enter' && restartArmed) {
      event.preventDefault();
      restart();
      return;
    }

    if (event.key !== 'Enter') {
      setRestartArmed(false);
    }

    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.key === ' ') {
      event.preventDefault();
      handleSpace();
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();
      handleBackspace();
      return;
    }

    if (event.key.length === 1) {
      event.preventDefault();
      handleCharacter(event.key);
    }
  }, [handleBackspace, handleCharacter, handleSpace, restart, restartArmed]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopTicker();
    };
  }, [handleKeyDown, stopTicker]);

  const metrics: TypingMetrics = useMemo(() => {
    let correctChars = 0;
    let totalTypedChars = 0;

    const limit = mode.type === 'words' ? Math.min(mode.value, words.length) : words.length;
    for (let index = 0; index < limit; index += 1) {
      const source = words[index] ?? '';
      const typed = typedWords[index] ?? '';
      totalTypedChars += typed.length;
      const shortest = Math.min(source.length, typed.length);
      for (let i = 0; i < shortest; i += 1) {
        if (source[i] === typed[i]) correctChars += 1;
      }
    }

    const elapsedMinutes = Math.max(elapsedMs / 60000, 1 / 60000);
    const wpm = (correctChars / 5) / elapsedMinutes;
    const rawWpm = (totalTypedChars / 5) / elapsedMinutes;
    const accuracy = totalTypedChars > 0 ? (correctChars / totalTypedChars) * 100 : 100;

    return {
      wpm: Number(wpm.toFixed(2)),
      rawWpm: Number(rawWpm.toFixed(2)),
      accuracy: Number(accuracy.toFixed(2)),
      correctChars,
      totalTypedChars,
    };
  }, [elapsedMs, mode.type, mode.value, typedWords, words]);

  const setModeAndRestart = useCallback((nextMode: ModeOption) => {
    restart(nextMode);
  }, [restart]);

  return {
    status,
    words,
    typedWords,
    currentWordIndex,
    currentCharIndex,
    metrics,
    elapsedMs,
    remainingTimeMs,
    mode,
    restartArmed,
    restart,
    setModeAndRestart,
  };
}
