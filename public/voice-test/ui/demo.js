// Synthetic speech for the welcome screen's demonstration (no mic, no audio). Same shapes as the
// design board's synth: syllables about 4 a second, a pause every 2.4 s, pitch falling in each phrase.
export const synth = {
  speech(t, seed = 0) {
    const phrase = (t + seed) % 2.4;
    if (phrase > 1.9) return 0.04;
    const syl = Math.max(0, Math.sin((t + seed) * Math.PI * 4.2)) ** 1.6;
    const wob = 0.75 + 0.25 * Math.sin((t + seed) * 1.7);
    return Math.min(1, 0.12 + 0.8 * syl * wob);
  },
  read(t, mean = 128, seed = 0) {
    const phrase = (t + seed) % 2.4;
    if (phrase > 1.9) return 0;
    const decl = 1.06 - 0.1 * (phrase / 1.9);
    return mean * decl * (1 + 0.018 * Math.sin(t * 3.1 + seed) + 0.008 * Math.sin(t * 7.3));
  },
};
