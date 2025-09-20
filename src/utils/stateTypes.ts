// State management types for crossword application

export interface CellState {
  // Basic cell properties
  letter: string; // User input letter
  answer: string; // Correct answer letter
  isBlocked: boolean; // Is this a black square?

  // Word associations
  acrossWordNum?: number; // Which across word this belongs to
  downWordNum?: number; // Which down word this belongs to
  positionInAcross?: number; // Position within the across word (0-based)
  positionInDown?: number; // Position within the down word (0-based)

  // UI state
  isSelected: boolean; // Is this cell currently selected?
  isHighlighted: boolean; // Is this cell highlighted (same word)?

  // Visual indicators
  showNumber: boolean; // Should we show the word number?
  numberValue?: number; // The actual number to display
}

export interface WordState {
  number: number;
  direction: "across" | "down";
  clue: string;
  answer: string;
  userAnswer: string;
  isComplete: boolean;
  isCorrect: boolean;
  cells: { row: number; col: number }[]; // Positions of cells in this word
}

export interface CrosswordState {
  cells: CellState[][];
  words: WordState[];
  selectedCell: { row: number; col: number } | null;
  currentDirection: "across" | "down";
  showAnswers: boolean;
}

// Helper function to create initial cell state
export function createInitialCellState(
  answer: string,
  letter: string,
  isBlocked: boolean,
  acrossWordNum?: number,
  downWordNum?: number,
  positionInAcross?: number,
  positionInDown?: number,
  showNumber: boolean = false,
  numberValue?: number
): CellState {
  return {
    letter,
    answer,
    isBlocked,
    acrossWordNum,
    downWordNum,
    positionInAcross,
    positionInDown,
    isSelected: false,
    isHighlighted: false,
    showNumber,
    numberValue,
  };
}

// Helper function to create initial word state
export function createInitialWordState(
  number: number,
  direction: "across" | "down",
  clue: string,
  answer: string,
  cells: { row: number; col: number }[]
): WordState {
  return {
    number,
    direction,
    clue,
    answer,
    userAnswer: "",
    isComplete: false,
    isCorrect: false,
    cells,
  };
}
