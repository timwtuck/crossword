import { useMemo } from "react";
import { getErrorMessage, type ValidationDataResult } from "../utils/crossword";

export const useCrosswordValidation = (validation: ValidationDataResult) => {
  const errorMessages = useMemo(() => {
    if (validation.isValid) return [];

    return validation.errors.map((error) => getErrorMessage(error));
  }, [validation]);

  return {
    errorMessages,
    isValid: validation.isValid,
    hasErrors: !validation.isValid && validation.errors.length > 0,
  };
};
