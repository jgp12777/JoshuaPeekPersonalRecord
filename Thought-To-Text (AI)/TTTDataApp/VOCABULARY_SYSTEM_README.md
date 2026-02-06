# EEG Word-Based Vocabulary Training System

## Overview

This system has been reconfigured from **color-based** stimulus presentation to **word-based vocabulary training** with **mental imagery association**. It collects 16-channel EEG data (OpenBCI Cyton+Daisy, 125 Hz) synchronized with word stimulus events for training thought-to-text machine learning models.

## Key Changes from Color System

### 1. Stimulus Type
- **OLD**: 7 colors (RED, BLUE, GREEN, etc.)
- **NEW**: 10 words with mental imagery descriptions

### 2. Training Protocol
- **NEW**: Learning phase where users practice mental imagery
- **NEW**: Baseline recording (eyes open + eyes closed)
- **NEW**: Fixation cross between stimuli (reduces artifacts)
- **IMPROVED**: Multiple repetitions per word (10-100x)

### 3. Data Collection Flow
```
OLD: Intake → Ready → Countdown → Running → Summary

NEW: Intake → Learning → Ready → Baseline → Countdown → Running → Summary
     ↑          ↑                     ↑
  Same      Mental Imagery       EEG Baseline
            Training Phase       (20 seconds)
```

## Vocabulary Design

The 10-word vocabulary is optimized for distinct EEG signatures:

### Concrete Nouns (Visual Cortex Activation)
- **APPLE** - Multi-sensory: visual, tactile, taste, auditory
- **DOG** - Animal with movement and sound
- **CHAIR** - Common object with physical interaction
- **WATER** - Fluid with sensory experience
- **BOOK** - Reading-related visual imagery

### Action Verbs (Motor Cortex Activation)
- **RUN** - Full-body motor imagery
- **THROW** - Arm movement with trajectory
- **JUMP** - Explosive motor action

### Emotional States (Limbic System)
- **HAPPY** - Positive emotion with recall
- **PEACEFUL** - Calm emotional state

## Mental Imagery Technique

Each word has a detailed **mental imagery prompt** that engages multiple senses:

**Example: APPLE**
> "Picture a crisp red apple in your hand. Feel its smooth, cool skin. Imagine biting into it - hear the crunch, taste the sweet juice flowing over your tongue."

**Why Multi-Sensory?**
- Engages visual cortex (seeing the apple)
- Activates somatosensory cortex (feeling texture)
- Triggers auditory processing (hearing crunch)
- Stimulates gustatory cortex (tasting)
- Creates richer, more distinctive EEG patterns

## Session Flow Explained

### 1. Intake Form
- Participant demographics
- Select trial count (10, 25, 50, or 100 trials)
- **Trial = one presentation of all 10 words**
- Example: 25 trials = each word shown 25 times

### 2. Learning Phase (~2 minutes)
**Purpose**: Train participants to form consistent mental imagery

**What Happens**:
- Introduction explaining mental imagery
- Each word shown for 8 seconds with full description
- 2-second rest between words
- Option to repeat or skip (for experienced users)

**Why Important**:
- Consistency improves signal quality
- Reduces inter-participant variability
- Better ML model training data

### 3. Ready Screen
- Review session parameters
- Check EEG connection status
- Final instructions

### 4. Baseline Recording (20 seconds)
**Purpose**: Capture individual baseline brain activity

**Protocol**:
- **Eyes Open** (10s): Stare at central dot, minimize blinking
- **Eyes Closed** (10s): Eyes gently closed, relaxed

**Why Critical for ML**:
- Establishes individual baseline for normalization
- Distinguishes alpha rhythm (eyes closed)
- Essential for artifact removal
- Enables subject-specific feature extraction

### 5. Countdown (3 seconds)
- Prepare for word presentation

### 6. Running Phase
**For each trial**:
1. **Fixation Cross** (500ms) - Focus attention, reduce eye movements
2. **Word Display** (5s) - Generate mental imagery
3. **Rest** (2s) - Blank white screen
4. Repeat for all 10 words
5. Continue for N trials

**Trial Duration**: ~75 seconds per trial

### 7. Summary
- Session statistics
- Save/download CSV data
- EEG data integrity report

## Data Output Format

### CSV Structure

**Metadata Section** (first 15 lines):
```csv
session_id,20240204_153022
participant_name,John Doe
participant_age,28
...
eeg_enabled,true
eeg_sample_rate_hz,125
eeg_channels,16
baseline_eyes_open_ms,10000
baseline_eyes_closed_ms,10000
start_time,2024-02-04T15:30:22Z
end_time,2024-02-04T15:50:45Z
```

