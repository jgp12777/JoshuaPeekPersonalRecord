/**
 * BCI Data Collection - Fixation Cross Component
 * Displays a fixation cross for 500ms between word stimuli to reduce eye movement artifacts.
 */

export function FixationCross() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700">
      {/* Fixation cross (+) */}
      <div className="relative">
        {/* Vertical bar */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-12 bg-white" />
        {/* Horizontal bar */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-white" />
      </div>
    </div>
  );
}

/**
 * BCI Data Collection - Word Presentation Component
 * Displays word stimulus or blank white rest screen.
 */

import { type WordDefinition } from '../constants/vocabulary';

const REST_COLOR = '#FFFFFF';
const WORD_BACKGROUND = '#000000';
const WORD_TEXT_COLOR = '#FFFFFF';

interface WordPresentationProps {
  currentWord: WordDefinition | null;
  isResting: boolean;
  isFixation: boolean;
  currentTrial: number;
  totalTrials: number;
}

export function WordPresentation({
  currentWord,
  isResting,
  isFixation,
  currentTrial,
  totalTrials,
}: WordPresentationProps) {
  // Fixation cross screen
  if (isFixation) {
    return <FixationCross />;
  }

  // Rest screen - completely blank white, no UI elements
  if (isResting) {
    return (
      <div
        className="fixed inset-0 z-50"
        style={{ backgroundColor: REST_COLOR }}
      />
    );
  }

  // Word stimulus screen
  if (!currentWord) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: WORD_BACKGROUND }}
    >
      {/* Word display */}
      <div
        className="text-9xl font-bold tracking-wider"
        style={{ color: WORD_TEXT_COLOR }}
      >
        {currentWord.word}
      </div>

      {/* Progress indicator - small, top-right corner */}
      <div
        className="absolute top-4 right-4 text-sm font-medium px-3 py-1 rounded-full"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: WORD_TEXT_COLOR,
        }}
      >
        Trial {currentTrial} of {totalTrials}
      </div>

      {/* Word category indicator - bottom center */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-xs px-3 py-1 rounded-full"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: 'rgba(255, 255, 255, 0.5)',
        }}
      >
        {currentWord.category.replace('_', ' ')}
      </div>
    </div>
  );
}
