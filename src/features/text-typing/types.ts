export type GameStatus = 'idle' | 'typing' | 'finished';

export type ModeType = 'time' | 'words';

export interface ModeOption {
  type: ModeType;
  value: number;
}

export interface CaretPosition {
  x: number;
  y: number;
  height: number;
}

export interface TypingMetrics {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  totalTypedChars: number;
}
