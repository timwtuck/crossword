import { createWord } from "./wordFactory";
import type { Word } from "./types";

/**
 * Extracts the actual word answers from the grid
 * @param grid - The crossword grid
 * @param words - Array of word positions
 * @returns Array of words with their answers extracted from the grid
 */
export function extractAnswers(
  grid: string[][],
  words: Omit<Word, "clue" | "answer">[]
): Word[] {
  return words.map((word) => {
    const answer = extractWordFromGrid(grid, word);
    return createWord(
      word.startRow,
      word.startCol,
      word.direction,
      word.length,
      "", // Will be filled by the caller
      answer.toLowerCase()
    );
  });
}

/**
 * Extracts a single word from the grid
 */
function extractWordFromGrid(
  grid: string[][],
  word: Omit<Word, "clue" | "answer">
): string {
  let answer = "";

  if (word.direction === "across") {
    // Extract across word (left to right)
    for (let col = word.startCol; col < word.startCol + word.length; col++) {
      answer += grid[word.startRow][col];
    }
  } else {
    // Extract down word (top to bottom)
    for (let row = word.startRow; row < word.startRow + word.length; row++) {
      answer += grid[row][word.startCol];
    }
  }

  return answer;
}
