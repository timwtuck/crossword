import React from "react";

interface InstructionsProps {
  currentDirection: "across" | "down";
}

export const Instructions: React.FC<InstructionsProps> = ({
  currentDirection,
}) => {
  return (
    <div className="instructions">
      <p>
        Click on a cell to select it, then type letters. Use arrow keys to
        navigate.
      </p>
      <p>Press Tab to switch between Across and Down directions.</p>
      <p className="current-direction">
        Current direction: <strong>{currentDirection.toUpperCase()}</strong>
      </p>
    </div>
  );
};
