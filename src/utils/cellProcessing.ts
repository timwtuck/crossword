import type { Cell, Word, CrosswordData } from "./types";

/**
 * Creates cell data with word information
 */
export function createCellGrid(
  crosswordData: CrosswordData,
  acrossWords: Word[],
  downWords: Word[]
): Cell[][] {
  return crosswordData.grid.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      const isBlocked = cell === "-";
      const cellData: Cell = {
        letter: isBlocked ? "" : cell,
        isBlocked,
        isSelected: false,
      };

      if (!isBlocked) {
        // Find which words this cell belongs to
        const acrossWord = findWordForCell(acrossWords, rowIndex, colIndex);
        const downWord = findWordForCell(downWords, rowIndex, colIndex);

        if (acrossWord) {
          cellData.wordAcross = acrossWords.indexOf(acrossWord);
          cellData.positionInWord = colIndex - acrossWord.startCol;
        }
        if (downWord) {
          cellData.wordDown = downWords.indexOf(downWord);
          cellData.positionInWord = rowIndex - downWord.startRow;
        }
      }

      return cellData;
    })
  );
}

/**
 * Finds which word a cell belongs to
 */
function findWordForCell(
  words: Word[],
  rowIndex: number,
  colIndex: number
): Word | undefined {
  return words.find((w) => {
    if (w.direction === "across") {
      return (
        w.startRow === rowIndex &&
        colIndex >= w.startCol &&
        colIndex < w.startCol + w.length
      );
    } else {
      return (
        w.startCol === colIndex &&
        rowIndex >= w.startRow &&
        rowIndex < w.startRow + w.length
      );
    }
  });
}
