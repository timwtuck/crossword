import React from "react";
import { CrosswordCell } from "./CrosswordCell";
import type { CellState, CrosswordState } from "../utils/stateTypes";

interface CrosswordGridProps {
  cells: CellState[][];
  selectedCell: { row: number; col: number } | null;
  showAnswers: boolean;
  onCellClick: (row: number, col: number) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const CrosswordGrid: React.FC<CrosswordGridProps> = ({
  cells,
  selectedCell,
  showAnswers,
  onCellClick,
  onKeyDown,
}) => {
  return (
    <div className="crossword-grid" onKeyDown={onKeyDown} tabIndex={0}>
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
