import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStore } from '../core/auth/auth-store';
import { I18nStore, SupportedLang } from '../core/i18n/i18n';
import { NAV_GROUPS, TONE_CLASSES } from '../domain/domain-navigation';
import { KidsStore } from '../domain/kids-store';
import { PRODUCT } from '../domain/product-manifest';

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="min-h-screen text-slate-900 dark:text-slate-100">
      <a
        href="#main"
        class="odv-btn-primary sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[80]"
        >İçeriğe geç</a
      >
      @if (mobileOpen()) {
        <button
          type="button"
          class="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          aria-label="Menüyü kapat"
          (click)="mobileOpen.set(false)"
        ></button>
      }
      <aside
        class="odv-sidebar fixed inset-y-0 start-0 z-40 flex w-72 flex-col border-e border-slate-200/80 bg-white/95 px-4 py-5 backdrop-blur transition-transform dark:border-slate-800 dark:bg-slate-900/95"
        [class.odv-sidebar-closed]="!mobileOpen()"
      >
        <div class="mb-6 flex items-center justify-between px-2">
          <a
            routerLink="/overview"
            class="flex items-center gap-3"
            aria-label="OdivonKids ana sayfa"
          >
            <span
              class="relative grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-violet-500/25"
            >
              <span class="material-symbols-rounded" aria-hidden="true">toys</span>
              <span
                class="absolute -end-1 -top-1 size-3.5 rounded-full bg-amber-400 ring-2 ring-white dark:ring-slate-900"
              ></span>
            </span>
            <span>
              <strong class="block text-base leading-tight tracking-tight"
                >Odivon<span class="text-violet-600 dark:text-violet-300">Kids</span></strong
              >
              <span class="text-[11px] font-semibold text-slate-500">Çocuk ürünü uyumluluğu</span>
            </span>
          </a>
          <button
            type="button"
            class="odv-icon-btn lg:hidden"
            (click)="mobileOpen.set(false)"
            aria-label="Menüyü kapat"
          >
            <span class="material-symbols-rounded">close</span>
          </button>
        </div>

        <nav
          aria-label="Ana menü"
          class="custom-scroll -mx-1 flex-1 space-y-5 overflow-y-auto px-1"
        >
          @for (group of groups; track group.label) {
            <div>
              <div
                class="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[.14em] text-slate-400"
              >
                {{ group.label }}
              </div>
              <ul class="m-0 space-y-0.5 ps-0">
                @for (item of group.items; track item.path) {
                  <li class="list-none">
                    <a
                      [routerLink]="item.path"
                      routerLinkActive="odv-nav-active"
                      #rla="routerLinkActive"
                      [attr.aria-current]="rla.isActive ? 'page' : null"
                      class="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                      (click)="mobileOpen.set(false)"
                    >
                      <span
                        class="grid size-8 place-items-center rounded-lg"
                        [class]="tones[item.tone].soft"
                      >
                        <span class="material-symbols-rounded !text-[18px]" aria-hidden="true">{{
                          item.icon
                        }}</span>
                      </span>
                      {{ item.label }}
                      @if (badge(item.path); as count) {
                        <span
                          class="ms-auto rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-black leading-none text-white"
                          [attr.aria-label]="count + ' sorunlu kayıt'"
                          >{{ count }}</span
                        >
                      }
                    </a>
                  </li>
                }
              </ul>
            </div>
          }
        </nav>

        <div
          class="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50"
        >
          <div class="flex items-center gap-3">
            <span
              class="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 text-sm font-black text-white"
              aria-hidden="true"
              >{{ initials() }}</span
            >
            <div class="min-w-0 flex-1">
              <strong class="block truncate text-xs">{{ auth.session()?.name }}</strong>
              <span class="block truncate text-[11px] text-slate-500">{{
                auth.session()?.email
              }}</span>
            </div>
            <button
              type="button"
              class="odv-icon-btn !size-9"
              aria-label="Güvenli çıkış"
              (click)="logout()"
            >
              <span class="material-symbols-rounded !text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div class="lg:ms-72">
        <header
          class="sticky top-0 z-20 flex min-h-16 items-center gap-3 border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-[#0b1120]/80 sm:px-6 lg:px-8"
        >
          <button
            class="odv-icon-btn lg:hidden"
            type="button"
            (click)="mobileOpen.set(true)"
            aria-label="Menüyü aç"
          >
            <span class="material-symbols-rounded">menu</span>
          </button>
          <form
            class="relative hidden max-w-md flex-1 md:block"
            role="search"
            (submit)="searchProducts($event)"
          >
            <label for="global-search" class="sr-only">Ürün ara</label>
            <span
              class="material-symbols-rounded pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
              >search</span
            >
            <input
              id="global-search"
              name="q"
              type="search"
              placeholder="Ürün, model veya GTIN ara…"
              class="w-full rounded-xl border border-transparent bg-slate-100 py-2.5 pe-4 ps-10 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:bg-slate-800/70 dark:focus:bg-slate-900"
            />
          </form>
          <div class="ms-auto flex items-center gap-1.5">
            @if (store.sampleData) {
              <span
                class="hidden items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-900 sm:inline-flex"
                title="MainAPI bağlantısı kurulana kadar örnek veri gösteriliyor"
                ><span class="size-1.5 rounded-full bg-amber-500"></span>Örnek veri</span
              >
            }
            @if (auth.session()?.demo) {
              <span
                class="hidden items-center rounded-full bg-sky-50 px-3 py-1.5 text-[11px] font-bold text-sky-700 ring-1 ring-inset ring-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:ring-sky-900 sm:inline-flex"
                >Demo oturumu</span
              >
            }
            <label class="sr-only" for="language">Dil</label>
            <select
              id="language"
              class="odv-input !w-auto !border-transparent !bg-transparent !py-2 !ps-2 !pe-7 text-sm font-semibold hover:!bg-slate-100 dark:hover:!bg-slate-800"
              [value]="i18n.currentLang()"
              (change)="setLanguage($any($event.target).value)"
            >
              @for (language of i18n.options; track language.code) {
                <option [value]="language.code">
                  {{ language.flag }} {{ language.code.toUpperCase() }}
                </option>
              }
            </select>
            <button
              type="button"
              class="odv-icon-btn"
              (click)="toggleTheme()"
              [attr.aria-label]="dark() ? 'Açık temaya geç' : 'Koyu temaya geç'"
            >
              <span class="material-symbols-rounded">{{
                dark() ? 'light_mode' : 'dark_mode'
              }}</span>
            </button>
          </div>
        </header>
        <main id="main" class="mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8"><router-outlet /></main>
      </div>
    </div>
  `,
})
export class AppShell {
  readonly product = PRODUCT;
  readonly auth = inject(AuthStore);
  readonly i18n = inject(I18nStore);
  readonly store = inject(KidsStore);
  readonly groups = NAV_GROUPS;
  readonly tones = TONE_CLASSES;
  readonly mobileOpen = signal(false);
  readonly dark = signal(localStorage.getItem('odivon:theme') === 'dark');
  readonly initials = computed(() => {
    const name = this.auth.session()?.name ?? '';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] ?? 'O') + (parts[1]?.[0] ?? '')).toLocaleUpperCase('tr');
  });
  /** Menüde sorunlu (uygunsuz/süresi dolmuş) kayıt sayısı. */
  readonly problems = computed(() => {
    const counts: Record<string, number> = {};
    for (const row of this.store.readiness()) {
      for (const [area, status] of Object.entries(row.areas)) {
        if (status === 'rejected' || status === 'expired')
          counts[`/${area}`] = (counts[`/${area}`] ?? 0) + 1;
      }
    }
    return counts;
  });
  private readonly router = inject(Router);

  constructor() {
    document.documentElement.classList.toggle('dark', this.dark());
    this.i18n.setLanguage(this.i18n.currentLang());
  }

  badge(path: string): number {
    return this.problems()[path] ?? 0;
  }

  setLanguage(value: string): void {
    this.i18n.setLanguage(value as SupportedLang);
  }

  toggleTheme(): void {
    this.dark.update((v) => !v);
    document.documentElement.classList.toggle('dark', this.dark());
    localStorage.setItem('odivon:theme', this.dark() ? 'dark' : 'light');
  }

  searchProducts(event: Event): void {
    event.preventDefault();
    const q = new FormData(event.target as HTMLFormElement).get('q')?.toString().trim() ?? '';
    void this.router.navigate(['/products'], { queryParams: q ? { q } : {} });
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}
