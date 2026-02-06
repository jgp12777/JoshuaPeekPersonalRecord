# Implementation Guide: Color-Based → Word-Based EEG Training

## Files to Replace/Update

### Backend Files

#### 1. `backend/constants.py` → Replace entirely
**Status**: ✅ Created (`backend_constants.py`)
**Changes**:
- Replaced `COLORS` with `VOCABULARY` (10 words with mental imagery)
- Added baseline timing constants
- Added fixation cross timing
- Updated trial duration calculations
- Added word categories

#### 2. `backend/models.py` → Replace entirely
**Status**: ✅ Created (`backend_models.py`)
**Changes**:
- Renamed `ColorEvent` → `WordEvent`
- Added new event types: `BASELINE_EYES_OPEN_START`, `BASELINE_EYES_CLOSED_START`, `FIXATION_CROSS`
- Updated socket event models to use words instead of colors
- Added baseline fields to SessionConfig and SessionSummary

#### 3. `backend/services/csv_service.py` → Minor updates needed
**Changes**:
- Update CSV headers: `color` → `word`, add `category` column
- Update metadata to include baseline settings
- No major structural changes needed

#### 4. `backend/services/session_service.py` → Minor updates needed
**Changes**:
- Update event logging to use `WordEvent` instead of `ColorEvent`
- Update summary statistics: `colors_presented` → `words_presented`

#### 5. `backend/socket_handlers.py` → Update event names
**Changes**:
- Rename `color_start` → `word_start`
- Rename `color_end` → `word_end`
- Add handlers for: `baseline_start`, `baseline_end`, `fixation_cross`
- Update event parsing to include word, word_id, category

#### 6. `backend/main.py` → Update config endpoint
**Changes**:
- Update `/api/config` to return vocabulary instead of colors
- Update timing constants

### Frontend Files

#### 1. `Frontend/src/constants/colors.ts` → Replace with vocabulary.ts
**Status**: ✅ Created (`frontend_vocabulary.ts`)
**Changes**:
- Complete replacement of color definitions with vocabulary
- Add mental imagery descriptions
- Add baseline and fixation timing constants
- Update trial options with repetition counts

#### 2. `Frontend/src/types/session.ts` → Update types
**Changes**:
- Add new screen states: `'learning'`, `'baseline'`
- Rename color-related fields to word-related
- Add baseline event types
- Add fixation event types

#### 3. New Component: `Frontend/src/components/LearningPhase.tsx`
**Purpose**: Pre-training phase where user learns mental imagery
**Features**:
- Show each word with full mental imagery description
- 8 seconds per word
- 2 seconds rest between words
- Progress indicator
- "Skip" option for experienced users
- "Repeat" option to go through vocabulary again

#### 4. New Component: `Frontend/src/components/BaselineRecording.tsx`
**Purpose**: Record baseline EEG before stimulus presentation
**Features**:
- Instructions screen
- Eyes-open 10-second recording with central dot
- Eyes-closed 10-second recording with timer
- Progress indicators
- Emit baseline events to backend

#### 5. New Component: `Frontend/src/components/FixationCross.tsx`
**Purpose**: Display fixation cross between stimuli (500ms)
**Features**:
- Central cross (+) on gray background
- 500ms duration
- Reduces eye movement artifacts

#### 6. Update: `Frontend/src/components/WordPresentation.tsx` (rename from ColorPresentation.tsx)
**Changes**:
- Display word instead of color
- Black background, white text
- Show word only (mental imagery is in learning phase)
- Keep rest screen (white blank)
- Update props to use WordDefinition

#### 7. Update: `Frontend/src/hooks/useWordSequence.ts` (rename from useColorSequence.ts)
**Changes**:
- Add baseline state
- Add fixation cross state
- Update callbacks for words instead of colors
- Add baseline event emissions
- Add fixation event emissions

#### 8. Update: `Frontend/src/hooks/useSocketIO.ts`
**Changes**:
- Rename socket event emitters: `emitColorStart` → `emitWordStart`
- Add `emitBaselineStart`, `emitBaselineEnd`
- Add `emitFixationCross`
- Update event payloads to include word, word_id, category

#### 9. Update: `Frontend/src/App.tsx`
**Changes**:
- Add new screen states: learning, baseline
- Add screen flow: intake → learning → ready → baseline → countdown → running → summary
- Update state management for new screens
- Pass vocabulary data instead of colors

#### 10. Update: `Frontend/src/components/ReadyScreen.tsx`
**Changes**:
- Update instructions to mention words instead of colors
- Update preview to show word categories
- Mention mental imagery training
- Update trial duration estimates

#### 11. Update: `Frontend/src/components/SummaryScreen.tsx`
**Changes**:
- Update labels: "Colors Presented" → "Words Presented"
- Show word repetition statistics
- Show baseline recording status

## Screen Flow Changes

### OLD FLOW
1. Intake Form
2. Ready Screen
3. Countdown (3s)
4. Running (Color presentation)
5. Summary

### NEW FLOW
1. Intake Form
2. **Learning Phase** (NEW - ~2 minutes)
   - Introduction screen
   - Each word + mental imagery (8s each)
   - Option to repeat or skip
3. Ready Screen (updated instructions)
4. **Baseline Recording** (NEW - 20 seconds)
   - Eyes open (10s)
   - Eyes closed (10s)
5. Countdown (3s)
6. Running (Word presentation with fixation crosses)
7. Summary

## Data Format Changes

### OLD CSV Format
```csv
event,color,color_id,trial,timestamp,relative_time_ms,ch1-ch16
color_start,RED,0,1,2024-02-04...,1000,...
```

