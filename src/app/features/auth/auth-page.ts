import { Component, inject, signal } from '@angular/core';
import { email, FormField, form, minLength, required, submit } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../core/auth/auth-store';
import { FirebaseIdentity } from '../../core/auth/firebase-identity';
import { TranslatePipe } from '../../core/i18n/i18n';
import { VersionStore } from '../../core/version/version-store';
import { PRODUCT } from '../../domain/product-manifest';

const THEME_KEY = 'odivon:theme';

@Component({
  selector: 'app-auth-page',
  imports: [FormField, RouterLink, TranslatePipe],
  template: `
    <main
      class="min-h-screen bg-slate-50 text-slate-900 lg:grid lg:grid-cols-[1.05fr_.95fr] dark:bg-[#0b1120] dark:text-white"
    >
      <!-- Marka paneli -->
      <section
        class="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-700 to-[#1e1048] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16"
      >
        <div
          aria-hidden="true"
          class="odv-auth-grid pointer-events-none absolute inset-0 opacity-40"
        ></div>
        <div
          aria-hidden="true"
          class="pointer-events-none absolute -start-24 top-24 size-96 rounded-full bg-sky-400/25 blur-3xl"
        ></div>
        <div
          aria-hidden="true"
          class="pointer-events-none absolute -end-16 bottom-0 size-80 rounded-full bg-fuchsia-400/20 blur-3xl"
        ></div>
        <div
          aria-hidden="true"
          class="pointer-events-none absolute end-24 top-1/3 size-40 rounded-full bg-amber-300/15 blur-3xl"
        ></div>

        <div class="relative flex items-center gap-3">
          <span
            class="relative grid size-12 place-items-center rounded-2xl bg-white/15 shadow-lg shadow-indigo-950/20 ring-1 ring-white/25 backdrop-blur"
            ><span class="material-symbols-rounded !text-[24px]" aria-hidden="true">toys</span
            ><span
              class="absolute -end-1 -top-1 size-3.5 rounded-full bg-amber-400 ring-2 ring-violet-600"
            ></span
          ></span>
          <div>
            <strong class="block text-xl font-extrabold tracking-tight"
              >Odivon<span class="text-amber-300">Kids</span></strong
            ><span class="block text-xs font-medium text-violet-200">{{
              product.categoryKey | t
            }}</span>
          </div>
        </div>

        <div class="relative max-w-2xl">
          <span
            class="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-violet-100 ring-1 ring-inset ring-white/15 backdrop-blur"
            ><span class="size-1.5 rounded-full bg-emerald-400"></span>Pazara hazırlık merkezi</span
          >
          <h1
            class="m-0 text-[2.75rem] font-extrabold leading-[1.08] tracking-tight xl:text-[3.25rem]"
          >
            Hangi ürün pazara hazır,<br />
            <span class="bg-gradient-to-r from-white to-violet-200 bg-clip-text text-transparent"
              >tek bakışta görün.</span
            >
          </h1>
          <p class="mt-6 max-w-lg text-base leading-7 text-indigo-100/90">
            {{ product.promiseKey | t }}
          </p>
          <ul class="mt-10 grid list-none gap-3 p-0">
            @for (f of features; track f.title) {
              <li
                class="flex items-center gap-4 rounded-2xl bg-white/[.08] p-4 ring-1 ring-inset ring-white/10 backdrop-blur-md transition-colors hover:bg-white/[.12]"
              >
                <span class="grid size-11 shrink-0 place-items-center rounded-xl" [class]="f.cls"
                  ><span class="material-symbols-rounded" aria-hidden="true">{{
                    f.icon
                  }}</span></span
                >
                <span class="min-w-0 flex-1"
                  ><strong class="block text-sm font-bold">{{ f.title }}</strong
                  ><span class="text-xs text-indigo-200">{{ f.note }}</span></span
                >
                <span class="material-symbols-rounded text-emerald-300" aria-hidden="true"
                  >check_circle</span
                >
              </li>
            }
          </ul>
        </div>

        <div class="relative flex items-center justify-between gap-4 text-xs text-indigo-200/80">
          <span class="inline-flex items-center gap-1.5"
            ><span class="material-symbols-rounded !text-[16px]" aria-hidden="true"
              >shield_lock</span
            >KVKK odaklı bulut altyapısı</span
          >
          <span>© Odivon</span>
        </div>
      </section>

      <!-- Form paneli -->
      <section class="relative flex min-h-screen flex-col px-5 py-6 sm:px-8">
        <div
          aria-hidden="true"
          class="pointer-events-none absolute end-0 top-0 size-96 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-500/10"
        ></div>
        <div class="relative flex items-center justify-between">
          <div class="flex items-center gap-3 lg:invisible">
            <span
              class="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-violet-500/25"
              ><span class="material-symbols-rounded" aria-hidden="true">toys</span></span
            ><strong class="text-base font-extrabold tracking-tight"
              >Odivon<span class="text-violet-600 dark:text-violet-300">Kids</span></strong
            >
          </div>
          <button
            type="button"
            class="odv-icon-btn"
            (click)="toggleTheme()"
            [attr.aria-label]="dark() ? 'Açık temaya geç' : 'Koyu temaya geç'"
          >
            <span class="material-symbols-rounded" aria-hidden="true">{{
              dark() ? 'light_mode' : 'dark_mode'
            }}</span>
          </button>
        </div>

        <div class="relative flex flex-1 items-center justify-center py-8">
          <div class="w-full max-w-[26rem]">
            @if (version.justUpdated(); as updatedTo) {
              <div
                class="mb-4 flex items-start gap-2.5 rounded-xl bg-violet-50 p-3 text-xs font-medium text-violet-800 ring-1 ring-inset ring-violet-200 dark:bg-violet-500/10 dark:text-violet-200 dark:ring-violet-500/30"
                role="status"
              >
                <span class="material-symbols-rounded !text-[18px]" aria-hidden="true"
                  >system_update</span
                >
                <span
                  >Uygulama v{{ updatedTo }} sürümüne güncellendi. Lütfen tekrar giriş yapın.</span
                >
              </div>
            }
            @if (demoMode) {
              <div
                class="mb-6 flex items-start gap-2.5 rounded-xl bg-sky-50 p-3 text-xs font-medium text-sky-800 ring-1 ring-inset ring-sky-200 dark:bg-sky-950/50 dark:text-sky-200 dark:ring-sky-900"
              >
                <span class="material-symbols-rounded !text-[18px]" aria-hidden="true">info</span>
                <span>Kimlik doğrulama henüz bağlı değil; giriş demo oturumu olarak açılır.</span>
              </div>
            }

            <div
              class="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-900/[.04] backdrop-blur sm:p-8 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/20"
            >
              <div class="mb-7">
                <span
                  class="text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-300"
                  >{{ isRegister ? 'Yeni çalışma alanı' : 'Tekrar hoş geldiniz' }}</span
                >
                <h2 class="mb-2 mt-2 text-[1.75rem] font-extrabold leading-tight tracking-tight">
                  {{ isRegister ? 'Hesabınızı oluşturun' : 'Hesabınıza giriş yapın' }}
                </h2>
                <p class="m-0 text-sm text-slate-500 dark:text-slate-400">
                  {{
                    isRegister
                      ? 'Ürün kataloğunuzu ekleyin, eksik kanıtları hemen görün.'
                      : 'Ürünlerinizin uyum durumuna kaldığınız yerden devam edin.'
                  }}
                </p>
              </div>

              <form class="space-y-4" (submit)="onSubmit($event)" novalidate>
                @if (isRegister) {
                  <label class="block"
                    ><span class="odv-auth-label">Ad soyad</span>
                    <span class="relative block">
                      <span class="odv-auth-icon material-symbols-rounded" aria-hidden="true"
                        >person</span
                      ><input
                        class="odv-input ps-11"
                        [formField]="authForm.name"
                        autocomplete="name"
                        placeholder="Adınız ve soyadınız"
                      />
                    </span>
                    @if (authForm.name().touched() && authForm.name().invalid()) {
                      <span class="odv-auth-error">Ad soyad zorunludur.</span>
                    }
                  </label>
                  <label class="block"
                    ><span class="odv-auth-label">Şirket adı</span>
                    <span class="relative block">
                      <span class="odv-auth-icon material-symbols-rounded" aria-hidden="true"
                        >apartment</span
                      ><input
                        class="odv-input ps-11"
                        [formField]="authForm.company"
                        autocomplete="organization"
                        placeholder="Şirketiniz"
                      />
                    </span>
                  </label>
                }
                <label class="block"
                  ><span class="odv-auth-label">E-posta adresi</span>
                  <span class="relative block">
                    <span class="odv-auth-icon material-symbols-rounded" aria-hidden="true"
                      >mail</span
                    ><input
                      class="odv-input ps-11"
                      type="email"
                      [formField]="authForm.email"
                      autocomplete="email"
                      placeholder="ornek@sirket.com"
                    />
                  </span>
                  @if (authForm.email().touched() && authForm.email().invalid()) {
                    <span class="odv-auth-error">Geçerli bir e-posta girin.</span>
                  }
                </label>
                <label class="block"
                  ><span class="odv-auth-label">Şifre</span>
                  <span class="relative block">
                    <span class="odv-auth-icon material-symbols-rounded" aria-hidden="true"
                      >lock</span
                    ><input
                      class="odv-input ps-11 pe-12"
                      [type]="showPassword() ? 'text' : 'password'"
                      [formField]="authForm.password"
                      [autocomplete]="isRegister ? 'new-password' : 'current-password'"
                      placeholder="En az 8 karakter"
                    /><button
                      class="odv-icon-btn absolute end-1 top-1/2 !size-9 -translate-y-1/2 text-slate-400"
                      type="button"
                      (click)="showPassword.update((v) => !v)"
                      [attr.aria-label]="showPassword() ? 'Şifreyi gizle' : 'Şifreyi göster'"
                      [attr.aria-pressed]="showPassword()"
                    >
                      <span class="material-symbols-rounded" aria-hidden="true">{{
                        showPassword() ? 'visibility_off' : 'visibility'
                      }}</span>
                    </button>
                  </span>
                  @if (authForm.password().touched() && authForm.password().invalid()) {
                    <span class="odv-auth-error">Şifre en az 8 karakter olmalıdır.</span>
                  }
                </label>
                @if (error()) {
                  <div
                    role="alert"
                    class="flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-900"
                  >
                    <span class="material-symbols-rounded !text-[18px]" aria-hidden="true"
                      >error</span
                    >{{ error() }}
                  </div>
                }
                <button class="odv-btn-primary !mt-6 w-full" type="submit" [disabled]="busy()">
                  @if (busy()) {
                    <span
                      class="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                      aria-hidden="true"
                    ></span
                    >İşleniyor…
                  } @else {
                    {{ isRegister ? 'Ücretsiz hesap oluştur' : 'Giriş yap' }}
                    <span class="material-symbols-rounded directional-icon" aria-hidden="true"
                      >arrow_forward</span
                    >
                  }
                </button>
              </form>

              <div class="my-6 flex items-center gap-3 text-xs font-medium text-slate-400">
                <span class="h-px flex-1 bg-slate-200 dark:bg-slate-700"></span>veya<span
                  class="h-px flex-1 bg-slate-200 dark:bg-slate-700"
                ></span>
              </div>
              <button
                type="button"
                class="odv-btn-ghost w-full border border-slate-200 bg-white text-sm dark:border-slate-700 dark:bg-slate-900"
                (click)="demo()"
              >
                <span
                  class="material-symbols-rounded text-violet-600 dark:text-violet-300"
                  aria-hidden="true"
                  >play_circle</span
                >Demo hesabıyla incele
              </button>
            </div>

            <p class="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              {{ isRegister ? 'Zaten hesabınız var mı?' : 'Henüz hesabınız yok mu?' }}
              <a
                class="font-bold text-violet-600 hover:underline dark:text-violet-300"
                [routerLink]="isRegister ? '/login' : '/register'"
                >{{ isRegister ? 'Giriş yapın' : 'Hesap oluşturun' }}</a
              >
            </p>
          </div>
        </div>

        <div class="relative text-center text-[11px] leading-5 text-slate-400">
          <p class="m-0">
            Devam ederek kullanım koşullarını ve gizlilik bildirimini kabul etmiş olursunuz.
          </p>
          <p class="m-0 mt-1">{{ version.label }}</p>
        </div>
      </section>
    </main>
  `,
  styles: `
    .odv-auth-grid {
      background-image:
        linear-gradient(rgb(255 255 255 / 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgb(255 255 255 / 0.06) 1px, transparent 1px);
      background-size: 44px 44px;
      mask-image: radial-gradient(ellipse at 30% 40%, black 20%, transparent 75%);
    }
    .odv-auth-label {
      display: block;
      margin-bottom: 0.4rem;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .odv-auth-icon {
      position: absolute;
      inset-inline-start: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
      pointer-events: none;
    }
    .odv-auth-error {
      display: block;
      margin-top: 0.35rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: #e11d48;
    }
  `,
})
export class AuthPage {
  readonly product = PRODUCT;
  readonly version = inject(VersionStore);
  readonly demoMode = !inject(FirebaseIdentity).configured;
  readonly features = [
    {
      icon: 'child_care',
      title: 'Yaş sınıfı ve uyarılar',
      note: 'Gerekçesi ve dilleriyle',
      cls: 'bg-sky-400/20 text-sky-100',
    },
    {
      icon: 'science',
      title: 'Test raporları',
      note: 'Geçerlilik süresi takibiyle',
      cls: 'bg-rose-400/20 text-rose-100',
    },
    {
      icon: 'qr_code_2',
      title: 'Parti izlenebilirliği',
      note: 'Üretimden rafa',
      cls: 'bg-teal-400/20 text-teal-100',
    },
  ];
  readonly isRegister = inject(ActivatedRoute).snapshot.data['mode'] === 'register';
  readonly dark = signal(readTheme() === 'dark');
  readonly showPassword = signal(false);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly model = signal({ name: '', company: '', email: '', password: '' });
  readonly authForm = form(this.model, (p) => {
    if (this.isRegister) required(p.name);
    required(p.email);
    email(p.email);
    required(p.password);
    minLength(p.password, 8);
  });
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  constructor() {
    document.documentElement.classList.toggle('dark', this.dark());
  }

  toggleTheme(): void {
    this.dark.update((v) => !v);
    document.documentElement.classList.toggle('dark', this.dark());
    try {
      localStorage.setItem(THEME_KEY, this.dark() ? 'dark' : 'light');
    } catch {
      /* depolama kapalıysa tema yalnız bu oturumda geçerli */
    }
  }
  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.authForm, async () => {
      this.busy.set(true);
      this.error.set('');
      try {
        const value = this.model();
        if (this.isRegister) await this.auth.register(value.name, value.email, value.password);
        else await this.auth.signIn(value.email, value.password);
        await this.router.navigateByUrl('/overview');
      } catch {
        this.error.set('İşlem tamamlanamadı. Bilgilerinizi kontrol edip tekrar deneyin.');
      } finally {
        this.busy.set(false);
      }
    });
  }
  demo(): void {
    this.auth.continueDemo();
    void this.router.navigateByUrl('/overview');
  }
}

function readTheme(): string | null {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}
