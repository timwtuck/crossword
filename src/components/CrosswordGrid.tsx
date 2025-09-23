import React, { useRef, useEffect } from "react";
import { CrosswordCell } from "./CrosswordCell";
import type { CellState } from "../utils/stateTypes";

interface CrosswordGridProps {
  cells: CellState[][];
  selectedCell: { row: number; col: number } | null;
  showAnswers: boolean;
  onCellClick: (row: number, col: number) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

/**
 * CrosswordGrid component with mobile keyboard support
 *
 * Features:
 * - Hidden input field that receives focus on mobile devices to trigger virtual keyboard
 * - Automatic focus management when cells are selected
 * - Touch-friendly interaction improvements
 * - Maintains existing keyboard navigation for desktop
 */
export const CrosswordGrid: React.FC<CrosswordGridProps> = ({
  cells,
  selectedCell,
  showAnswers,
  onCellClick,
  onKeyDown,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when a cell is selected (for mobile keyboard)
  useEffect(() => {
    if (selectedCell && inputRef.current) {
      // Small delay to ensure the cell click handler has finished
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [selectedCell]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent the input from showing the typed character
    e.target.value = "";
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Convert input event to the same format as the grid keydown
    onKeyDown(e as any);
  };

  const handleInputBlur = () => {
    // Refocus the input if a cell is still selected (for mobile)
    if (selectedCell && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  return (
    <div className="crossword-grid" onKeyDown={onKeyDown} tabIndex={0}>
      {/* Hidden input for mobile keyboard support */}
      <input
        ref={inputRef}
        type="text"
        className="mobile-input"
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onBlur={handleInputBlur}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        inputMode="text"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
      {cells.map((row, rowIndex) => (
        <div key={rowIndex} className="crossword-row">
          {row.map((cell, colIndex) => (
            <CrosswordCell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              rowIndex={rowIndex}
              colIndex={colIndex}
              isSelected={
                selectedCell?.row === rowIndex && selectedCell?.col === colIndex
              }
              isHighlighted={cell.isHighlighted}
              showAnswers={showAnswers}
              onClick={onCellClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
