import type { ReactNode } from 'react';

// Points at the stable, unversioned asset name so every release ships the
// current build here without this page needing an edit.
const DOWNLOAD_URL =
  'https://github.com/shadowline-trx/tether-adb/releases/latest/download/Tether-ADB-x64-setup.exe';
const RELEASES_URL = 'https://github.com/shadowline-trx/tether-adb/releases/latest';
const GITHUB_URL = 'https://github.com/shadowline-trx/tether-adb';
const VERSION = 'v0.1.1';
const SIZE = '10 MB';
const PAGE_URL = 'https://lunamaze.com/tether-adb/';

// ── tiny inline icon set (stroke, currentColor) ─────────────────────────────
type IconProps = { className?: string };
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};
function Svg({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" className={className} {...stroke} aria-hidden>
      {children}
    </svg>
  );
}
const IconQr = (p: IconProps) => (
  <Svg className={p.className}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h3v3M20 14v.01M14 20h.01M20 20v.01M17 20h.01M20 17h.01" />
  </Svg>
);
const IconMirror = (p: IconProps) => (
  <Svg className={p.className}>
    <rect x="7" y="2" width="10" height="20" rx="2" />
    <path d="M11 18h2" />
  </Svg>
);
const IconLog = (p: IconProps) => (
  <Svg className={p.className}>
    <path d="M4 5h16M4 10h10M4 15h16M4 20h8" />
  </Svg>
);
const IconTerminal = (p: IconProps) => (
  <Svg className={p.className}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 9l3 3-3 3M13 15h4" />
  </Svg>
);
const IconFiles = (p: IconProps) => (
  <Svg className={p.className}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </Svg>
);
const IconApps = (p: IconProps) => (
  <Svg className={p.className}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </Svg>
);
const IconAutomation = (p: IconProps) => (
  <Svg className={p.className}>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="M8.5 6H15a3 3 0 0 1 3 3v6.5" />
  </Svg>
);
const IconBolt = (p: IconProps) => (
  <Svg className={p.className}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
  </Svg>
);
const IconWindows = (p: IconProps) => (
  <Svg className={p.className}>
    <path d="M3 5.5 10.5 4.5v7H3zM10.5 4.4 21 3v8.5H10.5zM3 12.5h7.5v7L3 18.5zM10.5 12.5H21V21l-10.5-1.4z" />
  </Svg>
);
const IconDownload = (p: IconProps) => (
  <Svg className={p.className}>
    <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16" />
  </Svg>
);
const IconGithub = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="20" height="20" className={p.className} fill="currentColor" aria-hidden>
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.85 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.19-1.11-1.5-1.11-1.5-.9-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.35 9.35 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
  </svg>
);

const features: ReadonlyArray<{ icon: (p: IconProps) => ReactNode; title: string; desc: string }> = [
  {
    icon: IconQr,
    title: 'QR-code wireless pairing',
    desc: 'Scan a code and you’re connected. No IP typing, no six-digit codes. Pairing-code and mDNS discovery are there too.',
  },
  {
    icon: IconMirror,
    title: 'Screen mirror & control',
    desc: 'Low-latency mirroring powered by scrcpy, with quality presets, screenshots, and screen recording.',
  },
  {
    icon: IconLog,
    title: 'Live logcat',
    desc: 'Streaming logs with level coloring and tag/text filters, on a ring buffer that stays fast under heavy output.',
  },
  {
    icon: IconTerminal,
    title: 'Shell',
    desc: 'Run adb shell commands with history recall, exit-code badges, and one-tap quick commands.',
  },
  {
    icon: IconFiles,
    title: 'File manager',
    desc: 'Browse the device filesystem — pull, push, rename, delete, and make folders with native dialogs.',
  },
  {
    icon: IconApps,
    title: 'App manager',
    desc: 'Install, uninstall, launch, stop, clear, enable or disable apps, and pull APKs — with search.',
  },
  {
    icon: IconAutomation,
    title: 'Automation',
    desc: 'Port forwards, reverse tunnels, and one-click reboot targets (system, recovery, bootloader, fastboot).',
  },
  {
    icon: IconBolt,
    title: 'Instant device tracking',
    desc: 'Devices appear and disappear the moment they connect over USB or Wi-Fi — no manual refresh.',
  },
];

const steps: ReadonlyArray<{ n: string; title: string; desc: string }> = [
  {
    n: '1',
    title: 'Open the QR tab',
    desc: 'In Tether ADB, click Wireless → QR code. A fresh pairing code appears instantly.',
  },
  {
    n: '2',
    title: 'Scan with your phone',
    desc: 'On Android: Developer options → Wireless debugging → Pair device with QR code.',
  },
  {
    n: '3',
    title: 'It connects itself',
    desc: 'Tether ADB detects your phone over the network and pairs automatically — nothing to type.',
  },
];

