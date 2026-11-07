/** Preferences that survive a session reset so the user keeps their theme and language. */
export const PRESERVED_STORAGE_KEYS = ['odivon:theme', 'odivon:preferred_lang', 'odivon:last-commit'];

/** Removes every cookie this page can see, on the current path and each parent domain. */
export function clearCookies(doc: Document = document): void {
  const names = doc.cookie
    .split(';')
    .map((part) => part.split('=')[0]?.trim())
    .filter((name): name is string => !!name);
  const host = doc.location?.hostname ?? '';
  const parts = host.split('.');
  const domains = [''];
  for (let i = 0; i < parts.length - 1; i++) domains.push(`; domain=.${parts.slice(i).join('.')}`);
  const expired = '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0';
  for (const name of names) {
    for (const domain of domains) {
      doc.cookie = `${name}${expired}; path=/${domain}`;
      doc.cookie = `${name}${expired}${domain}`;
    }
  }
}

/** Clears localStorage (except preferences) and sessionStorage. */
export function clearWebStorage(): void {
  try {
    const kept = PRESERVED_STORAGE_KEYS.map((key) => [key, localStorage.getItem(key)] as const);
    localStorage.clear();
    for (const [key, value] of kept) if (value !== null) localStorage.setItem(key, value);
  } catch {}
  try {
    sessionStorage.clear();
  } catch {}
}

/** Removes Cache Storage, service workers and IndexedDB databases (Firebase keeps its login there). */
export async function clearOfflineData(): Promise<void> {
  const tasks: Promise<unknown>[] = [];
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    tasks.push(
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => Promise.all(regs.map((reg) => reg.unregister())))
        .catch(() => undefined),
    );
  }
  if (typeof caches !== 'undefined') {
    tasks.push(
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
        .catch(() => undefined),
    );
  }
  if (typeof indexedDB !== 'undefined' && typeof indexedDB.databases === 'function') {
    tasks.push(
      indexedDB
        .databases()
        .then((dbs) =>
          Promise.all(
            dbs
              .filter((db) => !!db.name)
              .map(
                (db) =>
                  new Promise<void>((resolve) => {
                    const request = indexedDB.deleteDatabase(db.name!);
                    request.onsuccess = request.onerror = request.onblocked = () => resolve();
                  }),
              ),
          ),
        )
        .catch(() => undefined),
    );
  }
  // Never let a hanging browser API keep the user on a stale version.
  await Promise.race([Promise.all(tasks), new Promise((resolve) => setTimeout(resolve, 3000))]);
}

/** Full reset: cookies, storage, caches, service workers and IndexedDB. */
export async function clearSessionData(): Promise<void> {
  clearCookies();
  clearWebStorage();
  await clearOfflineData();
}
