import type { Word } from "./types";

/**
 * Creates a word object with the specified properties
 */
export function createWord(
  startRow: number,
  startCol: number,
  direction: "across" | "down",
  length: number,
  clue: string = "",
  answer: string = ""
): Word {
  return {
    startRow,
    startCol,
    direction,
    length,
    clue,
    answer,
  };
}

/**
 * Creates a word object without clue and answer (for detection phase)
 */
export function createWordTemplate(
  startRow: number,
  startCol: number,
  direction: "across" | "down",
  length: number
): Omit<Word, "clue" | "answer"> {
  return {
    startRow,
    startCol,
    direction,
    length,
  };
}