### NEW CSV Format
```csv
event,word,word_id,category,trial,timestamp,relative_time_ms,ch1-ch16
baseline_eyes_open_start,,,baseline,0,2024-02-04...,0,...
baseline_eyes_open_end,,,baseline,0,2024-02-04...,10000,...
baseline_eyes_closed_start,,,baseline,0,2024-02-04...,10000,...
baseline_eyes_closed_end,,,baseline,0,2024-02-04...,20000,...
fixation_cross,,,prep,1,2024-02-04...,20500,...
word_start,APPLE,0,concrete_noun,1,2024-02-04...,21000,...
eeg_sample,,,,,,21008,12.5,15.3,...
word_end,APPLE,0,concrete_noun,1,2024-02-04...,26000,...
rest_start,,,rest,1,2024-02-04...,26000,...
rest_end,,,rest,1,2024-02-04...,28000,...
```

## Key Improvements for ML

### 1. Baseline Recording ⭐
- Provides individual baseline for each participant
- Essential for artifact removal and feature normalization
- Eyes-open vs eyes-closed distinguishes alpha rhythm

### 2. Mental Imagery Training ⭐
- Ensures participants form consistent mental images
- Better signal quality during recording
- Reduces variability between participants

### 3. Fixation Cross ⭐
- Reduces eye movement artifacts
- Centers attention between stimuli
- Improves data quality

### 4. Word Repetitions ⭐
- 10-100 presentations per word
- Provides sufficient data for ML classification
- Enables within-subject learning

### 5. Word Categories ⭐
- Concrete nouns: Strong visual cortex activation
- Action verbs: Motor cortex activation patterns
- Emotions: Limbic system involvement
- Different brain regions = better classification

### 6. Mental Imagery Descriptions ⭐
- Multi-sensory (visual, tactile, auditory)
- Engages multiple brain regions
- Creates richer EEG signatures
- Example: "apple" includes visual, tactile, taste, sound

## Testing Strategy

### Phase 1: Component Testing
1. Test LearningPhase component in isolation
2. Test BaselineRecording component
3. Test FixationCross timing
4. Test WordPresentation rendering

### Phase 2: Flow Testing
1. Complete session flow: intake → learning → baseline → recording → summary
2. Verify all event markers in CSV
3. Check EEG sample alignment with events
4. Verify baseline data captured correctly

### Phase 3: Data Quality Testing
1. Run parse_session.py on generated CSV
2. Verify baseline periods present
3. Check event marker timestamps
4. Validate EEG sample rate
5. Check for gaps or data loss

### Phase 4: ML Pipeline Testing
1. Extract baseline features
2. Segment word epochs (stimulus ± window)
3. Extract features (power spectral density, wavelet, etc.)
4. Verify data shape for model training
5. Test train/test split

## Deployment Steps

1. **Backup current code**
   ```bash
   git commit -am "Backup before vocabulary refactor"
   ```

2. **Update backend files**
   - Replace constants.py
   - Replace models.py
   - Update csv_service.py
   - Update session_service.py
   - Update socket_handlers.py
   - Update main.py

3. **Update frontend files**
   - Replace constants/colors.ts with vocabulary.ts
   - Update types/session.ts
   - Create LearningPhase.tsx
   - Create BaselineRecording.tsx
   - Create FixationCross.tsx
   - Rename and update ColorPresentation → WordPresentation
   - Rename and update useColorSequence → useWordSequence
   - Update useSocketIO.ts
   - Update App.tsx
   - Update ReadyScreen.tsx
   - Update SummaryScreen.tsx

4. **Test locally**
   ```bash
   ./run-local.sh
   ```

5. **Verify**
   - Complete one full session
   - Check CSV output format
   - Run parse_session.py
   - Verify all event types present

6. **Commit changes**
   ```bash
   git add .
   git commit -m "Refactor: Color-based → Word-based vocabulary training with mental imagery"
   ```

## File Checklist

### Backend ✅
- [✅] constants.py - Created
- [✅] models.py - Created
- [ ] services/csv_service.py - Needs updates
- [ ] services/session_service.py - Needs updates
- [ ] socket_handlers.py - Needs updates
- [ ] main.py - Needs minor updates

### Frontend ✅
- [✅] constants/vocabulary.ts - Created (replaces colors.ts)
- [ ] types/session.ts - Needs updates
- [ ] components/LearningPhase.tsx - NEW
- [ ] components/BaselineRecording.tsx - NEW
- [ ] components/FixationCross.tsx - NEW
- [ ] components/WordPresentation.tsx - Rename + update
- [ ] hooks/useWordSequence.ts - Rename + update
- [ ] hooks/useSocketIO.ts - Update
- [ ] App.tsx - Update
- [ ] components/ReadyScreen.tsx - Update
- [ ] components/SummaryScreen.tsx - Update

## Estimated Implementation Time

- Backend updates: 2-3 hours
- Frontend new components: 3-4 hours
- Frontend updates: 2-3 hours
- Testing: 2-3 hours
- **Total: 9-13 hours**

## Success Metrics

1. ✅ All 10 words with mental imagery loaded correctly
2. ✅ Learning phase displays all imagery descriptions
3. ✅ Baseline recording captures 20 seconds of data
4. ✅ Fixation cross appears between each word (500ms)
5. ✅ Each word presented N times (10-100 depending on trial count)
6. ✅ CSV includes all new event types
7. ✅ EEG samples synchronized with word events
8. ✅ Data parser confirms data integrity
9. ✅ ML pipeline can load and process data
10. ✅ User experience is smooth and clear
