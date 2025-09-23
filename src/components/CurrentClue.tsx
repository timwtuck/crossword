import React from "react";
import type { WordState } from "../utils/stateTypes";

interface CurrentClueProps {
  selectedCell: { row: number; col: number } | null;
  currentDirection: "across" | "down";
  words: WordState[];
  onRevealAnswer: (wordNumber: number, direction: "across" | "down") => void;
}

export const CurrentClue: React.FC<CurrentClueProps> = ({
  selectedCell,
  currentDirection,
  words,
  onRevealAnswer,
}) => {
  // Find the current word based on selected cell and direction
  const currentWord = selectedCell
    ? words.find((word) => {
        return (
          word.direction === currentDirection &&
          word.cells.some(
            (cell) =>
              cell.row === selectedCell.row && cell.col === selectedCell.col
          )
        );
      })
    : null;

  if (!currentWord) {
    return (
      <div className="current-clue">
        <div className="current-clue-content">
          <p className="no-clue-message">Click on a cell to see the clue</p>
        </div>
      </div>
    );
  }

  const isWordComplete =
    currentWord.userAnswer.length === currentWord.answer.length;
  const isWordCorrect = currentWord.isCorrect;

  return (
    <div className="current-clue">
      <div className="current-clue-content">
        <div className="clue-header">
          <span className="clue-number">
            {currentWord.number} {currentWord.direction.toUpperCase()}
          </span>
          <span className="clue-length">
            ({currentWord.answer.length} letters)
          </span>
        </div>
        <div className="clue-text">{currentWord.clue}</div>
        <div className="clue-actions">
          <button
            className="reveal-answer-btn"
            onClick={() =>
              onRevealAnswer(currentWord.number, currentWord.direction)
            }
            disabled={isWordComplete && isWordCorrect}
          >
            {isWordComplete && isWordCorrect ? "✓ Complete" : "Reveal Answer"}
          </button>
        </div>
      </div>
    </div>
  );
};
