import type { Metadata } from 'next';
import '@fontsource-variable/manrope';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import './globals.css';
export const metadata: Metadata = {
 title: 'Genesis — Free Terraforming Simulator & Planet Sandbox | Lunamaze',
 description: 'Build a living planet in your browser. Sculpt continents, change the atmosphere, melt ice caps and seed life in Genesis, a free terraforming sandbox by Lunamaze.',
 robots: { index: true, follow: true },
 icons: { icon: process.env.GITHUB_PAGES_BUILD === '1' ? '/genesis/favicon.svg' : '/favicon.svg' },
 alternates: { canonical: 'https://lunamaze.com/genesis/' },
 openGraph: { title: 'Genesis — A planet. A possibility.', description: 'Your own little world. Terraform it, bring it to life, and share what happens.', type: 'website', url: 'https://lunamaze.com/genesis/' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" className="dark"><body>{children}</body></html>; }
