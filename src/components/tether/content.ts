/**
 * Tether ADB page content: one source for the page, its FAQPage JSON-LD and
 * the metadata. Claims here must match the app (github.com/shadowline-trx/tether-adb).
 */

// Points at the stable, unversioned asset name so every release ships the
// current build here without this page needing an edit.
export const DOWNLOAD_URL =
  'https://github.com/shadowline-trx/tether-adb/releases/latest/download/Tether-ADB-x64-setup.exe';
export const RELEASES_URL = 'https://github.com/shadowline-trx/tether-adb/releases/latest';
export const GITHUB_URL = 'https://github.com/shadowline-trx/tether-adb';
export const VERSION = 'v0.1.2';
export const SIZE = '10 MB';
export const PAGE_URL = 'https://lunamaze.com/tether-adb/';

export type FeatureId = 'qr' | 'mirror' | 'logcat' | 'shell' | 'files' | 'apps' | 'automation' | 'tracking';

export interface Feature {
  readonly id: FeatureId;
  readonly title: string;
  readonly desc: string;
}

export const FEATURES: ReadonlyArray<Feature> = [
  {
    id: 'mirror',
    title: 'Screen mirror and control',
    desc: 'Low-latency mirroring powered by scrcpy, with quality presets, screenshots and screen recording.',
  },
  {
    id: 'logcat',
    title: 'Live logcat',
    desc: 'Streaming logs with level colouring and tag and text filters, on a ring buffer that stays fast under heavy output.',
  },
  {
    id: 'qr',
    title: 'QR-code wireless pairing',
    desc: 'Scan a code and you are connected. No IP typing, no six-digit codes. Pairing-code and mDNS discovery are there too.',
  },
  {
    id: 'shell',
    title: 'Shell',
    desc: 'Run adb shell commands with history recall, exit-code badges and one-tap quick commands.',
  },
  {
    id: 'files',
    title: 'File manager',
    desc: 'Browse the device filesystem: pull, push, rename, delete and make folders with native dialogs.',
  },
  {
    id: 'apps',
    title: 'App manager',
    desc: 'Install, uninstall, launch, stop, clear, enable or disable apps, and pull APKs, with search.',
  },
  {
    id: 'automation',
    title: 'Automation',
    desc: 'Port forwards, reverse tunnels and one-click reboot targets: system, recovery, bootloader, fastboot.',
  },
  {
    id: 'tracking',
    title: 'Instant device tracking',
    desc: 'Devices appear and disappear the moment they connect over USB or Wi-Fi. No manual refresh.',
  },
];

export const STEPS: ReadonlyArray<{ readonly title: string; readonly desc: string }> = [
  {
    title: 'Open the QR tab',
    desc: 'In Tether ADB, choose Wireless, then QR code. A fresh pairing code appears instantly.',
  },
  {
    title: 'Scan it with your phone',
    desc: 'On Android: Developer options, Wireless debugging, Pair device with QR code.',
  },
  {
    title: 'It connects itself',
    desc: 'Tether ADB finds the phone on your network and pairs automatically. Nothing to type.',
  },
];

export interface Faq {
  readonly q: string;
  readonly a: string;
}

export const FAQS: ReadonlyArray<Faq> = [
  {
    q: 'Do I need to install the Android SDK, adb, or scrcpy?',
    a: 'No. Tether ADB bundles adb and scrcpy inside the installer, so every feature, including screen mirroring, works out of the box with nothing else to install.',
  },
  {
    q: 'Is Tether ADB free?',
    a: 'Yes, Tether ADB is free to download and use. It is proprietary software, © Luna Maze, all rights reserved.',
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
    a: 'Tether ADB generates an Android-compatible pairing QR. When you scan it from your phone’s Wireless debugging screen, Tether ADB discovers the device on your network and runs the pairing automatically, with no codes to type.',
  },
  {
    q: 'Can I use ADB over Wi-Fi without a USB cable?',
    a: 'Yes. On Android 11 and newer, Wireless debugging lets you pair and connect with no cable at all: scan the QR code in Tether ADB and you are connected. On older devices, plug in once over USB and use “Go wireless”, which switches adb to TCP mode and connects over the network; the cable can then come out.',
  },
  {
    q: 'My phone is stuck on “pairing” forever. How do I fix it?',
    a: 'That almost always means the pairing request never reached your phone, so nothing ever completed the handshake. Retrying against the same screen cannot help, because an Android pairing screen is only good for one attempt. It is usually caused by mDNS discovery failing silently, which is common on Windows machines that have virtual network adapters from VirtualBox, WSL, Hyper-V or a VPN: the discovery query goes out the wrong adapter and the phone is never seen. Tether ADB works around this by doing its own mDNS discovery across every network interface rather than relying on adb’s. If discovery is blocked entirely on your network, use “Pair device with pairing code” on the phone and enter the address and code in Tether ADB’s Pair tab; that path needs no discovery at all.',
  },
  {
    q: 'adb says “Successfully paired” but the device never appears. Why?',
    a: 'Pairing and connecting are two different steps. “adb pair” only establishes trust between your PC and the phone; the device does not appear in the device list until something connects to its connect endpoint, which listens on a different port from the pairing one. adb normally does that itself using mDNS discovery, so when discovery fails you get a successful pairing and no device anywhere. Tether ADB connects for you after pairing, and tells you exactly what to do if it cannot find the endpoint.',
  },
  {
    q: 'Wireless debugging shows nothing, or “adb mdns services” is empty. Does Tether ADB still work?',
    a: 'Yes. adb’s bundled mDNS discovery is unreliable on Windows: it can return an empty list while your phone is plainly advertising, and its daemon sometimes dies outright with “mdns daemon unavailable”. Tether ADB browses mDNS itself on every network interface instead of trusting adb, and its built-in Connection Troubleshooter shows you exactly what is on the wire: adb health, the live discovery backend, every endpoint found, and a real reachability probe with latency for each.',
  },
  {
    q: 'Is there a GUI for scrcpy?',
    a: 'Yes. Tether ADB is a full graphical front-end for both adb and scrcpy, with scrcpy bundled. You get low-latency screen mirroring and control with quality presets, plus screenshots and screen recording, without touching a command line or installing anything else.',
  },
];
