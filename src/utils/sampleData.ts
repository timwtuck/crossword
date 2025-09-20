import type { CrosswordData } from "./types";

/**
 * Creates a sample crossword for testing
 */
export function createSampleCrossword(): CrosswordData {
  return {
    grid: [
      ["-", "a", "-", "-", "s"],
      ["-", "p", "i", "n", "k"],
      ["-", "p", "-", "-", "i"],
      ["s", "l", "i", "m", "-"],
      ["-", "e", "-", "e", "-"],
    ],
    clues: {
      across: ["Color of sunset", "Thin"],
      down: ["Fruit that's red or green", "Winter sport", "Personal pronoun"],
    },
  };
}

/**
 * Creates additional sample crosswords for testing
 */
export function createSampleCrossword1(): CrosswordData {
  return {
    grid: [
      ["p", "l", "a", "y", "-", "-"],
      ["r", "-", "-", "e", "-", "-"],
      ["i", "s", "i", "s", "-", "-"],
      ["n", "-", "n", "-", "-", "-"],
      ["t", "-", "n", "o", "o", "n"],
    ],
    clues: {
      across: ["clue 1", "clue 2", "clue 3"],
      down: ["clue 4", "clue 5", "clue 6"],
    },
  };
}

export function createSampleCrossword2(): CrosswordData {
  return {
    grid: [
      ["-", "t", "i", "m", "e"],
      ["-", "a", "-", "-", "a"],
      ["-", "k", "-", "-", "s"],
      ["r", "e", "a", "c", "t"],
      ["-", "-", "l", "-", "e"],
      ["p", "a", "l", "-", "r"],
    ],
    clues: {
      across: ["clue 1", "clue 2", "clue 3"],
      down: ["clue 4", "clue 5", "clue 6"],
    },
  };
}
