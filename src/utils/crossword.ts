// Main crossword utilities - orchestrates all crossword functionality
import { detectWords } from "./wordDetection";
import { extractAnswers } from "./answerExtraction";
import { createCellGrid } from "./cellProcessing";
import { createSampleCrossword } from "./sampleData";
import type { CrosswordData, ProcessedCrosswordData } from "./types";

// Re-export types for convenience
export type {
  Cell,
  Word,
  CrosswordData,
  ProcessedCrosswordData,
  ValidationResult,
  WordStatus,
} from "./types";

// Re-export main functions
export { detectWords, extractAnswers, createSampleCrossword };

// Re-export validation functions
export {
  validateCrossword,
  validateCrosswordData,
  getErrorMessage,
} from "./validation";
export type { ValidationError, ValidationDataResult } from "./validation";

// Re-export state management
export {
  createCrosswordState,
  updateWordStates,
  updateCellHighlighting,
} from "./stateManager";

export type { CellState, WordState, CrosswordState } from "./stateTypes";

/**
 * Maps clues to their corresponding answers
 * @param crosswordData - The crossword data with grid and clues
 * @returns Processed crossword data with clues mapped to answers
 */
export function processCrosswordData(
  crosswordData: CrosswordData
): ProcessedCrosswordData {
  const words = detectWords(crosswordData.grid);
  const wordsWithAnswers = extractAnswers(crosswordData.grid, words);

  // Separate words by direction
  const acrossWords = wordsWithAnswers.filter((w) => w.direction === "across");
  const downWords = wordsWithAnswers.filter((w) => w.direction === "down");

  // Assign clues to words in order
  acrossWords.forEach((word, index) => {
    word.clue = crosswordData.clues.across[index] || "";
  });

  downWords.forEach((word, index) => {
    word.clue = crosswordData.clues.down[index] || "";
  });

  // Create cell data with word information
  const cellGrid = createCellGrid(crosswordData, acrossWords, downWords);

  return {
    cellGrid,
    words: [...acrossWords, ...downWords],
    acrossWords,
    downWords,
  };
}
