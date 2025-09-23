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
  // Count words that are complete (regardless of correctness)
  const completedWords = words.filter((w) => w.isComplete).length;
  const totalWords = words.length;

  // Calculate completion percentage
  const completionPercentage =
    totalWords > 0 ? Math.round((completedWords / totalWords) * 100) : 0;

  return (
    <div className="controls">
      <button onClick={onToggleAnswers} className="toggle-answers-btn">
        {showAnswers ? "HIDE" : "SHOW"} ANSWERS
      </button>
      <div className="progress">
        Progress: {completedWords}/{totalWords} words completed (
        {completionPercentage}%)
      </div>
    </div>
  );
};
