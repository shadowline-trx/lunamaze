import type { Metadata } from 'next';
import type { JSX } from 'react';
import '../globals.css';
import { interClass } from '@/lib/interFont';
import { APP_STORE_ID, PLAY_BLOCKED_TERRITORIES, PLAY_PACKAGE } from '@/lib/storeLinks';

/**
 * /get/ — the Instagram link: bio, story stickers and the comment-to-DM reply.
 *
 * Unlike /go/reddit/ it redirects from an inline script instead of waiting for
 * React. Instagram opens links in its in-app browser, and every second spent
 * loading the framework before the bounce is a second in which a meme viewer
 * closes the tab. The script runs as soon as the HTML is parsed.
 *
 * `?s=<source>` names the campaign so installs split by where the tap came from
 * (`ig_bio` by default, e.g. `?s=ig_dm_level2` in the DM). It lands in Play's
 * UTM referrer and in Apple's `ct` token.
 *
 * The buttons are the real link: detection can miss (desktop, odd user agents)
 * and a failed redirect must never strand anyone on a blank page.
 */

export const metadata: Metadata = {
  title: 'Get AXIOM',
  description: 'AXIOM counts your days.',
  robots: { index: false, follow: false },
  // Shown as the preview card when the link is sent in a DM. Kept discreet on
  // purpose: the preview sits in an inbox other people can glance at.
  openGraph: {
    title: 'AXIOM',
    description: 'Counts your days.',
    url: 'https://lunamaze.com/get/',
    siteName: 'Luna Maze',
    type: 'website',
  },
};

const DEFAULT_SOURCE = 'ig_bio';

function playUrl(source: string): string {
  const referrer = new URLSearchParams({
    utm_source: 'instagram',
    utm_medium: 'social',
    utm_campaign: source,
  }).toString();
  return `https://play.google.com/store/apps/details?${new URLSearchParams({ id: PLAY_PACKAGE, referrer }).toString()}`;
}

function appleUrl(source: string): string | null {
  if (APP_STORE_ID === null) return null;
  return `https://apps.apple.com/app/id${APP_STORE_ID}?${new URLSearchParams({ ct: source, mt: '8' }).toString()}`;
}

// Runs before hydration. Re-tags both buttons with `?s=`, then sends phones to
// their store. Android is left on the page while Play is blocked anywhere, so a
// visitor in a blocked market never bounces into a 404 (see storeLinks.ts).
const REDIRECT_SCRIPT = `(function(){try{
var q=new URLSearchParams(location.search).get('s');
var s=q&&/^[a-z0-9_]{1,40}$/.test(q)?q:${JSON.stringify(DEFAULT_SOURCE)};
var apple=${JSON.stringify(APP_STORE_ID)};
var play='https://play.google.com/store/apps/details?id=${PLAY_PACKAGE}&referrer='+encodeURIComponent('utm_source=instagram&utm_medium=social&utm_campaign='+s);
var ios=apple?'https://apps.apple.com/app/id'+apple+'?ct='+s+'&mt=8':null;
var a=document.getElementById('get-apple'),p=document.getElementById('get-play');
if(a&&ios)a.href=ios;if(p)p.href=play;
var ua=navigator.userAgent;
var isApple=/iPhone|iPad|iPod/i.test(ua)||(/Macintosh/i.test(ua)&&navigator.maxTouchPoints>1);
var t=isApple?ios:/Android/i.test(ua)&&!${PLAY_BLOCKED_TERRITORIES.length > 0}?play:null;
if(t){document.getElementById('get-status').textContent='Opening your app store\\u2026';location.replace(t);}
}catch(e){}})();`;

export default function GetPage(): JSX.Element {
  const apple = appleUrl(DEFAULT_SOURCE);
  const buttonClass =
    'rounded-xl border border-lunamaze-border bg-lunamaze-bgSurface/60 px-6 py-4 font-semibold hover:border-lunamaze-signal transition-colors';

  return (
    <main className={`${interClass} relative min-h-screen bg-lunamaze-bgDeep text-lunamaze-textPrimary flex items-center justify-center px-6 py-24`}>
      <div className="w-full max-w-md mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          <span className="lunamaze-text-gradient">AXIOM</span>
        </h1>
        <p id="get-status" className="text-lunamaze-textSecondary leading-relaxed" aria-live="polite" suppressHydrationWarning>
          Pick your store:
        </p>
        <div className="mt-8 flex flex-col gap-3">
          {apple !== null && (
            <a id="get-apple" href={apple} className={buttonClass} suppressHydrationWarning>
              Download on the App Store
            </a>
          )}
          <a id="get-play" href={playUrl(DEFAULT_SOURCE)} className={buttonClass} suppressHydrationWarning>
            Get it on Google Play
          </a>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: REDIRECT_SCRIPT }} />
    </main>
  );
}
