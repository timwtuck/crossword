import React from "react";
import type { WordState } from "../utils/stateTypes";

interface CluesSectionProps {
  words: WordState[];
  selectedCell: { row: number; col: number } | null;
  currentDirection: "across" | "down";
  onClueClick: (wordNumber: number, direction: "across" | "down") => void;
}

export const CluesSection: React.FC<CluesSectionProps> = ({
  words,
  selectedCell,
  currentDirection,
  onClueClick,
}) => {
  const acrossWords = words
    .filter((word) => word.direction === "across")
    .sort((a, b) => a.number - b.number);

  const downWords = words
    .filter((word) => word.direction === "down")
    .sort((a, b) => a.number - b.number);

  const isWordActive = (word: WordState) => {
    return (
      selectedCell &&
      currentDirection === word.direction &&
      word.cells.some(
        (cell) => cell.row === selectedCell.row && cell.col === selectedCell.col
      )
    );
  };

  return (
    <div className="clues-section">
      <div className="clues-group">
        <h4>Across</h4>
        {acrossWords.map((word) => (
          <div
            key={`across-${word.number}`}
            className={`clue ${word.isCorrect ? "correct" : ""} ${
              isWordActive(word) ? "active" : ""
            }`}
            onClick={() => onClueClick(word.number, "across")}
          >
            <span className="clue-number">{word.number}.</span>
            <span className="clue-text">
              {word.clue}{" "}
              <span className="clue-length">({word.answer.length})</span>
            </span>
          </div>
        ))}
      </div>

      <div className="clues-group">
        <h4>Down</h4>
        {downWords.map((word) => (
          <div
            key={`down-${word.number}`}
            className={`clue ${word.isCorrect ? "correct" : ""} ${
              isWordActive(word) ? "active" : ""
            }`}
            onClick={() => onClueClick(word.number, "down")}
          >
            <span className="clue-number">{word.number}.</span>
            <span className="clue-text">
              {word.clue}{" "}
              <span className="clue-length">({word.answer.length})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
