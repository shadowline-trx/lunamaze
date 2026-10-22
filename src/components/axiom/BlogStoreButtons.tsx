'use client';

import { useEffect, useState } from 'react';
import { appStoreFirst, appStoreUrl, playStoreUrl } from '@/lib/storeLinks';
import { hexA } from '@/lib/color';

/**
 * Both store buttons, tagged with the article they sit under.
 *
 * The article CTA used to send readers to /axiom/, whose buttons all carry the
 * one `site-landing` tag, so no install could be traced back to the article
 * that earned it. Here the App Store `ct` and the Play `utm_source` name the
 * article and language (`blog-flatline-id`), which App Store Connect's
 * campaign report and the app's own `app:install_referrer` event both read.
 * One tap less to the store, too.
 *
 * The order follows `appStoreFirst()`, which needs `navigator`, so it is set
 * after mount; the server render puts Google Play first.
 */

const APPLE_LABEL: Readonly<Record<string, string>> = {
  en: 'Download on the App Store',
  hi: 'App Store से डाउनलोड करें',
  ta: 'App Store-இல் பதிவிறக்குங்கள்',
  ml: 'App Store-ൽ നിന്ന് download ചെയ്യൂ',
  id: 'Unduh di App Store',
  'pt-br': 'Baixar na App Store',
  es: 'Descargar en el App Store',
  ar: 'حمّله من App Store',
  fr: "Télécharger dans l'App Store",
  de: 'Laden im App Store',
  ru: 'Загрузите в App Store',
  tr: "App Store'dan indirin",
};

const PLAY_LABEL: Readonly<Record<string, string>> = {
  en: 'Get it on Google Play',
  hi: 'Google Play पर पाएं',
  ta: 'Google Play-இல் பெறுங்கள்',
  ml: 'Google Play-ൽ നിന്ന് download ചെയ്യൂ',
  id: 'Dapatkan di Google Play',
  'pt-br': 'Disponível no Google Play',
  es: 'Disponible en Google Play',
  ar: 'احصل عليه من Google Play',
  fr: 'Disponible sur Google Play',
  de: 'Jetzt bei Google Play',
  ru: 'Доступно в Google Play',
  tr: "Google Play'den alın",
};

interface Props {
  slug: string;
  lang: string;
  accent: string;
}

export default function BlogStoreButtons({ slug, lang, accent }: Props) {
  const [appleFirst, setAppleFirst] = useState(false);
  useEffect(() => setAppleFirst(appStoreFirst()), []);

  // Apple caps a campaign token at 40 characters.
  const source = `blog-${slug}-${lang}`.slice(0, 40);
  const apple = appStoreUrl(source);
  const play = playStoreUrl(source, 'blog', 'seo');

  const primary = {
    border: `1px solid ${hexA(accent, 0.55)}`,
    background: hexA(accent, 0.22),
  };
  const ghost = {
    border: `1px solid ${hexA(accent, 0.3)}`,
    background: 'transparent',
  };
  const cls =
    'inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-lunamaze-textPrimary transition-colors';

  const playLink = (
    <a key="play" href={play} target="_blank" rel="noreferrer" className={cls} style={appleFirst ? ghost : primary}>
      {PLAY_LABEL[lang] ?? PLAY_LABEL.en}
    </a>
  );
  const appleLink = apple ? (
    <a key="apple" href={apple} target="_blank" rel="noreferrer" className={cls} style={appleFirst ? primary : ghost}>
      {APPLE_LABEL[lang] ?? APPLE_LABEL.en}
    </a>
  ) : null;

  return (
    <div className="mt-5 flex flex-wrap gap-3" dir="ltr">
      {appleFirst ? [appleLink, playLink] : [playLink, appleLink]}
    </div>
  );
}
