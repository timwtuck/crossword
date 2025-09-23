import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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

  it("shows revealed answer when reveal button is clicked", () => {
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

    expect(screen.getByText("TEST")).toBeInTheDocument();
    expect(screen.queryByText("Reveal Answer")).not.toBeInTheDocument();
  });

  it("hides answer when hide button is clicked", () => {
    render(
      <CurrentClue
        selectedCell={{ row: 0, col: 0 }}
        currentDirection="across"
        words={mockWords}
        onRevealAnswer={mockOnRevealAnswer}
      />
    );

    // First reveal the answer
    const revealButton = screen.getByText("Reveal Answer");
    fireEvent.click(revealButton);

    expect(screen.getByText("TEST")).toBeInTheDocument();

    // Then hide it by clicking the button again
    const hideButton = screen.getByText("TEST");
    fireEvent.click(hideButton);

    expect(screen.queryByText("TEST")).not.toBeInTheDocument();
    expect(screen.getByText("Reveal Answer")).toBeInTheDocument();
  });

  it("maintains separate reveal state for different clues", () => {
    const { rerender } = render(
      <CurrentClue
        selectedCell={{ row: 0, col: 0 }}
        currentDirection="across"
        words={mockWords}
        onRevealAnswer={mockOnRevealAnswer}
      />
    );

    // Reveal answer for across clue
    const revealButton = screen.getByText("Reveal Answer");
    fireEvent.click(revealButton);

    expect(screen.getByText("TEST")).toBeInTheDocument();

    // Switch to down clue
    rerender(
      <CurrentClue
        selectedCell={{ row: 0, col: 0 }}
        currentDirection="down"
        words={mockWords}
        onRevealAnswer={mockOnRevealAnswer}
      />
    );

    // Down clue should not have answer revealed
    expect(screen.queryByText("Answer: WORD")).not.toBeInTheDocument();
    expect(screen.getByText("Reveal Answer")).toBeInTheDocument();

    // Switch back to across clue
    rerender(
      <CurrentClue
        selectedCell={{ row: 0, col: 0 }}
        currentDirection="across"
        words={mockWords}
        onRevealAnswer={mockOnRevealAnswer}
      />
    );

    // Across clue should still have answer revealed
    expect(screen.getByText("TEST")).toBeInTheDocument();
  });
});
