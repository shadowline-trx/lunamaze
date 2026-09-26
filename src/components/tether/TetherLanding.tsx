import { internalUrl } from '@/lib/paths';
import {
  DOWNLOAD_URL,
  FAQS,
  FEATURES,
  GITHUB_URL,
  RELEASES_URL,
  SIZE,
  STEPS,
  VERSION,
  type FeatureId,
} from './content';
import s from './tether.module.css';

/*
 * Tether ADB landing. A control room for an Android phone: near-black glass,
 * a mint signal colour, and one motif throughout, the tether itself: a cable
 * line with pulses running along it, cut in the title because the product's
 * whole point is that you no longer need one.
 *
 * Server-rendered and shipped without any JavaScript (see
 * scripts/static-islands.mjs): every animation is CSS, reveals are
 * scroll-driven where the browser supports it, the FAQ is native <details>.
 */

/* ------------------------------------------------------------------ QR */

// A 21x21 code in the shape of a real one: three finder squares, timing
// rows, and fixed pseudo-random modules. Drawn as one path.
const QR_PATH = (() => {
  const n = 21;
  const on = new Set<string>();
  const finder = (ox: number, oy: number): void => {
    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        const edge = x === 0 || y === 0 || x === 6 || y === 6;
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        if (edge || core) on.add(`${ox + x},${oy + y}`);
      }
    }
  };
  finder(0, 0);
  finder(14, 0);
  finder(0, 14);
  for (let i = 8; i < 13; i += 2) {
    on.add(`${i},6`);
    on.add(`6,${i}`);
  }
  let seed = 20260926;
  const rand = (): number => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const reserved = (x: number, y: number): boolean =>
    (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12) || x === 6 || y === 6;
  for (let y = 0; y < n; y += 1) {
    for (let x = 0; x < n; x += 1) {
      if (!reserved(x, y) && rand() > 0.5) on.add(`${x},${y}`);
    }
  }
  return Array.from(on, (k) => {
    const [x, y] = k.split(',');
    return `M${Number(x) + 2} ${Number(y) + 2}h1v1h-1z`;
  }).join('');
})();

function Qr({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 25 25" aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      <rect width="25" height="25" rx="1.2" fill="#f5f7fa" />
      <path d={QR_PATH} fill="#0a0d12" />
    </svg>
  );
}

/* --------------------------------------------------------------- Icons */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...stroke}>
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16" />
    </svg>
  );
}

function IconGithub() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.85 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.19-1.11-1.5-1.11-1.5-.9-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.35 9.35 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

function IconWindows() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" {...stroke}>
      <path d="M3 5.5 10.5 4.5v7H3zM10.5 4.4 21 3v8.5H10.5zM3 12.5h7.5v7L3 18.5zM10.5 12.5H21V21l-10.5-1.4z" />
    </svg>
  );
}

/* ---------------------------------------------------------------- Hero */

function HeroStage() {
  return (
    <div className={s.stage} aria-hidden="true">
      <div className={s.window}>
        <picture>
          <source
            type="image/webp"
            srcSet="/images/tether-adb-app-760.webp 760w, /images/tether-adb-app-1300.webp 1300w"
            sizes="(max-width: 900px) 92vw, 760px"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={s.shot}
            src="/images/tether-adb-app.png"
            alt=""
            width={1300}
            height={840}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        {/* The code in the screenshot, being read. */}
        <span className={s.shotScan} />
        <span className={s.chip}>
          <i />
          Paired · Pixel 8 · 192.168.1.24:5555
        </span>
      </div>

      <svg className={s.tether} viewBox="0 0 400 300" preserveAspectRatio="none">
        <path className={s.tetherLine} d="M330 170C300 170 260 120 170 120S60 90 40 90" pathLength={1} />
        <path className={s.tetherPulse} d="M330 170C300 170 260 120 170 120S60 90 40 90" pathLength={1} />
      </svg>

      <div className={s.phone}>
        <div className={s.phoneScreen}>
          <p className={s.phoneTitle}>Pair device with QR code</p>
          <div className={s.viewfinder}>
            <Qr className={s.viewQr} />
            <i className={s.viewBeam} />
            <b className={s.viewCorners} />
          </div>
          <p className={s.phoneState}>
            <span className={s.stateScan}>Scanning…</span>
            <span className={s.statePaired}>Paired</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className={s.hero} aria-labelledby="tether-title">
      <div className={s.heroCopy}>
        <p className={s.badge}>
          <i aria-hidden="true" /> Free for Windows · adb and scrcpy bundled
        </p>
        <h1 id="tether-title" className={s.title}>
          <span className={s.titleKicker}>Tether ADB: wireless ADB, screen mirroring and Android device control for Windows</span>
          <span className={s.titleBig}>
            Android,{' '}
            <span className={s.nowrap}>
              <em>
                untethered
                <svg className={s.cut} viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
                  <path className={s.cutLeft} d="M4 14C60 14 90 10 138 12" />
                  <path className={s.cutRight} d="M162 12C210 14 240 10 296 14" />
                  <circle className={s.spark} cx="150" cy="12" r="3" />
                </svg>
              </em>
              .
            </span>
          </span>
        </h1>
        <p className={s.lede}>
          Pair a phone over Wi-Fi by scanning a QR code, then mirror and control its screen, tail logcat, run a shell,
          and manage files and apps. One app, with adb and scrcpy already inside.
        </p>
        <div className={s.ctas}>
          <a className={s.primary} href={DOWNLOAD_URL}>
            <IconDownload />
            <span>
              Download for Windows
              <small>
                {VERSION} · {SIZE}
              </small>
            </span>
          </a>
          <a className={s.ghost} href={GITHUB_URL}>
            <IconGithub /> View on GitHub
          </a>
        </div>
        <ul className={s.meta}>
          <li>
            <IconWindows /> Windows 10 and 11, 64-bit
          </li>
          <li>No admin rights</li>
          <li>Nothing else to install</li>
        </ul>
      </div>
      <HeroStage />
    </section>
  );
}

