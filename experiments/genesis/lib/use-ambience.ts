'use client';
import { useEffect, useRef, useState } from 'react';

export function useAmbience() {
  const context = useRef<AudioContext | null>(null),
    [enabled, setEnabled] = useState(false);
  useEffect(
    () => () => {
      void context.current?.close();
    },
    [],
  );
  async function toggle() {
    if (enabled) {
      await context.current?.suspend();
      setEnabled(false);
      return;
    }
    if (!context.current) {
      const audio = new AudioContext();
      context.current = audio;
      const master = audio.createGain();
      master.gain.value = 0.065;
      master.connect(audio.destination);
      for (const [index, hz] of [65.406, 98, 130.81, 196.0].entries()) {
        const tone = audio.createOscillator(),
          gain = audio.createGain();
        tone.type = 'sine';
        tone.frequency.value = hz;
        tone.detune.value = index * 2 - 3;
        gain.gain.value = 0.18 / (index + 1);
        tone.connect(gain);
        gain.connect(master);
        tone.start();
        const lfo = audio.createOscillator(),
          depth = audio.createGain();
        lfo.frequency.value = 0.05 + index * 0.013;
        depth.gain.value = 0.04 / (index + 1);
        lfo.connect(depth);
        depth.connect(gain.gain);
        lfo.start();
      }
    }
    try {
      await context.current.resume();
      setEnabled(true);
    } catch {
      setEnabled(false);
    }
  }
  return { enabled, toggle };
}
