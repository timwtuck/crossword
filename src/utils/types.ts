// Core types for crossword utilities
export interface Cell {
  letter: string;
  isBlocked: boolean;
  isSelected: boolean;
  wordAcross?: number; // Index of the across word this cell belongs to
  wordDown?: number; // Index of the down word this cell belongs to
  positionInWord?: number; // Position within the word (0-based)
}

export interface Word {
  startRow: number;
  startCol: number;
  direction: "across" | "down";
  length: number;
  clue: string;
  answer: string; // The actual word answer
}

export interface CrosswordData {
  grid: string[][]; // Simple grid with '-' for blocked, letters for cells
  clues: {
    across: string[];
    down: string[];
  };
}

export interface ProcessedCrosswordData {
  cellGrid: Cell[][];
  words: Word[];
  acrossWords: Word[];
  downWords: Word[];
}

export interface ValidationResult {
  isComplete: boolean;
  correctWords: number;
  totalWords: number;
  wordStatus: WordStatus[];
}

export interface WordStatus {
  word: Word;
  userAnswer: string;
  isCorrect: boolean;
  isComplete: boolean;
}
