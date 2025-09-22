import React from "react";
import type { CellState } from "../utils/stateTypes";

interface CrosswordCellProps {
  cell: CellState;
  rowIndex: number;
  colIndex: number;
  isSelected: boolean;
  isHighlighted: boolean;
  showAnswers: boolean;
  onClick: (row: number, col: number) => void;
}

export const CrosswordCell: React.FC<CrosswordCellProps> = ({
  cell,
  rowIndex,
  colIndex,
  isSelected,
  isHighlighted,
  showAnswers,
  onClick,
}) => {
  const handleClick = () => {
    if (!cell.isBlocked) {
      onClick(rowIndex, colIndex);
    }
  };

  return (
    <div
      className={`crossword-cell ${cell.isBlocked ? "blocked" : ""} ${
        isSelected ? "selected current" : ""
      } ${isHighlighted ? "highlighted" : ""}`}
      onClick={handleClick}
    >
      {cell.showNumber && (
        <span className="cell-number">{cell.numberValue}</span>
      )}
      <span className="cell-letter">
        {showAnswers ? cell.answer.toUpperCase() : cell.letter}
      </span>
    </div>
  );
};
