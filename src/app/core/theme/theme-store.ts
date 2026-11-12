import { Injectable, signal } from '@angular/core';

const THEME_KEY = 'odivon:theme';

/** Açık/koyu tema tercihini tek yerde tutar; tüm sayfalar aynı tercihi paylaşır. */
@Injectable({ providedIn: 'root' })
export class ThemeStore {
  readonly dark = signal(read() === 'dark');

  constructor() {
    this.apply();
  }

  toggle(): void {
    this.dark.update((v) => !v);
    this.apply();
    try {
      localStorage.setItem(THEME_KEY, this.dark() ? 'dark' : 'light');
    } catch {
      /* depolama kapalıysa tercih yalnız bu oturumda geçerli */
    }
  }

  private apply(): void {
    document.documentElement.classList.toggle('dark', this.dark());
  }
}

function read(): string | null {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}
