// Gate 1 lab storage: sessions (both takes + numbers) and blind-listen answers, on this device only.
const DB = 'dv-lab';
const VERSION = 1;
const FLAG = 'dv_lab';

function openDb() {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open(DB, VERSION);
    r.onupgradeneeded = () => {
      const db = r.result;
      if (!db.objectStoreNames.contains('sessions')) db.createObjectStore('sessions', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('listens')) db.createObjectStore('listens', { keyPath: 'id' });
    };
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

async function run(store, mode, fn) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction(store, mode);
    const req = fn(t.objectStore(store));
    t.oncomplete = () => resolve(req?.result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

export const lab = {
  enabled: () => localStorage.getItem(FLAG) === '1',
  setEnabled: (on) => localStorage.setItem(FLAG, on ? '1' : '0'),
  saveSession: (rec) => run('sessions', 'readwrite', (s) => s.put(rec)),
  listSessions: async () => ((await run('sessions', 'readonly', (s) => s.getAll())) || []).sort((a, b) => a.at.localeCompare(b.at)),
  saveListen: (rec) => run('listens', 'readwrite', (s) => s.put(rec)),
  listListens: async () => (await run('listens', 'readonly', (s) => s.getAll())) || [],
  clearAll: async () => {
    await run('sessions', 'readwrite', (s) => s.clear());
    await run('listens', 'readwrite', (s) => s.clear());
  },
};
