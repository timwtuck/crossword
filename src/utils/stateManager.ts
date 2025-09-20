import type { CrosswordData, ProcessedCrosswordData } from "./types";
import type { CellState, WordState, CrosswordState } from "./stateTypes";
import { createInitialCellState, createInitialWordState } from "./stateTypes";

/**
 * Converts processed crossword data to application state
 */
export function createCrosswordState(
  crosswordData: CrosswordData,
  processedData: ProcessedCrosswordData
): CrosswordState {
  const cells = createCellStates(crosswordData, processedData);
  const words = createWordStates(processedData);

  return {
    cells,
    words,
    selectedCell: null,
    currentDirection: "across",
    showAnswers: false,
  };
}

/**
 * Creates cell states from crossword data
 */
function createCellStates(
  crosswordData: CrosswordData,
  processedData: ProcessedCrosswordData
): CellState[][] {
  // First, create the sequential numbering map
  const cellNumbers = createSequentialNumbering(processedData);

  return crosswordData.grid.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      const isBlocked = cell === "-";
      const cellData = processedData.cellGrid[rowIndex][colIndex];

      // Determine if this cell should show a number (only on starting cells)
      const isStartingCell =
        !isBlocked &&
        ((cellData.wordAcross !== undefined &&
          colIndex ===
            processedData.acrossWords[cellData.wordAcross].startCol) ||
          (cellData.wordDown !== undefined &&
            rowIndex === processedData.downWords[cellData.wordDown].startRow));

      // Get the sequential number for this cell
      let numberValue: number | undefined;
      if (isStartingCell) {
        const cellKey = `${rowIndex}-${colIndex}`;
        numberValue = cellNumbers.get(cellKey);
      }

      return createInitialCellState(
        isBlocked ? "" : cell.toLowerCase(),
        "",
        isBlocked,
        cellData.wordAcross,
        cellData.wordDown,
        cellData.positionInWord,
        cellData.positionInWord,
        isStartingCell,
        numberValue
      );
    })
  );
}

/**
 * Creates sequential numbering for all word-starting cells
 * Numbers are assigned in top-left to bottom-right order
 */
function createSequentialNumbering(
  processedData: ProcessedCrosswordData
): Map<string, number> {
  const cellNumbers = new Map<string, number>();
  let currentNumber = 1;

  // Collect all word-starting positions
  const startingPositions: { row: number; col: number; key: string }[] = [];

  // Add across word starting positions
  processedData.acrossWords.forEach((word) => {
    const key = `${word.startRow}-${word.startCol}`;
    startingPositions.push({ row: word.startRow, col: word.startCol, key });
  });

  // Add down word starting positions
  processedData.downWords.forEach((word) => {
    const key = `${word.startRow}-${word.startCol}`;
    startingPositions.push({ row: word.startRow, col: word.startCol, key });
  });

  // Sort by row first, then by column (top-left to bottom-right)
  startingPositions.sort((a, b) => {
    if (a.row !== b.row) {
      return a.row - b.row;
    }
    return a.col - b.col;
  });

  // Assign sequential numbers, skipping duplicates
  const seenKeys = new Set<string>();
  startingPositions.forEach(({ key }) => {
    if (!seenKeys.has(key)) {
      cellNumbers.set(key, currentNumber++);
      seenKeys.add(key);
    }
  });

  return cellNumbers;
}

/**
 * Creates word states from processed data
 */
function createWordStates(processedData: ProcessedCrosswordData): WordState[] {
  const words: WordState[] = [];

  // Create the sequential numbering map
  const cellNumbers = createSequentialNumbering(processedData);

  // Process across words first (left to right, top to bottom)
  processedData.acrossWords.forEach((word) => {
    const cells = getWordCellPositions(word);
    const cellKey = `${word.startRow}-${word.startCol}`;
    const wordNumber = cellNumbers.get(cellKey)!;

    words.push(
      createInitialWordState(
        wordNumber,
        "across",
        word.clue,
        word.answer,
        cells
      )
    );
  });

  // Process down words (top to bottom, left to right)
  processedData.downWords.forEach((word) => {
    const cells = getWordCellPositions(word);
    const cellKey = `${word.startRow}-${word.startCol}`;
    const wordNumber = cellNumbers.get(cellKey)!;

    words.push(
      createInitialWordState(wordNumber, "down", word.clue, word.answer, cells)
    );
  });

  return words;
}

/**
 * Gets cell positions for a word
 */
function getWordCellPositions(word: any): { row: number; col: number }[] {
  const cells: { row: number; col: number }[] = [];

  if (word.direction === "across") {
    for (let col = word.startCol; col < word.startCol + word.length; col++) {
      cells.push({ row: word.startRow, col });
    }
  } else {
    for (let row = word.startRow; row < word.startRow + word.length; row++) {
      cells.push({ row, col: word.startCol });
    }
  }

  return cells;
}

/**
 * Updates word states based on current cell states
 */
export function updateWordStates(
  cells: CellState[][],
  words: WordState[]
): WordState[] {
  return words.map((word) => {
    const userAnswer = word.cells
      .map(({ row, col }) => cells[row][col].letter)
      .join("");

    const isComplete = userAnswer.length === word.answer.length;
    const isCorrect = userAnswer.toLowerCase() === word.answer.toLowerCase();

    return {
      ...word,
      userAnswer,
      isComplete,
      isCorrect,
    };
  });
}

/**
 * Updates cell highlighting based on selected cell
 */
export function updateCellHighlighting(
  cells: CellState[][],
  selectedCell: { row: number; col: number } | null,
  direction: "across" | "down"
): CellState[][] {
  // Reset all highlighting
  const updatedCells = cells.map((row) =>
    row.map((cell) => ({ ...cell, isHighlighted: false }))
  );

  if (!selectedCell) return updatedCells;

  const { row, col } = selectedCell;
  const cell = updatedCells[row][col];

  if (cell.isBlocked) return updatedCells;

  // Highlight cells in the same word
  const wordNum =
    direction === "across" ? cell.acrossWordNum : cell.downWordNum;
  if (wordNum !== undefined) {
    updatedCells.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellWordNum =
          direction === "across" ? cell.acrossWordNum : cell.downWordNum;
        if (cellWordNum === wordNum) {
          updatedCells[rowIndex][colIndex].isHighlighted = true;
        }
      });
    });
  }

  return updatedCells;
}
