import type { CrosswordData } from "../utils/types";

interface CrosswordOption {
  id: string;
  name: string;
  data: () => CrosswordData;
}

interface CrosswordSelectorProps {
  selectedCrossword: string;
  onCrosswordChange: (crosswordId: string) => void;
  crosswords: CrosswordOption[];
}

export function CrosswordSelector({
  selectedCrossword,
  onCrosswordChange,
  crosswords,
}: CrosswordSelectorProps) {
  return (
    <div className="crossword-selector">
      <h2>Select Crossword</h2>
      <div className="crossword-tabs">
        {crosswords.map((crossword) => (
          <button
            key={crossword.id}
            className={`crossword-tab ${
              selectedCrossword === crossword.id ? "active" : ""
            }`}
            onClick={() => onCrosswordChange(crossword.id)}
          >
            {crossword.name}
          </button>
        ))}
      </div>
    </div>
  );
}
