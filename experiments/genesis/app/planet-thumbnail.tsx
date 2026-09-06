'use client';
import { useEffect, useRef } from 'react';
import { bakeTerrain } from '@/lib/terrain';
import { scenarios, type Scenario } from '@/lib/simulation';

export default function PlanetThumbnail({ scenario }: { scenario: Scenario }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let cancelled = false;
    const s = scenarios[scenario];
    void bakeTerrain(s.seed, 256, () => cancelled).then((map) => {
      if (!map || cancelled || !ref.current) return;
      const ctx = ref.current.getContext('2d');
      if (!ctx) return;
      const size = 180,
        img = ctx.createImageData(size, size),
        sea = 0.315 + s.water * 0.0037;
      for (let y = 0; y < size; y++)
        for (let x = 0; x < size; x++) {
          const nx = (x - size / 2) / (size * 0.44),
            ny = -(y - size / 2) / (size * 0.44),
            r = nx * nx + ny * ny;
          if (r > 1) continue;
          const nz = Math.sqrt(1 - r),
            lon = Math.atan2(nz, nx),
            lat = Math.asin(ny),
            tx =
              Math.floor((lon / (2 * Math.PI) + 0.5) * map.width) % map.width,
            ty = Math.min(
              map.height - 1,
              Math.floor((lat / Math.PI + 0.5) * map.height),
            ),
            i = (ty * map.width + tx) * 4,
            h = (map.pixels[i] * 256 + map.pixels[i + 1]) / 65535,
            moist = map.pixels[i + 2] / 255,
            cloud = map.pixels[i + 3] / 255;
          let color =
            h < sea
              ? [5, 42, 58]
              : scenario === 'mars'
                ? [152 + moist * 45, 78 + moist * 45, 42 + moist * 25]
                : [54 + moist * 40, 78 + moist * 40, 41 + moist * 20];
          if (
            scenario === 'ice' ||
            (scenario === 'eden' && Math.abs(ny) > 0.78)
          )
            color = [180, 209, 212];
          const shade = Math.max(0.045, -nx * 0.6 + ny * 0.3 + nz * 0.8);
          const clouds =
            scenario === 'mars' ? 0 : Math.max(0, (cloud - 0.54) * 1.9);
          const o = (y * size + x) * 4;
          for (let c = 0; c < 3; c++)
            img.data[o + c] = (color[c] * (1 - clouds) + 230 * clouds) * shade;
          img.data[o + 3] = Math.min(255, (1 - r) * 20000);
        }
      ctx.putImageData(img, 0, 0);
    });
    return () => {
      cancelled = true;
    };
  }, [scenario]);
  return (
    <canvas
      ref={ref}
      width={180}
      height={180}
      aria-hidden="true"
      className="scenario-planet"
    />
  );
}
