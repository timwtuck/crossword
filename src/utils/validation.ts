import type { CrosswordData, ProcessedCrosswordData, Word, WordStatus, ValidationResult } from "./types";

export interface ValidationError {
  type: "grid_consistency" | "clue_count" | "empty_cell";
  message: string;
  details?: any;
}

export interface ValidationDataResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validates crossword data for common errors
 */
export function validateCrosswordData(
  crosswordData: CrosswordData
): ValidationDataResult {
  const errors: ValidationError[] = [];

  // Check grid consistency (all rows have same length)
  const gridConsistencyError = validateGridConsistency(crosswordData.grid);
  if (gridConsistencyError) {
    errors.push(gridConsistencyError);
  }

  // Check for empty cells in grid
  const emptyCellErrors = validateEmptyCells(crosswordData.grid);
  errors.push(...emptyCellErrors);

  // Check clue count matches word count
  const clueCountErrors = validateClueCounts(crosswordData);
  errors.push(...clueCountErrors);

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates that all rows in the grid have the same number of characters
 */
function validateGridConsistency(grid: string[][]): ValidationError | null {
  if (grid.length === 0) {
    return {
      type: "grid_consistency",
      message: "Grid is empty",
      details: { rowCount: 0 },
    };
  }

  const expectedLength = grid[0].length;
  const inconsistentRows: number[] = [];

  grid.forEach((row, index) => {
    if (row.length !== expectedLength) {
      inconsistentRows.push(index);
    }
  });

  if (inconsistentRows.length > 0) {
    return {
      type: "grid_consistency",
      message: `Grid rows have inconsistent lengths. Expected ${expectedLength} characters per row.`,
      details: {
        expectedLength,
        inconsistentRows,
        actualLengths: inconsistentRows.map((rowIndex) => ({
          row: rowIndex,
          length: grid[rowIndex].length,
        })),
      },
    };
  }

  return null;
}

/**
 * Validates that there are no empty cells in the grid
 */
function validateEmptyCells(grid: string[][]): ValidationError[] {
  const errors: ValidationError[] = [];

  grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === "") {
        errors.push({
          type: "empty_cell",
          message: `Empty cell found at position (${rowIndex}, ${colIndex})`,
          details: { row: rowIndex, col: colIndex },
        });
      }
    });
  });

  return errors;
}

/**
 * Validates that clue counts match word counts
 */
function validateClueCounts(crosswordData: CrosswordData): ValidationError[] {
  const errors: ValidationError[] = [];

  // This is a simplified check - in a real implementation, you'd need to
  // detect words first and then compare counts
  const acrossClueCount = crosswordData.clues.across.length;
  const downClueCount = crosswordData.clues.down.length;

  // Basic validation - we'll enhance this when we integrate with word detection
  if (acrossClueCount === 0) {
    errors.push({
      type: "clue_count",
      message: "No across clues provided",
      details: { acrossClueCount },
    });
  }

  if (downClueCount === 0) {
    errors.push({
      type: "clue_count",
      message: "No down clues provided",
      details: { downClueCount },
    });
  }

  return errors;
}

/**
 * Gets a user-friendly error message for display
 */
export function getErrorMessage(error: ValidationError): string {
  switch (error.type) {
    case "grid_consistency":
      return `Grid Error: ${error.message}`;
    case "empty_cell":
      return `Empty Cell: ${error.message}`;
    case "clue_count":
      return `Clue Count: ${error.message}`;
    default:
      return `Validation Error: ${error.message}`;
  }
}

/**
 * Validates user input against crossword answers
 */
export function validateCrossword(
  userInput: string[][],
  processedData: ProcessedCrosswordData
): ValidationResult {
  const wordStatus: WordStatus[] = [];
  let correctWords = 0;
  let isComplete = true;

  processedData.words.forEach((word) => {
    const userAnswer = extractUserAnswer(userInput, word);
    const isCorrect = userAnswer.toLowerCase() === word.answer.toLowerCase();
    const isWordComplete = userAnswer.length === word.answer.length;

    if (isCorrect) correctWords++;
    if (!isWordComplete) isComplete = false;

    wordStatus.push({
      word,
      userAnswer,
      isCorrect,
      isComplete: isWordComplete,
    });
  });

  return {
    isComplete,
    correctWords,
    totalWords: processedData.words.length,
    wordStatus,
  };
}

/**
 * Extracts user answer for a specific word
 */
function extractUserAnswer(
  userInput: string[][],
  word: Word
): string {
  const cells: string[] = [];
  
  if (word.direction === "across") {
    // Extract across word
    for (let col = word.startCol; col < word.startCol + word.length; col++) {
      cells.push(userInput[word.startRow]?.[col] || "");
    }
  } else {
    // Extract down word
    for (let row = word.startRow; row < word.startRow + word.length; row++) {
      cells.push(userInput[row]?.[word.startCol] || "");
    }
  }
  
  return cells.join("");
}
