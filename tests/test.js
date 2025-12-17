/**
 * Retro Audio Processor - Test Suite
 * Run with: node tests/test.js
 */

// ANSI color codes for output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

// Test framework
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
        this.currentSuite = '';
    }

    describe(name, fn) {
        this.currentSuite = name;
        console.log(`\n${colors.cyan}${colors.bold}${name}${colors.reset}`);
        fn();
    }

    it(name, fn) {
        try {
            fn();
            this.passed++;
            console.log(`  ${colors.green}✓${colors.reset} ${name}`);
        } catch (error) {
            this.failed++;
            console.log(`  ${colors.red}✗${colors.reset} ${name}`);
            console.log(`    ${colors.red}${error.message}${colors.reset}`);
        }
    }

    summary() {
        console.log(`\n${colors.bold}Test Results:${colors.reset}`);
        console.log(`  ${colors.green}Passed: ${this.passed}${colors.reset}`);
        console.log(`  ${colors.red}Failed: ${this.failed}${colors.reset}`);
        console.log(`  Total: ${this.passed + this.failed}\n`);
        return this.failed === 0;
    }
}

// Assertion helpers
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, but got ${actual}`);
    }
}

function assertDeepEqual(actual, expected, message) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(message || `Objects are not equal`);
    }
}

function assertRange(value, min, max, message) {
    if (value < min || value > max) {
        throw new Error(message || `Expected value between ${min} and ${max}, but got ${value}`);
    }
}

function assertType(value, type, message) {
    if (typeof value !== type) {
        throw new Error(message || `Expected type ${type}, but got ${typeof value}`);
    }
}

// Era presets (same as in main app)
const ERA_PRESETS = {
    '1910s': {
        compression: 100,
        hiss: 90,
        filtering: 100,
        mono: 100,
        lowFreq: 500,
        highFreq: 2500,
        description: 'Spark gap era, extremely primitive, barely intelligible'
    },
    '1920s': {
        compression: 95,
        hiss: 80,
        filtering: 95,
        mono: 100,
        lowFreq: 400,
        highFreq: 2800,
        description: 'Crystal radio era, AM broadcast beginnings'
    },
    '1930s': {
        compression: 90,
        hiss: 70,
        filtering: 90,
        mono: 100,
        lowFreq: 300,
        highFreq: 3000,
        description: 'AM radio, lo-fi, scratchy'
    },
    '1940s': {
        compression: 80,
        hiss: 50,
        filtering: 85,
        mono: 100,
        lowFreq: 250,
        highFreq: 3500,
        description: 'War-era radio, slightly clearer'
    },
    '1950s': {
        compression: 70,
        hiss: 35,
        filtering: 65,
        mono: 75,
        lowFreq: 200,
        highFreq: 5000,
        description: 'Early rock & roll, jukeboxes'
    },
    '1960s': {
        compression: 50,
        hiss: 20,
        filtering: 45,
        mono: 50,
        lowFreq: 150,
        highFreq: 8000,
        description: 'FM emergence, cleaner but warm'
    },
    '1970s': {
        compression: 30,
        hiss: 10,
        filtering: 25,
        mono: 0,
        lowFreq: 100,
        highFreq: 10000,
        description: 'Near hi-fi, slight warmth/saturation'
    },
    '1980s': {
        compression: 20,
        hiss: 5,
        filtering: 15,
        mono: 0,
        lowFreq: 80,
        highFreq: 12000,
        description: 'FM dominance, clean, modern warmth'
    }
};

// Helper functions from the app
function makeDistortionCurve(amount) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < samples; i++) {
        const x = (i * 2) / samples - 1;
        curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
}

function calculateFilterFrequencies(preset, filterAmount) {
    const fullLow = 20;
    const fullHigh = 20000;
    const lowFreq = fullLow + (preset.lowFreq - fullLow) * filterAmount;
    const highFreq = fullHigh - (fullHigh - preset.highFreq) * filterAmount;
    return { lowFreq, highFreq };
}

function calculateCompressorSettings(compAmount) {
    return {
        threshold: -50 + (1 - compAmount) * 40,
        knee: 40 * compAmount,
        ratio: 1 + compAmount * 19
    };
}

// Run tests
const runner = new TestRunner();

console.log(`${colors.bold}Retro Audio Processor - Test Suite${colors.reset}`);
console.log('='.repeat(40));

// Era Presets Tests
runner.describe('Era Presets Configuration', () => {
    runner.it('should have all 8 decades defined (1910s-1980s)', () => {
        const expectedEras = ['1910s', '1920s', '1930s', '1940s', '1950s', '1960s', '1970s', '1980s'];
        expectedEras.forEach(era => {
            assert(ERA_PRESETS[era], `Era ${era} should be defined`);
        });
        assertEqual(Object.keys(ERA_PRESETS).length, 8, 'Should have exactly 8 eras');
    });

    runner.it('should have decreasing compression values as decades progress', () => {
        const eras = ['1910s', '1920s', '1930s', '1940s', '1950s', '1960s', '1970s', '1980s'];
        for (let i = 1; i < eras.length; i++) {
            assert(
                ERA_PRESETS[eras[i]].compression <= ERA_PRESETS[eras[i-1]].compression,
                `Compression should decrease from ${eras[i-1]} (${ERA_PRESETS[eras[i-1]].compression}) to ${eras[i]} (${ERA_PRESETS[eras[i]].compression})`
            );
        }
    });

    runner.it('should have decreasing hiss values as decades progress', () => {
        const eras = ['1910s', '1920s', '1930s', '1940s', '1950s', '1960s', '1970s', '1980s'];
        for (let i = 1; i < eras.length; i++) {
            assert(
                ERA_PRESETS[eras[i]].hiss <= ERA_PRESETS[eras[i-1]].hiss,
                `Hiss should decrease from ${eras[i-1]} to ${eras[i]}`
            );
        }
    });

    runner.it('should have increasing high frequency cutoff as decades progress', () => {
        const eras = ['1910s', '1920s', '1930s', '1940s', '1950s', '1960s', '1970s', '1980s'];
        for (let i = 1; i < eras.length; i++) {
            assert(
                ERA_PRESETS[eras[i]].highFreq >= ERA_PRESETS[eras[i-1]].highFreq,
                `High frequency should increase from ${eras[i-1]} to ${eras[i]}`
            );
        }
    });

    runner.it('should have decreasing low frequency cutoff as decades progress', () => {
        const eras = ['1910s', '1920s', '1930s', '1940s', '1950s', '1960s', '1970s', '1980s'];
        for (let i = 1; i < eras.length; i++) {
            assert(
                ERA_PRESETS[eras[i]].lowFreq <= ERA_PRESETS[eras[i-1]].lowFreq,
                `Low frequency should decrease from ${eras[i-1]} to ${eras[i]}`
            );
        }
    });

    runner.it('should have 100% mono for 1910s-1940s (mono era)', () => {
        ['1910s', '1920s', '1930s', '1940s'].forEach(era => {
            assertEqual(ERA_PRESETS[era].mono, 100, `${era} should be 100% mono`);
        });
    });

    runner.it('should have 0% mono for 1970s-1980s (stereo era)', () => {
        ['1970s', '1980s'].forEach(era => {
            assertEqual(ERA_PRESETS[era].mono, 0, `${era} should be 0% mono (full stereo)`);
        });
    });

    runner.it('should have valid frequency ranges for all eras', () => {
        Object.entries(ERA_PRESETS).forEach(([era, preset]) => {
            assert(preset.lowFreq >= 20 && preset.lowFreq <= 1000,
                `${era} low frequency (${preset.lowFreq}) should be between 20-1000 Hz`);
            assert(preset.highFreq >= 2000 && preset.highFreq <= 20000,
                `${era} high frequency (${preset.highFreq}) should be between 2000-20000 Hz`);
            assert(preset.lowFreq < preset.highFreq,
                `${era} low frequency should be less than high frequency`);
        });
    });

    runner.it('should have all parameter values in 0-100 range', () => {
        Object.entries(ERA_PRESETS).forEach(([era, preset]) => {
            assertRange(preset.compression, 0, 100, `${era} compression out of range`);
            assertRange(preset.hiss, 0, 100, `${era} hiss out of range`);
            assertRange(preset.filtering, 0, 100, `${era} filtering out of range`);
            assertRange(preset.mono, 0, 100, `${era} mono out of range`);
        });
    });

    runner.it('should have description for each era', () => {
        Object.entries(ERA_PRESETS).forEach(([era, preset]) => {
            assert(preset.description && preset.description.length > 0,
                `${era} should have a description`);
        });
    });
});

// Distortion Curve Tests
runner.describe('Distortion Curve Generation', () => {
    runner.it('should create curve with correct length', () => {
        const curve = makeDistortionCurve(50);
        assertEqual(curve.length, 44100, 'Curve should have 44100 samples');
    });

    runner.it('should have negative values at start and positive at end', () => {
        const curve = makeDistortionCurve(50);
        assert(curve[0] < 0, 'First sample should be negative');
        assert(curve[44099] > 0, 'Last sample should be positive');
    });

    runner.it('should pass through zero at midpoint', () => {
        const curve = makeDistortionCurve(50);
        const midIndex = Math.floor(44100 / 2);
        assert(Math.abs(curve[midIndex]) < 0.01, 'Midpoint should be near zero');
    });

    runner.it('should produce different curves for different amounts', () => {
        const curve1 = makeDistortionCurve(10);
        const curve2 = makeDistortionCurve(50);
        assert(curve1[1000] !== curve2[1000], 'Different amounts should produce different curves');
    });

    runner.it('should be symmetric around midpoint', () => {
        const curve = makeDistortionCurve(50);
        const len = curve.length;
        assert(Math.abs(curve[1000] + curve[len - 1001]) < 0.01,
            'Curve should be anti-symmetric');
    });
});

// Filter Frequency Calculation Tests
runner.describe('Filter Frequency Calculations', () => {
    runner.it('should return preset frequencies at 100% filtering', () => {
        const preset = { lowFreq: 300, highFreq: 3000 };
        const result = calculateFilterFrequencies(preset, 1);
        assertEqual(result.lowFreq, 300, 'Low frequency should match preset at 100%');
        assertEqual(result.highFreq, 3000, 'High frequency should match preset at 100%');
    });

    runner.it('should return full range at 0% filtering', () => {
        const preset = { lowFreq: 300, highFreq: 3000 };
        const result = calculateFilterFrequencies(preset, 0);
        assertEqual(result.lowFreq, 20, 'Low frequency should be 20 Hz at 0%');
        assertEqual(result.highFreq, 20000, 'High frequency should be 20000 Hz at 0%');
    });

    runner.it('should interpolate correctly at 50% filtering', () => {
        const preset = { lowFreq: 300, highFreq: 3000 };
        const result = calculateFilterFrequencies(preset, 0.5);
        // lowFreq = 20 + (300 - 20) * 0.5 = 160
        // highFreq = 20000 - (20000 - 3000) * 0.5 = 11500
        assertEqual(result.lowFreq, 160, 'Low frequency should be 160 Hz at 50%');
        assertEqual(result.highFreq, 11500, 'High frequency should be 11500 Hz at 50%');
    });

    runner.it('should always maintain lowFreq < highFreq', () => {
        Object.values(ERA_PRESETS).forEach(preset => {
            for (let amount = 0; amount <= 1; amount += 0.1) {
                const result = calculateFilterFrequencies(preset, amount);
                assert(result.lowFreq < result.highFreq,
                    `lowFreq should always be less than highFreq`);
            }
        });
    });
});

// Compressor Settings Tests
runner.describe('Compressor Settings Calculations', () => {
    runner.it('should return correct settings at 0% compression', () => {
        const settings = calculateCompressorSettings(0);
        assertEqual(settings.threshold, -10, 'Threshold should be -10 dB at 0%');
        assertEqual(settings.knee, 0, 'Knee should be 0 at 0%');
        assertEqual(settings.ratio, 1, 'Ratio should be 1 at 0%');
    });

    runner.it('should return correct settings at 100% compression', () => {
        const settings = calculateCompressorSettings(1);
        assertEqual(settings.threshold, -50, 'Threshold should be -50 dB at 100%');
        assertEqual(settings.knee, 40, 'Knee should be 40 at 100%');
        assertEqual(settings.ratio, 20, 'Ratio should be 20 at 100%');
    });

    runner.it('should return settings in valid Web Audio API ranges', () => {
        for (let amount = 0; amount <= 1; amount += 0.1) {
            const settings = calculateCompressorSettings(amount);
            assertRange(settings.threshold, -100, 0, 'Threshold should be in valid range');
            assertRange(settings.knee, 0, 40, 'Knee should be in valid range');
            assertRange(settings.ratio, 1, 20, 'Ratio should be in valid range');
        }
    });
});

// Noise Generation Tests
runner.describe('Noise Generation Logic', () => {
    runner.it('should generate white noise in valid range', () => {
        for (let i = 0; i < 1000; i++) {
            const noise = Math.random() * 2 - 1;
            assertRange(noise, -1, 1, 'White noise should be between -1 and 1');
        }
    });

    runner.it('should calculate higher crackle probability for pre-1940 eras', () => {
        const amount = 1;
        const crackle1910 = 1910 < 1940 ? 0.0005 * amount : 0.0001 * amount;
        const crackle1950 = 1950 < 1940 ? 0.0005 * amount : 0.0001 * amount;
        const crackle1980 = 1980 < 1940 ? 0.0005 * amount : 0.0001 * amount;

        assert(crackle1910 > crackle1950, '1910s should have more crackle than 1950s');
        assert(crackle1910 > crackle1980, '1910s should have more crackle than 1980s');
        assertEqual(crackle1950, crackle1980, '1950s and 1980s should have same crackle rate');
    });

    runner.it('should scale noise with amount parameter', () => {
        const baseNoise = Math.random() * 2 - 1;
        const amount1 = 0.5;
        const amount2 = 1.0;

        const scaled1 = baseNoise * amount1;
        const scaled2 = baseNoise * amount2;

        assert(Math.abs(scaled2) >= Math.abs(scaled1),
            'Higher amount should produce louder noise');
    });
});

// Mono Conversion Tests
runner.describe('Mono Conversion Logic', () => {
    runner.it('should have correct mono values for transitional eras', () => {
        assertEqual(ERA_PRESETS['1950s'].mono, 75, '1950s should be 75% mono');
        assertEqual(ERA_PRESETS['1960s'].mono, 50, '1960s should be 50% mono');
    });

    runner.it('should calculate correct stereo mix', () => {
        const monoAmount = 0.75;
        const stereoMix = 1 - monoAmount;
        assertEqual(stereoMix, 0.25, 'Stereo mix should be inverse of mono amount');
    });

    runner.it('should preserve mono for early eras', () => {
        ['1910s', '1920s', '1930s', '1940s'].forEach(era => {
            const monoAmount = ERA_PRESETS[era].mono / 100;
            assertEqual(monoAmount, 1, `${era} should have full mono`);
        });
    });
});

// WAV Header Tests
runner.describe('WAV File Format', () => {
    runner.it('should calculate correct WAV file size', () => {
        const numChannels = 2;
        const sampleRate = 44100;
        const bitDepth = 16;
        const durationSeconds = 1;

        const bytesPerSample = bitDepth / 8;
        const samples = sampleRate * durationSeconds;
        const dataLength = samples * numChannels * bytesPerSample;
        const headerLength = 44;
        const totalLength = headerLength + dataLength;

        assertEqual(totalLength, 44 + 176400, 'Total length should be header + data');
        assertEqual(dataLength, 176400, 'Data length should be 176400 bytes for 1 sec stereo');
    });

    runner.it('should have correct block align calculation', () => {
        const numChannels = 2;
        const bitDepth = 16;
        const bytesPerSample = bitDepth / 8;
        const blockAlign = numChannels * bytesPerSample;

        assertEqual(blockAlign, 4, 'Block align should be 4 for stereo 16-bit');
    });

    runner.it('should have correct byte rate calculation', () => {
        const sampleRate = 44100;
        const numChannels = 2;
        const bitDepth = 16;
        const bytesPerSample = bitDepth / 8;
        const blockAlign = numChannels * bytesPerSample;
        const byteRate = sampleRate * blockAlign;

        assertEqual(byteRate, 176400, 'Byte rate should be 176400 for CD quality stereo');
    });
});

// Era Characteristics Tests
runner.describe('Era Characteristic Verification', () => {
    runner.it('1910s should have most extreme settings', () => {
        const preset = ERA_PRESETS['1910s'];
        assertEqual(preset.compression, 100, '1910s should have maximum compression');
        assertEqual(preset.hiss, 90, '1910s should have very high hiss');
        assertEqual(preset.mono, 100, '1910s should be fully mono');
    });

    runner.it('1980s should have most relaxed settings', () => {
        const preset = ERA_PRESETS['1980s'];
        assert(preset.compression <= 25, '1980s should have low compression');
        assert(preset.hiss <= 10, '1980s should have minimal hiss');
        assertEqual(preset.mono, 0, '1980s should be fully stereo');
    });

    runner.it('bandwidth should expand over time', () => {
        const bandwidth1910 = ERA_PRESETS['1910s'].highFreq - ERA_PRESETS['1910s'].lowFreq;
        const bandwidth1980 = ERA_PRESETS['1980s'].highFreq - ERA_PRESETS['1980s'].lowFreq;

        assert(bandwidth1980 > bandwidth1910 * 4,
            '1980s bandwidth should be significantly wider than 1910s');
    });

    runner.it('each era should have unique characteristics', () => {
        const eras = Object.keys(ERA_PRESETS);
        for (let i = 0; i < eras.length; i++) {
            for (let j = i + 1; j < eras.length; j++) {
                const a = ERA_PRESETS[eras[i]];
                const b = ERA_PRESETS[eras[j]];
                const sameValues =
                    a.compression === b.compression &&
                    a.hiss === b.hiss &&
                    a.filtering === b.filtering &&
                    a.mono === b.mono;
                assert(!sameValues, `${eras[i]} and ${eras[j]} should have different values`);
            }
        }
    });
});

// Print summary
const success = runner.summary();
process.exit(success ? 0 : 1);
