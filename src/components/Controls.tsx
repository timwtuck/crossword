import React from "react";
import type { WordState } from "../utils/stateTypes";

interface ControlsProps {
  showAnswers: boolean;
  onToggleAnswers: () => void;
  words: WordState[];
}

export const Controls: React.FC<ControlsProps> = ({
  showAnswers,
  onToggleAnswers,
  words,
}) => {
  const correctWords = words.filter((w) => w.isCorrect).length;
  const totalWords = words.length;

  return (
    <div className="controls">
      <button onClick={onToggleAnswers} className="toggle-answers-btn">
        {showAnswers ? "HIDE" : "SHOW"} ANSWERS
      </button>
      <div className="progress">
        Progress: {correctWords}/{totalWords} words correct
      </div>
    </div>
  );
};
