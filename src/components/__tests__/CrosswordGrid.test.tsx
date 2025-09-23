import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CrosswordGrid } from "../CrosswordGrid";
import type { CellState } from "../../utils/stateTypes";

// Mock cell data
const mockCells: CellState[][] = [
  [
    {
      letter: "",
      answer: "A",
      isBlocked: false,
      showNumber: true,
      numberValue: 1,
      acrossWordNum: 1,
      downWordNum: undefined,
      isHighlighted: false,
      isSelected: false,
    },
    {
      letter: "",
      answer: "B",
      isBlocked: false,
      showNumber: false,
      numberValue: undefined,
      acrossWordNum: 1,
      downWordNum: undefined,
      isHighlighted: false,
      isSelected: false,
    },
  ],
];

describe("CrosswordGrid Mobile Keyboard Support", () => {
  const mockOnCellClick = vi.fn();
  const mockOnKeyDown = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders hidden input for mobile keyboard support", () => {
    render(
      <CrosswordGrid
        cells={mockCells}
        selectedCell={null}
        showAnswers={false}
        onCellClick={mockOnCellClick}
        onKeyDown={mockOnKeyDown}
      />
    );

    const mobileInput = screen.getByRole("textbox");
    expect(mobileInput).toBeInTheDocument();
    expect(mobileInput).toHaveClass("mobile-input");
    expect(mobileInput).toHaveAttribute("type", "text");
    expect(mobileInput).toHaveAttribute("autoComplete", "off");
    expect(mobileInput).toHaveAttribute("autoCorrect", "off");
    expect(mobileInput).toHaveAttribute("autoCapitalize", "off");
    expect(mobileInput).toHaveAttribute("spellCheck", "false");
    expect(mobileInput).toHaveAttribute("inputMode", "text");
  });

  it("focuses input when cell is selected", () => {
    const { rerender } = render(
      <CrosswordGrid
        cells={mockCells}
        selectedCell={null}
        showAnswers={false}
        onCellClick={mockOnCellClick}
        onKeyDown={mockOnKeyDown}
      />
    );

    const mobileInput = screen.getByRole("textbox") as HTMLInputElement;

    // Initially not focused
    expect(document.activeElement).not.toBe(mobileInput);

    // Select a cell
    rerender(
      <CrosswordGrid
        cells={mockCells}
        selectedCell={{ row: 0, col: 0 }}
        showAnswers={false}
        onCellClick={mockOnCellClick}
        onKeyDown={mockOnKeyDown}
      />
    );

    // Input should be focused after a short delay
    setTimeout(() => {
      expect(document.activeElement).toBe(mobileInput);
    }, 150);
  });

  it("handles input keydown events", () => {
    render(
      <CrosswordGrid
        cells={mockCells}
        selectedCell={{ row: 0, col: 0 }}
        showAnswers={false}
        onCellClick={mockOnCellClick}
        onKeyDown={mockOnKeyDown}
      />
    );

    const mobileInput = screen.getByRole("textbox");

    fireEvent.keyDown(mobileInput, { key: "A" });
    expect(mockOnKeyDown).toHaveBeenCalledWith(
      expect.objectContaining({ key: "A" })
    );
  });

  it("clears input value on change", () => {
    render(
      <CrosswordGrid
        cells={mockCells}
        selectedCell={{ row: 0, col: 0 }}
        showAnswers={false}
        onCellClick={mockOnCellClick}
        onKeyDown={mockOnKeyDown}
      />
    );

    const mobileInput = screen.getByRole("textbox") as HTMLInputElement;

    // Simulate typing
    fireEvent.change(mobileInput, { target: { value: "A" } });

    // Value should be cleared
    expect(mobileInput.value).toBe("");
  });

  it("refocuses input on blur if cell is still selected", () => {
    render(
      <CrosswordGrid
        cells={mockCells}
        selectedCell={{ row: 0, col: 0 }}
        showAnswers={false}
        onCellClick={mockOnCellClick}
        onKeyDown={mockOnKeyDown}
      />
    );

    const mobileInput = screen.getByRole("textbox") as HTMLInputElement;

    // Simulate blur
    fireEvent.blur(mobileInput);

    // Should refocus after a short delay
    setTimeout(() => {
      expect(document.activeElement).toBe(mobileInput);
    }, 100);
  });
});
