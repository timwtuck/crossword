import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Controls } from "../Controls";
import type { WordState } from "../../utils/stateTypes";

// Mock word data
const mockWords: WordState[] = [
  {
    number: 1,
    direction: "across",
    clue: "Test clue 1",
    answer: "TEST",
    userAnswer: "TE", // Started but not complete
    isComplete: false,
    isCorrect: false,
    cells: [],
  },
  {
    number: 2,
    direction: "down",
    clue: "Test clue 2",
    answer: "WORD",
    userAnswer: "", // Not started
    isComplete: false,
    isCorrect: false,
    cells: [],
  },
  {
    number: 3,
    direction: "across",
    clue: "Test clue 3",
    answer: "DONE",
    userAnswer: "DONE", // Complete
    isComplete: true,
    isCorrect: true,
    cells: [],
  },
];

describe("Controls Component - Updated Progress", () => {
  const mockOnToggleAnswers = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows progress based on completed words, not correct words", () => {
    render(
      <Controls
        showAnswers={false}
        onToggleAnswers={mockOnToggleAnswers}
        words={mockWords}
      />
    );

    // Should show 1/3 words completed (33%) instead of 1/3 correct
    expect(
      screen.getByText("Progress: 1/3 words completed (33%)")
    ).toBeInTheDocument();
  });

  it("shows 0% when no words are completed", () => {
    const emptyWords: WordState[] = mockWords.map((word) => ({
      ...word,
      userAnswer: "",
      isComplete: false,
    }));

    render(
      <Controls
        showAnswers={false}
        onToggleAnswers={mockOnToggleAnswers}
        words={emptyWords}
      />
    );

    expect(
      screen.getByText("Progress: 0/3 words completed (0%)")
    ).toBeInTheDocument();
  });

  it("shows 100% when all words are completed", () => {
    const allCompletedWords: WordState[] = mockWords.map((word) => ({
      ...word,
      userAnswer: word.answer, // Complete word
      isComplete: true,
    }));

    render(
      <Controls
        showAnswers={false}
        onToggleAnswers={mockOnToggleAnswers}
        words={allCompletedWords}
      />
    );

    expect(
      screen.getByText("Progress: 3/3 words completed (100%)")
    ).toBeInTheDocument();
  });

  it("handles empty words array", () => {
    render(
      <Controls
        showAnswers={false}
        onToggleAnswers={mockOnToggleAnswers}
        words={[]}
      />
    );

    expect(
      screen.getByText("Progress: 0/0 words completed (0%)")
    ).toBeInTheDocument();
  });

  it("still shows toggle answers button", () => {
    render(
      <Controls
        showAnswers={false}
        onToggleAnswers={mockOnToggleAnswers}
        words={mockWords}
      />
    );

    expect(screen.getByText("SHOW ANSWERS")).toBeInTheDocument();
  });
});
