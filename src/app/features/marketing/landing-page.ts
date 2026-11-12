import { Component, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../core/auth/auth-store';
import { ThemeStore } from '../../core/theme/theme-store';
import { VersionStore } from '../../core/version/version-store';
import { BrandMark } from './brand-mark';
import { ProductPreview } from './product-preview';

/** kids.odivon.com açılış sayfası: ürünü tanıtır, giriş ve kayda yönlendirir. */
@Component({
  selector: 'app-landing-page',
  imports: [RouterLink, BrandMark, ProductPreview],
  template: `
    <div class="min-h-screen bg-white text-slate-900 dark:bg-[#0b1120] dark:text-white">
      <a
        href="#icerik"
        class="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[80] odv-btn-primary"
        >İçeriğe geç</a
      >

      <!-- Üst menü -->
      <header
        class="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
        [class]="scrolled() ? 'border-b border-white/10 bg-[#0c0a1f]/80 backdrop-blur-xl' : ''"
      >
        <nav
          class="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8"
          aria-label="Ana menü"
        >
          <a routerLink="/" aria-label="OdivonKids ana sayfa" class="rounded-xl">
            <odv-brand-mark tone="light" />
          </a>
          <ul class="m-0 hidden list-none items-center gap-1 p-0 lg:flex">
            @for (l of navLinks; track l.href) {
              <li>
                <a
                  [href]="'#' + l.href"
                  class="rounded-lg px-3 py-2 text-sm font-semibold text-indigo-100/80 transition-colors hover:bg-white/10 hover:text-white"
                  >{{ l.label }}</a
                >
              </li>
            }
          </ul>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="hidden size-10 place-items-center rounded-xl text-indigo-100 hover:bg-white/10 sm:grid"
              (click)="theme.toggle()"
              [attr.aria-label]="theme.dark() ? 'Açık temaya geç' : 'Koyu temaya geç'"
            >
              <span class="material-symbols-rounded" aria-hidden="true">{{
                theme.dark() ? 'light_mode' : 'dark_mode'
              }}</span>
            </button>
            @if (auth.isAuthenticated()) {
              <a routerLink="/overview" class="odv-land-btn-primary">
                Panele git
                <span class="material-symbols-rounded directional-icon" aria-hidden="true"
                  >arrow_forward</span
                >
              </a>
            } @else {
              <a
                routerLink="/login"
                class="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10 sm:inline-flex"
                >Giriş yap</a
              >
              <a routerLink="/register" class="odv-land-btn-primary">Ücretsiz başla</a>
            }
            <button
              type="button"
              class="grid size-10 place-items-center rounded-xl text-white hover:bg-white/10 lg:hidden"
              (click)="menuOpen.update((v) => !v)"
              [attr.aria-expanded]="menuOpen()"
              aria-controls="mobil-menu"
              [attr.aria-label]="menuOpen() ? 'Menüyü kapat' : 'Menüyü aç'"
            >
              <span class="material-symbols-rounded" aria-hidden="true">{{
                menuOpen() ? 'close' : 'menu'
              }}</span>
            </button>
          </div>
        </nav>
        @if (menuOpen()) {
          <div
            id="mobil-menu"
            class="mx-4 mb-4 rounded-2xl border border-white/10 bg-[#141033]/95 p-3 shadow-2xl backdrop-blur-xl lg:hidden"
          >
            @for (l of navLinks; track l.href) {
              <a
                [href]="'#' + l.href"
                (click)="menuOpen.set(false)"
                class="block rounded-xl px-4 py-3 text-sm font-semibold text-indigo-100 hover:bg-white/10"
                >{{ l.label }}</a
              >
            }
            @if (!auth.isAuthenticated()) {
              <div class="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                <a
                  routerLink="/login"
                  class="rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-bold text-white"
                  >Giriş yap</a
                >
                <a routerLink="/register" class="odv-land-btn-primary justify-center">Üye ol</a>
              </div>
            }
          </div>
        }
      </header>

      <main id="icerik">
        <!-- Hero -->
        <section
          class="odv-hero relative overflow-hidden bg-[#0c0a1f] pb-24 pt-32 text-white sm:pt-36 lg:pb-32"
        >
          <div aria-hidden="true" class="odv-grid pointer-events-none absolute inset-0"></div>
          <div
            aria-hidden="true"
            class="odv-blob pointer-events-none absolute -start-40 -top-32 size-[36rem] rounded-full bg-indigo-600/40 blur-[120px]"
          ></div>
          <div
            aria-hidden="true"
            class="odv-blob odv-blob-2 pointer-events-none absolute -end-32 top-20 size-[30rem] rounded-full bg-fuchsia-600/30 blur-[120px]"
          ></div>
          <div
            aria-hidden="true"
            class="pointer-events-none absolute bottom-0 start-1/3 size-80 rounded-full bg-sky-500/20 blur-[100px]"
          ></div>

          <div
            class="relative mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr]"
          >
            <div>
              <span
                class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1.5 pe-4 ps-1.5 text-xs font-semibold text-indigo-100 backdrop-blur"
              >
                <span
                  class="rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-950"
                  >Yeni</span
                >
                GPSR ve EN 71 kanıtlarını tek yerde toplayın
              </span>
              <h1
                class="mb-0 mt-7 text-[2.6rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl"
              >
                Çocuk ürünleriniz
                <span class="odv-gradient-text block">pazara hazır mı?</span>
              </h1>
              <p class="mt-7 max-w-xl text-lg leading-8 text-indigo-100/80">
                OdivonKids; yaş sınıfı, test raporu, uyarı metni ve parti izlenebilirliğini ürün
                bazında birleştirir. Hangi ürünün satışa çıkabileceğini, hangisinde neyin eksik
                olduğunu tek ekranda görürsünüz.
              </p>
              <div class="mt-10 flex flex-col gap-3 sm:flex-row">
                @if (auth.isAuthenticated()) {
                  <a routerLink="/overview" class="odv-land-btn-primary odv-land-btn-lg">
                    Panele git
                    <span class="material-symbols-rounded directional-icon" aria-hidden="true"
                      >arrow_forward</span
                    >
                  </a>
                } @else {
                  <a routerLink="/register" class="odv-land-btn-primary odv-land-btn-lg">
                    Ücretsiz hesap oluştur
                    <span class="material-symbols-rounded directional-icon" aria-hidden="true"
                      >arrow_forward</span
                    >
                  </a>
                  <a routerLink="/login" class="odv-land-btn-glass odv-land-btn-lg">
                    <span class="material-symbols-rounded" aria-hidden="true">login</span>Giriş yap
                  </a>
                }
              </div>
              <ul
                class="m-0 mt-8 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-sm text-indigo-100/70"
              >
                @for (t of heroTrust; track t) {
                  <li class="inline-flex items-center gap-1.5">
                    <span
                      class="material-symbols-rounded !text-[18px] text-emerald-400"
                      aria-hidden="true"
                      >check_circle</span
                    >{{ t }}
                  </li>
                }
              </ul>
            </div>
            <div class="relative lg:ps-6">
              <div
                aria-hidden="true"
                class="absolute inset-6 rounded-[2rem] bg-gradient-to-br from-indigo-500/40 to-fuchsia-500/40 blur-2xl"
              ></div>
              <odv-product-preview />
            </div>
          </div>

          <!-- Standart şeridi -->
          <div class="relative mx-auto mt-24 max-w-7xl px-5 sm:px-8">
            <p
              class="mb-5 text-center text-xs font-bold uppercase tracking-[.2em] text-indigo-200/60"
            >
              Kanıtlarını kayıt altına alabileceğiniz mevzuat ve standartlar
            </p>
            <ul class="m-0 flex list-none flex-wrap justify-center gap-3 p-0">
              @for (s of standards; track s.code) {
                <li
                  class="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center backdrop-blur"
                >
                  <strong class="block text-sm font-extrabold text-white">{{ s.code }}</strong>
                  <span class="text-[11px] text-indigo-200/70">{{ s.label }}</span>
                </li>
              }
            </ul>
          </div>
        </section>

        <!-- Sorun / çözüm -->
        <section class="relative py-24 sm:py-32">
          <div class="mx-auto max-w-7xl px-5 sm:px-8">
            <div class="grid items-center gap-14 lg:grid-cols-2">
              <div>
                <span class="odv-eyebrow">Neden OdivonKids?</span>
                <h2 class="odv-h2">Dağınık klasörler, kaçan son tarihler ve geri çağırma riski.</h2>
                <p class="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                  Bir oyuncağın rafa çıkması için onlarca belge gerekir: test raporları, yaş
                  gerekçesi, çok dilli uyarılar, parti kayıtları. Bunlar e-posta ve Excel
                  dosyalarına dağıldığında, süresi dolan tek bir rapor bütün sevkiyatı durdurabilir.
                </p>
              </div>
              <div class="grid gap-4 sm:grid-cols-2">
                @for (p of problems; track p.title) {
                  <div
                    class="rounded-3xl border p-6"
                    [class]="
                      p.good
                        ? 'border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 dark:border-violet-500/30 dark:from-violet-500/10 dark:to-indigo-500/10'
                        : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60'
                    "
                  >
                    <span
                      class="grid size-11 place-items-center rounded-2xl"
                      [class]="
                        p.good
                          ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                          : 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300'
                      "
                      ><span class="material-symbols-rounded" aria-hidden="true">{{
                        p.icon
                      }}</span></span
                    >
                    <h3 class="mb-1.5 mt-4 text-base font-extrabold">{{ p.title }}</h3>
                    <p class="m-0 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {{ p.text }}
                    </p>
                  </div>
                }
              </div>
            </div>
          </div>
        </section>

        <!-- Özellikler -->
        <section
          id="ozellikler"
          class="scroll-mt-20 bg-slate-50 py-24 sm:py-32 dark:bg-slate-950/40"
        >
          <div class="mx-auto max-w-7xl px-5 sm:px-8">
            <div class="mx-auto max-w-2xl text-center">
              <span class="odv-eyebrow">Özellikler</span>
              <h2 class="odv-h2">Uyumluluğun her parçası, birbirine bağlı.</h2>
              <p class="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Her kayıt bir ürüne bağlıdır. Bir alan eksik ya da süresi dolmuşsa ürün otomatik
                olarak işaretlenir; kimse hatırlamak zorunda kalmaz.
              </p>
            </div>
            <div class="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              @for (f of features; track f.title) {
                <article
                  class="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div
                    aria-hidden="true"
                    class="absolute -end-10 -top-10 size-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                    [class]="f.glow"
                  ></div>
                  <span
                    class="relative grid size-12 place-items-center rounded-2xl"
                    [class]="f.tone"
                    ><span class="material-symbols-rounded" aria-hidden="true">{{
                      f.icon
                    }}</span></span
                  >
                  <h3 class="relative mb-2 mt-5 text-lg font-extrabold tracking-tight">
                    {{ f.title }}
                  </h3>
                  <p class="relative m-0 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {{ f.text }}
                  </p>
                  <ul class="relative m-0 mt-5 list-none space-y-2 p-0">
                    @for (b of f.bullets; track b) {
                      <li
                        class="flex items-start gap-2 text-[13px] font-medium text-slate-700 dark:text-slate-300"
                      >
                        <span
                          class="material-symbols-rounded !text-[17px] text-violet-600 dark:text-violet-400"
                          aria-hidden="true"
                          >check</span
                        >{{ b }}
                      </li>
                    }
                  </ul>
                </article>
              }
            </div>
          </div>
        </section>

        <!-- Nasıl çalışır -->
        <section id="nasil-calisir" class="scroll-mt-20 py-24 sm:py-32">
          <div class="mx-auto max-w-7xl px-5 sm:px-8">
            <div class="mx-auto max-w-2xl text-center">
              <span class="odv-eyebrow">Nasıl çalışır?</span>
              <h2 class="odv-h2">Üç adımda pazara hazır.</h2>
            </div>
            <div class="relative mt-16">
              <div
                aria-hidden="true"
                class="absolute inset-x-[16%] top-8 hidden h-px bg-gradient-to-r from-indigo-300 via-violet-400 to-fuchsia-300 lg:block dark:from-indigo-500/40 dark:via-violet-500/50 dark:to-fuchsia-500/40"
              ></div>
              <ol class="relative m-0 grid list-none gap-6 p-0 lg:grid-cols-3">
                @for (s of steps; track s.title; let i = $index) {
                  <li class="relative text-center">
                    <span
                      class="relative mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-xl shadow-violet-500/30"
                    >
                      <span class="material-symbols-rounded !text-[28px]" aria-hidden="true">{{
                        s.icon
                      }}</span>
                      <span
                        class="absolute -end-2 -top-2 grid size-7 place-items-center rounded-full bg-white text-xs font-extrabold text-violet-700 shadow ring-1 ring-slate-200 dark:bg-slate-900 dark:text-violet-300 dark:ring-slate-700"
                        >{{ i + 1 }}</span
                      >
                    </span>
                    <h3 class="mb-2 mt-6 text-xl font-extrabold tracking-tight">{{ s.title }}</h3>
                    <p
                      class="mx-auto m-0 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400"
                    >
                      {{ s.text }}
                    </p>
                  </li>
                }
              </ol>
            </div>
          </div>
        </section>

        <!-- Öne çıkan: otomatik bloke -->
        <section class="pb-24 sm:pb-32">
          <div class="mx-auto max-w-7xl px-5 sm:px-8">
            <div
              class="relative overflow-hidden rounded-[2rem] bg-[#0c0a1f] p-8 text-white sm:p-12 lg:p-16"
            >
              <div
                aria-hidden="true"
                class="odv-grid pointer-events-none absolute inset-0 opacity-60"
              ></div>
              <div
                aria-hidden="true"
                class="pointer-events-none absolute -end-20 -top-20 size-96 rounded-full bg-violet-600/40 blur-[100px]"
              ></div>
              <div class="relative grid items-center gap-12 lg:grid-cols-2">
                <div>
                  <span class="text-xs font-bold uppercase tracking-[.2em] text-amber-300"
                    >Akıllı hazırlık kuralları</span
                  >
                  <h2
                    class="mb-0 mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
                  >
                    Süresi dolan rapor, ürünü kendiliğinden bloke eder.
                  </h2>
                  <p class="mt-5 text-base leading-7 text-indigo-100/80">
                    Her ürünün hazırlık puanı dört zorunlu alandan hesaplanır. Bir test raporunun
                    geçerliliği bittiği anda ürün "Bloke" olur ve panelde kırmızıyla işaretlenir.
                    Böylece süresi geçmiş belgeyle sevkiyat yapılmaz.
                  </p>
                  <dl class="m-0 mt-10 grid grid-cols-3 gap-4">
                    @for (m of metrics; track m.label) {
                      <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <dt class="text-[11px] font-semibold text-indigo-200/70">{{ m.label }}</dt>
                        <dd class="m-0 mt-1 text-3xl font-extrabold tracking-tight">
                          {{ m.value }}
                        </dd>
                      </div>
                    }
                  </dl>
                </div>
                <div class="grid gap-3" aria-hidden="true">
                  @for (t of timeline; track t.title) {
                    <div
                      class="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.06] p-4 backdrop-blur"
                    >
                      <span
                        class="grid size-11 shrink-0 place-items-center rounded-xl"
                        [class]="t.tone"
                        ><span class="material-symbols-rounded">{{ t.icon }}</span></span
                      >
                      <span class="min-w-0 flex-1">
                        <strong class="block text-sm font-bold">{{ t.title }}</strong>
                        <span class="text-xs text-indigo-200/70">{{ t.note }}</span>
                      </span>
                      <span
                        class="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider"
                        [class]="t.badgeTone"
                        >{{ t.badge }}</span
                      >
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Kimler için -->
        <section
          id="kimler-icin"
          class="scroll-mt-20 bg-slate-50 py-24 sm:py-32 dark:bg-slate-950/40"
        >
          <div class="mx-auto max-w-7xl px-5 sm:px-8">
            <div class="mx-auto max-w-2xl text-center">
              <span class="odv-eyebrow">Kimler için?</span>
              <h2 class="odv-h2">Çocuk ürünü zincirindeki herkes için.</h2>
            </div>
            <div class="mt-16 grid gap-5 md:grid-cols-3">
              @for (a of audiences; track a.title) {
                <article
                  class="rounded-3xl border border-slate-200/80 bg-white p-8 dark:border-slate-800 dark:bg-slate-900"
                >
                  <span
                    class="grid size-14 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg"
                    [class]="a.tone"
                    ><span class="material-symbols-rounded !text-[28px]" aria-hidden="true">{{
                      a.icon
                    }}</span></span
                  >
                  <h3 class="mb-2 mt-6 text-xl font-extrabold tracking-tight">{{ a.title }}</h3>
                  <p class="m-0 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {{ a.text }}
                  </p>
                </article>
              }
            </div>
          </div>
        </section>

        <!-- Güvenlik -->
        <section id="guvenlik" class="scroll-mt-20 py-24 sm:py-32">
          <div
            class="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr]"
          >
            <div>
              <span class="odv-eyebrow">Güvenlik ve gizlilik</span>
              <h2 class="odv-h2">Verileriniz güvende, ekibiniz kontrolde.</h2>
              <p class="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                OdivonKids, Odivon'un KVKK odaklı bulut altyapısında çalışır. Erişim kimlik
                doğrulamayla korunur, her değişiklik kimin ne zaman yaptığıyla kayda geçer.
              </p>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              @for (s of security; track s.title) {
                <div
                  class="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                >
                  <span
                    class="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                    ><span class="material-symbols-rounded" aria-hidden="true">{{
                      s.icon
                    }}</span></span
                  >
                  <span>
                    <strong class="block text-sm font-extrabold">{{ s.title }}</strong>
                    <span
                      class="mt-1 block text-[13px] leading-5 text-slate-600 dark:text-slate-400"
                      >{{ s.text }}</span
                    >
                  </span>
                </div>
              }
            </div>
          </div>
        </section>

        <!-- SSS -->
        <section id="sss" class="scroll-mt-20 bg-slate-50 py-24 sm:py-32 dark:bg-slate-950/40">
          <div class="mx-auto max-w-3xl px-5 sm:px-8">
            <div class="text-center">
              <span class="odv-eyebrow">Sıkça sorulan sorular</span>
              <h2 class="odv-h2">Aklınıza takılanlar</h2>
            </div>
            <div class="mt-12 space-y-3">
              @for (q of faqs; track q.q) {
                <details
                  class="group rounded-2xl border border-slate-200/80 bg-white p-5 open:shadow-lg open:shadow-indigo-500/5 dark:border-slate-800 dark:bg-slate-900"
                >
                  <summary
                    class="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold [&::-webkit-details-marker]:hidden"
                  >
                    {{ q.q }}
                    <span
                      class="material-symbols-rounded shrink-0 text-violet-600 transition-transform group-open:rotate-45 dark:text-violet-400"
                      aria-hidden="true"
                      >add</span
                    >
                  </summary>
                  <p class="m-0 mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {{ q.a }}
                  </p>
                </details>
              }
            </div>
          </div>
        </section>

        <!-- Son çağrı -->
        <section class="py-24 sm:py-32">
          <div class="mx-auto max-w-7xl px-5 sm:px-8">
            <div
              class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-16 text-center text-white shadow-2xl shadow-violet-500/30 sm:px-16 sm:py-20"
            >
              <div
                aria-hidden="true"
                class="odv-grid pointer-events-none absolute inset-0 opacity-50"
              ></div>
              <div class="relative mx-auto max-w-2xl">
                <h2 class="m-0 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                  Bir sonraki ürününüzü güvenle rafa çıkarın.
                </h2>
                <p class="mx-auto mt-5 max-w-xl text-lg leading-8 text-violet-100">
                  Birkaç dakikada hesabınızı açın, ilk ürününüzü ekleyin ve eksik kanıtları hemen
                  görün.
                </p>
                <div class="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                  @if (auth.isAuthenticated()) {
                    <a routerLink="/overview" class="odv-land-btn-white odv-land-btn-lg"
                      >Panele git</a
                    >
                  } @else {
                    <a routerLink="/register" class="odv-land-btn-white odv-land-btn-lg">
                      Ücretsiz üye ol
                      <span class="material-symbols-rounded directional-icon" aria-hidden="true"
                        >arrow_forward</span
                      >
                    </a>
                    <a routerLink="/login" class="odv-land-btn-glass odv-land-btn-lg">Giriş yap</a>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer class="border-t border-slate-200 py-12 dark:border-slate-800">
        <div
          class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 text-sm text-slate-500 sm:px-8 md:flex-row dark:text-slate-400"
        >
          <odv-brand-mark subtitle="Çocuk ürünleri güvenliği" />
          <nav aria-label="Alt menü" class="flex flex-wrap justify-center gap-x-6 gap-y-2">
            @for (l of navLinks; track l.href) {
              <a [href]="'#' + l.href" class="hover:text-violet-600 dark:hover:text-violet-300">{{
                l.label
              }}</a>
            }
            <a routerLink="/login" class="hover:text-violet-600 dark:hover:text-violet-300"
              >Giriş yap</a
            >
            <a routerLink="/register" class="hover:text-violet-600 dark:hover:text-violet-300"
              >Üye ol</a
            >
          </nav>
          <p class="m-0 text-xs">© {{ year }} Odivon · {{ version.label }}</p>
        </div>
      </footer>
    </div>
  `,
  host: { '(window:scroll)': 'onScroll()' },
  styles: `
    :host {
      display: block;
      scroll-behavior: smooth;
    }
    .h-18 {
      height: 4.5rem;
    }
    .odv-grid {
      background-image:
        linear-gradient(rgb(255 255 255 / 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgb(255 255 255 / 0.05) 1px, transparent 1px);
      background-size: 56px 56px;
      mask-image: radial-gradient(ellipse at 50% 30%, black 15%, transparent 70%);
    }
    .odv-gradient-text {
      background: linear-gradient(90deg, #a5b4fc, #f0abfc 45%, #fcd34d);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .odv-eyebrow {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #7c3aed;
    }
    :host-context(.dark) .odv-eyebrow {
      color: #c4b5fd;
    }
    .odv-h2 {
      margin: 0.85rem 0 0;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.025em;
    }
    .odv-land-btn-primary,
    .odv-land-btn-glass,
    .odv-land-btn-white {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      border-radius: 0.85rem;
      padding: 0.65rem 1.1rem;
      font-size: 0.875rem;
      font-weight: 800;
      white-space: nowrap;
      transition:
        transform 0.2s,
        box-shadow 0.2s,
        background-color 0.2s;
    }
    .odv-land-btn-primary {
      background: linear-gradient(135deg, #6366f1, #8b5cf6 55%, #d946ef);
      color: white;
      box-shadow: 0 10px 30px rgb(139 92 246 / 0.35);
    }
    .odv-land-btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 14px 36px rgb(139 92 246 / 0.45);
    }
    .odv-land-btn-glass {
      border: 1px solid rgb(255 255 255 / 0.2);
      background: rgb(255 255 255 / 0.08);
      color: white;
      backdrop-filter: blur(8px);
    }
    .odv-land-btn-glass:hover {
      background: rgb(255 255 255 / 0.16);
    }
    .odv-land-btn-white {
      background: white;
      color: #4c1d95;
      box-shadow: 0 10px 30px rgb(15 23 42 / 0.25);
    }
    .odv-land-btn-white:hover {
      transform: translateY(-1px);
    }
    .odv-land-btn-lg {
      justify-content: center;
      padding: 0.95rem 1.5rem;
      font-size: 1rem;
      border-radius: 1rem;
    }
    a:focus-visible,
    button:focus-visible,
    summary:focus-visible {
      outline: 3px solid rgb(167 139 250 / 0.7);
      outline-offset: 2px;
    }
    @keyframes odv-drift {
      0%,
      100% {
        transform: translate(0, 0) scale(1);
      }
      50% {
        transform: translate(40px, 30px) scale(1.08);
      }
    }
    .odv-blob {
      animation: odv-drift 18s ease-in-out infinite;
    }
    .odv-blob-2 {
      animation-duration: 22s;
      animation-direction: reverse;
    }
    @media (prefers-reduced-motion: reduce) {
      :host {
        scroll-behavior: auto;
      }
      .odv-blob {
        animation: none;
      }
    }
  `,
})
export class LandingPage {
  readonly auth = inject(AuthStore);
  readonly theme = inject(ThemeStore);
  readonly version = inject(VersionStore);
  readonly menuOpen = signal(false);
  readonly scrolled = signal(false);
  readonly year = new Date().getFullYear();

  readonly navLinks = [
    { href: 'ozellikler', label: 'Özellikler' },
    { href: 'nasil-calisir', label: 'Nasıl çalışır?' },
    { href: 'kimler-icin', label: 'Kimler için?' },
    { href: 'guvenlik', label: 'Güvenlik' },
    { href: 'sss', label: 'SSS' },
  ];
  readonly heroTrust = ['Kredi kartı gerekmez', 'Dakikalar içinde kurulum', 'KVKK odaklı altyapı'];
  readonly standards = [
    { code: 'GPSR', label: 'AB 2023/988' },
    { code: 'EN 71', label: 'Oyuncak güvenliği' },
    { code: 'CE', label: 'Uygunluk işareti' },
    { code: 'REACH', label: 'Kimyasal maddeler' },
    { code: 'ASTM F963', label: 'ABD oyuncak standardı' },
    { code: 'EN 62115', label: 'Elektrikli oyuncaklar' },
  ];
  readonly problems = [
    {
      icon: 'folder_off',
      title: 'Dağınık belgeler',
      text: 'Raporlar e-postada, uyarılar tasarım dosyasında, partiler Excel’de.',
      good: false,
    },
    {
      icon: 'event_busy',
      title: 'Kaçan son tarihler',
      text: 'Süresi dolan test raporu fark edilmeden sevkiyat yapılır.',
      good: false,
    },
    {
      icon: 'hub',
      title: 'Tek kaynak',
      text: 'Ürüne bağlı tüm kanıtlar tek yerde, herkes aynı bilgiyi görür.',
      good: true,
    },
    {
      icon: 'notifications_active',
      title: 'Zamanında uyarı',
      text: 'Bitişine günler kala hatırlatma; süresi dolarsa otomatik bloke.',
      good: true,
    },
  ];
  readonly features = [
    {
      icon: 'child_care',
      title: 'Yaş sınıflandırması',
      text: 'Her ürünün hedef yaş aralığını gerekçesiyle birlikte kaydedin.',
      bullets: ['Gerekçe ve değerlendirme notu', '0-36 ay uyarısı kontrolü'],
      tone: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300',
      glow: 'bg-sky-400/30',
    },
    {
      icon: 'science',
      title: 'Test raporları',
      text: 'Laboratuvar raporlarını standart, kapsam ve geçerlilik tarihiyle saklayın.',
      bullets: ['Geçerlilik süresi takibi', 'Laboratuvar ve rapor numarası'],
      tone: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300',
      glow: 'bg-rose-400/30',
    },
    {
      icon: 'warning',
      title: 'Uyarı metinleri',
      text: 'Ambalaj ve kullanım kılavuzu uyarılarını dil bazında yönetin.',
      bullets: ['Çok dilli uyarı kontrolü', 'İnceleme ve onay akışı'],
      tone: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
      glow: 'bg-amber-400/30',
    },
    {
      icon: 'qr_code_2',
      title: 'Parti izlenebilirliği',
      text: 'Üretimden rafa her partiyi izleyin, geri çağırmada dakikalar içinde bulun.',
      bullets: ['Lot ve üretim tarihi', 'Serbest bırakma kaydı'],
      tone: 'bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300',
      glow: 'bg-teal-400/30',
    },
    {
      icon: 'grid_view',
      title: 'Pazara hazırlık matrisi',
      text: 'Tüm ürünlerin dört alandaki durumunu tek tabloda görün.',
      bullets: ['Hazır / Eksik / Bloke durumu', 'Yüzde bazlı hazırlık puanı'],
      tone: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300',
      glow: 'bg-violet-400/30',
    },
    {
      icon: 'translate',
      title: 'Çok dilli çalışma',
      text: 'Türkçe ve İngilizce arayüz; Arapça için sağdan sola destek.',
      bullets: ['Ekip bazında dil seçimi', 'RTL uyumlu düzen'],
      tone: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300',
      glow: 'bg-indigo-400/30',
    },
  ];
  readonly steps = [
    {
      icon: 'add_box',
      title: 'Ürünlerinizi ekleyin',
      text: 'Model kodu, GTIN ve hedef pazarla ürün kataloğunuzu birkaç dakikada oluşturun.',
    },
    {
      icon: 'upload_file',
      title: 'Kanıtları bağlayın',
      text: 'Test raporu, yaş gerekçesi, uyarılar ve parti kayıtlarını ilgili ürüne ekleyin.',
    },
    {
      icon: 'rocket_launch',
      title: 'Güvenle satışa çıkın',
      text: 'Hazırlık puanı %100 olan ürünleri yayınlayın, eksikleri sorumlusuna atayın.',
    },
  ];
  readonly metrics = [
    { label: 'Zorunlu alan', value: '4' },
    { label: 'Ürün başına', value: '%100' },
    { label: 'Hatırlatma', value: '30 gün' },
  ];
  readonly timeline = [
    {
      icon: 'science',
      title: 'EN 71-3 raporu yüklendi',
      note: 'Manyetik Blok Seti · geçerli',
      badge: 'Onaylı',
      tone: 'bg-emerald-400/20 text-emerald-300',
      badgeTone: 'bg-emerald-400/15 text-emerald-300',
    },
    {
      icon: 'schedule',
      title: 'Rapor süresi 30 gün içinde doluyor',
      note: 'Peluş Uyku Arkadaşı · yenileme gerekiyor',
      badge: 'Yaklaşıyor',
      tone: 'bg-amber-400/20 text-amber-300',
      badgeTone: 'bg-amber-400/15 text-amber-300',
    },
    {
      icon: 'block',
      title: 'Test raporunun süresi doldu',
      note: 'Çocuk Gece Lambası · satış durduruldu',
      badge: 'Bloke',
      tone: 'bg-rose-500/20 text-rose-300',
      badgeTone: 'bg-rose-500/20 text-rose-300',
    },
  ];
  readonly audiences = [
    {
      icon: 'precision_manufacturing',
      title: 'Üreticiler',
      text: 'Ürün geliştirme aşamasından itibaren gerekli testleri ve teknik dosyayı planlayın.',
      tone: 'from-indigo-500 to-violet-600 shadow-indigo-500/30',
    },
    {
      icon: 'local_shipping',
      title: 'İthalatçılar ve distribütörler',
      text: 'Tedarikçiden gelen belgeleri doğrulayın, eksik kanıtı olan ürünü gümrükten önce yakalayın.',
      tone: 'from-fuchsia-500 to-pink-600 shadow-fuchsia-500/30',
    },
    {
      icon: 'storefront',
      title: 'Perakende ve e-ticaret',
      text: 'Pazaryerlerinin istediği uygunluk belgelerini tek tıkla hazır tutun.',
      tone: 'from-amber-400 to-orange-500 shadow-amber-500/30',
    },
  ];
  readonly security = [
    { icon: 'lock', title: 'Güvenli erişim', text: 'Kimlik doğrulama ve oturum koruması.' },
    {
      icon: 'history',
      title: 'Değişiklik geçmişi',
      text: 'Her kayıt kimin ne zaman değiştirdiğiyle saklanır.',
    },
    {
      icon: 'shield_person',
      title: 'KVKK odaklı',
      text: 'Kişisel veriler Türkiye mevzuatı gözetilerek işlenir.',
    },
    {
      icon: 'cloud_done',
      title: 'Bulut altyapısı',
      text: 'Kurulum gerekmez, her cihazdan erişin.',
    },
  ];
  readonly faqs = [
    {
      q: 'OdivonKids tam olarak ne yapar?',
      a: 'Çocuk ürünleri için gereken uyumluluk kanıtlarını (yaş sınıfı, test raporu, uyarı metni, parti kaydı) ürün bazında toplar ve her ürünün satışa hazır olup olmadığını otomatik hesaplar.',
    },
    {
      q: 'Hangi standartları destekliyor?',
      a: 'GPSR, EN 71 serisi, EN 62115, REACH, ASTM F963 gibi standartlara ait rapor ve belgeleri kaydedebilirsiniz. Kayıtlar standart adı, kapsam ve geçerlilik tarihiyle tutulur.',
    },
    {
      q: 'Kurulum gerekiyor mu?',
      a: 'Hayır. OdivonKids tarayıcıdan çalışır. Üye olduktan sonra ürünlerinizi hemen eklemeye başlayabilirsiniz.',
    },
    {
      q: 'Ekip arkadaşlarımla birlikte kullanabilir miyim?',
      a: 'Evet. Aynı çalışma alanında birden fazla kişi çalışabilir; her değişiklik kimin yaptığıyla kayda geçer.',
    },
    {
      q: 'Önce denemek istiyorum, mümkün mü?',
      a: 'Giriş ekranındaki "Demo hesabıyla incele" seçeneğiyle örnek verilerle dolu bir çalışma alanını hesap açmadan gezebilirsiniz.',
    },
  ];

  constructor() {
    inject(Title).setTitle('OdivonKids · Çocuk ürünleri için uyumluluk ve pazara hazırlık');
    inject(Meta).updateTag({
      name: 'description',
      content:
        'Yaş sınıfı, test raporu, uyarı metni ve parti izlenebilirliğini ürün bazında yönetin. Hangi çocuk ürününüzün pazara hazır olduğunu tek bakışta görün.',
    });
  }

  onScroll(): void {
    this.scrolled.set(window.scrollY > 24);
  }
}
