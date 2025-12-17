# Era Radio Filter

A single-page HTML application that transforms audio files to sound like they're being played over vintage radios from different eras (1910s-1980s).

## Features

- **8 Era Presets**: Transform audio to sound like it's from the 1910s through 1980s
- **Real-time Processing**: Uses Web Audio API for instant audio processing
- **Adjustable Parameters**: Fine-tune compression, hiss/noise, filtering, and mono blend
- **Drag & Drop Upload**: Easy file upload with drag-and-drop support
- **Audio Playback**: Compare original and processed audio in real-time
- **Download**: Export processed audio as WAV

## Era Presets

| Era | Character | Bandpass | Compression | Noise |
|-----|-----------|----------|-------------|-------|
| **1910s** | Spark gap era, extremely primitive | 500-2500 Hz | Very Heavy | Very High |
| **1920s** | Crystal radio, AM broadcast beginnings | 400-2800 Hz | Very Heavy | High |
| **1930s** | AM radio, lo-fi, scratchy | 300-3000 Hz | Heavy | High |
| **1940s** | War-era radio, slightly clearer | 250-3500 Hz | Heavy | Medium-High |
| **1950s** | Early rock & roll, jukeboxes | 200-5000 Hz | Medium-Heavy | Medium |
| **1960s** | FM emergence, cleaner but warm | 150-8000 Hz | Medium | Low-Medium |
| **1970s** | Near hi-fi, slight warmth/saturation | 100-10000 Hz | Light-Medium | Low |
| **1980s** | FM dominance, clean, modern warmth | 80-12000 Hz | Light | Very Low |

## Usage

1. Open `index.html` in a modern web browser
2. Upload an audio file (MP3, WAV, OGG, FLAC supported)
3. Select an era preset (1910s-1980s)
4. Adjust parameters as desired:
   - **Compression**: Dynamic range compression intensity
   - **Record Hiss/Noise**: Amount of static and crackle
   - **Filtering**: Bandpass filter intensity (narrower = more vintage)
   - **Mono Blend**: Stereo to mono conversion amount
5. Click "Play Processed" to preview the effect
6. Click "Download" to save the processed audio

## Audio Processing Chain

```
Input -> Mono Conversion -> Bandpass Filter -> Bit Crusher -> Compressor -> Noise Mix -> Output
```

### Processing Details

- **Mono Conversion**: Blends stereo channels based on era (older eras were mono)
- **Bandpass Filter**: High-pass and low-pass filters limit frequency range
- **Waveshaper**: Adds subtle distortion/warmth for older eras
- **Compressor**: Simulates broadcast limiting common in radio
- **Noise Layer**: Adds filtered pink/white noise with optional crackle

## Running Tests

### Browser Tests
Open `tests/test.html` in a web browser to run the interactive test suite.

### Node.js Tests
```bash
node tests/test.js
```

## Technical Requirements

- Modern web browser with Web Audio API support (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- No external dependencies required

## Browser Compatibility

- Chrome 35+
- Firefox 25+
- Safari 14.1+
- Edge 79+

## File Structure

```
era-radio-audio-filter/
├── index.html      # Main application
├── SPEC.md         # Project specification
├── README.md       # This file
├── LICENSE         # License file
└── tests/
    ├── test.html   # Browser-based tests
    └── test.js     # Node.js tests
```

## License

MIT License - See LICENSE file for details
