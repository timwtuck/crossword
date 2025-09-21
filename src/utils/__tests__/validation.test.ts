import { describe, it, expect } from "vitest";
import { validateCrosswordData, getErrorMessage } from "../validation";
import type { CrosswordData } from "../types";

describe("Crossword Validation", () => {
  describe("validateCrosswordData", () => {
    it("should validate a correct crossword", () => {
      const validCrossword: CrosswordData = {
        grid: [
          ["a", "b", "c"],
          ["d", "e", "f"],
          ["g", "h", "i"],
        ],
        clues: {
          across: ["clue 1", "clue 2"],
          down: ["clue 3", "clue 4"],
        },
      };

      const result = validateCrosswordData(validCrossword);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect inconsistent row lengths", () => {
      const invalidCrossword: CrosswordData = {
        grid: [
          ["a", "b", "c"],
          ["d", "e"], // Wrong length
          ["g", "h", "i"],
        ],
        clues: {
          across: ["clue 1"],
          down: ["clue 2"],
        },
      };

      const result = validateCrosswordData(invalidCrossword);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);

      const error = result.errors[0];
      expect(error.type).toBe("grid_consistency");
      expect(error.details?.inconsistentRows).toEqual([1]);
      expect(error.details?.expectedLength).toBe(3);
    });

    it("should detect empty cells", () => {
      const invalidCrossword: CrosswordData = {
        grid: [
          ["a", "b", "c"],
          ["d", "", "f"], // Empty cell
          ["g", "h", "i"],
        ],
        clues: {
          across: ["clue 1"],
          down: ["clue 2"],
        },
      };

      const result = validateCrosswordData(invalidCrossword);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);

      const error = result.errors[0];
      expect(error.type).toBe("empty_cell");
      expect(error.details?.row).toBe(1);
      expect(error.details?.col).toBe(1);
    });

    it("should detect multiple empty cells", () => {
      const invalidCrossword: CrosswordData = {
        grid: [
          ["a", "", "c"],
          ["d", "e", ""],
          ["", "h", "i"],
        ],
        clues: {
          across: ["clue 1"],
          down: ["clue 2"],
        },
      };

      const result = validateCrosswordData(invalidCrossword);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);

      const emptyCellErrors = result.errors.filter(
        (e) => e.type === "empty_cell"
      );
      expect(emptyCellErrors).toHaveLength(3);
    });

    it("should detect empty grid", () => {
      const invalidCrossword: CrosswordData = {
        grid: [],
        clues: {
          across: [],
          down: [],
        },
      };

      const result = validateCrosswordData(invalidCrossword);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(1);

      const gridError = result.errors.find(e => e.type === "grid_consistency");
      expect(gridError).toBeDefined();
      expect(gridError?.message).toBe("Grid is empty");
    });

    it("should detect missing across clues", () => {
      const invalidCrossword: CrosswordData = {
        grid: [
          ["a", "b", "c"],
          ["d", "e", "f"],
          ["g", "h", "i"],
        ],
        clues: {
          across: [], // No across clues
          down: ["clue 1"],
        },
      };

      const result = validateCrosswordData(invalidCrossword);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);

      const error = result.errors[0];
      expect(error.type).toBe("clue_count");
      expect(error.message).toBe("No across clues provided");
    });

    it("should detect missing down clues", () => {
      const invalidCrossword: CrosswordData = {
        grid: [
          ["a", "b", "c"],
          ["d", "e", "f"],
          ["g", "h", "i"],
        ],
        clues: {
          across: ["clue 1"],
          down: [], // No down clues
        },
      };

      const result = validateCrosswordData(invalidCrossword);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);

      const error = result.errors[0];
      expect(error.type).toBe("clue_count");
      expect(error.message).toBe("No down clues provided");
    });

    it("should detect multiple types of errors", () => {
      const invalidCrossword: CrosswordData = {
        grid: [
          ["a", "b"],
          ["d", "", "f"], // Wrong length and empty cell
          ["g", "h"],
        ],
        clues: {
          across: [], // No across clues
          down: [],
        },
      };

      const result = validateCrosswordData(invalidCrossword);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);

      const errorTypes = result.errors.map((e) => e.type);
      expect(errorTypes).toContain("grid_consistency");
      expect(errorTypes).toContain("empty_cell");
      expect(errorTypes).toContain("clue_count");
    });
  });

  describe("getErrorMessage", () => {
    it("should format grid consistency error", () => {
      const error = {
        type: "grid_consistency" as const,
        message: "Grid rows have inconsistent lengths",
        details: { expectedLength: 3, inconsistentRows: [1] },
      };

      expect(getErrorMessage(error)).toBe(
        "Grid Error: Grid rows have inconsistent lengths"
      );
    });

    it("should format empty cell error", () => {
      const error = {
        type: "empty_cell" as const,
        message: "Empty cell found at position (1, 2)",
        details: { row: 1, col: 2 },
      };

      expect(getErrorMessage(error)).toBe(
        "Empty Cell: Empty cell found at position (1, 2)"
      );
    });

    it("should format clue count error", () => {
      const error = {
        type: "clue_count" as const,
        message: "No across clues provided",
        details: { acrossClueCount: 0 },
      };

      expect(getErrorMessage(error)).toBe(
        "Clue Count: No across clues provided"
      );
    });
  });
});
