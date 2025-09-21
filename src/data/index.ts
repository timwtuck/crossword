import graniteCrossword1 from "./1";
import graniteCrossword2 from "./2";
import graniteCrossword3 from "./3";
import graniteCrossword4 from "./4";
import graniteCrossword5 from "./5";
import type { CrosswordData } from "../utils/types";

export interface CrosswordOption {
  id: string;
  name: string;
  data: () => CrosswordData;
}

export const crosswordOptions: CrosswordOption[] = [
  {
    id: "granite-1",
    name: "Granite Crossword 1",
    data: graniteCrossword1,
  },
  {
    id: "granite-2",
    name: "Granite Crossword 2",
    data: graniteCrossword2,
  },
  {
    id: "granite-3",
    name: "Granite Crossword 3",
    data: graniteCrossword3,
  },
  {
    id: "granite-4",
    name: "Granite Crossword 4",
    data: graniteCrossword4,
  },
  {
    id: "granite-5",
    name: "Granite Crossword 5",
    data: graniteCrossword5,
  },
];