/* ------------------------------------------------------------- Pairing */

function Pairing() {
  return (
    <section id="pairing" className={s.section} aria-labelledby="pairing-title">
      <div className={s.head} data-reveal>
        <p className={s.eyebrow}>01 · Pairing</p>
        <h2 id="pairing-title">
          One scan. <em>No cable.</em>
        </h2>
        <p>
          Wireless debugging usually means typing IP addresses and six-digit codes. Tether ADB turns it into a scan:
          point your phone at the code and it connects itself.
        </p>
      </div>
      <ol className={s.steps}>
        <svg className={s.stepsCable} viewBox="0 0 1000 20" preserveAspectRatio="none" aria-hidden="true">
          <path className={s.stepsLine} d="M60 10H940" pathLength={1} />
          <path className={s.stepsPulse} d="M60 10H940" pathLength={1} />
        </svg>
        {STEPS.map((step, i) => (
          <li key={step.title} className={s.step} data-reveal style={{ ['--i' as string]: i }}>
            <span className={s.stepNo}>0{i + 1}</span>
            <div className={s.stepArt} aria-hidden="true">
              {i === 0 && (
                <div className={s.miniWindow}>
                  <span className={s.miniTabs}>
                    <b>QR code</b>
                    <span>Connect</span>
                    <span>Pair</span>
                  </span>
                  <Qr className={s.miniQr} />
                </div>
              )}
              {i === 1 && (
                <div className={s.miniPhone}>
                  <Qr className={s.miniQr} />
                  <i />
                </div>
              )}
              {i === 2 && (
                <div className={s.miniDone}>
                  <svg viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="17" pathLength={1} />
                    <path d="M12 20.5l5.5 5.5L28 15" pathLength={1} />
                  </svg>
                  <span>Connected</span>
                  <code>192.168.1.24:5555</code>
                </div>
              )}
            </div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------- Toolbox */

const LOG_LINES: ReadonlyArray<readonly [string, string, string]> = [
  ['I', 'ActivityManager', 'Start proc 8123:com.example.app/u0a241'],
  ['D', 'MainActivity', 'onCreate: savedInstanceState=null'],
  ['W', 'NetworkClient', 'retrying request (attempt 2 of 3)'],
  ['I', 'Choreographer', 'Skipped 2 frames'],
  ['E', 'SyncWorker', 'java.net.SocketTimeoutException: timeout'],
  ['D', 'MainActivity', 'onResume'],
  ['I', 'WindowManager', 'Relayout Window{e1f2 u0 MainActivity}'],
  ['V', 'Adapter', 'bind position=14 viewType=2'],
];

function FeatureArt({ id }: { readonly id: FeatureId }) {
  switch (id) {
    case 'mirror':
      return (
        <div className={s.artMirror}>
          <div className={s.mirrorPhone}>
            <div className={s.mirrorFeed}>
              {Array.from({ length: 8 }, (_, i) => (
                <span key={i} className={i % 3 === 0 ? s.feedCard : s.feedRow} />
              ))}
            </div>
          </div>
          <svg className={s.mirrorBeam} viewBox="0 0 60 20" aria-hidden="true">
            <path d="M2 10H52M44 3l8 7-8 7" />
          </svg>
          <div className={s.mirrorDesk}>
            <span className={s.deskBar}>
              <i />
              <i />
              <i />
              scrcpy · Pixel 8
            </span>
            <div className={s.deskScreen}>
              <div className={s.mirrorFeed}>
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={i} className={i % 3 === 0 ? s.feedCard : s.feedRow} />
                ))}
              </div>
            </div>
          </div>
          <div className={s.mirrorPresets}>
            <span>Low latency</span>
            <b>Balanced</b>
            <span>Crisp</span>
          </div>
          <div className={s.mirrorRec}>
            <i /> REC
          </div>
        </div>
      );
    case 'logcat':
      return (
        <div className={s.artLog}>
          <div className={s.logFilter}>
            <span>tag: MainActivity</span>
            <span>level ≥ D</span>
          </div>
          <div className={s.logWindow}>
            <div className={s.logRoll}>
              {[...LOG_LINES, ...LOG_LINES].map(([lvl, tag, msg], i) => (
                <p key={i} data-lvl={lvl}>
                  <b>{lvl}</b>
                  <span>{tag}</span>
                  {msg}
                </p>
              ))}
            </div>
          </div>
        </div>
      );
    case 'qr':
      return (
        <div className={s.artQr}>
          <Qr className={s.artQrCode} />
          <i />
        </div>
      );
    case 'shell':
      return (
        <div className={s.artShell}>
          <p className={s.shellCmd}>
            <b>$</b> pm list packages -3<i />
          </p>
          <p className={s.shellOut}>package:com.lunamaze.axiom</p>
          <p className={s.shellOut}>package:dev.lunamaze.kern</p>
          <p className={s.shellExit}>
            exit <b>0</b>
          </p>
        </div>
      );
    case 'files':
      return (
        <div className={s.artFiles}>
          <p>/sdcard</p>
          <p>
            <i /> DCIM
          </p>
          <p>
            <i /> Download
          </p>
          <p className={s.fileActive}>
            <i /> screen-0412.mp4
          </p>
          <span className={s.fileBar}>
            <b />
          </span>
        </div>
      );
    case 'apps':
      return (
        <div className={s.artApps}>
          {['Camera', 'Maps', 'Chrome'].map((app, i) => (
            <p key={app}>
              <i style={{ ['--h' as string]: `${i * 90 + 150}` }} />
              {app}
              <b className={i === 1 ? s.toggleOff : s.toggleOn} />
            </p>
          ))}
        </div>
      );
    case 'automation':
      return (
        <div className={s.artAuto}>
          <p>
            <code>tcp:8081</code>
            <i />
            <code>tcp:8081</code>
          </p>
          <div>
            <span>system</span>
            <span>recovery</span>
            <b>bootloader</b>
          </div>
        </div>
      );
    case 'tracking':
      return (
        <div className={s.artTrack}>
          <p>
            <i className={s.dotWifi} /> Pixel 8 <em>Wi-Fi</em>
          </p>
          <p className={s.trackBlink}>
            <i className={s.dotUsb} /> Galaxy S23 <em>USB</em>
          </p>
          <p>
            <i className={s.dotWifi} /> Tab S9 <em>Wi-Fi</em>
          </p>
        </div>
      );
  }
}

function Toolbox() {
  return (
    <section id="toolbox" className={s.section} aria-labelledby="toolbox-title">
      <div className={s.head} data-reveal>
        <p className={s.eyebrow}>02 · Toolbox</p>
        <h2 id="toolbox-title">
          The whole adb toolbox, <em>in one window.</em>
        </h2>
        <p>A control centre that actually feels good to use, for everything you would otherwise do in a terminal.</p>
      </div>
      <ul className={s.bento}>
        {FEATURES.map((f) => (
          <li key={f.id} className={s.cell} data-cell={f.id} data-reveal>
            <FeatureArt id={f.id} />
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* --------------------------------------------------------- Troubleshoot */

const ADAPTERS = [
  { name: 'WSL', ok: false },
  { name: 'VirtualBox', ok: false },
  { name: 'VPN', ok: false },
  { name: 'Wi-Fi', ok: true },
];

function Troubleshoot() {
  return (
    <section className={s.section} aria-labelledby="discovery-title">
      <div className={s.split}>
        <div className={s.head} data-reveal>
          <p className={s.eyebrow}>03 · Discovery</p>
          <h2 id="discovery-title">
            When pairing hangs, <em>blame the network card.</em>
          </h2>
          <p>
            adb’s own discovery sends its query out of one network adapter. With WSL, Hyper-V, VirtualBox or a VPN
            installed, that is often the wrong one, and the phone is never found.
          </p>
          <p>
            Tether ADB browses every interface itself, then shows what it found in a Connection Troubleshooter: adb
            health, the discovery backend, each endpoint, and a live reachability probe with latency.
          </p>
        </div>
        <div className={s.net} data-reveal aria-hidden="true">
          <div className={s.netPc}>
            <svg viewBox="0 0 48 40" {...stroke}>
              <rect x="4" y="4" width="40" height="26" rx="3" />
              <path d="M16 36h16M24 30v6" />
            </svg>
            <span>Your PC</span>
          </div>
          <ul className={s.netList}>
            {ADAPTERS.map((a, i) => (
              <li key={a.name} data-ok={a.ok ? '' : undefined} style={{ ['--i' as string]: i }}>
                <span className={s.netName}>{a.name}</span>
                <span className={s.netWire}>
                  <i />
                </span>
                <span className={s.netResult}>{a.ok ? '4 ms · found' : 'no reply'}</span>
              </li>
            ))}
          </ul>
          <div className={s.netPhone}>
            <svg viewBox="0 0 30 48" {...stroke}>
              <rect x="3" y="2" width="24" height="44" rx="5" />
              <path d="M12 40h6" />
            </svg>
            <span>Your phone</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Download */

function Download() {
  return (
    <section id="download" className={s.section} aria-labelledby="download-title">
      <div className={s.download} data-reveal>
        <div className={s.downloadCopy}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/tether-adb-icon-64.webp" alt="" width={56} height={56} loading="lazy" decoding="async" />
          <h2 id="download-title">Get Tether ADB</h2>
          <p>
            One installer, everything included. It installs per-user with a desktop shortcut and a searchable
            Start-menu entry. No admin, no SDK.
          </p>
          <div className={s.ctas}>
            <a className={s.primary} href={DOWNLOAD_URL}>
              <IconDownload />
              <span>
                Download {VERSION}
                <small>{SIZE} · Windows 10 and 11</small>
              </span>
            </a>
            <a className={s.ghost} href={RELEASES_URL}>
              All releases
            </a>
          </div>
        </div>
        <div className={s.smart} aria-label="If Windows SmartScreen appears: choose More info, then Run anyway.">
          <p className={s.smartNote}>First run, if Windows asks</p>
          <div className={s.dialog} aria-hidden="true">
            <p className={s.dialogTitle}>Windows protected your PC</p>
            <p className={s.dialogBody}>Microsoft Defender SmartScreen prevented an unrecognised app from starting.</p>
            <span className={s.dialogLink}>More info</span>
            <div className={s.dialogButtons}>
              <span className={s.dialogRun}>Run anyway</span>
              <span>Don’t run</span>
            </div>
            <i className={s.dialogPointer} />
          </div>
          <p className={s.smartText}>
            The installer is not code-signed yet, so choose <b>More info</b>, then <b>Run anyway</b>. Signing is
            planned.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- FAQ */

function Faq() {
  return (
    <section id="faq" className={s.section} aria-labelledby="faq-title">
      <div className={s.faqGrid}>
        <div className={s.head} data-reveal>
          <p className={s.eyebrow}>04 · Questions</p>
          <h2 id="faq-title">
            Frequently <em>asked.</em>
          </h2>
          <p>
            Anything else? Write to{' '}
            <a href="mailto:lunamaze.dev@gmail.com?subject=Tether%20ADB">lunamaze.dev@gmail.com</a>.
          </p>
        </div>
        <div className={s.faqList}>
          {FAQS.map((f, i) => (
            <details key={f.q} className={s.faq} name="tether-faq" open={i === 0}>
              <summary>
                <h3>{f.q}</h3>
                <span aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Page */

export default function TetherLanding() {
  return (
    <div className={s.root}>
      <header className={s.nav}>
        <a className={s.brand} href={internalUrl('/tether-adb/')} aria-label="Tether ADB">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/tether-adb-icon-64.webp" alt="" width={30} height={30} />
          <span>
            Tether <b>ADB</b>
          </span>
        </a>
        <nav className={s.links} aria-label="Sections">
          <a href="#pairing">Pairing</a>
          <a href="#toolbox">Toolbox</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className={s.navActions}>
          <a className={s.navGit} href={GITHUB_URL} aria-label="Tether ADB on GitHub">
            <IconGithub />
          </a>
          <a className={s.navDownload} href={DOWNLOAD_URL}>
            <IconDownload /> Download
          </a>
        </div>
      </header>
      <main>
        <Hero />
        <Pairing />
        <Toolbox />
        <Troubleshoot />
        <Download />
        <Faq />
      </main>
      <footer className={s.footer}>
        <p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/tether-adb-icon-64.webp" alt="" width={22} height={22} loading="lazy" decoding="async" />
          Tether ADB · © 2026 Luna Maze. All rights reserved.
        </p>
        <nav aria-label="Footer">
          <a href={GITHUB_URL}>GitHub</a>
          <a href={RELEASES_URL}>Releases</a>
          <a href={internalUrl('/')}>Luna Maze</a>
        </nav>
      </footer>
    </div>
  );
}
