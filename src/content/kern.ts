/** Public listing and release details shared by Kern's product pages. */
export const KERN_PLAY_URL =
  'https://play.google.com/store/apps/details?id=dev.lunamaze.kern';

export const KERN_RELEASE_NOTE =
  'Full rollout submitted to Google Play. Availability may vary while review completes.';

export const KERN_SCREENSHOTS = [
  { file: '01-home.webp', title: 'A quiet home screen', alt: 'Kern home screen with a large clock and four favourite apps on a dark background' },
  { file: '02-search.webp', title: 'Find it in two letters', alt: 'Kern app search ranking Maps, Messages and Mail from the letters ma' },
  { file: '03-pause.webp', title: 'Pause before the scroll', alt: 'Kern pausing before opening YouTube with an option to choose Not now' },
  { file: '04-screen-time.webp', title: 'See your day clearly', alt: 'Kern daily screen-time ledger with hourly activity, pickups and time away' },
  { file: '05-focus.webp', title: 'Make room for focus', alt: 'Kern timed focus session with selected apps blocked' },
  { file: '06-notes.webp', title: 'A place for your thoughts', alt: 'Kern Pages for notes, checklists and daily tasks' },
] as const;
