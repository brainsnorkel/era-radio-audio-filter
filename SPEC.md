# PROJECT SPEC: Era Radio Filter Web App

Create a single-page HTML application that applies vintage radio effects to uploaded audio files, simulating different decades from the 1910s to 1980s.

## Requirements

### File Upload
- Accept MP3, WAV, or other common audio formats
- Drag-and-drop support optional but nice to have

### Era Presets

Provide selectable presets for different decades, each with characteristic audio profiles:

| Era | Bandpass Range | Compression | Noise Level | Mono | Character |
|-----|---------------|-------------|-------------|------|-----------|
| **1910s** | 500-2500 Hz | Very Heavy | Very High (static/crackle) | Yes | Spark gap era, extremely primitive, barely intelligible |
| **1920s** | 400-2800 Hz | Very Heavy | High (heavy static) | Yes | Crystal radio era, AM broadcast beginnings |
| **1930s** | 300-3000 Hz | Heavy | High (crackle/hiss) | Yes | AM radio, lo-fi, scratchy |
| **1940s** | 250-3500 Hz | Heavy | Medium-High | Yes | War-era radio, slightly clearer |
| **1950s** | 200-5000 Hz | Medium-Heavy | Medium | Optional | Early rock & roll, jukeboxes |
| **1960s** | 150-8000 Hz | Medium | Low-Medium | Optional | FM emergence, cleaner but warm |
| **1970s** | 100-10000 Hz | Light-Medium | Low | No | Near hi-fi, slight warmth/saturation |
| **1980s** | 80-12000 Hz | Light | Very Low | No | FM dominance, clean, modern warmth |

### Audio Processing (using Web Audio API)

- **Bandpass filter**: Cut frequencies based on selected era
- **Bit crushing effect**: Simulate lo-fi quality (stronger for older eras)
- **Mono conversion**: Convert stereo to mono (adjustable)
- **Compression**: Apply dynamic compression to simulate broadcast limiting
- **Noise layer**: Add static/crackle/hiss (pink or white noise)
- **Optional**: Slight wow/flutter (pitch variation) for older eras

### Adjustable Parameters

Users should be able to fine-tune the following settings:

1. **Compression** - Adjust the intensity of dynamic compression
   - Range: 0% (off) to 100% (heavy broadcast limiting)

2. **Record Hiss/Noise** - Control the amount of static and crackle
   - Range: 0% (clean) to 100% (heavy noise)

3. **Filtering** - Adjust the bandpass filter intensity
   - Range: 0% (full frequency) to 100% (era-specific narrow band)

4. **Mono** - Toggle or blend stereo to mono conversion
   - Options: Stereo / Mono / Blend slider

### User Interface

- Simple, clean design
- Era preset selector (dropdown or buttons for 1910s-1980s)
- Upload button
- Play/pause controls for both original and processed audio
- Sliders for adjustable parameters (compression, hiss, filtering, mono blend)
- Visual feedback showing current settings
- Download button for processed audio

### Output

- Export as WAV or MP3
- Maintain reasonable quality while achieving the vintage effect

## Technical Approach

- Use Web Audio API (AudioContext, BiquadFilterNode, DynamicsCompressorNode, GainNode, ChannelMergerNode)
- Pure HTML/CSS/JavaScript - no external libraries required
- Should work in modern browsers (Chrome, Firefox, Safari, Edge)
- Real-time audio preview with adjustable parameters

## Style

- Retro aesthetic (browns, beiges, vintage colors) to match the era theme would be nice but not essential
- Clear, intuitive controls
- Consider era-appropriate visual styling when preset is selected

## Audio Processing Chain

```
Input → Mono Conversion → Bandpass Filter → Bit Crusher → Compressor → Noise Mix → Output
```

## Preset Default Values

### 1910s
- Compression: 100%
- Hiss: 90%
- Filtering: 100% (500-2500 Hz)
- Mono: 100%

### 1920s
- Compression: 95%
- Hiss: 80%
- Filtering: 95% (400-2800 Hz)
- Mono: 100%

### 1930s
- Compression: 90%
- Hiss: 70%
- Filtering: 90% (300-3000 Hz)
- Mono: 100%

### 1940s
- Compression: 80%
- Hiss: 50%
- Filtering: 85% (250-3500 Hz)
- Mono: 100%

### 1950s
- Compression: 70%
- Hiss: 35%
- Filtering: 65% (200-5000 Hz)
- Mono: 75%

### 1960s
- Compression: 50%
- Hiss: 20%
- Filtering: 45% (150-8000 Hz)
- Mono: 50%

### 1970s
- Compression: 30%
- Hiss: 10%
- Filtering: 25% (100-10000 Hz)
- Mono: 0%

### 1980s
- Compression: 20%
- Hiss: 5%
- Filtering: 15% (80-12000 Hz)
- Mono: 0%
