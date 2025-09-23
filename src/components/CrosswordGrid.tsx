import React, { useRef, useEffect } from "react";
import { CrosswordCell } from "./CrosswordCell";
import type { CellState } from "../utils/stateTypes";

interface CrosswordGridProps {
  cells: CellState[][];
  selectedCell: { row: number; col: number } | null;
  showAnswers: boolean;
  onCellClick: (row: number, col: number) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

/**
 * CrosswordGrid component with mobile keyboard support
 *
 * Features:
 * - Hidden input field that receives focus on mobile devices to trigger virtual keyboard
 * - Automatic focus management when cells are selected
 * - Touch-friendly interaction improvements
 * - Maintains existing keyboard navigation for desktop
 */
export const CrosswordGrid: React.FC<CrosswordGridProps> = ({
  cells,
  selectedCell,
  showAnswers,
  onCellClick,
  onKeyDown,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const processingInput = useRef(false);

  // Focus the input when a cell is selected (for mobile keyboard)
  useEffect(() => {
    if (selectedCell && inputRef.current) {
      // Small delay to ensure the cell click handler has finished
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [selectedCell]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (processingInput.current) return;

    const value = e.target.value;
    if (value.length > 0) {
      processingInput.current = true;

      // Get the last character typed
      const lastChar = value[value.length - 1].toUpperCase();

      // Create a simple synthetic keyboard event
      const syntheticEvent = {
        key: lastChar,
        code: `Key${lastChar}`,
        keyCode: lastChar.charCodeAt(0),
        which: lastChar.charCodeAt(0),
        charCode: lastChar.charCodeAt(0),
        altKey: false,
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        getModifierState: () => false,
        preventDefault: () => {},
        stopPropagation: () => {},
        target: e.target,
        currentTarget: e.target,
        type: "keydown",
        bubbles: true,
        cancelable: true,
        defaultPrevented: false,
        eventPhase: 2,
        isTrusted: false,
        nativeEvent: e.nativeEvent,
        timeStamp: Date.now(),
        detail: 0,
        view: null,
      } as any;

      // Forward the synthetic event to the key handler
      onKeyDown(syntheticEvent);

      // Clear the input after processing
      e.target.value = "";

      // Reset the flag after a short delay
      setTimeout(() => {
        processingInput.current = false;
      }, 10);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // For special keys (Enter, Backspace, Arrow keys, etc.), forward directly
    if (e.key.length > 1 || e.key === " ") {
      onKeyDown(e as any);
    } else if (!processingInput.current) {
      // For regular characters, prevent default to avoid double input
      // Only if we're not already processing input
      e.preventDefault();
    }
  };

  const handleInputBlur = () => {
    // Refocus the input if a cell is still selected (for mobile)
    if (selectedCell && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  return (
    <div className="crossword-grid" onKeyDown={onKeyDown} tabIndex={0}>
      {/* Hidden input for mobile keyboard support */}
      <input
        ref={inputRef}
        type="text"
        className="mobile-input"
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onBlur={handleInputBlur}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        autoSave="off"
        spellCheck="false"
        inputMode="text"
        data-lpignore="true"
        data-form-type="other"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
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
