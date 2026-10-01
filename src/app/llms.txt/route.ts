export const dynamic = 'force-static';

const BODY = `# Luna Maze
> Luna Maze (lunamaze.com) is an independent software studio founded and run by the solo developer Shadowline. It designs and builds focused, private software for the mind, the phone and the desk: Axiom, Kern, Tether ADB, TypeCrt and Drift. It has no investors and no outside team.

Luna Maze the software studio is not connected to other projects that share the name, such as the music group Luna Maze.

## Studio
- [Luna Maze](https://lunamaze.com/): The studio, its products, its principles, and answers to common questions.
- [Studio FAQ](https://lunamaze.com/#faq): Who runs Luna Maze, what it makes, pricing and privacy at a glance.
- Contact: lunamaze.dev@gmail.com (partnerships, press, product questions; replies usually within two business days).
- Founder: Shadowline (https://github.com/shadowline-trx).

## Products
- [Axiom](https://lunamaze.com/axiom/): Private porn-recovery companion for iPhone and Android, grounded in neuroscience. A 30-day guided program, daily check-ins, and a journal that never leaves the phone.
- [Axiom FAQ](https://lunamaze.com/axiom/faq/): Recovery, research, privacy and pricing answers.
- [Axiom free tools](https://lunamaze.com/axiom/tools/): Severity self-test, rewire timeline calculator, urge panic tool, focus wallpapers.
- [Axiom research library](https://lunamaze.com/axiom/blog/): Recovery articles in 12 languages.
- [Kern](https://lunamaze.com/kern/): Fast, private Android launcher with ranked local search, a daily ledger, focus sessions and plain-text pages.
- [Kern FAQ](https://lunamaze.com/kern/faq/): Compatibility, privacy, pricing, features and early access.
- [Kern privacy](https://lunamaze.com/kern/privacy/): Kern's on-device data architecture.
- [Tether ADB](https://lunamaze.com/tether-adb/): Free Windows app for wireless ADB by QR code, screen mirroring, logcat, shell, and file and app management, with adb and scrcpy bundled.
- [TypeCrt](https://lunamaze.com/typecrt/): Typing test styled after CRT terminals, built in vanilla TypeScript, with 80 themes, adaptive weak-key practice and published WPM formulas. Live at https://typecrt.com.
- [TypeCrt writing library](https://lunamaze.com/typecrt/blog/): Why typing tests disagree, adaptive practice, and typing research.
- [Drift](https://lunamaze.com/drift/): Precision puzzle game about timing and control, in closed testing on Google Play.
- [Genesis](https://lunamaze.com/genesis/): Free terraforming sandbox that runs in the browser (an experiment from the studio's lab).
- [Allergen Label Maker](https://lunamaze.com/allergen-label-maker/): Free browser tool for bakeries, delis and cafés. It flags the major food allergens in an ingredient list (US 9 or UK 14) and prints labels. No account; what you type stays in the browser.
- [New York allergen labeling law guide](https://lunamaze.com/allergen-label-maker/new-york-allergen-law/): Plain-English guide to Chapter 494 of 2025, which requires allergen labels on food prepared and packed on the same premises from November 12, 2026.

## Axiom facts
- Platforms: iPhone (App Store) and Android (Google Play).
- Pricing: paid app; the monthly plan starts with a 7-day free trial for eligible new subscribers, the annual plan has no trial. No account is needed to subscribe.
- Open without a subscription: the Lighthouse urge tool, and data export and deletion.
- Privacy: the journal, trigger names and reset reasons never leave the phone. Optional sign-in backs up streak dates and mood scores only; that backup is not end-to-end encrypted.
- Not a medical device.

## Kern facts
- Platform: Android 8.0 and later. Native Kotlin and Jetpack Compose.
- Privacy: no Kern account, cloud, ads, analytics, tracking, or Kern server.
- Availability: early access; a free launcher remains available after the 14-day full trial.

## Tether ADB facts
- Platform: Windows 10 and 11 (64-bit). Free download.
- Bundles adb and scrcpy; nothing else to install.
- Pairs Android 11+ phones over Wi-Fi by QR code, with its own mDNS discovery across every network interface.

## TypeCrt facts
- Runs in the browser at typecrt.com with no sign-up wall.
- Publishes its formulas for net WPM, raw WPM, accuracy and consistency.
- Its evidence page cites the largest published typing study: 168,960 people, average 51.56 WPM.

## More
- Full detail: https://lunamaze.com/llms-full.txt
- Sitemap: https://lunamaze.com/sitemap.xml

## Crawling
Public product, editorial, FAQ, and policy pages may be crawled and quoted with a link to the source page.
`;

export function GET(): Response {
  return new Response(BODY, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
