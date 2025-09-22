import { useCallback } from "react";
import type { CrosswordState, WordState } from "../utils/stateTypes";

export const useCrosswordNavigation = (
  crosswordState: CrosswordState,
  setCrosswordState: React.Dispatch<React.SetStateAction<CrosswordState>>,
  updatedWords: WordState[]
) => {
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      const cell = crosswordState.cells[row][col];
      if (cell.isBlocked) return;

      const newSelectedCell = { row, col };
      let newDirection = crosswordState.currentDirection;

      if (
        crosswordState.selectedCell?.row === row &&
        crosswordState.selectedCell?.col === col
      ) {
        newDirection =
          crosswordState.currentDirection === "across" ? "down" : "across";
      } else {
        if (
          cell.acrossWordNum !== undefined &&
          cell.downWordNum !== undefined
        ) {
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
    },
    [
      crosswordState.cells,
      crosswordState.selectedCell,
      crosswordState.currentDirection,
      setCrosswordState,
    ]
  );

  const moveToNextCell = useCallback(
    (row: number, col: number, dir: "across" | "down") => {
      const maxCol = crosswordState.cells[0].length;
      const maxRow = crosswordState.cells.length;

      if (dir === "across") {
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
    },
    [crosswordState.cells, setCrosswordState]
  );

  const moveToPreviousCell = useCallback(
    (row: number, col: number, dir: "across" | "down") => {
      if (dir === "across") {
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
    },
    [crosswordState.cells, setCrosswordState]
  );

  const moveInDirection = useCallback(
    (key: string) => {
      if (!crosswordState.selectedCell) return;

      let { row, col } = crosswordState.selectedCell;
      const maxCol = crosswordState.cells[0].length;
      const maxRow = crosswordState.cells.length;

      switch (key) {
        case "ArrowUp":
          for (let r = row - 1; r >= 0; r--) {
            if (!crosswordState.cells[r][col].isBlocked) {
              const newCell = crosswordState.cells[r][col];
              let newDirection: "across" | "down" = "down";
              if (
                newCell.acrossWordNum !== undefined &&
                newCell.downWordNum === undefined
              ) {
                newDirection = "across";
              } else if (
                newCell.acrossWordNum === undefined &&
                newCell.downWordNum !== undefined
              ) {
                newDirection = "down";
              }

              setCrosswordState((prev) => ({
                ...prev,
                selectedCell: { row: r, col },
                currentDirection: newDirection,
              }));
              return;
            }
          }
          break;
        case "ArrowDown":
          for (let r = row + 1; r < maxRow; r++) {
            if (!crosswordState.cells[r][col].isBlocked) {
              const newCell = crosswordState.cells[r][col];
              let newDirection: "across" | "down" = "down";
              if (
                newCell.acrossWordNum !== undefined &&
                newCell.downWordNum === undefined
              ) {
                newDirection = "across";
              } else if (
                newCell.acrossWordNum === undefined &&
                newCell.downWordNum !== undefined
              ) {
                newDirection = "down";
              }

              setCrosswordState((prev) => ({
                ...prev,
                selectedCell: { row: r, col },
                currentDirection: newDirection,
              }));
              return;
            }
          }
          break;
        case "ArrowLeft":
          for (let c = col - 1; c >= 0; c--) {
            if (!crosswordState.cells[row][c].isBlocked) {
              const newCell = crosswordState.cells[row][c];
              let newDirection: "across" | "down" = "across";
              if (
                newCell.acrossWordNum !== undefined &&
                newCell.downWordNum === undefined
              ) {
                newDirection = "across";
              } else if (
                newCell.acrossWordNum === undefined &&
                newCell.downWordNum !== undefined
              ) {
                newDirection = "down";
              }

              setCrosswordState((prev) => ({
                ...prev,
                selectedCell: { row, col: c },
                currentDirection: newDirection,
              }));
              return;
            }
          }
          break;
        case "ArrowRight":
          for (let c = col + 1; c < maxCol; c++) {
            if (!crosswordState.cells[row][c].isBlocked) {
              const newCell = crosswordState.cells[row][c];
              let newDirection: "across" | "down" = "across";
              if (
                newCell.acrossWordNum !== undefined &&
                newCell.downWordNum === undefined
              ) {
                newDirection = "across";
              } else if (
                newCell.acrossWordNum === undefined &&
                newCell.downWordNum !== undefined
              ) {
                newDirection = "down";
              }

              setCrosswordState((prev) => ({
                ...prev,
                selectedCell: { row, col: c },
                currentDirection: newDirection,
              }));
              return;
            }
          }
          break;
      }
    },
    [crosswordState.selectedCell, crosswordState.cells, setCrosswordState]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (!crosswordState.selectedCell) return;

      const { row, col } = crosswordState.selectedCell;

      if (e.key === "Backspace" || e.key === "Delete") {
        if (crosswordState.cells[row][col].letter) {
          setCrosswordState((prev) => {
            const newCells = [...prev.cells];
            newCells[row][col] = { ...newCells[row][col], letter: "" };
            return { ...prev, cells: newCells };
          });
        } else {
          moveToPreviousCell(row, col, crosswordState.currentDirection);
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        setCrosswordState((prev) => ({
          ...prev,
          currentDirection:
            prev.currentDirection === "across" ? "down" : "across",
        }));
      } else if (e.key.length === 1 && /[A-Za-z]/.test(e.key)) {
        setCrosswordState((prev) => {
          const newCells = [...prev.cells];
          newCells[row][col] = {
            ...newCells[row][col],
            letter: e.key.toUpperCase(),
          };
          return { ...prev, cells: newCells };
        });

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
    },
    [
      crosswordState.selectedCell,
      crosswordState.cells,
      crosswordState.currentDirection,
      setCrosswordState,
      moveToPreviousCell,
      moveToNextCell,
      moveInDirection,
    ]
  );

  const handleClueClick = useCallback(
    (wordNumber: number, direction: "across" | "down") => {
      const word = updatedWords.find(
        (w) => w.number === wordNumber && w.direction === direction
      );

      if (!word) return;

      let targetCell = word.cells[0];

      for (const cell of word.cells) {
        const cellState = crosswordState.cells[cell.row][cell.col];
        if (!cellState.letter) {
          targetCell = cell;
          break;
        }
      }

      setCrosswordState((prev) => ({
        ...prev,
        selectedCell: { row: targetCell.row, col: targetCell.col },
        currentDirection: direction,
      }));
    },
    [updatedWords, crosswordState.cells, setCrosswordState]
  );

  return {
    handleCellClick,
    handleKeyPress,
    handleClueClick,
  };
};
