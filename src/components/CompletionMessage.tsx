import React from "react";

interface CompletionMessageProps {
  isComplete: boolean;
}

export const CompletionMessage: React.FC<CompletionMessageProps> = ({
  isComplete,
}) => {
  if (!isComplete) return null;

  return (
    <div className="completion-message">
      🎉 Congratulations! You've completed the crossword!
    </div>
  );
};
