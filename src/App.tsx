import { useState } from "react";
import "./App.css";
import { useCrosswordData } from "./hooks/useCrosswordData";
import { useCrosswordState } from "./hooks/useCrosswordState";
import { useCrosswordNavigation } from "./hooks/useCrosswordNavigation";
import { useCrosswordValidation } from "./hooks/useCrosswordValidation";
import { crosswordOptions } from "./data";
import { CrosswordSelector } from "./components/CrosswordSelector";
import { CrosswordGrid } from "./components/CrosswordGrid";
import { CluesSection } from "./components/CluesSection";
import { Controls } from "./components/Controls";
import { Instructions } from "./components/Instructions";
import { CompletionMessage } from "./components/CompletionMessage";

function App() {
  // State for selected crossword
  const [selectedCrosswordId, setSelectedCrosswordId] = useState("granite-1");
  const [menuOpen, setMenuOpen] = useState(false);

  // Get crossword data using custom hook
  const { crosswordData, processedData, validation } =
    useCrosswordData(selectedCrosswordId);

  // Manage crossword state using custom hook
  const { crosswordState, setCrosswordState, updatedWords, highlightedCells } =
    useCrosswordState(crosswordData, processedData);

  // Get navigation handlers from custom hook
  const { handleCellClick, handleKeyPress, handleClueClick } =
    useCrosswordNavigation(crosswordState, setCrosswordState, updatedWords);

  // Get validation data from custom hook
  const { errorMessages, hasErrors } = useCrosswordValidation(validation);

  return (
    <div className="crossword-app">
      {/* Header with title and menu button */}
      <div className="app-header">
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <h1>Crossword Puzzle</h1>
      </div>

      {/* Sliding Menu */}
      <div className={`sliding-menu ${menuOpen ? "open" : ""}`}>
        <CrosswordSelector
          selectedCrossword={selectedCrosswordId}
          onCrosswordChange={setSelectedCrosswordId}
          crosswords={crosswordOptions}
        />
      </div>

      {/* Menu Overlay */}
      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* Validation Errors */}
      {hasErrors && (
        <div className="validation-errors">
          <h3>⚠️ Validation Errors</h3>
          {errorMessages.map((error, index) => (
            <div key={index} className="validation-error">
              {error}
            </div>
          ))}
        </div>
      )}

      <div className="crossword-container">
        <CrosswordGrid
          cells={highlightedCells}
          selectedCell={crosswordState.selectedCell}
          showAnswers={crosswordState.showAnswers}
          onCellClick={handleCellClick}
          onKeyDown={handleKeyPress}
        />

        <CluesSection
          words={updatedWords}
          selectedCell={crosswordState.selectedCell}
          currentDirection={crosswordState.currentDirection}
          onClueClick={handleClueClick}
        />
      </div>

      <Controls
        showAnswers={crosswordState.showAnswers}
        onToggleAnswers={() =>
          setCrosswordState((prev) => ({
            ...prev,
            showAnswers: !prev.showAnswers,
          }))
        }
        words={updatedWords}
      />

      <Instructions currentDirection={crosswordState.currentDirection} />

      <CompletionMessage isComplete={updatedWords.every((w) => w.isCorrect)} />
    </div>
  );
}

export default App;
