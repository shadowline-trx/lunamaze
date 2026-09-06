// A seamless, seeded elevation field. Baking the expensive noise once leaves
// the animation loop free to light and move the planet at display refresh rate.
export function terrainNoise(seed: number) {
  let state = (seed + 1) >>> 0;
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const values = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  const p = new Uint16Array(512);
  for (let i = 0; i < 512; i++) p[i] = values[i & 255];
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const mix = (a: number, b: number, t: number) => a + (b - a) * t;
  const grad = (h: number, x: number, y: number, z: number) => {
    h &= 15;
    const u = h < 8 ? x : y,
      v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return (h & 1 ? -u : u) + (h & 2 ? -v : v);
  };
  return (x: number, y: number, z: number) => {
    const X = Math.floor(x) & 255,
      Y = Math.floor(y) & 255,
      Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    const u = fade(x),
      v = fade(y),
      w = fade(z),
      A = p[X] + Y,
      B = p[X + 1] + Y,
      AA = p[A] + Z,
      AB = p[A + 1] + Z,
      BA = p[B] + Z,
      BB = p[B + 1] + Z;
    return mix(
      mix(
        mix(grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z), u),
        mix(grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z), u),
        v,
      ),
      mix(
        mix(grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1), u),
        mix(
          grad(p[AB + 1], x, y - 1, z - 1),
          grad(p[BB + 1], x - 1, y - 1, z - 1),
          u,
        ),
        v,
      ),
      w,
    );
  };
}

export async function bakeTerrain(
  seed: number,
  width: number,
  cancelled: () => boolean,
) {
  const height = width / 2,
    pixels = new Uint8Array(width * height * 4),
    noise = terrainNoise(seed);
  const fbm = (x: number, y: number, z: number, octaves: number) => {
    let sum = 0,
      amp = 0.5;
    for (let i = 0; i < octaves; i++) {
      sum += noise(x, y, z) * amp;
      x = x * 2.03 + 17.1;
      y = y * 2.03 + 9.2;
      z = z * 2.03 + 3.7;
      amp *= 0.49;
    }
    return sum;
  };
  for (let row = 0; row < height; row++) {
    if (row % 8 === 0) {
      if (cancelled()) return null;
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    }
    const latitude = ((row + 0.5) / height - 0.5) * Math.PI,
      y = Math.sin(latitude),
      r = Math.cos(latitude);
    for (let col = 0; col < width; col++) {
      const longitude = ((col + 0.5) / width - 0.5) * Math.PI * 2,
        x = Math.cos(longitude) * r,
        z = Math.sin(longitude) * r;
      const warp = fbm(x * 2.8 + 8, y * 2.8, z * 2.8, 3);
      const continent = fbm(
        x * 2.15 + warp * 0.8,
        y * 2.15 + warp * 0.6,
        z * 2.15 + warp * 0.8,
        5,
      );
      let ridge = 0,
        scale = 18,
        weight = 0.5;
      for (let octave = 0; octave < 5; octave++) {
        const r =
          1 - Math.abs(noise(x * scale + warp * 4, y * scale, z * scale));
        ridge += r * r * weight;
        scale *= 2.1;
        weight *= 0.52;
      }
      const elevation = Math.max(
        0.02,
        Math.min(
          0.98,
          0.5 +
            continent * 0.72 +
            ridge * 0.025 +
            fbm(x * 65, y * 65, z * 65, 3) * 0.009,
        ),
      );
      const encoded = Math.round(elevation * 65535),
        i = (row * width + col) * 4;
      pixels[i] = encoded >> 8;
      pixels[i + 1] = encoded & 255;
      pixels[i + 2] = Math.round(
        Math.max(0, Math.min(1, 0.5 + fbm(x * 5 + 19, y * 5, z * 5, 4))) * 255,
      );
      const twist = y * 0.9 + warp * 0.6,
        cx = x * Math.cos(twist) - z * Math.sin(twist),
        cz = x * Math.sin(twist) + z * Math.cos(twist);
      const clouds = fbm(cx * 4.5 + 41, y * 4.5, cz * 4.5, 6);
      pixels[i + 3] = Math.round(
        Math.max(0, Math.min(1, 0.48 + clouds * 1.5)) * 255,
      );
    }
  }
  return { pixels, width, height };
}
