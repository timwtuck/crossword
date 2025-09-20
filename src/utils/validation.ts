import type {
  ProcessedCrosswordData,
  ValidationResult,
  WordStatus,
} from "./types";

/**
 * Validates user input against the correct answers
 * @param userInput - 2D array of user input
 * @param processedData - Processed crossword data with correct answers
 * @returns Object with validation results
 */
export function validateCrossword(
  userInput: string[][],
  processedData: ProcessedCrosswordData
): ValidationResult {
  let correctWords = 0;
  let isComplete = true;

  const wordStatus: WordStatus[] = processedData.words.map((word) => {
    const userAnswer = extractUserAnswer(userInput, word);
    const isCorrect = userAnswer.toLowerCase() === word.answer;
    const isWordComplete = userAnswer.length === word.length;

    if (isCorrect) correctWords++;
    if (!userAnswer || !isWordComplete) isComplete = false;

    return {
      word,
      userAnswer: userAnswer.toLowerCase(),
      isCorrect,
      isComplete: isWordComplete,
    };
  });

  return {
    isComplete,
    correctWords,
    totalWords: processedData.words.length,
    wordStatus,
  };
}

/**
 * Extracts user's answer for a specific word
 */
function extractUserAnswer(userInput: string[][], word: any): string {
  let userAnswer = "";

  if (word.direction === "across") {
    for (let col = word.startCol; col < word.startCol + word.length; col++) {
      userAnswer += userInput[word.startRow]?.[col] || "";
    }
  } else {
    for (let row = word.startRow; row < word.startRow + word.length; row++) {
      userAnswer += userInput[row]?.[word.startCol] || "";
    }
  }

  return userAnswer;
}
