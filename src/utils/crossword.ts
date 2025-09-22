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

  // Create a map of word positions to clues for proper assignment
  const acrossClueMap = new Map<string, string>();
  const downClueMap = new Map<string, string>();

  // Map clues to their expected positions based on sequential numbering
  let acrossIndex = 0;
  let downIndex = 0;

  // Sort words by their grid position (top-left to bottom-right) to match sequential numbering
  const sortedAcrossWords = [...acrossWords].sort((a, b) => {
    if (a.startRow !== b.startRow) return a.startRow - b.startRow;
    return a.startCol - b.startCol;
  });

  const sortedDownWords = [...downWords].sort((a, b) => {
    if (a.startRow !== b.startRow) return a.startRow - b.startRow;
    return a.startCol - b.startCol;
  });

  // Assign clues based on grid position order
  sortedAcrossWords.forEach((word) => {
    const key = `${word.startRow}-${word.startCol}`;
    acrossClueMap.set(key, crosswordData.clues.across[acrossIndex] || "");
    acrossIndex++;
  });

  sortedDownWords.forEach((word) => {
    const key = `${word.startRow}-${word.startCol}`;
    downClueMap.set(key, crosswordData.clues.down[downIndex] || "");
    downIndex++;
  });

  // Apply clues to original word arrays
  acrossWords.forEach((word) => {
    const key = `${word.startRow}-${word.startCol}`;
    word.clue = acrossClueMap.get(key) || "";
  });

  downWords.forEach((word) => {
    const key = `${word.startRow}-${word.startCol}`;
    word.clue = downClueMap.get(key) || "";
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
