# EEG Data Collection App - Analysis & Reconfiguration Plan

## Current Architecture Analysis

### ✅ Strengths
1. **Solid EEG Integration**: Uses BrainFlow library with proper OpenBCI Cyton+Daisy support (16 channels, 125 Hz)
2. **Thread-safe CSV Writing**: Handles concurrent EEG samples and event markers correctly
3. **Real-time Event Logging**: Socket.IO provides precise stimulus timing markers
4. **Data Structure**: CSV format with metadata + event markers + EEG samples is ML-ready

### ⚠️ Issues Found & Fixes Needed

#### 1. **EEG Data Verification** ✅ CORRECT
- Sample rate: 125 Hz ✅
- Channels: 16 ✅
- Thread-safe writes ✅
- Relative timestamps ✅
- The implementation is solid for ML training

#### 2. **Missing Baseline Recording** ❌ CRITICAL
- No pre-stimulus baseline period
- **Impact**: ML models need baseline for feature extraction
- **Fix**: Add 10-second eyes-open and 10-second eyes-closed baseline at session start

#### 3. **No Fixation Cross** ❌ IMPORTANT
- Currently shows colors immediately
- **Impact**: Eye movements create artifacts
- **Fix**: Add fixation cross between stimuli (500ms) to reduce artifacts

#### 4. **Fixed Stimulus Duration** ⚠️ MODERATE
- 5 seconds per stimulus may be too long/short depending on mental task
- **Fix**: Make duration configurable per word type

#### 5. **No Repetition Strategy** ⚠️ MODERATE
- Each word shown once per trial
- **Impact**: Not enough data per word for ML
- **Fix**: Implement block design with multiple presentations per word

## Reconfiguration Plan: Colors → Words + Mental Imagery

### New Stimulus Structure

Instead of 7 colors, use vocabulary words with mental imagery prompts:

```
WORD: "apple"
MENTAL IMAGE: "Picture a crisp red apple. Feel its smooth skin. 
Imagine biting into it and tasting the sweet juice."
```

### Vocabulary Categories for Better EEG Signals

1. **Concrete Nouns** (strongest EEG signals)
   - Objects: apple, chair, car, book
   - Animals: dog, cat, bird, fish
   
2. **Action Verbs** (distinct motor cortex activation)
   - Movement: run, jump, throw, catch
   
3. **Emotional Words** (limbic system activation)
   - Happy, sad, angry, peaceful

### Training Protocol Design

#### Phase 1: Learning (5 minutes)
- Present each word with full mental imagery description
- Allow 10 seconds for mental rehearsal
- User practices forming the mental image

#### Phase 2: Training (multiple blocks)
- Show word only (or word + brief image prompt)
- User generates mental imagery
- 5-second stimulus duration
- 2-second rest between words
- Repeat each word 20-30 times across trials

#### Phase 3: Testing (optional)
- Random word order
- No prompts
- Assess consistency

## Implementation Changes

### Frontend Changes
1. Replace `COLORS` constant with `VOCABULARY` array
2. Add mental imagery descriptions
3. Create learning phase screen
4. Add baseline recording screen
5. Add fixation cross component
6. Update UI to show word + imagery text

### Backend Changes
1. Update constants for words/imagery
2. Add baseline event types
3. Add fixation event markers
4. Extend session config for vocabulary metadata
5. Update CSV headers

### Data Format for ML
```csv
event,word,word_id,category,trial,timestamp,relative_time_ms,ch1,ch2,...,ch16
baseline_eyes_open,,,baseline,0,2024-02-04T...,0,,,
baseline_eyes_closed,,,baseline,0,2024-02-04T...,10000,,,
fixation_cross,,,prep,1,2024-02-04T...,20500,,,
word_start,apple,0,noun,1,2024-02-04T...,21000,,,
eeg_sample,,,,,,21008,12.5,15.3,...
word_end,apple,0,noun,1,2024-02-04T...,26000,,,
rest_start,,,rest,1,2024-02-04T...,26000,,,
```

## Suggested Improvements

### 1. Baseline Recording ⭐ CRITICAL
- 10s eyes-open
- 10s eyes-closed
- Provides individual baseline for artifact removal

### 2. Fixation Cross ⭐ CRITICAL
- 500ms between stimuli
- Reduces eye movement artifacts
- Improves data quality

### 3. Block Randomization ⭐ IMPORTANT
- Randomize word order within blocks
- Prevents order effects
- Better for ML generalization

### 4. Training Repetitions ⭐ IMPORTANT
- Each word needs 20-30 presentations
- Calculated: 10 words × 25 reps = 250 trials
- Duration: ~30 minutes

### 5. Mental Imagery Training Phase ⭐ IMPORTANT
- Dedicated learning screen before data collection
- Shows full imagery descriptions
- User practices forming mental images
- Better signal quality during actual recording

### 6. Attention Monitoring
- Random attention checks (rare trials)
- Ensures participant engagement
- Optional validation mechanism

### 7. Session Configuration
- Adjustable word set size
- Configurable repetitions
- Rest breaks every N trials

### 8. Data Quality Metrics
- Real-time EEG quality indicators
- Channel impedance display (if hardware supports)
- Sample rate verification

## Timeline

1. ✅ Update constants and models (1 hour)
2. ✅ Add baseline recording phase (2 hours)
3. ✅ Implement fixation cross (30 min)
4. ✅ Create learning phase screen (2 hours)
5. ✅ Update word presentation logic (1 hour)
6. ✅ Test end-to-end with mock data (1 hour)
7. ✅ Document changes (30 min)

Total: ~8 hours of development

## Success Criteria

1. ✅ EEG data captures baseline period
2. ✅ Word + mental imagery displayed correctly
3. ✅ Event markers synchronized with EEG samples
4. ✅ CSV output format compatible with ML pipelines
5. ✅ Each word presented multiple times
6. ✅ Learning phase helps user form consistent imagery
7. ✅ Data quality improvements visible in output
