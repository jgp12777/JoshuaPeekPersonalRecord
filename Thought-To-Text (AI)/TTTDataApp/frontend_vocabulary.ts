/**
 * BCI Data Collection - Vocabulary Constants
 * Word definitions and timing configurations matching backend.
 */

export interface WordDefinition {
  id: number;
  word: string;
  category: string;
  mental_imagery: string;
  imagery_duration_ms: number;
}

// Training Vocabulary with Mental Imagery Prompts
export const VOCABULARY: WordDefinition[] = [
  {
    id: 0,
    word: 'APPLE',
    category: 'concrete_noun',
    mental_imagery:
      'Picture a crisp red apple in your hand. Feel its smooth, cool skin. Imagine biting into it - hear the crunch, taste the sweet juice flowing over your tongue.',
    imagery_duration_ms: 8000,
  },
  {
    id: 1,
    word: 'DOG',
    category: 'concrete_noun',
    mental_imagery:
      'Visualize a friendly dog wagging its tail. See its fur, hear it bark excitedly. Feel the dog lick your hand and jump up to greet you.',
    imagery_duration_ms: 8000,
  },
  {
    id: 2,
    word: 'RUN',
    category: 'action_verb',
    mental_imagery:
      'Imagine yourself running fast. Feel your legs pumping, your heart racing. Feel the wind rushing past your face as you sprint forward.',
    imagery_duration_ms: 8000,
  },
  {
    id: 3,
    word: 'CHAIR',
    category: 'concrete_noun',
    mental_imagery:
      'Picture a comfortable chair. See its shape and color. Imagine sitting down in it - feel your body sink into the cushion, your back supported.',
    imagery_duration_ms: 8000,
  },
  {
    id: 4,
    word: 'HAPPY',
    category: 'emotion',
    mental_imagery:
      'Recall a moment of pure happiness. Feel warmth spreading through your chest. See yourself smiling broadly, laughing with joy.',
    imagery_duration_ms: 8000,
  },
  {
    id: 5,
    word: 'WATER',
    category: 'concrete_noun',
    mental_imagery:
      'Visualize clear, cool water. See it flowing and sparkling. Imagine drinking it - feel the refreshing liquid flowing down your throat.',
    imagery_duration_ms: 8000,
  },
  {
    id: 6,
    word: 'THROW',
    category: 'action_verb',
    mental_imagery:
      'Imagine throwing a ball with force. Feel your arm wind back, your muscles tense. Release - watch the ball fly through the air.',
    imagery_duration_ms: 8000,
  },
  {
    id: 7,
    word: 'BOOK',
    category: 'concrete_noun',
    mental_imagery:
      'Picture a book in your hands. Feel its weight, the texture of the pages. Imagine opening it and reading, seeing the words on the page.',
    imagery_duration_ms: 8000,
  },
  {
    id: 8,
    word: 'JUMP',
    category: 'action_verb',
    mental_imagery:
      'Imagine yourself jumping high into the air. Feel your legs push off the ground, your body rising. Experience the moment of weightlessness at the peak.',
    imagery_duration_ms: 8000,
  },
  {
    id: 9,
    word: 'PEACEFUL',
    category: 'emotion',
    mental_imagery:
      'Feel deep calm washing over you. Picture a tranquil scene - maybe a quiet beach or forest. Sense all tension melting away from your body.',
    imagery_duration_ms: 8000,
  },
];

// Timing constants (in milliseconds)
export const BASELINE_EYES_OPEN_MS = 10000; // 10 seconds baseline with eyes open
export const BASELINE_EYES_CLOSED_MS = 10000; // 10 seconds baseline with eyes closed
export const FIXATION_CROSS_MS = 500; // 500ms fixation cross before each word
export const WORD_STIMULUS_MS = 5000; // 5 seconds per word presentation
export const REST_DURATION_MS = 2000; // 2 seconds rest between words
export const COUNTDOWN_DURATION_S = 3; // 3 second countdown

// Learning phase timing
export const LEARNING_WORD_DISPLAY_MS = 8000; // 8 seconds to read and practice mental imagery
export const LEARNING_REST_MS = 2000; // 2 seconds between learning words

// Derived constants
export const WORDS_PER_TRIAL = VOCABULARY.length; // 10 words
export const TRIAL_DURATION_MS =
  (FIXATION_CROSS_MS + WORD_STIMULUS_MS + REST_DURATION_MS) * WORDS_PER_TRIAL; // 75 seconds

// Trial count options with calculated durations
export interface TrialOption {
  trials: number;
  repetitions_per_word: number;
  duration_min: number;
  label: string;
}

export const TRIAL_OPTIONS: TrialOption[] = [
  {
    trials: 10,
    repetitions_per_word: 10,
    duration_min: Math.round((10 * TRIAL_DURATION_MS) / 60000),
    label: '10 trials (~13 min) - Quick test',
  },
  {
    trials: 25,
    repetitions_per_word: 25,
    duration_min: Math.round((25 * TRIAL_DURATION_MS) / 60000),
    label: '25 trials (~31 min) - Standard training',
  },
  {
    trials: 50,
    repetitions_per_word: 50,
    duration_min: Math.round((50 * TRIAL_DURATION_MS) / 60000),
    label: '50 trials (~63 min) - Deep training',
  },
  {
    trials: 100,
    repetitions_per_word: 100,
    duration_min: Math.round((100 * TRIAL_DURATION_MS) / 60000),
    label: '100 trials (~125 min) - Maximum data',
  },
];

// Form options
export const SEX_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];

export const RACE_OPTIONS = [
  'White',
  'Black/African American',
  'Asian',
  'Hispanic/Latino',
  'Native American',
  'Pacific Islander',
  'Two or more',
  'Other',
  'Prefer not to say',
];

// Category descriptions
export const WORD_CATEGORIES = {
  concrete_noun: 'Concrete Nouns (Objects/Animals)',
  action_verb: 'Action Verbs (Motor imagery)',
  emotion: 'Emotional States',
};

// UI Colors
export const FIXATION_CROSS_COLOR = '#FFFFFF';
export const REST_BACKGROUND_COLOR = '#FFFFFF';
export const WORD_BACKGROUND_COLOR = '#000000';
export const WORD_TEXT_COLOR = '#FFFFFF';
export const BASELINE_BACKGROUND_COLOR = '#1a1a1a';
