import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { BUILD_INFO } from './build-info';
import { clearSessionData } from './session-reset';

export interface RemoteVersion {
  version: string;
  buildId?: string;
  commit?: string;
  releaseNotes?: string[];
}

const LAST_COMMIT_KEY = 'odivon:last-commit';
const UPDATED_FLAG_KEY = 'odivon:updated-to';

@Injectable({ providedIn: 'root' })
export class VersionStore {
  private readonly document = inject(DOCUMENT);
  private timer: number | undefined;
  readonly current = BUILD_INFO;
  readonly label = `v${BUILD_INFO.version} · ${BUILD_INFO.commit}`;
  readonly remote = signal<RemoteVersion | null>(null);
  readonly updateRequired = signal(false);
  readonly updating = signal(false);
  /** Set when this page load is the first one on a new commit; the login page shows a notice. */
  readonly justUpdated = signal<string | null>(null);

  /**
   * Runs before the router starts. When the deployed commit differs from the one this browser
   * last ran, every cookie, storage entry and cache is cleared so the user signs in again on
   * the login page with a clean session.
   */
  async resetIfNewRelease(): Promise<void> {
    try {
      const flagged = sessionStorage.getItem(UPDATED_FLAG_KEY);
      if (flagged) {
        sessionStorage.removeItem(UPDATED_FLAG_KEY);
        this.justUpdated.set(flagged);
      }
      const previous = localStorage.getItem(LAST_COMMIT_KEY);
      if (previous && previous !== BUILD_INFO.commit) {
        await clearSessionData();
        this.justUpdated.set(BUILD_INFO.version);
      }
      localStorage.setItem(LAST_COMMIT_KEY, BUILD_INFO.commit);
    } catch {}
  }

  start(): void {
    if (this.timer) return;
    void this.check();
    this.timer = window.setInterval(() => void this.check(), 300_000);
    this.document.addEventListener('visibilitychange', () => {
      if (this.document.visibilityState === 'visible') void this.check();
    });
  }

  async check(): Promise<void> {
    try {
      const response = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) return;
      const value = (await response.json()) as RemoteVersion;
      this.remote.set(value);
      if (value.buildId && value.buildId !== BUILD_INFO.buildId) this.updateRequired.set(true);
    } catch {}
  }

  requireUpdate(): void {
    this.updateRequired.set(true);
  }

  /** Clears cookies, storage and caches, then loads the new version on the login page. */
  async applyUpdate(): Promise<void> {
    if (this.updating()) return;
    this.updating.set(true);
    try {
      await clearSessionData();
      sessionStorage.setItem(UPDATED_FLAG_KEY, this.remote()?.version ?? BUILD_INFO.version);
    } catch {
    } finally {
      window.location.replace('/login');
    }
  }
}
