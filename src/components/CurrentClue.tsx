import React, { useState } from "react";
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
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(
    new Set()
  );

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
          <div className="clue-header">
            <div className="clue-info">
              <span className="clue-number">No Clue</span>
            </div>
          </div>
          <div className="clue-text">Click on a cell to see the clue</div>
        </div>
      </div>
    );
  }

  const isWordComplete =
    currentWord.userAnswer.length === currentWord.answer.length;
  const isWordCorrect = currentWord.isCorrect;
  const wordKey = `${currentWord.number}-${currentWord.direction}`;
  const isAnswerRevealed = revealedAnswers.has(wordKey);

  const handleRevealAnswer = () => {
    if (isAnswerRevealed) {
      // Hide the answer
      setRevealedAnswers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(wordKey);
        return newSet;
      });
    } else {
      // Show the answer
      setRevealedAnswers((prev) => new Set(prev).add(wordKey));
      onRevealAnswer(currentWord.number, currentWord.direction);
    }
  };

  return (
    <div className="current-clue">
      <button
        className={`reveal-answer-btn ${isAnswerRevealed ? "revealed" : ""}`}
        onClick={handleRevealAnswer}
      >
        {isAnswerRevealed ? currentWord.answer : "Reveal Answer"}
      </button>
      <div className="current-clue-content">
        <div className="clue-header">
          <div className="clue-info">
            <span className="clue-number">
              {currentWord.number} {currentWord.direction.toUpperCase()}
            </span>
            <span className="clue-length">
              ({currentWord.answer.length} letters)
            </span>
          </div>
        </div>
        <div className="clue-text">{currentWord.clue}</div>
      </div>
    </div>
  );
};
