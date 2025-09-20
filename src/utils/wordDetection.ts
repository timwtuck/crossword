import { createWordTemplate } from "./wordFactory";
import type { Word } from "./types";

/**
 * Detects words from a crossword grid
 * @param grid - 2D array where '-' represents blocked cells and letters represent word cells
 * @returns Array of detected words with their positions and lengths
 */
export function detectWords(grid: string[][]): Omit<Word, "clue" | "answer">[] {
  const words: Omit<Word, "clue" | "answer">[] = [];
  const rows = grid.length;
  const cols = grid[0].length;

  // Detect across words (left to right)
  for (let row = 0; row < rows; row++) {
    const acrossWords = detectWordsInRow(grid, row, cols);
    words.push(...acrossWords);
  }

  // Detect down words (top to bottom)
  for (let col = 0; col < cols; col++) {
    const downWords = detectWordsInColumn(grid, col, rows);
    words.push(...downWords);
  }

  return words;
}

/**
 * Detects words in a specific row
 */
function detectWordsInRow(
  grid: string[][],
  row: number,
  cols: number
): Omit<Word, "clue" | "answer">[] {
  const words: Omit<Word, "clue" | "answer">[] = [];
  let wordStart = -1;

  for (let col = 0; col < cols; col++) {
    if (grid[row][col] !== "-") {
      if (wordStart === -1) {
        wordStart = col;
      }
    } else {
      if (wordStart !== -1) {
        // End of word
        const wordLength = col - wordStart;
        if (wordLength >= 2) {
          words.push(createWordTemplate(row, wordStart, "across", wordLength));
        }
        wordStart = -1;
      }
    }
  }

  // Check if word extends to end of row
  if (wordStart !== -1) {
    const wordLength = cols - wordStart;
    if (wordLength >= 2) {
      words.push(createWordTemplate(row, wordStart, "across", wordLength));
    }
  }

  return words;
}

/**
 * Detects words in a specific column
 */
function detectWordsInColumn(
  grid: string[][],
  col: number,
  rows: number
): Omit<Word, "clue" | "answer">[] {
  const words: Omit<Word, "clue" | "answer">[] = [];
  let wordStart = -1;

  for (let row = 0; row < rows; row++) {
    if (grid[row][col] !== "-") {
      if (wordStart === -1) {
        wordStart = row;
      }
    } else {
      if (wordStart !== -1) {
        // End of word
        const wordLength = row - wordStart;
        if (wordLength >= 2) {
          words.push(createWordTemplate(wordStart, col, "down", wordLength));
        }
        wordStart = -1;
      }
    }
  }

  // Check if word extends to end of column
  if (wordStart !== -1) {
    const wordLength = rows - wordStart;
    if (wordLength >= 2) {
      words.push(createWordTemplate(wordStart, col, "down", wordLength));
    }
  }

  return words;
}
