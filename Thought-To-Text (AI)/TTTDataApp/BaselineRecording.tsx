/**
 * BCI Data Collection - Baseline Recording Component
 * Records baseline EEG with eyes open and eyes closed.
 */

import { useCallback, useEffect, useState } from 'react';
import { BASELINE_EYES_OPEN_MS, BASELINE_EYES_CLOSED_MS } from '../constants/vocabulary';

interface BaselineRecordingProps {
  onComplete: () => void;
  onBaselineStart: (type: 'eyes_open' | 'eyes_closed') => void;
  onBaselineEnd: (type: 'eyes_open' | 'eyes_closed') => void;
}

type BaselineState = 'intro' | 'eyes_open_ready' | 'eyes_open' | 'eyes_closed_ready' | 'eyes_closed' | 'complete';

export function BaselineRecording({
  onComplete,
  onBaselineStart,
  onBaselineEnd,
}: BaselineRecordingProps) {
  const [state, setState] = useState<BaselineState>('intro');
  const [timer, setTimer] = useState(0);
  const [countdown, setCountdown] = useState(3);

  const handleStartBaseline = useCallback(() => {
    setState('eyes_open_ready');
    setCountdown(3);
  }, []);

  // Countdown for ready screens
  useEffect(() => {
    if (state !== 'eyes_open_ready' && state !== 'eyes_closed_ready') return;

    if (countdown === 0) {
      if (state === 'eyes_open_ready') {
        setState('eyes_open');
        setTimer(BASELINE_EYES_OPEN_MS / 1000);
        onBaselineStart('eyes_open');
      } else {
        setState('eyes_closed');
        setTimer(BASELINE_EYES_CLOSED_MS / 1000);
        onBaselineStart('eyes_closed');
      }
      return;
    }

    const timeout = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [state, countdown, onBaselineStart]);

  // Recording timer
  useEffect(() => {
    if (state !== 'eyes_open' && state !== 'eyes_closed') return;

    if (timer === 0) {
      if (state === 'eyes_open') {
        onBaselineEnd('eyes_open');
        setState('eyes_closed_ready');
        setCountdown(3);
      } else {
        onBaselineEnd('eyes_closed');
        setState('complete');
      }
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [state, timer, onBaselineEnd]);

  // Introduction screen
  if (state === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Baseline Recording</h1>

          <p className="text-gray-300 text-lg mb-6">
            Before we begin the word training, we need to record a baseline of your brain activity.
          </p>

          <div className="bg-gray-800 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-white mb-4">What is a Baseline?</h2>
            <p className="text-gray-300 mb-4">
              A baseline recording captures your normal brain activity when you're not performing
              any specific mental task. This helps us identify what's unique about your brain
              signals when you're thinking about specific words.
            </p>

            <h2 className="text-xl font-semibold text-white mb-4 mt-6">What You'll Do</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">1.</span>
                <span>
                  <strong className="text-white">Eyes Open</strong> - Stare at the central dot for{' '}
                  {BASELINE_EYES_OPEN_MS / 1000} seconds
                  <br />
                  <span className="text-sm text-gray-400">
                    Keep your gaze steady, try not to blink too much
                  </span>
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">2.</span>
                <span>
                  <strong className="text-white">Eyes Closed</strong> - Keep your eyes gently
                  closed for {BASELINE_EYES_CLOSED_MS / 1000} seconds
                  <br />
                  <span className="text-sm text-gray-400">
                    Relax, don't think about anything specific
                  </span>
                </span>
              </li>
            </ul>

            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mt-6">
              <p className="text-blue-200 text-sm">
                💡 <strong>Tip:</strong> Try to relax and minimize body movement during the
                baseline. Muscle tension can create artifacts in the EEG signal.
              </p>
            </div>
          </div>

          <button
            onClick={handleStartBaseline}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold px-12 py-4 rounded-lg transition-colors"
          >
            Start Baseline Recording
          </button>
        </div>
      </div>
    );
  }

  // Eyes open ready countdown
  if (state === 'eyes_open_ready') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Eyes Open Baseline</h2>
          <p className="text-gray-300 mb-8">
            When the countdown finishes, focus on the central dot and keep your eyes open.
          </p>
          <div className="text-8xl font-bold text-blue-400 animate-pulse">{countdown}</div>
        </div>
      </div>
    );
  }

  // Eyes open recording
  if (state === 'eyes_open') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <div className="text-center">
          {/* Central fixation dot */}
          <div className="w-4 h-4 bg-white rounded-full mx-auto mb-8 shadow-lg" />

          {/* Timer */}
          <div className="text-6xl font-bold text-white mb-4">{timer}s</div>
          <p className="text-gray-300 text-lg">Keep looking at the dot</p>

          {/* Progress bar */}
          <div className="w-64 mx-auto mt-6 bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{
                width: `${((BASELINE_EYES_OPEN_MS / 1000 - timer) / (BASELINE_EYES_OPEN_MS / 1000)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Eyes closed ready countdown
  if (state === 'eyes_closed_ready') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
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

          <h2 className="text-3xl font-bold text-white mb-4">Eyes Closed Baseline</h2>
          <p className="text-gray-300 mb-8">
            When the countdown finishes, gently close your eyes and relax.
          </p>
          <div className="text-8xl font-bold text-blue-400 animate-pulse">{countdown}</div>
        </div>
      </div>
    );
  }

  // Eyes closed recording
  if (state === 'eyes_closed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          {/* Visual cue for eyes closed (they won't see this but good for testing) */}
          <p className="text-gray-600 text-sm mb-8">(Eyes Closed)</p>

          {/* Timer - dimmed since eyes should be closed */}
          <div className="text-6xl font-bold text-gray-700 mb-4">{timer}s</div>
          <p className="text-gray-700 text-lg">Keep your eyes gently closed</p>

          {/* Progress bar - dimmed */}
          <div className="w-64 mx-auto mt-6 bg-gray-900 rounded-full h-2">
            <div
              className="bg-gray-700 h-2 rounded-full transition-all duration-1000"
              style={{
                width: `${((BASELINE_EYES_CLOSED_MS / 1000 - timer) / (BASELINE_EYES_CLOSED_MS / 1000)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Complete screen
  if (state === 'complete') {
    // Auto-advance after 1 second
    useEffect(() => {
      const timeout = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timeout);
    }, [onComplete]);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
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
          <h2 className="text-3xl font-bold text-white mb-2">Baseline Complete!</h2>
          <p className="text-gray-300">Proceeding to word training...</p>
        </div>
      </div>
    );
  }

  return null;
}
