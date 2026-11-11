// 16-bit PCM mono WAV encode/decode. No DOM (Node tests use it too).

export function encodeWav(pcm, fs) {
  const n = pcm.length;
  const buf = new ArrayBuffer(44 + n * 2);
  const v = new DataView(buf);
  const str = (o, s) => {
    for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
  };
  str(0, 'RIFF');
  v.setUint32(4, 36 + n * 2, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, fs, true);
  v.setUint32(28, fs * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  str(36, 'data');
  v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, pcm[i]));
    v.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Uint8Array(buf);
}

export function decodeWav(arrayBuffer) {
  const v = new DataView(arrayBuffer);
  let off = 12;
  let fs = 0;
  let channels = 1;
  let bits = 16;
  while (off + 8 <= v.byteLength) {
    const id = String.fromCharCode(v.getUint8(off), v.getUint8(off + 1), v.getUint8(off + 2), v.getUint8(off + 3));
    const size = v.getUint32(off + 4, true);
    if (id === 'fmt ') {
      channels = v.getUint16(off + 10, true);
      fs = v.getUint32(off + 12, true);
      bits = v.getUint16(off + 22, true);
    } else if (id === 'data') {
      if (bits !== 16) throw new Error('only 16-bit WAV supported');
      const frames = size / (2 * channels);
      const pcm = new Float32Array(frames);
      for (let i = 0; i < frames; i++) pcm[i] = v.getInt16(off + 8 + i * 2 * channels, true) / 0x8000;
      return { pcm, fs };
    }
    off += 8 + size + (size % 2);
  }
  throw new Error('no data chunk');
}
