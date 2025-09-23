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
  // Count words that have been started (have at least one letter filled)
  const startedWords = words.filter((w) => w.userAnswer.length > 0).length;
  const totalWords = words.length;

  // Calculate completion percentage
  const completionPercentage =
    totalWords > 0 ? Math.round((startedWords / totalWords) * 100) : 0;

  return (
    <div className="controls">
      <button onClick={onToggleAnswers} className="toggle-answers-btn">
        {showAnswers ? "HIDE" : "SHOW"} ANSWERS
      </button>
      <div className="progress">
        Progress: {startedWords}/{totalWords} words started (
        {completionPercentage}%)
      </div>
    </div>
  );
};
