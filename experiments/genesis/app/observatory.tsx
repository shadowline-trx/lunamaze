'use client';

import { useEffect, useRef, useState } from 'react';

import {
  AudioLines,
  VolumeX,
  Shuffle,
  Cloud,
  ArrowUpRight,
  Check,
  CircleHelp,
  Droplets,
  Earth,
  Flame,
  Globe2,
  Leaf,
  Mountain,
  Orbit,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Save,
  Share2,
  Snowflake,
  Sparkles,
  Sun,
  Thermometer,
  Undo2,
  Waves,
  Wind,
  X,
  Zap,
} from 'lucide-react';

import { Slider } from '@/components/ui/slider';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Progress } from '@/components/ui/progress';

import Planet from './planet';

import PlanetThumbnail from './planet-thumbnail';

import { useAmbience } from '@/lib/use-ambience';

import {
  createWorld,
  decodeWorld,
  encodeWorld,
  habitability,
  isComplete,
  scenarios,
  status,
  targetTemperature,
  tick,
  validateWorld,
  type Scenario,
  type Stamp,
  type Tool,
  type View,
  type World,
} from '@/lib/simulation';

import { usePlanetTools } from '@/lib/planet-tools';

const toolList: {
  id: Tool;
  label: string;
  icon: typeof Orbit;
  hint: string;
}[] = [
  {
    id: 'orbit',
    label: 'Explore',
    icon: Orbit,
    hint: 'Drag to orbit · Scroll to get closer',
  },

  {
    id: 'raise',
    label: 'Raise land',
    icon: Mountain,
    hint: 'Tap the planet to raise a mountain range',
  },

  {
    id: 'lower',
    label: 'Carve ocean',
    icon: Waves,
    hint: 'Tap the planet to carve an ocean basin',
  },

  {
    id: 'life',
    label: 'Seed life',
    icon: Leaf,
    hint: 'Tap the planet to introduce your first organisms',
  },

  {
    id: 'impact',
    label: 'Impact',
    icon: Zap,
    hint: 'Tap the planet to strike it with an asteroid',
  },
];

const STORAGE = 'lunamaze-genesis-world-v1';

