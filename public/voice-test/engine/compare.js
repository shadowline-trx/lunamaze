// Before vs after the 60-second reset. Honest by construction: it only reports changes it measured.

export const GATE_PITCH_ST = -1; // a measurable drop for the Gate 1 lab test
export const GATE_DF_PCT = -3;

export function compareTakes(before, after) {
  const dSt = 12 * Math.log2(after.f0Median / before.f0Median);
  const dHz = after.f0Median - before.f0Median;
  const bDf = before.resonance?.deltaF;
  const aDf = after.resonance?.deltaF;
  const dDfPct = Number.isFinite(bDf) && Number.isFinite(aDf) ? (aDf / bDf - 1) * 100 : 0;
  const dScore = Math.round((after.scores.overall - before.scores.overall) * 10) / 10;
  const pitchDrop = dSt <= GATE_PITCH_ST;
  const resonanceDrop = dDfPct <= GATE_DF_PCT;
  const endingsBetter = after.phraseCount > 0 && after.risingCount < before.risingCount;
  const fakeDeep = after.fryPct >= 0.2 && after.fryPct > before.fryPct + 0.1;

  const highlights = [];
  if (dSt <= -0.5) {
    highlights.push({
      key: 'pitch',
      title: `${Math.round(before.f0Median)} → ${Math.round(after.f0Median)} Hz`,
      sub: `${Math.abs(dSt).toFixed(1)} semitones deeper`,
    });
  }
  if (dDfPct <= -1.5) {
    highlights.push({
      key: 'resonance',
      title: `Resonance ${before.scores.resonance.toFixed(1)} → ${after.scores.resonance.toFixed(1)}`,
      sub: 'darker, fuller tone',
    });
  }
  if (endingsBetter) {
    highlights.push({
      key: 'endings',
      title: `Rising endings ${before.risingCount} → ${after.risingCount}`,
      sub: 'you sound sure, not like you are asking',
    });
  }

  const improved = highlights.length > 0 && !fakeDeep;
  return {
    dSt,
    dHz,
    dDfPct,
    dScore,
    pitchDrop,
    resonanceDrop,
    measurableDrop: pitchDrop || resonanceDrop,
    endingsBetter,
    fakeDeep,
    improved,
    highlights,
  };
}
