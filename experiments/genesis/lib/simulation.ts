export type Scenario = 'eden' | 'mars' | 'ice';
export type Tool = 'orbit' | 'raise' | 'lower' | 'life' | 'impact';
export type View = 'natural' | 'thermal' | 'terrain';
export type Stamp = [number, number, number, number];
export type World = { version: 1; scenario: Scenario; seed: number; year: number; sun: number; atmosphere: number; water: number; temperature: number; biomass: number; seeded: boolean; stamps: Stamp[] };
export const scenarios = {
 eden: { name: 'New Eden', tag: 'OPEN SANDBOX', eyebrow: 'A world of your own', description: 'An ocean. A little warmth. The possibility of life.', goal: 'Grow a thriving biosphere above 70%.', seed: 27, sun: 100, atmosphere: 100, water: 56, temperature: 14, biomass: 32, seeded: true },
 mars: { name: 'Red Frontier', tag: 'TERRAFORM MARS', eyebrow: 'From dust to dawn', description: 'Warm a frozen desert. Build an atmosphere. Let life take root.', goal: 'Reach 0–35°C, add water, and grow a biosphere above 40%.', seed: 13, sun: 71, atmosphere: 8, water: 8, temperature: -56, biomass: 0, seeded: false },
 ice: { name: 'The Long Thaw', tag: 'ICE WORLD', eyebrow: 'Wake a sleeping world', description: 'Beneath the ice, an ocean waits for its first spring.', goal: 'Thaw the surface above 0°C and grow a biosphere above 40%.', seed: 64, sun: 76, atmosphere: 62, water: 68, temperature: -32, biomass: 0, seeded: false },
};
export function createWorld(scenario: Scenario = 'eden'): World {
 const p = scenarios[scenario];
 return { version: 1, scenario, seed: p.seed, year: 0, sun: p.sun, atmosphere: p.atmosphere, water: p.water, temperature: p.temperature, biomass: p.biomass, seeded: p.seeded, stamps: [] };
}
export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
export function targetTemperature(w: World) { return -30 + (w.sun - 70) * 1.08 + w.atmosphere * .145 - Math.max(0, w.water - 60) * .09; }
export function habitability(w: World) {
 const heat = clamp(1 - Math.abs(w.temperature - 18) / 50, 0, 1);
 const air = clamp(w.atmosphere / 65, 0, 1) * clamp(1 - Math.max(0, w.atmosphere - 140) / 120, 0, 1);
 const water = clamp(w.water / 32, 0, 1) * clamp((100 - w.water) / 22, 0, 1);
 return Math.round(100 * heat * air * water);
}
export function tick(w: World, years: number): World {
 const temperature = w.temperature + (targetTemperature(w) - w.temperature) * (1 - Math.exp(-years / 18));
 const carryingCapacity = w.seeded ? habitability({ ...w, temperature }) : 0;
 const biomass = clamp(w.biomass + (carryingCapacity - w.biomass) * (1 - Math.exp(-years / 65)), 0, 100);
 return { ...w, year: Math.min(999999, w.year + years), temperature, biomass };
}
export function status(w: World) { return w.temperature < -10 ? 'Frozen world' : w.temperature > 48 ? 'Heat stress' : w.biomass > 70 ? 'Life is flourishing' : w.biomass > 20 ? 'Life is taking root' : w.seeded ? 'A fragile beginning' : 'Awaiting first life'; }
export function isComplete(w: World) { return w.scenario === 'eden' ? w.biomass >= 70 : w.temperature > 0 && w.temperature < 35 && w.biomass >= 40; }
export function validateWorld(value: unknown): World | null {
 if (!value || typeof value !== 'object') return null;
 const w = value as World;
 if (w.version !== 1 || !Object.hasOwn(scenarios, w.scenario) || typeof w.seeded !== 'boolean') return null;
 const ranges: [keyof World, number, number][] = [['seed',0,9999],['year',0,999999],['sun',55,145],['atmosphere',0,200],['water',0,95],['temperature',-120,150],['biomass',0,100]];
 if (ranges.some(([key, lo, hi]) => typeof w[key] !== 'number' || !Number.isFinite(w[key]) || Number(w[key]) < lo || Number(w[key]) > hi)) return null;
 if (!Array.isArray(w.stamps) || w.stamps.length > 16 || w.stamps.some(s => !Array.isArray(s) || s.length !== 4 || s.some(n => typeof n !== 'number' || !Number.isFinite(n)) || s.slice(0,3).some(n => Math.abs(n) > 1.01) || Math.abs(s[3]) > .3)) return null;
 return { version: 1, scenario: w.scenario, seed: w.seed, year: w.year, sun: w.sun, atmosphere: w.atmosphere, water: w.water, temperature: w.temperature, biomass: w.biomass, seeded: w.seeded, stamps: w.stamps.map(s => [...s]) };
}
export function encodeWorld(w: World) { return btoa(JSON.stringify(w)); }
export function decodeWorld(hash: string): World | null { try { if (hash.length > 6000) return null; return validateWorld(JSON.parse(atob(hash))); } catch { return null; } }
