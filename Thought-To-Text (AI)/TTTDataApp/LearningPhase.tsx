/**
 * BCI Data Collection - Learning Phase Component
 * Pre-training screen where participants learn mental imagery for each word.
 */

import { useCallback, useEffect, useState } from 'react';
import { Button } from './ui/button';
import {
  VOCABULARY,
  LEARNING_WORD_DISPLAY_MS,
  LEARNING_REST_MS,
  type WordDefinition,
} from '../constants/vocabulary';

interface LearningPhaseProps {
  onComplete: () => void;
  participantName: string;
}

type LearningState = 'intro' | 'learning' | 'rest' | 'complete';

export function LearningPhase({ onComplete, participantName }: LearningPhaseProps) {
  const [state, setState] = useState<LearningState>('intro');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [timer, setTimer] = useState(0);

  const currentWord: WordDefinition | null =
    state === 'learning' && currentWordIndex < VOCABULARY.length
      ? VOCABULARY[currentWordIndex]
      : null;

  const handleStartLearning = useCallback(() => {
    setState('learning');
    setCurrentWordIndex(0);
    setTimer(LEARNING_WORD_DISPLAY_MS / 1000);
  }, []);

  const handleSkip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const handleRepeat = useCallback(() => {
    setCurrentWordIndex(0);
    setState('learning');
    setTimer(LEARNING_WORD_DISPLAY_MS / 1000);
  }, []);

  // Timer logic
  useEffect(() => {
    if (state !== 'learning' && state !== 'rest') return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          // Timer finished
          if (state === 'learning') {
            // Move to rest
            setState('rest');
            return LEARNING_REST_MS / 1000;
          } else {
            // Move to next word
            const nextIndex = currentWordIndex + 1;
            if (nextIndex >= VOCABULARY.length) {
              // All words completed
              setState('complete');
              return 0;
            } else {
              setState('learning');
              setCurrentWordIndex(nextIndex);
              return LEARNING_WORD_DISPLAY_MS / 1000;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state, currentWordIndex]);

  // Introduction screen
  if (state === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Mental Imagery Training</h1>

          <p className="text-gray-300 text-lg mb-6">
            Welcome, <span className="text-white font-semibold">{participantName}</span>!
          </p>

          <div className="bg-gray-800 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-white mb-4">What is Mental Imagery?</h2>
            <p className="text-gray-300 mb-4">
              Mental imagery is the practice of vividly imagining something in your mind, engaging
              all your senses. This creates stronger brain signals that our system can detect.
            </p>

            <h2 className="text-xl font-semibold text-white mb-4 mt-6">How This Works</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">1.</span>
                <span>
                  You'll see <span className="text-white font-medium">10 words</span>, one at a
                  time
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">2.</span>
                <span>
                  Each word comes with a{' '}
                  <span className="text-white font-medium">mental imagery description</span>
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">3.</span>
                <span>
                  Read the description and{' '}
                  <span className="text-white font-medium">practice forming the mental image</span>
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">4.</span>
                <span>
                  Make it <span className="text-white font-medium">vivid and multi-sensory</span> -
                  see it, feel it, hear it, even taste it if applicable
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">5.</span>
                <span>
                  During the actual recording, you'll see just the word and need to{' '}
                  <span className="text-white font-medium">recreate that mental image</span>
                </span>
              </li>
            </ul>

            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mt-6">
              <p className="text-blue-200 text-sm">
                💡 <strong>Tip:</strong> The more vivid and consistent your mental imagery, the
                better the EEG signals and the more accurate the thought-to-text system will be.
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleStartLearning}
              size="lg"
              className="text-xl px-12 py-6 h-auto bg-green-600 hover:bg-green-700"
            >
              Begin Learning
            </Button>

            <Button
              onClick={handleSkip}
              variant="outline"
              size="lg"
              className="text-xl px-12 py-6 h-auto border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Skip (Experienced Users)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Learning screen - show word and mental imagery
  if (state === 'learning' && currentWord) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
        <div className="w-full max-w-3xl">
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>
                Word {currentWordIndex + 1} of {VOCABULARY.length}
              </span>
              <span>{timer}s remaining</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${((currentWordIndex + 1) / VOCABULARY.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Word card */}
          <div className="bg-gray-800 border-4 border-green-500 rounded-lg p-8 text-center">
            <h1 className="text-6xl font-bold text-white mb-6">{currentWord.word}</h1>

            <div className="bg-gray-700/50 rounded-lg p-6">
              <p className="text-xl text-gray-200 leading-relaxed">{currentWord.mental_imagery}</p>
            </div>

            <div className="mt-6 text-gray-400 text-sm">
              <p>
                Category:{' '}
                <span className="text-gray-300">
                  {currentWord.category.replace('_', ' ').toUpperCase()}
                </span>
              </p>
            </div>
          </div>

          {/* Instruction */}
          <div className="mt-6 text-center">
            <p className="text-gray-300 text-lg">
              Practice forming this mental image in your mind...
            </p>
            <p className="text-gray-500 text-sm mt-2">Make it as vivid and real as possible</p>
          </div>
        </div>
      </div>
    );
  }

  // Rest screen between words
  if (state === 'rest') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-6xl font-bold text-gray-600 mb-4">{timer}</div>
          <p className="text-gray-400">Rest... Next word coming up</p>
        </div>
      </div>
    );
  }

  // Complete screen
  if (state === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="w-full max-w-lg text-center">
          <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">Learning Complete!</h1>

          <p className="text-gray-300 mb-6">
            You've learned all {VOCABULARY.length} words. During the recording, you'll see just the
            word name. Your job is to recreate the mental imagery you just practiced.
          </p>

          <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 mb-6">
            <p className="text-yellow-200 text-sm">
              <strong>Remember:</strong> The more consistent and vivid your mental imagery, the
              better the results. Take your time with each word.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={onComplete}
              size="lg"
              className="text-xl px-12 py-6 h-auto bg-green-600 hover:bg-green-700"
            >
              Continue to Session
            </Button>

            <Button
              onClick={handleRepeat}
              variant="outline"
              size="lg"
              className="text-xl px-8 py-6 h-auto border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Review Words Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