export default function Observatory() {
  const [world, setWorld] = useState<World>(() => createWorld()),
    [view, setView] = useState<View>('natural'),
    [tool, setTool] = useState<Tool>('orbit'),
    [running, setRunning] = useState(true),
    [speed, setSpeed] = useState(1);

  const [notice, setNotice] = useState(''),
    [dialog, setDialog] = useState<'guide' | 'save' | 'reset' | 'share' | null>(
      null,
    ),
    [saved, setSaved] = useState<World | null>(null),
    [shareURL, setShareURL] = useState('');

  const [log, setLog] = useState([
    { year: 0, text: 'First light reaches New Eden.' },
  ]);

  const [undo, setUndo] = useState<World | null>(null),
    [ready, setReady] = useState(false);

  const [clouds, setClouds] = useState(65);

  const ambience = useAmbience();

  const completed = useRef(false),
    noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const worldRef = useRef(world);
  worldRef.current = world;

  usePlanetTools(world, setWorld);

  function tell(message: string) {
    setNotice(message);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(''), 4500);
  }

  function record(text: string) {
    setLog((items) =>
      [{ year: Math.floor(worldRef.current.year), text }, ...items].slice(0, 6),
    );
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setSaved(validateWorld(JSON.parse(raw)));
    } catch {}

    const hash = window.location.hash;

    if (hash.startsWith('#world=')) {
      const loaded = decodeWorld(hash.slice(7));
      if (loaded) {
        setWorld(loaded);
        setRunning(false);
        setLog([
          {
            year: loaded.year,
            text: 'A shared world has arrived. Make it your own.',
          },
        ]);
      } else
        tell('This world link is invalid. A fresh world is ready to explore.');
    } else {
      const s = new URLSearchParams(window.location.search).get('scenario');
      if (s && Object.hasOwn(scenarios, s)) {
        setWorld(createWorld(s as Scenario));
        setLog([
          {
            year: 0,
            text: `First light reaches ${scenarios[s as Scenario].name}.`,
          },
        ]);
      }
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      setRunning(false);

    setReady(true);

    return () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!running || !ready) return;
    const id = setInterval(() => {
      if (!document.hidden) setWorld((w) => tick(w, speed));
    }, 1000);
    return () => clearInterval(id);
  }, [running, speed, ready]);

  useEffect(() => {
    if (isComplete(world) && !completed.current) {
      completed.current = true;
      record('A living world. Your challenge is complete.');
      tell('A living world. Challenge complete — keep exploring.');
    }
  }, [world]);

  function changeScenario(s: Scenario) {
    setUndo(world);
    setWorld(createWorld(s));
    setLog([{ year: 0, text: `First light reaches ${scenarios[s].name}.` }]);
    completed.current = false;
    setTool('orbit');
    setRunning(true);
    if (typeof window !== 'undefined')
      history.replaceState(
        null,
        '',
        window.location.pathname + '?scenario=' + s,
      );
  }

  function adjust(key: 'sun' | 'atmosphere' | 'water', value: number) {
    setWorld((w) => ({ ...w, [key]: value }));
  }

  function sculpt(point: [number, number, number]) {
    if (tool === 'life') {
      setUndo(world);
      setWorld((w) => ({
        ...w,
        seeded: true,
        biomass: Math.max(w.biomass, 2),
      }));
      record('Life introduced. A stable climate will help it spread.');
      tell('Life seeded. Give it warmth, water and time.');
      return true;
    }

    if (world.stamps.length >= 16) {
      tell(
        'This world has 16 terrain edits. Undo the last edit or reset to start a new landscape.',
      );
      return false;
    }

    setUndo(world);
    const strength = tool === 'raise' ? 0.22 : tool === 'impact' ? -0.28 : -0.2;

    setWorld((w) => ({
      ...w,
      stamps: [...w.stamps, [...point, strength] as Stamp],
      ...(tool === 'impact'
        ? {
            temperature: Math.min(150, w.temperature + 14),
            biomass: w.biomass * 0.65,
          }
        : {}),
    }));

    record(
      tool === 'raise'
        ? 'A mountain range rises from the surface.'
        : tool === 'lower'
          ? 'A new basin reshapes the landscape.'
          : 'An impact heats the planet and damages its biosphere.',
    );
    return true;
  }

  function save() {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(world));
      setSaved(world);
      tell('World saved on this device.');
      setDialog(null);
    } catch {
      tell(
        'Your browser could not save this world. Use Share world to keep a link instead.',
      );
    }
  }

  async function share() {
    const url =
      window.location.origin +
      window.location.pathname +
      '#world=' +
      encodeWorld(world);
    setShareURL(url);
    try {
      await navigator.clipboard.writeText(url);
      tell('World link copied. Anyone with it can continue your experiment.');
    } catch {
      setDialog('share');
    }
  }

  function undoAction() {
    if (undo) {
      setWorld(undo);
      setUndo(null);
      completed.current = isComplete(undo);
      record('Last action undone.');
    }
  }

  const preset = scenarios[world.scenario],
    hab = habitability(world),
    complete = isComplete(world),
    selectedTool = toolList.find((t) => t.id === tool)!;

  return (
    <div className="genesis-app">
      <a className="skip-link" href="#controls">
        Skip to planet controls
      </a>
      <header className="site-header">
        <a
          href="https://lunamaze.com/"
          className="brand"
          aria-label="Lunamaze home"
        >
          <Orbit className="brand-mark" strokeWidth={1} />
          <span>
            genesis<span className="brand-by">BY LUNAMAZE</span>
          </span>
        </a>
        <div className="header-center">
          <span className="live-dot" /> AN EXPERIMENT IN POSSIBILITY
        </div>
        <nav aria-label="Site">
          <button
            className="sound-button"
            onClick={() => void ambience.toggle()}
            aria-label={
              ambience.enabled ? 'Mute ambient sound' : 'Enable ambient sound'
            }
            aria-pressed={ambience.enabled}
          >
            {ambience.enabled ? (
              <AudioLines size={17} />
            ) : (
              <VolumeX size={17} />
            )}
          </button>
          <button className="text-button" onClick={() => setDialog('guide')}>
            <CircleHelp size={16} />
            <span>Field guide</span>
          </button>
          <button className="outline-button header-share" onClick={share}>
            <Share2 size={15} /> Share world <ArrowUpRight size={14} />
          </button>
        </nav>
      </header>
      <main>
        <div className="observatory-top">
          <span>
            <span className="tiny-cross">+</span> GENESIS / PLANETARY
            OBSERVATORY
          </span>
          <span className="top-caption">
            Every world starts with a possibility.
          </span>
          <span className="live-readout">
            <span className={running ? 'live-dot' : 'paused-dot'} />
            {running ? 'SIMULATION LIVE' : 'SIMULATION PAUSED'}
          </span>
        </div>
        <section className="observatory" aria-label="Terraforming simulator">
          <aside className="world-story">
            <div className="mission-identity">
              <span className="eyebrow">
                TERRAFORMING SANDBOX / {String(world.seed).padStart(4, '0')}
              </span>
              <h1>
                {preset.name}
                <span className="mission-orbit"> / LIVE WORLD</span>
              </h1>
              <p className="story-description">{preset.description}</p>
            </div>
            <div className="habitat-stat">
              <div className="habitat-head">
                <span>
                  <Leaf size={15} /> HABITABILITY
                </span>
                <span className="stat-fraction">/ 100</span>
              </div>
              <div className="habitat-number">
                {hab}
                <span>%</span>
                <span className="habitat-trend">
                  {hab >= 65
                    ? 'FAVORABLE'
                    : hab >= 30
                      ? 'DEVELOPING'
                      : 'HOSTILE'}
                </span>
              </div>
              <Progress
                value={hab}
                aria-label={`Habitability ${hab}%`}
                className="habitat-progress"
              />
            </div>
            <div className="small-stats">
              <div>
                <Thermometer />
                <span>Surface temperature</span>
                <strong>
                  {world.temperature.toFixed(1)}
                  <small>°C</small>
                </strong>
              </div>
              <div>
                <Leaf />
                <span>Biosphere</span>
                <strong>
                  {Math.round(world.biomass)}
                  <small>%</small>
                </strong>
              </div>
            </div>
            <button className="guide-link" onClick={() => setDialog('guide')}>
              Mission guide <ArrowUpRight size={15} />
            </button>
          </aside>
          <div className="planet-stage">
            <div className="orbital-ring ring-one" aria-hidden="true" />
            <div className="orbital-ring ring-two" aria-hidden="true" />
            <div className="planet-north" aria-hidden="true">
              N<span>│</span>
            </div>
            <div
              className="planet-coordinate coordinate-left"
              aria-hidden="true"
            >
              +<span>23.4° AXIAL TILT</span>
            </div>
            <div
              className="planet-coordinate coordinate-right"
              aria-hidden="true"
            >
              +<span>SEED {String(world.seed).padStart(4, '0')}</span>
            </div>
            <Planet
              world={world}
              view={view}
              tool={tool}
              running={running}
              cloudCover={clouds / 100}
              onSculpt={sculpt}
            />
            <div className="planet-caption">
              <span className="live-dot" />
              {status(world)}
            </div>
            <div className="view-switch">
              <Tabs value={view} onValueChange={(v) => setView(v as View)}>
                <TabsList aria-label="Planet visualization">
                  <TabsTrigger value="natural">
                    <Earth /> Natural
                  </TabsTrigger>
                  <TabsTrigger value="thermal">
                    <Thermometer /> Thermal
                  </TabsTrigger>
                  <TabsTrigger value="terrain">
                    <Mountain /> Terrain
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {view === 'thermal' && (
              <div className="map-legend">
                <span>−40°C</span>
                <i />
                <span>60°C</span>
              </div>
            )}
            {view === 'terrain' && (
              <div className="map-legend terrain-legend">
                <span>Low elevation</span>
                <i />
                <span>High</span>
              </div>
            )}
          </div>
          <section className="sculpt-bar" aria-label="Planet tools">
            <div className="sculpt-heading">
              <span className="micro-label">A HAND IN CREATION</span>
              <p>{selectedTool.hint}</p>
            </div>
            <div
              className="tool-group"
              role="group"
              aria-label="Sculpting tools"
            >
              {toolList.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  aria-pressed={tool === id}
                  className={tool === id ? 'tool active' : 'tool'}
                  onClick={() => setTool(id)}
                >
                  <Icon size={19} strokeWidth={1.4} />
                  <span>{label}</span>
                </button>
              ))}
              <span className="tool-divider" />
              <button
                className="undo-tool"
                title="Undo last action"
                aria-label="Undo last action"
                disabled={!undo}
                onClick={undoAction}
              >
                <Undo2 size={18} />
              </button>
            </div>
          </section>

          <aside className="control-panel" id="controls">
            <div className="panel-topline">
              <span className="micro-label">PLANET SYSTEMS</span>
              <Sun size={17} />
            </div>
            <h2>
              Climate lab<span>Adjust. Observe. Discover.</span>
            </h2>
            <Control
              label="Sunlight"
              icon={Sun}
              value={world.sun}
              min={55}
              max={145}
              suffix="%"
              low="Cooler"
              high="Warmer"
              hint="Energy reaching the surface"
              onChange={(v) => adjust('sun', v)}
            />
            <Control
              label="Atmosphere"
              icon={Wind}
              value={world.atmosphere}
              min={0}
              max={200}
              suffix="%"
              low="Thinner"
              high="Thicker"
              hint="Heat retained around the planet"
              onChange={(v) => adjust('atmosphere', v)}
            />
            <Control
              label="Water level"
              icon={Droplets}
              value={world.water}
              min={0}
              max={95}
              suffix="%"
              low="More land"
              high="More ocean"
              hint="Relative sea level, not ocean coverage"
              onChange={(v) => adjust('water', v)}
            />
            <Control
              label="Cloud cover"
              icon={Cloud}
              value={clouds}
              min={0}
              max={100}
              suffix="%"
              low="Clear skies"
              high="Overcast"
              hint="Visual cloud density; does not change the climate model"
              onChange={setClouds}
            />
            <div className="climate-note">
              <Sparkles size={16} />
              <p>
                {world.temperature < 0
                  ? 'A frozen beginning. Add warmth to reveal liquid oceans.'
                  : hab < 35
                    ? 'Life needs a balance of warmth, water and atmosphere.'
                    : world.seeded
                      ? 'The conditions are changing. Give your world time to respond.'
                      : 'The conditions are promising. Seed life to begin a biosphere.'}
              </p>
            </div>
            <div className="equilibrium">
              <span>Temperature trending toward</span>
              <strong>{targetTemperature(world).toFixed(1)}°C</strong>
            </div>
            <div className="panel-actions">
              <button onClick={() => setDialog('reset')}>
                <RotateCcw size={14} /> Reset
              </button>
              <button onClick={() => setDialog('save')}>
                <Save size={14} /> My world{' '}
                {saved && <span className="saved-dot" />}
              </button>
            </div>
          </aside>
        </section>
        <section className="timeline" aria-label="Simulation time">
          <div className="time-control">
            <button
              className="play-button"
              aria-label={running ? 'Pause simulation' : 'Play simulation'}
              onClick={() => setRunning((v) => !v)}
            >
              {running ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" />
              )}
            </button>
            <div>
              <span className="micro-label">TIME, UNFOLDING</span>
              <p>
                Year{' '}
                <strong>
                  {String(Math.floor(world.year)).padStart(4, '0')}
                </strong>
              </p>
            </div>
          </div>
          <div
            className="speed-control"
            role="group"
            aria-label="Simulation speed"
          >
            {[1, 10, 50].map((n) => (
              <button
                key={n}
                aria-pressed={speed === n}
                className={speed === n ? 'selected' : ''}
                onClick={() => setSpeed(n)}
              >
                {n}×
              </button>
            ))}
          </div>
          <div className="latest-event">
            <span className="live-dot" />
            <div>
              <span className="micro-label">LATEST FIELD NOTE</span>
              <p>{log[0].text}</p>
            </div>
          </div>
          <button
            className="jump-button"
            onClick={() => {
              setWorld((w) => tick(w, 100));
              record('A century passes. The planet finds a new balance.');
            }}
          >
            See 100 years ahead <ArrowUpRight size={19} />
          </button>
        </section>
        <section className="scenario-section" id="worlds">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                THREE WORLDS. COUNTLESS POSSIBILITIES.
              </span>
              <h2>Where will you begin?</h2>
            </div>
            <button
              className="outline-button"
              onClick={() => {
                setUndo(world);
                setWorld({
                  ...createWorld(world.scenario),
                  seed: Math.floor(Math.random() * 10000),
                });
                completed.current = false;
                setLog([
                  { year: 0, text: 'An undiscovered world takes shape.' },
                ]);
                tell('A new landscape. An unwritten story.');
              }}
            >
              <Shuffle size={15} /> Discover a new world
            </button>
          </div>
          <div className="scenario-grid">
            {(Object.keys(scenarios) as Scenario[]).map((s, i) => {
              const p = scenarios[s],
                Icon = s === 'eden' ? Leaf : s === 'mars' ? Flame : Snowflake;
              return (
                <button
                  className={`scenario-card scenario-${s} ${world.scenario === s ? 'chosen' : ''}`}
                  key={s}
                  onClick={() => changeScenario(s)}
                >
                  <PlanetThumbnail scenario={s} />
                  <div className="scenario-card-top">
                    <span className="scenario-index">0{i + 1}</span>
                    <span className="scenario-tag">{p.tag}</span>
                    <Icon size={22} strokeWidth={1} />
                  </div>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <div className="scenario-bottom">
                    <span>
                      {world.scenario === s
                        ? 'Currently exploring'
                        : 'Explore this world'}
                    </span>
                    {world.scenario === s ? (
                      <span className="live-dot" />
                    ) : (
                      <ArrowUpRight size={18} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
        <section className="field-section">
          <div className="challenge">
            <span className="eyebrow">YOUR SMALL CHALLENGE</span>
            <h2>
              {complete ? 'You made room for life.' : 'Make room for life.'}
            </h2>
            <p>{preset.goal}</p>
            <div className="challenge-status">
              {complete ? <Check size={16} /> : <Leaf size={16} />}{' '}
              {complete
                ? 'Challenge complete. Your world keeps evolving.'
                : `${Math.round(world.biomass)}% biosphere · ${Math.round(world.scenario === 'eden' ? 70 : 40)}% target`}
            </div>
          </div>
          <div className="field-notes">
            <span className="eyebrow">FIELD NOTES</span>
            <ol>
              {log.slice(0, 3).map((item, i) => (
                <li key={`${item.year}-${item.text}-${i}`}>
                  <time>
                    YR {String(Math.floor(item.year)).padStart(4, '0')}
                  </time>
                  <span>{item.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section className="about-section">
          <span className="eyebrow">CURIOSITY IS THE WHOLE POINT.</span>
          <h2>
            A free terraforming simulator.
            <br />
            <em>A little space to wonder.</em>
          </h2>
          <p>
            Genesis is an interactive planet sandbox. Shape the terrain,
            experiment with sunlight and atmosphere, and watch a simplified
            biosphere respond. Try terraforming a Mars-inspired world, thawing
            an ice planet, or building your own New Eden.
          </p>
          <p className="model-note">
            An imaginative, simplified simulation — not a scientific climate
            model or weather forecast. Planets are procedurally generated; the
            Mars scenario is inspired by Mars, not a geographic replica. No
            account or download needed.
          </p>
        </section>
      </main>
      <footer>
        <a href="https://lunamaze.com/" className="footer-brand">
          <Orbit size={19} /> LUNAMAZE
        </a>
        <span>Made for the joy of finding out.</span>
        <button onClick={() => setDialog('guide')}>
          How the simulation works <ArrowUpRight size={14} />
        </button>
      </footer>
      {notice && (
        <div className="toast" role="status">
          <Sparkles size={17} />
          {notice}
          <button
            aria-label="Dismiss notification"
            onClick={() => setNotice('')}
          >
            <X size={15} />
          </button>
        </div>
      )}
      <Dialog
        open={dialog !== null}
        onOpenChange={(open) => {
          if (!open) setDialog(null);
        }}
      >
        <DialogContent className="genesis-dialog">
          <DialogHeader>
            <span className="eyebrow">GENESIS / FIELD GUIDE</span>
            <DialogTitle>
              {dialog === 'guide'
                ? 'Mission guide'
                : dialog === 'save'
                  ? 'Keep your little world'
                  : dialog === 'reset'
                    ? 'Begin this world again?'
                    : 'Take your world with you'}
            </DialogTitle>
            <DialogDescription>
              {dialog === 'guide'
                ? 'A few simple rules. An open-ended experiment.'
                : dialog === 'save'
                  ? 'One save slot, stored in this browser on this device.'
                  : dialog === 'reset'
                    ? 'This resets the current scenario. You can undo the reset afterward.'
                    : 'Copy this link to share an exact snapshot of your world.'}
            </DialogDescription>
          </DialogHeader>
          {dialog === 'guide' && (
            <div className="guide-content">
              <div>
                <Sun />
                <p>
                  <strong>Find a comfortable climate.</strong> Sunlight warms
                  the surface. Atmosphere retains heat. The temperature takes
                  time to approach its new balance.
                </p>
              </div>
              <div>
                <Waves />
                <p>
                  <strong>Leave room for land and water.</strong> Raise the
                  water level to fill lower terrain. Very dry worlds and
                  almost-water worlds leave less room for the biosphere.
                </p>
              </div>
              <div>
                <Leaf />
                <p>
                  <strong>Give life a beginning.</strong> Choose Seed life, then
                  tap the globe. Organisms spread when warmth, water and
                  atmosphere are favorable, and decline when conditions become
                  harsh.
                </p>
              </div>
              <div>
                <Orbit />
                <p>
                  <strong>Change your perspective.</strong> Drag to orbit,
                  scroll to zoom, or use the arrow keys. Select Thermal or
                  Terrain to see the world differently. Press Enter on the globe
                  to apply a tool at its center.
                </p>
              </div>
              <div>
                <Plus />
                <p>
                  <strong>Let time do its work.</strong> Speed up to 10× or 50×,
                  or jump a century. Terrain edits are limited to 16 per world;
                  Undo reverses your last action. Use the globe’s download
                  button to keep a postcard, or expand it for an immersive view.
                  Cloud cover changes the appearance of the sky.
                </p>
              </div>
              <p className="model-note">
                Habitability is a 0–100 index combining temperature, atmospheric
                support and water availability. Biosphere approaches that index
                over time after life is seeded. These are illustrative
                relationships, not research-grade predictions.
              </p>
            </div>
          )}
          {dialog === 'save' && (
            <div className="save-content">
              {saved ? (
                <div className="saved-world">
                  <Globe2 />
                  <div>
                    <strong>{scenarios[saved.scenario].name}</strong>
                    <span>
                      Year {Math.floor(saved.year)} · {habitability(saved)}%
                      habitability
                    </span>
                  </div>
                  <button
                    className="outline-button"
                    onClick={() => {
                      setUndo(world);
                      setWorld(saved);
                      setRunning(false);
                      completed.current = isComplete(saved);
                      setLog([
                        {
                          year: saved.year,
                          text: 'Your saved world is restored.',
                        },
                      ]);
                      setDialog(null);
                      tell('Saved world restored.');
                    }}
                  >
                    Restore
                  </button>
                </div>
              ) : (
                <p>No world saved yet. Your first one is waiting.</p>
              )}
              <button className="primary-button" onClick={save}>
                <Save size={16} />
                {saved
                  ? 'Replace saved world with this one'
                  : 'Save this world'}
              </button>
              <button className="text-button" onClick={share}>
                <Share2 size={15} /> Keep a shareable link instead
              </button>
            </div>
          )}
          {dialog === 'reset' && (
            <div className="dialog-actions">
              <button
                className="outline-button"
                onClick={() => setDialog(null)}
              >
                Keep exploring
              </button>
              <button
                className="primary-button"
                onClick={() => {
                  changeScenario(world.scenario);
                  setDialog(null);
                  tell('A fresh beginning.');
                }}
              >
                Begin again <RotateCcw size={15} />
              </button>
            </div>
          )}
          {dialog === 'share' && (
            <div className="share-fallback">
              <label htmlFor="world-link">Your world link</label>
              <textarea
                id="world-link"
                readOnly
                value={shareURL}
                onFocus={(e) => e.currentTarget.select()}
              />
              <p>
                Select the link, then copy it with your browser or keyboard.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Control({
  label,
  icon: Icon,
  value,
  min,
  max,
  suffix,
  low,
  high,
  hint,
  onChange,
}: {
  label: string;
  icon: typeof Sun;
  value: number;
  min: number;
  max: number;
  suffix: string;
  low: string;
  high: string;
  hint: string;
  onChange: (value: number) => void;
}) {
  const id = label.toLowerCase().replaceAll(' ', '-');

  return (
    <div className="planet-control">
      <div className="control-label">
        <label id={id}>
          <Icon size={16} />
          {label}
        </label>
        <output>
          {Math.round(value)}
          <span>{suffix}</span>
        </output>
      </div>
      <Slider
        aria-labelledby={id}
        aria-label={label}
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
        className="planet-slider"
      />
      <div className="range-labels">
        <span>{low}</span>
        <span>{high}</span>
      </div>
      <span className="sr-only">{hint}</span>
    </div>
  );
}
