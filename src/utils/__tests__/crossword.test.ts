import { describe, it, expect } from "vitest";
import {
  detectWords,
  extractAnswers,
  processCrosswordData,
  validateCrossword,
  createSampleCrossword,
  type CrosswordData,
} from "../crossword";

describe("detectWords", () => {
  it("should detect across words correctly", () => {
    const grid = [
      ["a", "b", "c", "-", "d"],
      ["-", "-", "-", "-", "-"],
      ["e", "f", "-", "g", "h"],
    ];

    const words = detectWords(grid);
    const acrossWords = words.filter((w) => w.direction === "across");

    expect(acrossWords).toHaveLength(3);
    expect(acrossWords[0]).toEqual({
      startRow: 0,
      startCol: 0,
      direction: "across",
      length: 3,
    });
    expect(acrossWords[1]).toEqual({
      startRow: 2,
      startCol: 0,
      direction: "across",
      length: 2,
    });
    expect(acrossWords[2]).toEqual({
      startRow: 2,
      startCol: 3,
      direction: "across",
      length: 2,
    });
  });

  it("should detect down words correctly", () => {
    const grid = [
      ["a", "-", "b"],
      ["c", "-", "d"],
      ["e", "-", "f"],
    ];

    const words = detectWords(grid);
    const downWords = words.filter((w) => w.direction === "down");

    expect(downWords).toHaveLength(2);
    expect(downWords[0]).toEqual({
      startRow: 0,
      startCol: 0,
      direction: "down",
      length: 3,
    });
    expect(downWords[1]).toEqual({
      startRow: 0,
      startCol: 2,
      direction: "down",
      length: 3,
    });
  });

  it("should not detect single letter words", () => {
    const grid = [
      ["a", "-", "b"],
      ["-", "-", "-"],
      ["c", "-", "d"],
    ];

    const words = detectWords(grid);
    expect(words).toHaveLength(0);
  });

  it("should handle edge cases with words at grid boundaries", () => {
    const grid = [
      ["a", "b", "c"],
      ["-", "-", "-"],
      ["d", "e", "f"],
    ];

    const words = detectWords(grid);
    expect(words).toHaveLength(2); // 2 across (no down words due to gaps)
  });
});

describe("extractAnswers", () => {
  it("should extract across answers correctly", () => {
    const grid = [
      ["h", "e", "l", "l", "o"],
      ["-", "-", "-", "-", "-"],
    ];
    const words = [
      {
        startRow: 0,
        startCol: 0,
        direction: "across" as const,
        length: 5,
      },
    ];

    const result = extractAnswers(grid, words);
    expect(result[0].answer).toBe("hello");
  });

  it("should extract down answers correctly", () => {
    const grid = [
      ["h", "-"],
      ["e", "-"],
      ["l", "-"],
      ["l", "-"],
      ["o", "-"],
    ];
    const words = [
      {
        startRow: 0,
        startCol: 0,
        direction: "down" as const,
        length: 5,
      },
    ];

    const result = extractAnswers(grid, words);
    expect(result[0].answer).toBe("hello");
  });

  it("should convert answers to lowercase", () => {
    const grid = [["H", "E", "L", "L", "O"]];
    const words = [
      {
        startRow: 0,
        startCol: 0,
        direction: "across" as const,
        length: 5,
      },
    ];

    const result = extractAnswers(grid, words);
    expect(result[0].answer).toBe("hello");
  });
});

describe("processCrosswordData", () => {
  it("should process crossword data correctly", () => {
    const crosswordData: CrosswordData = {
      grid: [
        ["a", "b", "-", "c"],
        ["-", "-", "-", "-"],
        ["d", "e", "f", "g"],
      ],
      clues: {
        across: ["First word", "Second word"],
        down: ["First down", "Second down"],
      },
    };

    const result = processCrosswordData(crosswordData);

    expect(result.words).toHaveLength(2);
    expect(result.acrossWords).toHaveLength(2);
    expect(result.downWords).toHaveLength(0);
    expect(result.cellGrid).toHaveLength(3);
    expect(result.cellGrid[0]).toHaveLength(4);
  });

  it("should assign clues to words in correct order", () => {
    const crosswordData: CrosswordData = {
      grid: [
        ["a", "b", "c"],
        ["-", "-", "-"],
        ["d", "e", "f"],
      ],
      clues: {
        across: ["ABC clue", "DEF clue"],
        down: ["AD clue", "BE clue", "CF clue"],
      },
    };

    const result = processCrosswordData(crosswordData);

    expect(result.acrossWords[0].clue).toBe("ABC clue");
    expect(result.acrossWords[1].clue).toBe("DEF clue");
    // No down words due to gaps in the middle row
    expect(result.downWords).toHaveLength(0);
  });
});

