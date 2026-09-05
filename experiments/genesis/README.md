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

When `document.modelContext` is available, Genesis registers `read_planet`, `configure_planet`, and `advance_simulation`. All mutating inputs are validated and use the same visible app state. Live WebMCP validation requires a supporting browser; it has not been performed in this environment.
