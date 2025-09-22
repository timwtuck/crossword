import { useMemo } from "react";
import {
  processCrosswordData,
  validateCrosswordData,
  type CrosswordData,
  type ProcessedCrosswordData,
} from "../utils/crossword";
import { crosswordOptions } from "../data";

export const useCrosswordData = (selectedCrosswordId: string) => {
  const crosswordData: CrosswordData = useMemo(() => {
    const option = crosswordOptions.find(
      (opt) => opt.id === selectedCrosswordId
    );
    return option ? option.data() : crosswordOptions[0].data();
  }, [selectedCrosswordId]);

  const processedData: ProcessedCrosswordData = useMemo(() => {
    return processCrosswordData(crosswordData);
  }, [crosswordData]);

  const validation = useMemo(() => {
    return validateCrosswordData(crosswordData);
  }, [crosswordData]);

  return {
    crosswordData,
    processedData,
    validation,
  };
};