const faqs: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: 'Do I need to install the Android SDK, adb, or scrcpy?',
    a: 'No. Tether ADB bundles adb and scrcpy inside the installer, so every feature — including screen mirroring — works out of the box with nothing else to install.',
  },
  {
    q: 'Is Tether ADB free?',
    a: 'Yes, Tether ADB is free to download and use. It is proprietary software — © Luna Maze, all rights reserved.',
  },
  {
    q: 'Which platforms are supported?',
    a: 'Tether ADB runs on Windows 10 and 11 (64-bit). It installs per-user with no administrator rights and adds a searchable Start-menu entry and a desktop shortcut.',
  },
  {
    q: 'Why does Windows show a SmartScreen warning?',
    a: 'The installer is not code-signed yet, so Windows SmartScreen may show a “Windows protected your PC” prompt. Click “More info” then “Run anyway”. Code signing is planned.',
  },
  {
    q: 'How does QR-code wireless pairing work?',
    a: 'Tether ADB generates an Android-compatible pairing QR. When you scan it from your phone’s Wireless debugging screen, Tether ADB discovers the device on your network and runs the pairing automatically — no codes to type.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Tether ADB',
      operatingSystem: 'Windows 10, Windows 11',
      applicationCategory: 'DeveloperApplication',
      description:
        'Enterprise-grade Android device control center for Windows: QR-code wireless pairing, screen mirroring, logcat, shell, file and app management, and automation. adb and scrcpy bundled.',
      url: PAGE_URL,
      downloadUrl: DOWNLOAD_URL,
      softwareVersion: '0.1.1',
      fileSize: '10MB',
      image: 'https://lunamaze.com/images/tether-adb-og.png',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@type': 'Organization', name: 'Luna Maze', url: 'https://lunamaze.com' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

function DownloadButton({ primary, children }: { primary?: boolean; children: ReactNode }) {
  return (
    <a
      href={DOWNLOAD_URL}
      className={
        primary
          ? 'inline-flex items-center gap-2.5 rounded-xl bg-lunamaze-violet px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-lunamaze-violet/30 transition hover:bg-lunamaze-violetLight'
          : 'inline-flex items-center gap-2.5 rounded-xl border border-lunamaze-border bg-lunamaze-bgSurface px-6 py-3.5 text-[15px] font-semibold text-lunamaze-textPrimary transition hover:border-lunamaze-violet'
      }
    >
      {children}
    </a>
  );
}

export default function AdbHubPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* backdrop glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(760px 460px at 12% -6%, rgba(123,92,255,0.18), transparent 60%), radial-gradient(680px 420px at 100% 4%, rgba(52,211,238,0.10), transparent 58%)',
        }}
      />

      {/* header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/tether-adb-icon.png" alt="Tether ADB" width={34} height={34} className="rounded-lg" />
          <span className="text-[15px] font-semibold tracking-tight">Tether</span>
        </a>
        <nav className="flex items-center gap-3">
          <a
            href={GITHUB_URL}
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-[14px] text-lunamaze-textSecondary transition hover:text-lunamaze-textPrimary sm:inline-flex"
          >
            <IconGithub /> GitHub
          </a>
          <a
            href={DOWNLOAD_URL}
            className="inline-flex items-center gap-2 rounded-lg bg-lunamaze-violet px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-lunamaze-violetLight"
          >
            <IconDownload className="h-4 w-4" /> Download
          </a>
        </nav>
      </header>

      {/* hero */}
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-10 sm:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-lunamaze-border bg-lunamaze-bgSurface/60 px-3.5 py-1.5 text-[12.5px] font-medium text-lunamaze-textSecondary">
            <span className="h-1.5 w-1.5 rounded-full bg-lunamaze-streak" /> Free for Windows · adb &amp; scrcpy bundled
          </span>
          <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
            Android device control,
            <br className="hidden sm:block" /> wired &amp;{' '}
            <span className="bg-gradient-to-r from-lunamaze-violetLight to-lunamaze-calm bg-clip-text text-transparent">
              wireless
            </span>
            .
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-[16.5px] leading-relaxed text-lunamaze-textSecondary">
            Tether ADB is an enterprise-grade Android device hub for your desktop. Pair over Wi-Fi with a{' '}
            <span className="text-lunamaze-textPrimary">QR code</span>, mirror and control the screen, tail logcat,
            run a shell, and manage files &amp; apps — all in one stunning app.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <DownloadButton primary>
              <IconDownload className="h-[18px] w-[18px]" /> Download for Windows
            </DownloadButton>
            <a
              href={GITHUB_URL}
              className="inline-flex items-center gap-2.5 rounded-xl border border-lunamaze-border bg-lunamaze-bgSurface px-6 py-3.5 text-[15px] font-semibold transition hover:border-lunamaze-violet"
            >
              <IconGithub /> View on GitHub
            </a>
          </div>
          <p className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[13px] text-lunamaze-textDim">
            <span className="inline-flex items-center gap-1.5">
              <IconWindows className="h-4 w-4" /> Windows 10/11 (64-bit)
            </span>
            <span aria-hidden>·</span>
            <span>{VERSION}</span>
            <span aria-hidden>·</span>
            <span>{SIZE} installer</span>
            <span aria-hidden>·</span>
            <span>No admin required</span>
          </p>
        </div>

        {/* screenshot */}
        <div className="relative mx-auto mt-14 max-w-5xl">
          <div
            aria-hidden
            className="absolute -inset-x-10 -top-10 bottom-0 -z-10 rounded-[32px] opacity-70 blur-2xl"
            style={{ background: 'radial-gradient(60% 60% at 50% 0%, rgba(123,92,255,0.35), transparent 70%)' }}
          />
          <div className="overflow-hidden rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface shadow-2xl shadow-black/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/tether-adb-app.png"
              alt="Tether ADB app — device dashboard with bundled adb and scrcpy"
              width={1300}
              height={840}
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* features */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need, in one hub</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-lunamaze-textSecondary">
            The full adb toolbox with a control center that actually feels good to use.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/70 p-5 transition hover:border-lunamaze-violet/60 hover:bg-lunamaze-bgSurface"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl border border-lunamaze-border bg-lunamaze-bgElevated text-lunamaze-violetLight transition group-hover:text-lunamaze-calm">
                  <Icon />
                </div>
                <h3 className="mt-4 text-[15.5px] font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-lunamaze-textSecondary">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* QR spotlight */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="rounded-3xl border border-lunamaze-border bg-gradient-to-b from-lunamaze-bgSurface/80 to-lunamaze-bgPrimary/40 p-8 sm:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-lunamaze-violet/40 bg-lunamaze-violet/10 px-3 py-1 text-[12.5px] font-medium text-lunamaze-violetLight">
                <IconQr className="h-4 w-4" /> The fastest way to go wireless
              </span>
              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Pair with a QR code in seconds</h2>
              <p className="mt-4 text-[15.5px] leading-relaxed text-lunamaze-textSecondary">
                Wireless debugging usually means typing IP addresses and six-digit codes. Tether ADB makes it a scan:
                point your phone at the code and it connects itself.
              </p>
              <ol className="mt-8 space-y-5">
                {steps.map((s) => (
                  <li key={s.n} className="flex gap-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lunamaze-violet/15 text-[14px] font-bold text-lunamaze-violetLight">
                      {s.n}
                    </span>
                    <div>
                      <h3 className="text-[15px] font-semibold">{s.title}</h3>
                      <p className="mt-0.5 text-[13.5px] leading-relaxed text-lunamaze-textSecondary">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="grid place-items-center">
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 rounded-3xl opacity-60 blur-2xl"
                  style={{ background: 'radial-gradient(circle, rgba(123,92,255,0.4), transparent 70%)' }}
                />
                <div className="rounded-3xl border border-lunamaze-border bg-lunamaze-bgElevated p-8">
                  <div className="grid place-items-center rounded-2xl bg-white p-5" style={{ width: 220, height: 220 }}>
                    <IconQr className="h-32 w-32 text-lunamaze-bgDeep" />
                  </div>
                  <p className="mt-4 text-center text-[13px] text-lunamaze-textSecondary">
                    Waiting for your phone to scan…
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* download CTA */}
      <section id="download" className="mx-auto max-w-3xl scroll-mt-20 px-6 py-16 text-center sm:py-24">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Get Tether ADB</h2>
        <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-lunamaze-textSecondary">
          One installer, everything included. Installs per-user with a desktop shortcut and a searchable Start-menu
          entry — no admin, no SDK.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <DownloadButton primary>
            <IconDownload className="h-[18px] w-[18px]" /> Download {VERSION}
          </DownloadButton>
          <a
            href={RELEASES_URL}
            className="inline-flex items-center gap-2.5 rounded-xl border border-lunamaze-border bg-lunamaze-bgSurface px-6 py-3.5 text-[15px] font-semibold transition hover:border-lunamaze-violet"
          >
            All releases
          </a>
        </div>
        <p className="mx-auto mt-6 max-w-lg rounded-xl border border-lunamaze-border bg-lunamaze-bgSurface/50 px-4 py-3 text-[12.5px] leading-relaxed text-lunamaze-textDim">
          The installer isn’t code-signed yet, so Windows may show a SmartScreen prompt — click{' '}
          <span className="text-lunamaze-textSecondary">More info → Run anyway</span>. adb and scrcpy are bundled;
          nothing else to install.
        </p>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Frequently asked</h2>
        <div className="mt-10 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-5 [&_summary]:cursor-pointer"
            >
              <summary className="flex items-center justify-between gap-4 text-[15.5px] font-semibold text-lunamaze-textPrimary marker:content-['']">
                {f.q}
                <span className="text-lunamaze-textDim transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[14px] leading-relaxed text-lunamaze-textSecondary">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-lunamaze-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-2.5 text-[13.5px] text-lunamaze-textSecondary">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/tether-adb-icon.png" alt="" width={22} height={22} className="rounded-md" />
            Tether ADB — © 2026 Luna Maze. All rights reserved.
          </div>
          <div className="flex items-center gap-5 text-[13.5px] text-lunamaze-textSecondary">
            <a href={GITHUB_URL} className="transition hover:text-lunamaze-textPrimary">
              GitHub
            </a>
            <a href="/" className="transition hover:text-lunamaze-textPrimary">
              Luna Maze
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
