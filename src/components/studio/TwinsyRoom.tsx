import { internalUrl } from '@/lib/paths';
import t from './twinsy-room.module.css';

const ACCOUNTS = [
  { name: 'Personal', number: '01', y: 64, rowY: 115 },
  { name: 'Work', number: '02', y: 156, rowY: 156 },
] as const;

function MailGlyph() {
  return (
    <symbol id="lm-twinsy-mail" viewBox="0 0 24 24">
      <rect className={t.glyphSurface} x="0.5" y="0.5" width="23" height="23" rx="6" />
      <rect className={t.envelope} x="5" y="7" width="14" height="10" rx="2" />
      <path className={t.envelope} d="m5.5 8 6.5 5 6.5-5" />
    </symbol>
  );
}

function AccountPanel({ name, number, y }: { readonly name: string; readonly number: string; readonly y: number }) {
  return (
    <g className={number === '02' ? t.work : undefined} transform={`translate(222 ${y})`}>
      <rect className={t.accountSurface} width="150" height="72" rx="11" />
      <use href="#lm-twinsy-mail" x="13" y="14" width="25" height="25" />
      <text className={t.accountName} x="49" y="26">{name}</text>
      <text className={t.accountMeta} x="49" y="39">Mail account</text>
      <line className={t.divider} x1="13" y1="49" x2="137" y2="49" />
      <text className={t.dataLabel} x="13" y="62">Separate app data</text>
      <text className={t.profileNumber} x="137" y="26" textAnchor="end">{number}</text>
      <circle className={t.destination} cx="0" cy="36" r="2.4" />
    </g>
  );
}

function Phone() {
  return (
    <g>
      <rect className={t.deviceEdge} x="35" y="18" width="139" height="216" rx="21" />
      <rect className={t.screen} x="41" y="24" width="127" height="204" rx="16" />
      <rect className={t.speaker} x="93" y="28" width="23" height="2" rx="1" />
      <image href={internalUrl('/twinsy/assets/twinsy-favicon.svg')} x="52" y="39" width="19" height="19" />
      <text className={t.brand} x="78" y="52">Twinsy</text>
      <line className={t.divider} x1="52" y1="66" x2="157" y2="66" />
      <text className={t.phoneTitle} x="52" y="88">Copies</text>
      <text className={t.copyCount} x="156" y="87" textAnchor="end">02</text>
      <text className={t.eyebrow} x="52" y="103">CHOOSE YOUR SPACE</text>
      {ACCOUNTS.map(account => (
        <g key={account.number} transform={`translate(51 ${account.rowY})`}>
          <rect className={t.libraryRow} width="107" height="32" rx="7" />
          <use href="#lm-twinsy-mail" x="7" y="7" width="18" height="18" />
          <text className={t.rowName} x="32" y="14">{account.name}</text>
          <text className={t.rowMeta} x="32" y="25">Mail · {account.number}</text>
          <path className={t.openArrow} d="M92 12h5v5m0-5-6 6" />
        </g>
      ))}
      <rect className={t.addField} x="51" y="199" width="107" height="16" rx="4" />
      <text className={t.addLabel} x="60" y="209.5">Add an app</text>
      <path className={t.addPlus} d="M146 204v7m-3.5-3.5h7" />
      <rect className={t.homeIndicator} x="86" y="221" width="37" height="2" rx="1" />
    </g>
  );
}

export default function TwinsyRoom() {
  return (
    <>
      <defs><MailGlyph /></defs>
      <text className={t.diagramHeading} x="222" y="40">SEPARATE ACCOUNTS</text>
      <path className={t.rail} d="M174 131h14q8 0 8-8v-15q0-8 8-8h18" />
      <path className={t.rail} d="M174 172h14q8 0 8 8v4q0 8 8 8h18" />
      <path className={t.pulse} d="M174 131h14q8 0 8-8v-15q0-8 8-8h18" pathLength="1" />
      <path className={`${t.pulse} ${t.secondPulse}`} d="M174 172h14q8 0 8 8v4q0 8 8 8h18" pathLength="1" />
      <Phone />
      {ACCOUNTS.map(account => <AccountPanel key={account.number} {...account} />)}
      <circle className={t.origin} cx="174" cy="131" r="2.3" />
      <circle className={t.origin} cx="174" cy="172" r="2.3" />
      <text className={t.caption} x="36" y="252">ONE APP. TWO SPACES.</text>
      <text className={t.caption} x="372" y="252" textAnchor="end">01 / 02</text>
    </>
  );
}
