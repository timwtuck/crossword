import { useState, useMemo } from "react";
import "./App.css";
import {
  processCrosswordData,
  createCrosswordState,
  updateWordStates,
  updateCellHighlighting,
  type CrosswordData,
  type ProcessedCrosswordData,
  type CrosswordState,
} from "./utils/crossword";
import { createSampleCrossword1 } from "./utils/sampleData";

function App() {
  // Sample 5x5 crossword data using your format
  const crosswordData: CrosswordData = createSampleCrossword1();

  // Process the crossword data using utility functions
  const processedData: ProcessedCrosswordData = useMemo(() => {
    return processCrosswordData(crosswordData);
  }, [crosswordData]);

  // Create crossword state
  const [crosswordState, setCrosswordState] = useState<CrosswordState>(() =>
    createCrosswordState(crosswordData, processedData)
  );

  // Update word states when cells change
  const updatedWords = useMemo(() => {
    return updateWordStates(crosswordState.cells, crosswordState.words);
  }, [crosswordState.cells, crosswordState.words]);

  // Update cell highlighting when selection changes
  const highlightedCells = useMemo(() => {
    return updateCellHighlighting(
      crosswordState.cells,
      crosswordState.selectedCell,
      crosswordState.currentDirection
    );
  }, [
    crosswordState.cells,
    crosswordState.selectedCell,
    crosswordState.currentDirection,
  ]);

  const handleCellClick = (row: number, col: number) => {
    const cell = crosswordState.cells[row][col];
    if (cell.isBlocked) return;

    const newSelectedCell = { row, col };
    let newDirection = crosswordState.currentDirection;

    // Toggle direction if clicking the same cell
    if (
      crosswordState.selectedCell?.row === row &&
      crosswordState.selectedCell?.col === col
    ) {
      newDirection =
        crosswordState.currentDirection === "across" ? "down" : "across";
    } else {
      // Set direction based on which direction is available
      if (cell.acrossWordNum !== undefined && cell.downWordNum !== undefined) {
        // Keep current direction
      } else if (cell.acrossWordNum !== undefined) {
        newDirection = "across";
      } else if (cell.downWordNum !== undefined) {
        newDirection = "down";
      }
    }

    setCrosswordState((prev) => ({
      ...prev,
      selectedCell: newSelectedCell,
      currentDirection: newDirection,
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!crosswordState.selectedCell) return;

    const { row, col } = crosswordState.selectedCell;

    if (e.key === "Backspace" || e.key === "Delete") {
      // If current cell has content, clear it
      if (crosswordState.cells[row][col].letter) {
        setCrosswordState((prev) => {
          const newCells = [...prev.cells];
          newCells[row][col] = { ...newCells[row][col], letter: "" };
          return { ...prev, cells: newCells };
        });
      } else {
        // If current cell is empty, move to previous cell and clear it
        moveToPreviousCell(row, col, crosswordState.currentDirection);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Toggle direction
      setCrosswordState((prev) => ({
        ...prev,
        currentDirection:
          prev.currentDirection === "across" ? "down" : "across",
      }));
    } else if (e.key.length === 1 && /[A-Za-z]/.test(e.key)) {
      // Add letter to cell
      setCrosswordState((prev) => {
        const newCells = [...prev.cells];
        newCells[row][col] = {
          ...newCells[row][col],
          letter: e.key.toUpperCase(),
        };
        return { ...prev, cells: newCells };
      });

      // Move to next cell in current direction
      moveToNextCell(row, col, crosswordState.currentDirection);
    } else if (
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight"
    ) {
      e.preventDefault();
      moveInDirection(e.key);
    }
  };

  const moveToNextCell = (row: number, col: number, dir: "across" | "down") => {
    const maxCol = crosswordState.cells[0].length;
    const maxRow = crosswordState.cells.length;

    if (dir === "across") {
      // Move right
      for (let c = col + 1; c < maxCol; c++) {
        if (!crosswordState.cells[row][c].isBlocked) {
          setCrosswordState((prev) => ({
            ...prev,
            selectedCell: { row, col: c },
          }));
          return;
        }
      }
    } else {
      // Move down
      for (let r = row + 1; r < maxRow; r++) {
        if (!crosswordState.cells[r][col].isBlocked) {
          setCrosswordState((prev) => ({
            ...prev,
            selectedCell: { row: r, col },
          }));
          return;
        }
      }
    }
  };

  const moveToPreviousCell = (
    row: number,
    col: number,
    dir: "across" | "down"
  ) => {
    const maxCol = crosswordState.cells[0].length;
    const maxRow = crosswordState.cells.length;

    if (dir === "across") {
      // Move left
      for (let c = col - 1; c >= 0; c--) {
        if (!crosswordState.cells[row][c].isBlocked) {
          setCrosswordState((prev) => {
            const newCells = [...prev.cells];
            newCells[row][c] = { ...newCells[row][c], letter: "" };
            return {
              ...prev,
              cells: newCells,
              selectedCell: { row, col: c },
            };
          });
          return;
        }
      }
    } else {
      // Move up
      for (let r = row - 1; r >= 0; r--) {
        if (!crosswordState.cells[r][col].isBlocked) {
          setCrosswordState((prev) => {
            const newCells = [...prev.cells];
            newCells[r][col] = { ...newCells[r][col], letter: "" };
            return {
              ...prev,
              cells: newCells,
              selectedCell: { row: r, col },
            };
          });
          return;
        }
      }
    }
  };

  const moveInDirection = (key: string) => {
    if (!crosswordState.selectedCell) return;

    let { row, col } = crosswordState.selectedCell;
    const maxCol = crosswordState.cells[0].length;
    const maxRow = crosswordState.cells.length;

    switch (key) {
      case "ArrowUp":
        for (let r = row - 1; r >= 0; r--) {
          if (!crosswordState.cells[r][col].isBlocked) {
            setCrosswordState((prev) => ({
              ...prev,
              selectedCell: { row: r, col },
              currentDirection: "down",
            }));
            return;
          }
        }
        break;
      case "ArrowDown":
        for (let r = row + 1; r < maxRow; r++) {
          if (!crosswordState.cells[r][col].isBlocked) {
            setCrosswordState((prev) => ({
              ...prev,
              selectedCell: { row: r, col },
              currentDirection: "down",
            }));
            return;
          }
        }
        break;
      case "ArrowLeft":
        for (let c = col - 1; c >= 0; c--) {
          if (!crosswordState.cells[row][c].isBlocked) {
            setCrosswordState((prev) => ({
              ...prev,
              selectedCell: { row, col: c },
              currentDirection: "across",
            }));
            return;
          }
        }
        break;
      case "ArrowRight":
        for (let c = col + 1; c < maxCol; c++) {
          if (!crosswordState.cells[row][c].isBlocked) {
            setCrosswordState((prev) => ({
              ...prev,
              selectedCell: { row, col: c },
              currentDirection: "across",
            }));
            return;
          }
        }
        break;
    }
  };

  const handleClueClick = (
    wordNumber: number,
    direction: "across" | "down"
  ) => {
    // Find the word with the given number and direction
    const word = updatedWords.find(
      (w) => w.number === wordNumber && w.direction === direction
    );

    if (!word) return;

    // Find the next available empty cell, or the first cell if all are filled
    let targetCell = word.cells[0]; // Default to first cell

    for (const cell of word.cells) {
      const cellState = crosswordState.cells[cell.row][cell.col];
      if (!cellState.letter) {
        targetCell = cell;
        break;
      }
    }

    // Update state to focus on the target cell and set direction
    setCrosswordState((prev) => ({
      ...prev,
      selectedCell: { row: targetCell.row, col: targetCell.col },
      currentDirection: direction,
    }));
  };

  return (
    <div className="crossword-app">
      <h1>Crossword Puzzle</h1>

      <div className="crossword-container">
        <div className="crossword-grid" onKeyDown={handleKeyPress} tabIndex={0}>
          {highlightedCells.map((row, rowIndex) => (
            <div key={rowIndex} className="crossword-row">
              {row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`crossword-cell ${
                    cell.isBlocked ? "blocked" : ""
                  } ${
                    crosswordState.selectedCell?.row === rowIndex &&
                    crosswordState.selectedCell?.col === colIndex
                      ? "selected current"
                      : ""
                  } ${cell.isHighlighted ? "highlighted" : ""}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell.showNumber && (
                    <span className="cell-number">{cell.numberValue}</span>
                  )}
                  <span className="cell-letter">
                    {crosswordState.showAnswers ? cell.answer : cell.letter}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="clues-section">
          <div className="clues-column">
            <h3>Across</h3>
            {updatedWords
              .filter((word) => word.direction === "across")
              .map((word) => (
                <div
                  key={`across-${word.number}`}
                  className={`clue ${word.isCorrect ? "correct" : ""} ${
                    crosswordState.selectedCell &&
                    crosswordState.currentDirection === "across" &&
                    word.cells.some(
                      (cell) =>
                        cell.row === crosswordState.selectedCell!.row &&
                        cell.col === crosswordState.selectedCell!.col
                    )
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleClueClick(word.number, "across")}
                >
                  <span className="clue-number">{word.number}.</span>
                  <span className="clue-text">{word.clue}</span>
                </div>
              ))}
          </div>

          <div className="clues-column">
            <h3>Down</h3>
            {updatedWords
              .filter((word) => word.direction === "down")
              .map((word) => (
                <div
                  key={`down-${word.number}`}
                  className={`clue ${word.isCorrect ? "correct" : ""} ${
                    crosswordState.selectedCell &&
                    crosswordState.currentDirection === "down" &&
                    word.cells.some(
                      (cell) =>
                        cell.row === crosswordState.selectedCell!.row &&
                        cell.col === crosswordState.selectedCell!.col
                    )
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleClueClick(word.number, "down")}
                >
                  <span className="clue-number">{word.number}.</span>
                  <span className="clue-text">{word.clue}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="controls">
        <button
          onClick={() =>
            setCrosswordState((prev) => ({
              ...prev,
              showAnswers: !prev.showAnswers,
            }))
          }
          className="toggle-answers-btn"
        >
          {crosswordState.showAnswers ? "Hide" : "Show"} Answers
        </button>
        <div className="progress">
          Progress: {updatedWords.filter((w) => w.isCorrect).length}/
          {updatedWords.length} words correct
        </div>
      </div>

      <div className="instructions">
        <p>
          Click on a cell to select it, then type letters. Use arrow keys to
          navigate.
        </p>
        <p>Press Tab to switch between Across and Down directions.</p>
        <p className="current-direction">
          Current direction:{" "}
          <strong>{crosswordState.currentDirection.toUpperCase()}</strong>
        </p>
      </div>

      {updatedWords.every((w) => w.isCorrect) && (
        <div className="completion-message">
          🎉 Congratulations! You've completed the crossword!
        </div>
      )}
    </div>
  );
}

export default App;
