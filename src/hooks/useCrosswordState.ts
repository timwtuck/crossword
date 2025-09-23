import { useState, useMemo, useCallback } from "react";
import {
  createCrosswordState,
  updateWordStates,
  updateCellHighlighting,
  type CrosswordState,
  type ProcessedCrosswordData,
  type CrosswordData,
} from "../utils/crossword";

export const useCrosswordState = (
  crosswordData: CrosswordData,
  processedData: ProcessedCrosswordData
) => {
  const [crosswordState, setCrosswordState] = useState<CrosswordState>(() =>
    createCrosswordState(crosswordData, processedData)
  );

  // Reset state when crossword data changes
  useMemo(() => {
    setCrosswordState(createCrosswordState(crosswordData, processedData));
  }, [crosswordData, processedData]);

  const updatedWords = useMemo(() => {
    return updateWordStates(crosswordState.cells, crosswordState.words);
  }, [crosswordState.cells, crosswordState.words]);

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

  const revealAnswer = useCallback(
    (wordNumber: number, direction: "across" | "down") => {
      setCrosswordState((prev) => {
        const newCells = [...prev.cells];
        const word = prev.words.find(
          (w) => w.number === wordNumber && w.direction === direction
        );

        if (word) {
          // Fill in the answer for this word
          word.cells.forEach((cell, index) => {
            if (newCells[cell.row] && newCells[cell.row][cell.col]) {
              newCells[cell.row][cell.col] = {
                ...newCells[cell.row][cell.col],
                letter: word.answer[index],
              };
            }
          });
        }

        return {
          ...prev,
          cells: newCells,
        };
      });
    },
    []
  );

  return {
    crosswordState,
    setCrosswordState,
    updatedWords,
    highlightedCells,
    revealAnswer,
  };
};
