// Reference values for scoring. Every number here needs a source or a "provisional" flag.

// Adult male speaking F0: mean 115 Hz, SD 21 Hz.
// Source: Sydney Voice Lab, "Acoustic analysis normative data reference sheet" v4.0 (2025-04-16).
// voicescience.org lists ~93-135 Hz as the typical adult male range (mean ~116 Hz), which agrees.
export const MALE_F0 = Object.freeze({ meanHz: 115, sdHz: 21, provisional: false });

// Formant spacing (deltaF, Reby & McComb regression over F1-F4) for adult men.
// A 17 cm vocal tract gives ~1030 Hz (c / 2L, c = 35000 cm/s). The SD is a guess.
// PROVISIONAL: recalibrate from the Gate 1 lab recordings before showing it as a percentile.
export const MALE_DF = Object.freeze({ meanHz: 1040, sdHz: 60, provisional: true });

// Frame-to-frame pitch change (median |delta| in semitones per 10 ms) mapped to steadiness.
// PROVISIONAL: calibrate on Gate 1 recordings.
export const STEADINESS = Object.freeze({ best: 0.05, worst: 0.5, provisional: true });

export const SPEED_OF_SOUND_CM_S = 35000;
