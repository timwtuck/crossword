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
      // This function is now just a placeholder since we're showing the answer
      // in the clue section instead of filling it in the grid
      // The actual answer display is handled in the CurrentClue component
      console.log(`Revealing answer for ${wordNumber} ${direction}`);
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
