# Genesis by Lunamaze

A browser terraforming sandbox with a procedural WebGL planet, three scenarios, climate controls, terrain editing, deterministic time simulation, a device-local save slot, and validated share links.

## Development

Use Node 22.13 or newer. Run `npm ci` and `npm run dev`.

Run `node --experimental-strip-types --test tests/simulation.test.mjs` for the simulation and shared-state checks. Run `npx tsc --noEmit` for type checking and `npm run build` for the static production export in `dist/client`.

Set `GITHUB_PAGES_BUILD=1` when building for `https://lunamaze.com/genesis/`; leave it unset for a root deployment. All fonts and rendering code are bundled locally. The planet is generated from simulation state, with no image API, paid API, account system, or runtime server.

## Simulation model

This is an illustrative toy model, not a scientific prediction. Sunlight and atmosphere set an equilibrium temperature; temperature relaxes toward it over 18 simulation years. A habitability index combines temperature, atmosphere and water availability. Once seeded, a biosphere approaches that index over 65 years. Terrain edits change the displayed elevation field, and impacts damage life and transiently heat the planet. Local latitude and elevation affect visual ice, vegetation and thermal color. Scenario geometry is fictional, including the Mars-inspired scenario.

## Storage and sharing

The browser-local save slot uses `lunamaze-genesis-world-v1`. Shared states are encoded in the URL fragment, validated before loading, and contain only simulation data. They are exact snapshots, not cloud-saved collaborative worlds. Simulation pauses for background tabs and initially pauses when reduced motion is preferred.

## Agent tools

When `document.modelContext` is available, Genesis registers `read_planet`, `configure_planet`, and `advance_simulation`. All mutating inputs are validated and use the same visible app state. The configure and advance tools were exercised in the supporting in-app browser during the rendering upgrade.

## Rendering and browser checks

The renderer bakes seeded 16-bit elevation, moisture, and cloud data incrementally, then lights it on the GPU. Animation follows requestAnimationFrame with adaptive pixel density, damped orbit and zoom, and background/reduced-motion handling. Climate colors ease toward the model state. Clouds occupy a separate apparent radius and cast surface shadows. Sculpting has a surface cursor; impacts add crater rims and a fading shockwave. Night lights are an illustrative effect for mature biospheres, not a separate civilization model.

Cloud cover and camera position are view preferences, not part of saved simulation snapshots. Ambient sound is synthesized locally and starts only on explicit user interaction. Postcards are generated locally as 1600 × 1200 PNGs with a preview and download link. Terrain edits remain limited to 16 per world.

The upgrade was iterated in-browser at desktop, tablet and 390px phone widths. Checks covered shader startup, temperature changes, thermal/terrain views, impact/undo, save/restore, share-link copying, postcard image generation, and responsive tool placement. A local desktop animation sample reached approximately 142 FPS on a high-refresh display; performance depends on hardware. Real-device multitouch and cross-browser download behavior are not covered by these checks. Additional terrain tests run with `node --experimental-strip-types --test tests/terrain.test.mjs`.


## Flight deck interaction update

The observatory now uses a telemetry header, wide planet viewport and climate lab. Dragging stops automatic rotation and moves surface landmarks with the pointer. Zoom is bounded to retain the full globe and atmosphere; fit and explicit zoom controls are available. The circular CSS clip is removed. Pointer capture cleanup and pinch continuation prevent stuck gestures; a pinch cannot apply a terrain edit. Rejected terrain edits preserve undo. Terrain detail now bakes progressively up to 2048 pixels, with softer ice relief and cloud self-shading.

Validation: TypeScript, production build and 11 simulation/terrain/orbit checks pass. Browser checks cover left drag, maximum zoom, fit controls, thermal view and responsive 390px/1440px layouts, without console errors. Physical multi-touch remains unverified.
