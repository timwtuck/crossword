import { describe, it, expect } from "vitest";
import { createCrosswordState } from "../stateManager";
import { createSampleCrossword, processCrosswordData } from "../crossword";

describe("State Manager", () => {
  describe("Sequential Numbering", () => {
    it("should number words sequentially from top-left to bottom-right", () => {
      const crosswordData = createSampleCrossword();
      const processedData = processCrosswordData(crosswordData);
      const state = createCrosswordState(crosswordData, processedData);

      // Check that words are numbered sequentially
      const acrossWords = state.words.filter((w) => w.direction === "across");
      const downWords = state.words.filter((w) => w.direction === "down");

      // Across words should be numbered 1, 2, 3...
      acrossWords.forEach((word, index) => {
        expect(word.number).toBe(index + 1);
      });

      // Down words should continue the sequence
      const totalWords = acrossWords.length + downWords.length;
      const allNumbers = state.words.map((w) => w.number).sort((a, b) => a - b);

      // Should be sequential from 1 to totalWords
      for (let i = 0; i < totalWords; i++) {
        expect(allNumbers[i]).toBe(i + 1);
      }
    });

    it("should assign same number to shared cell words", () => {
      const crosswordData = createSampleCrossword();
      const processedData = processCrosswordData(crosswordData);
      const state = createCrosswordState(crosswordData, processedData);

      // Find words that share the same starting cell
      const cellMap = new Map<string, WordState[]>();

      state.words.forEach((word) => {
        const startCell = word.cells[0];
        const cellKey = `${startCell.row}-${startCell.col}`;

        if (!cellMap.has(cellKey)) {
          cellMap.set(cellKey, []);
        }
        cellMap.get(cellKey)!.push(word);
      });

      // Words sharing the same cell should have the same number
      cellMap.forEach((words) => {
        if (words.length > 1) {
          const firstNumber = words[0].number;
          words.forEach((word) => {
            expect(word.number).toBe(firstNumber);
          });
        }
      });
    });

    it("should create proper cell states with correct numbering", () => {
      const crosswordData = createSampleCrossword();
      const processedData = processCrosswordData(crosswordData);
      const state = createCrosswordState(crosswordData, processedData);

      // Check that numbered cells exist (only on starting cells)
      const numberedCells = state.cells
        .flat()
        .filter((cell) => cell.showNumber);
      expect(numberedCells.length).toBeGreaterThan(0);

      // Check that we have numbered cells (should be at least the number of unique starting positions)
      const uniqueStartingPositions = new Set(
        state.words.map((word) => `${word.cells[0].row}-${word.cells[0].col}`)
      );
      expect(numberedCells.length).toBe(uniqueStartingPositions.size);
    });
  });
});
