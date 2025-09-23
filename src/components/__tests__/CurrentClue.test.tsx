import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { CurrentClue } from "../CurrentClue";
import type { WordState } from "../../utils/stateTypes";

// Mock word data
const mockWords: WordState[] = [
  {
    number: 1,
    direction: "across",
    clue: "Test clue for word 1",
    answer: "TEST",
    userAnswer: "TE",
    isComplete: false,
    isCorrect: false,
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
    ],
  },
  {
    number: 2,
    direction: "down",
    clue: "Test clue for word 2",
    answer: "WORD",
    userAnswer: "WO",
    isComplete: false,
    isCorrect: false,
    cells: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 3, col: 0 },
    ],
  },
];

describe("CurrentClue Component", () => {
  const mockOnRevealAnswer = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows no clue message when no cell is selected", () => {
    render(
      <CurrentClue
        selectedCell={null}
        currentDirection="across"
        words={mockWords}
        onRevealAnswer={mockOnRevealAnswer}
      />
    );

    expect(
      screen.getByText("Click on a cell to see the clue")
    ).toBeInTheDocument();
  });

  it("displays current clue when cell is selected", () => {
    render(
      <CurrentClue
        selectedCell={{ row: 0, col: 0 }}
        currentDirection="across"
        words={mockWords}
        onRevealAnswer={mockOnRevealAnswer}
      />
    );

    expect(screen.getByText("1 ACROSS")).toBeInTheDocument();
    expect(screen.getByText("(4 letters)")).toBeInTheDocument();
    expect(screen.getByText("Test clue for word 1")).toBeInTheDocument();
    expect(screen.getByText("Reveal Answer")).toBeInTheDocument();
  });

  it("displays down clue when direction is down", () => {
    render(
      <CurrentClue
        selectedCell={{ row: 0, col: 0 }}
        currentDirection="down"
        words={mockWords}
        onRevealAnswer={mockOnRevealAnswer}
      />
    );

    expect(screen.getByText("2 DOWN")).toBeInTheDocument();
    expect(screen.getByText("(4 letters)")).toBeInTheDocument();
    expect(screen.getByText("Test clue for word 2")).toBeInTheDocument();
  });

  it("calls onRevealAnswer when reveal button is clicked", () => {
    render(
      <CurrentClue
        selectedCell={{ row: 0, col: 0 }}
        currentDirection="across"
        words={mockWords}
        onRevealAnswer={mockOnRevealAnswer}
      />
    );

    const revealButton = screen.getByText("Reveal Answer");
    fireEvent.click(revealButton);

    expect(mockOnRevealAnswer).toHaveBeenCalledWith(1, "across");
  });

  it("shows complete status when word is complete and correct", () => {
    const completeWords: WordState[] = [
      {
        ...mockWords[0],
        userAnswer: "TEST",
        isComplete: true,
        isCorrect: true,
      },
    ];

    render(
      <CurrentClue
        selectedCell={{ row: 0, col: 0 }}
        currentDirection="across"
        words={completeWords}
        onRevealAnswer={mockOnRevealAnswer}
      />
    );

    expect(screen.getByText("✓ Complete")).toBeInTheDocument();
    expect(screen.queryByText("Reveal Answer")).not.toBeInTheDocument();
  });

  it("disables reveal button when word is complete and correct", () => {
    const completeWords: WordState[] = [
      {
        ...mockWords[0],
        userAnswer: "TEST",
        isComplete: true,
        isCorrect: true,
      },
    ];

    render(
      <CurrentClue
        selectedCell={{ row: 0, col: 0 }}
        currentDirection="across"
        words={completeWords}
        onRevealAnswer={mockOnRevealAnswer}
      />
    );

    const button = screen.getByText("✓ Complete");
    expect(button).toBeDisabled();
  });
});
