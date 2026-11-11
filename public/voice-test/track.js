// Funnel events. Local for Gate 1; Gate 2 sets CONFIG.eventsEndpoint.
import { CONFIG } from './config.js';

const KEY = 'dv_events';
const SESSION = Math.random().toString(36).slice(2, 10);

export function track(name, props = {}) {
  const ev = { name, t: Date.now(), s: SESSION, ...props };
  try {
    const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
    arr.push(ev);
    localStorage.setItem(KEY, JSON.stringify(arr.slice(-500)));
  } catch {
    /* storage full or blocked */
  }
  if (CONFIG.eventsEndpoint && navigator.sendBeacon) navigator.sendBeacon(CONFIG.eventsEndpoint, JSON.stringify(ev));
  if (window.DV_DEBUG) console.debug('[dv]', ev);
}

export function localEvents() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}