**Data Section**:
```csv
event,word,word_id,category,trial,timestamp,relative_time_ms,ch1,ch2,...,ch16

# Baseline recordings
baseline_eyes_open_start,,,baseline,0,2024-02-04T15:30:22Z,0,...
eeg_sample,,,,,,8,12.5,15.3,18.2,...,24.1
eeg_sample,,,,,,16,12.3,15.1,18.0,...,23.9
...
baseline_eyes_open_end,,,baseline,0,2024-02-04T15:30:32Z,10000,...
baseline_eyes_closed_start,,,baseline,0,2024-02-04T15:30:32Z,10000,...
...
baseline_eyes_closed_end,,,baseline,0,2024-02-04T15:30:42Z,20000,...

# Trial 1
fixation_cross,,,prep,1,2024-02-04T15:30:42.500Z,20500,...
word_start,APPLE,0,concrete_noun,1,2024-02-04T15:30:43Z,21000,...
eeg_sample,,,,,,21008,11.2,14.5,17.8,...,23.5
eeg_sample,,,,,,21016,11.0,14.3,17.6,...,23.3
...
word_end,APPLE,0,concrete_noun,1,2024-02-04T15:30:48Z,26000,...
rest_start,,,rest,1,2024-02-04T15:30:48Z,26000,...
rest_end,,,rest,1,2024-02-04T15:30:50Z,28000,...

# Next word in trial 1
fixation_cross,,,prep,1,2024-02-04T15:30:50.500Z,28500,...
word_start,DOG,1,concrete_noun,1,2024-02-04T15:30:51Z,29000,...
...
```

### Event Types

| Event Type | Description | Has EEG Data |
|-----------|-------------|--------------|
| `session_start` | Session begins | Marker only |
| `baseline_eyes_open_start` | Eyes-open baseline start | Marker + EEG |
| `baseline_eyes_open_end` | Eyes-open baseline end | Marker + EEG |
| `baseline_eyes_closed_start` | Eyes-closed baseline start | Marker + EEG |
| `baseline_eyes_closed_end` | Eyes-closed baseline end | Marker + EEG |
| `fixation_cross` | Fixation cross displayed | Marker + EEG |
| `word_start` | Word stimulus onset | Marker + EEG |
| `eeg_sample` | Raw EEG data point | EEG only |
| `word_end` | Word stimulus offset | Marker + EEG |
| `rest_start` | Rest period begins | Marker + EEG |
| `rest_end` | Rest period ends | Marker + EEG |
| `session_end` | Session complete | Marker only |

## ML Pipeline Integration

### 1. Data Loading
```python
import pandas as pd

# Read metadata
with open('session.csv', 'r') as f:
    metadata = {}
    for i in range(15):
        line = f.readline().strip().split(',')
        metadata[line[0]] = line[1]

# Read data
data = pd.read_csv('session.csv', skiprows=16)

# Split into events and EEG samples
events = data[data['event'] != 'eeg_sample']
eeg = data[data['event'] == 'eeg_sample']
```

### 2. Baseline Extraction
```python
# Extract baseline periods
baseline_open = eeg[
    (eeg['relative_time_ms'] >= 0) & 
    (eeg['relative_time_ms'] < 10000)
]

baseline_closed = eeg[
    (eeg['relative_time_ms'] >= 10000) & 
    (eeg['relative_time_ms'] < 20000)
]

# Compute baseline features (e.g., power spectral density)
baseline_features = compute_baseline_psd(baseline_open, baseline_closed)
```

### 3. Word Epoch Extraction
```python
# For each word presentation
word_starts = events[events['event'] == 'word_start']

epochs = []
for _, event in word_starts.iterrows():
    word = event['word']
    word_id = event['word_id']
    category = event['category']
    trial = event['trial']
    
    start_time = event['relative_time_ms']
    end_time = start_time + 5000  # 5-second stimulus
    
    # Extract EEG for this epoch (with pre/post windows)
    epoch_eeg = eeg[
        (eeg['relative_time_ms'] >= start_time - 1000) &  # 1s pre-stimulus
        (eeg['relative_time_ms'] < end_time + 1000)       # 1s post-stimulus
    ]
    
    epochs.append({
        'word': word,
        'word_id': word_id,
        'category': category,
        'trial': trial,
        'eeg_data': epoch_eeg[['ch1', 'ch2', ..., 'ch16']].values,
        'timestamps': epoch_eeg['relative_time_ms'].values
    })
```