describe("validateCrossword", () => {
  it("should validate correct answers", () => {
    const crosswordData: CrosswordData = {
      grid: [
        ["h", "e", "l", "l", "o"],
        ["-", "-", "-", "-", "-"],
      ],
      clues: {
        across: ["Greeting"],
        down: [],
      },
    };

    const processedData = processCrosswordData(crosswordData);
    const userInput = [
      ["h", "e", "l", "l", "o"],
      ["", "", "", "", ""],
    ];

    const result = validateCrossword(userInput, processedData);

    expect(result.correctWords).toBe(1);
    expect(result.totalWords).toBe(1);
    expect(result.isComplete).toBe(true);
    expect(result.wordStatus[0].isCorrect).toBe(true);
  });

  it("should detect incorrect answers", () => {
    const crosswordData: CrosswordData = {
      grid: [
        ["h", "e", "l", "l", "o"],
        ["-", "-", "-", "-", "-"],
      ],
      clues: {
        across: ["Greeting"],
        down: [],
      },
    };

    const processedData = processCrosswordData(crosswordData);
    const userInput = [
      ["w", "o", "r", "l", "d"],
      ["", "", "", "", ""],
    ];

    const result = validateCrossword(userInput, processedData);

    expect(result.correctWords).toBe(0);
    expect(result.isComplete).toBe(true);
    expect(result.wordStatus[0].isCorrect).toBe(false);
  });

  it("should detect incomplete answers", () => {
    const crosswordData: CrosswordData = {
      grid: [
        ["h", "e", "l", "l", "o"],
        ["-", "-", "-", "-", "-"],
      ],
      clues: {
        across: ["Greeting"],
        down: [],
      },
    };

    const processedData = processCrosswordData(crosswordData);
    const userInput = [
      ["h", "e", "", "", ""],
      ["", "", "", "", ""],
    ];

    const result = validateCrossword(userInput, processedData);

    expect(result.correctWords).toBe(0);
    expect(result.isComplete).toBe(false);
    expect(result.wordStatus[0].isComplete).toBe(false);
  });
});

describe("Sample Crosswords", () => {
  describe("First sample crossword", () => {
    const crosswordData: CrosswordData = {
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

    it("should detect words correctly", () => {
      const words = detectWords(crosswordData.grid);
      const acrossWords = words.filter((w) => w.direction === "across");
      const downWords = words.filter((w) => w.direction === "down");

      expect(acrossWords).toHaveLength(3);
      expect(downWords).toHaveLength(3);
    });

    it("should extract correct answers", () => {
      const words = detectWords(crosswordData.grid);
      const wordsWithAnswers = extractAnswers(crosswordData.grid, words);

      const acrossWords = wordsWithAnswers.filter(
        (w) => w.direction === "across"
      );
      const downWords = wordsWithAnswers.filter((w) => w.direction === "down");

      expect(acrossWords[0].answer).toBe("play");
      expect(acrossWords[1].answer).toBe("isis");
      expect(acrossWords[2].answer).toBe("noon");

      expect(downWords[0].answer).toBe("print");
      expect(downWords[1].answer).toBe("inn");
      expect(downWords[2].answer).toBe("yes");
    });

    it("should process crossword data correctly", () => {
      const result = processCrosswordData(crosswordData);

      expect(result.acrossWords).toHaveLength(3);
      expect(result.downWords).toHaveLength(3);
      expect(result.acrossWords[0].clue).toBe("clue 1");
      expect(result.acrossWords[0].answer).toBe("play");
    });
  });

  describe("Second sample crossword", () => {
    const crosswordData: CrosswordData = {
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

    it("should detect words correctly", () => {
      const words = detectWords(crosswordData.grid);
      const acrossWords = words.filter((w) => w.direction === "across");
      const downWords = words.filter((w) => w.direction === "down");

      expect(acrossWords).toHaveLength(3);
      expect(downWords).toHaveLength(3);
    });

    it("should extract correct answers", () => {
      const words = detectWords(crosswordData.grid);
      const wordsWithAnswers = extractAnswers(crosswordData.grid, words);

      const acrossWords = wordsWithAnswers.filter(
        (w) => w.direction === "across"
      );
      const downWords = wordsWithAnswers.filter((w) => w.direction === "down");

      expect(acrossWords[0].answer).toBe("time");
      expect(acrossWords[1].answer).toBe("react");
      expect(acrossWords[2].answer).toBe("pal");

      expect(downWords[0].answer).toBe("take");
      expect(downWords[1].answer).toBe("all");
      expect(downWords[2].answer).toBe("easter");
    });
  });
});

describe("createSampleCrossword", () => {
  it("should create a valid crossword", () => {
    const crossword = createSampleCrossword();

    expect(crossword.grid).toBeDefined();
    expect(crossword.clues).toBeDefined();
    expect(crossword.clues.across).toBeDefined();
    expect(crossword.clues.down).toBeDefined();
  });

  it("should have correct structure", () => {
    const crossword = createSampleCrossword();

    expect(Array.isArray(crossword.grid)).toBe(true);
    expect(Array.isArray(crossword.clues.across)).toBe(true);
    expect(Array.isArray(crossword.clues.down)).toBe(true);
  });

  it("should process without errors", () => {
    const crossword = createSampleCrossword();
    const result = processCrosswordData(crossword);

    expect(result).toBeDefined();
    expect(result.words.length).toBeGreaterThan(0);
  });
});
