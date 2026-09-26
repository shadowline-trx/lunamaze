import type { Metadata } from 'next';
import Hero from '@/components/studio/Hero';
import { Loader, Nav, Credits } from '@/components/studio/Chrome';
import { Manifesto, Works, Reel, Method, Ledger, Maker, Questions, Finale } from '@/components/studio/Sections';
import StudioEnhancer from '@/components/studio/StudioEnhancer';
import { fontVariables } from '@/components/studio/fonts';
import { CONTACT_EMAIL, FAQS, GITHUB_URL, HOME_UPDATED, LAB, SITE, WORKS } from '@/components/studio/content';
import s from '@/components/studio/studio.module.css';

const TITLE = 'Luna Maze — Independent Software Studio';
const DESCRIPTION =
  'Luna Maze is an independent software studio making Axiom, Kern, Tether ADB, TypeCrt and Drift: focused, private software for the mind, the phone and the desk.';
const OG_IMAGE = `${SITE}/images/og/lunamaze-og.jpg`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE}/` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}/`,
    siteName: 'Luna Maze',
    locale: 'en_US',
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Luna Maze: a silver labyrinth inside a violet crescent moon' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const ORG_ID = `${SITE}/#organization`;
const FOUNDER_ID = `${SITE}/#shadowline`;

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: 'Luna Maze',
      alternateName: ['LunaMaze', 'Luna Maze Studio', 'lunamaze.com'],
      url: `${SITE}/`,
      logo: {
        '@type': 'ImageObject',
        '@id': `${SITE}/#logo`,
        url: `${SITE}/images/lunamaze-logo-512.png`,
        width: 512,
        height: 512,
        caption: 'Luna Maze',
      },
      image: { '@id': `${SITE}/#logo` },
      description:
        'Luna Maze is an independent software studio that designs and builds focused, private software: Axiom, Kern, Tether ADB, TypeCrt and Drift.',
      slogan: 'Quiet software, precisely made.',
      email: CONTACT_EMAIL,
      founder: { '@id': FOUNDER_ID },
      address: { '@type': 'PostalAddress', addressCountry: 'IN' },
      contactPoint: {
        '@type': 'ContactPoint',
        email: CONTACT_EMAIL,
        contactType: 'customer support',
        availableLanguage: ['English'],
      },
      sameAs: [GITHUB_URL],
      knowsAbout: [
        'Software engineering',
        'Android launchers',
        'Android Debug Bridge',
        'Habit tracking',
        'Privacy engineering',
        'Typing practice',
        'Puzzle game design',
      ],
      owns: [...WORKS, LAB].map((w) => ({ '@id': `${SITE}${w.href}#app` })),
    },
    {
      '@type': 'Person',
      '@id': FOUNDER_ID,
      name: 'Shadowline',
      jobTitle: 'Founder and developer',
      worksFor: { '@id': ORG_ID },
      url: `${SITE}/#maker`,
      sameAs: [GITHUB_URL],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: `${SITE}/`,
      name: 'Luna Maze',
      alternateName: 'LunaMaze',
      inLanguage: 'en',
      publisher: { '@id': ORG_ID },
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE}/#webpage`,
      url: `${SITE}/`,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: 'en',
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@id': ORG_ID },
      primaryImageOfPage: { '@type': 'ImageObject', url: OG_IMAGE, width: 1200, height: 630 },
      dateModified: HOME_UPDATED,
    },
    ...[...WORKS, LAB].map((w) => ({
      '@type': w.schemaType,
      '@id': `${SITE}${w.href}#app`,
      name: w.name,
      url: `${SITE}${w.href}`,
      description: `${w.line} ${w.detail}`,
      applicationCategory: w.category,
      ...(w.os ? { operatingSystem: w.os } : {}),
      publisher: { '@id': ORG_ID },
      author: { '@id': ORG_ID },
    })),
    {
      '@type': 'ItemList',
      '@id': `${SITE}/#works`,
      name: 'Luna Maze products',
      itemListElement: WORKS.map((w, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE}${w.href}`,
        name: w.name,
      })),
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE}/#faq`,
      isPartOf: { '@id': `${SITE}/#webpage` },
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

/**
 * Binds the italic and mono faces once the page has loaded, independent of
 * React. They swap into small labels and below-the-fold headings only, and
 * keeping them out of the first render keeps them off the critical path.
 */
/**
 * Runs before the first paint, from inside the page root:
 * - applies the colour theme chosen on an earlier visit (no flash of violet);
 * - plays the opening loader once per session, and never with reduced motion;
 * - marks the page as scripted (data-js), so reveal states are part of the
 *   first style pass; if the runtime has not started 12 s later, the mark is
 *   removed again and everything simply shows;
 * - binds the late fonts (italic, mono) only once the page has loaded AND its
 *   first contentful paint is on screen, so they never compete with it.
 */
const BOOT =
  "(function(r){try{var t=localStorage.getItem('lm-theme');if(t==='eclipse'||t==='tide')r.setAttribute('data-theme',t);if(sessionStorage.getItem('lm-intro'))r.setAttribute('data-intro-seen','');else sessionStorage.setItem('lm-intro','1')}catch(e){}if(matchMedia('(prefers-reduced-motion: reduce)').matches)r.setAttribute('data-intro-seen','');r.setAttribute('data-js','');setTimeout(function(){if(!r.hasAttribute('data-ready'))r.removeAttribute('data-js')},12000);var L=document.readyState==='complete',P=0,D=0;function go(){if(D||!L||!P)return;D=1;setTimeout(function(){r.setAttribute('data-late-fonts','');dispatchEvent(new Event('lm:painted'))},0)}try{new PerformanceObserver(function(l,o){if(l.getEntriesByName('first-contentful-paint').length){P=1;o.disconnect();go()}}).observe({type:'paint',buffered:true})}catch(e){P=1}if(!L)addEventListener('load',function(){L=1;go()},{once:true});else go()})(document.currentScript.parentElement)";

export default function StudioHome() {
  return (
    <div className={`${fontVariables} ${s.root}`} data-studio>
      <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      {/* The theme switch paints the new light as a widening circle cast from
          itself (View Transitions); the default cross-fade is switched off. */}
      <style>{'::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal}'}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <Loader />
      <Nav />
      <main id="main" style={{ position: 'relative' }}>
        <Hero />
        <svg className={s.pageThread} data-page-thread aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="lm-page-thread" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" className={s.vSoft} />
              <stop offset="1" className={s.vMoon} />
            </linearGradient>
          </defs>
          <path className={s.pageThreadTrack} data-track />
          <path className={s.pageThreadLine} data-line pathLength={1} />
          <circle className={s.pageThreadHead} data-head r="3" />
        </svg>
        <Manifesto />
        <Works />
        <Reel />
        <Method />
        <Ledger />
        <Maker />
        <Questions />
        <Finale />
      </main>
      <Credits />
      <div className={s.cursor} data-cursor-el aria-hidden="true">
        <span className={s.cursorRing} data-cursor-ring>
          <span />
        </span>
        <span className={s.cursorDot} data-cursor-dot />
      </div>
      <div className={s.grain} aria-hidden="true" />
      <svg className={s.srOnly} aria-hidden="true" focusable="false">
        <filter id="lm-liquid" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
          <feDisplacementMap in="SourceGraphic" in2="soft" scale="26" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <StudioEnhancer />
    </div>
  );
}