### 4. Feature Extraction
```python
from scipy import signal

def extract_features(epoch_eeg, baseline_features, fs=125):
    """Extract features for one word epoch."""
    
    # Baseline normalization
    epoch_normalized = (epoch_eeg - baseline_features['mean']) / baseline_features['std']
    
    # Power spectral density (0.5-50 Hz)
    freqs, psd = signal.welch(epoch_normalized, fs=fs, nperseg=128, axis=0)
    
    # Band power
    delta = psd[(freqs >= 0.5) & (freqs < 4)].mean(axis=0)
    theta = psd[(freqs >= 4) & (freqs < 8)].mean(axis=0)
    alpha = psd[(freqs >= 8) & (freqs < 13)].mean(axis=0)
    beta = psd[(freqs >= 13) & (freqs < 30)].mean(axis=0)
    gamma = psd[(freqs >= 30) & (freqs < 50)].mean(axis=0)
    
    # Event-related potential (ERP)
    erp = epoch_normalized.mean(axis=0)
    
    # Combine features
    features = np.concatenate([delta, theta, alpha, beta, gamma, erp])
    
    return features
```

### 5. Model Training
```python
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Prepare data
X = []  # Features
y = []  # Word labels

for epoch in epochs:
    features = extract_features(epoch['eeg_data'], baseline_features)
    X.append(features)
    y.append(epoch['word_id'])

X = np.array(X)
y = np.array(y)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y)

# Train classifier
clf = RandomForestClassifier(n_estimators=100)
clf.fit(X_train, y_train)

# Evaluate
accuracy = clf.score(X_test, y_test)
print(f'Classification Accuracy: {accuracy:.2%}')
```

## Data Quality Verification

Use the included parser to check data integrity:

```bash
python scripts/parse_session.py backend/data/sessions/session_20240204_153022_johndoe.csv
```

**Output includes**:
- Sample rate verification (expected: 125 Hz)
- Data loss percentage
- Gap detection (missing samples)
- Per-trial statistics
- Channel health (detect bad channels)
- Event marker verification

## System Requirements

### Hardware
- OpenBCI Cyton+Daisy board (16 channels)
- OpenBCI ThinkPulse EEG cap
- USB connection to computer

### Software
- Python 3.9+ (backend)
- Node.js 16+ (frontend)
- BrainFlow library

### Recommended Session Parameters
- **Quick Test**: 10 trials (~13 min) - Testing setup
- **Standard Training**: 25 trials (~31 min) - Good for prototyping
- **Deep Training**: 50 trials (~63 min) - Production ML models
- **Maximum Data**: 100 trials (~125 min) - Research/publication

## Troubleshooting

### EEG Not Connecting
1. Check USB cable connection
2. Verify serial port permissions
3. Check board battery level
4. Try manual port selection

### Poor Data Quality
1. Check electrode impedances (should be < 10kΩ)
2. Apply more conductive gel
3. Ensure tight cap fit
4. Minimize movement during recording
5. Check for electrical interference

### Inconsistent Mental Imagery
1. Repeat learning phase
2. Practice before recording
3. Take breaks between trials
4. Ensure participant understands task

## Research Considerations

### Word Selection Rationale
1. **Concrete nouns** - Strongest visual cortex activation
2. **Action verbs** - Distinct motor cortex patterns
3. **Emotions** - Limbic system involvement
4. **Categories** - Different brain regions for better classification

### Timing Justification
- **5s stimulus**: Balance between signal accumulation and participant fatigue
- **2s rest**: Allows signal return to baseline
- **500ms fixation**: Sufficient for eye stabilization
- **10s baseline**: Capture stable alpha rhythm

### Alternative Approaches
1. **Shorter stimuli** (3s): Faster sessions, less data per word
2. **Longer stimuli** (8s): More data, higher fatigue
3. **Different words**: Adjust based on application domain
4. **Block design**: All presentations of one word before moving to next

## Citations & References

- OpenBCI Documentation: https://docs.openbci.com/
- BrainFlow Library: https://brainflow.org/
- Mental Imagery in BCI: Guillot et al. (2009), Neuroscience & Biobehavioral Reviews
- ERP Analysis: Luck (2014), An Introduction to the Event-Related Potential Technique

## License

See LICENSE file for details.

## Support

For issues or questions:
1. Check hardware connections
2. Review data quality with parser
3. Consult OpenBCI community forums
4. Submit issues to project repository
