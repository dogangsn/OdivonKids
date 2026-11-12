import { Component, inject, signal } from '@angular/core';
import { email, FormField, form, minLength, required, submit } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../core/auth/auth-store';
import { FirebaseIdentity } from '../../core/auth/firebase-identity';
import { ThemeStore } from '../../core/theme/theme-store';
import { VersionStore } from '../../core/version/version-store';
import { BrandMark } from '../marketing/brand-mark';
import { ProductPreview } from '../marketing/product-preview';

@Component({
  selector: 'app-auth-page',
  imports: [FormField, RouterLink, BrandMark, ProductPreview],
  template: `
    <main class="relative min-h-screen overflow-hidden bg-[#0c0a1f] text-white">
      <!-- Arka plan -->
      <div aria-hidden="true" class="odv-grid pointer-events-none absolute inset-0"></div>
      <div
        aria-hidden="true"
        class="odv-blob pointer-events-none absolute -start-40 -top-40 size-[40rem] rounded-full bg-indigo-600/40 blur-[130px]"
      ></div>
      <div
        aria-hidden="true"
        class="odv-blob odv-blob-2 pointer-events-none absolute -bottom-40 -end-20 size-[34rem] rounded-full bg-fuchsia-600/30 blur-[130px]"
      ></div>
      <div
        aria-hidden="true"
        class="pointer-events-none absolute start-1/3 top-1/3 size-80 rounded-full bg-sky-500/15 blur-[110px]"
      ></div>

      <div class="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 sm:px-8">
        <!-- Üst çubuk -->
        <header class="flex items-center justify-between gap-3">
          <a routerLink="/" class="rounded-xl" aria-label="OdivonKids ana sayfa">
            <odv-brand-mark tone="light" />
          </a>
          <div class="flex items-center gap-1">
            <a
              routerLink="/"
              class="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-indigo-100/80 hover:bg-white/10 hover:text-white sm:inline-flex"
              ><span
                class="material-symbols-rounded directional-icon !text-[18px]"
                aria-hidden="true"
                >arrow_back</span
              >Ana sayfa</a
            >
            <button
              type="button"
              class="grid size-10 place-items-center rounded-xl text-indigo-100 hover:bg-white/10"
              (click)="theme.toggle()"
              [attr.aria-label]="theme.dark() ? 'Açık temaya geç' : 'Koyu temaya geç'"
            >
              <span class="material-symbols-rounded" aria-hidden="true">{{
                theme.dark() ? 'light_mode' : 'dark_mode'
              }}</span>
            </button>
          </div>
        </header>

        <div class="grid flex-1 items-center gap-16 py-10 lg:grid-cols-[1.1fr_.9fr]">
          <!-- Tanıtım -->
          <section class="hidden lg:block" aria-labelledby="auth-hero">
            <span
              class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-indigo-100 backdrop-blur"
              ><span class="size-1.5 rounded-full bg-emerald-400"></span>Pazara hazırlık
              merkezi</span
            >
            <h1
              id="auth-hero"
              class="mb-0 mt-6 text-[2.6rem] font-extrabold leading-[1.08] tracking-tight xl:text-[3.25rem]"
            >
              Hangi ürün pazara hazır,
              <span class="odv-gradient-text block">tek bakışta görün.</span>
            </h1>
            <p class="mt-6 max-w-lg text-base leading-7 text-indigo-100/75">
              Yaş sınıfı, test raporu, uyarı metni ve parti kanıtlarını ürün bazında yönetin. Süresi
              dolan rapor ürünü kendiliğinden bloke eder.
            </p>
            <div class="mt-10 max-w-lg pe-6">
              <odv-product-preview />
            </div>
          </section>

          <!-- Form -->
          <section class="mx-auto w-full max-w-[28rem]" aria-labelledby="auth-title">
            <div
              class="rounded-[1.75rem] border border-white/10 bg-white p-6 text-slate-900 shadow-2xl shadow-indigo-950/60 sm:p-8 dark:bg-slate-900/80 dark:text-white dark:backdrop-blur-xl"
            >
              <!-- Giriş / üye ol seçimi -->
              <nav
                class="mb-7 grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800/80"
                aria-label="Giriş veya üyelik"
              >
                <a
                  routerLink="/login"
                  class="odv-tab"
                  [class.odv-tab-active]="!isRegister"
                  [attr.aria-current]="!isRegister ? 'page' : null"
                  >Giriş yap</a
                >
                <a
                  routerLink="/register"
                  class="odv-tab"
                  [class.odv-tab-active]="isRegister"
                  [attr.aria-current]="isRegister ? 'page' : null"
                  >Üye ol</a
                >
              </nav>

              @if (version.justUpdated(); as updatedTo) {
                <div
                  class="mb-4 flex items-start gap-2.5 rounded-xl bg-violet-50 p-3 text-xs font-medium text-violet-800 ring-1 ring-inset ring-violet-200 dark:bg-violet-500/10 dark:text-violet-200 dark:ring-violet-500/30"
                  role="status"
                >
                  <span class="material-symbols-rounded !text-[18px]" aria-hidden="true"
                    >system_update</span
                  >
                  <span
                    >Uygulama v{{ updatedTo }} sürümüne güncellendi. Lütfen tekrar giriş
                    yapın.</span
                  >
                </div>
              }

              <div class="mb-6">
                <h2
                  id="auth-title"
                  class="m-0 text-[1.7rem] font-extrabold leading-tight tracking-tight"
                >
                  {{ isRegister ? 'Ücretsiz hesabınızı açın' : 'Tekrar hoş geldiniz' }}
                </h2>
                <p class="m-0 mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {{
                    isRegister
                      ? 'Ürün kataloğunuzu ekleyin, eksik kanıtları hemen görün.'
                      : 'Ürünlerinizin uyum durumuna kaldığınız yerden devam edin.'
                  }}
                </p>
              </div>

              @if (demoMode) {
                <div
                  class="mb-5 flex items-start gap-2.5 rounded-xl bg-sky-50 p-3 text-xs font-medium text-sky-800 ring-1 ring-inset ring-sky-200 dark:bg-sky-950/50 dark:text-sky-200 dark:ring-sky-900"
                >
                  <span class="material-symbols-rounded !text-[18px]" aria-hidden="true">info</span>
                  <span>Kimlik doğrulama henüz bağlı değil; giriş demo oturumu olarak açılır.</span>
                </div>
              }

              <form class="space-y-4" (submit)="onSubmit($event)" novalidate>
                @if (isRegister) {
                  <div class="grid gap-4 sm:grid-cols-2">
                    <label class="block"
                      ><span class="odv-label">Ad soyad</span>
                      <span class="relative block">
                        <span class="odv-field-icon material-symbols-rounded" aria-hidden="true"
                          >person</span
                        ><input
                          class="odv-field"
                          [formField]="authForm.name"
                          autocomplete="name"
                          placeholder="Adınız"
                        />
                      </span>
                      @if (authForm.name().touched() && authForm.name().invalid()) {
                        <span class="odv-error">Ad soyad zorunludur.</span>
                      }
                    </label>
                    <label class="block"
                      ><span class="odv-label">Şirket</span>
                      <span class="relative block">
                        <span class="odv-field-icon material-symbols-rounded" aria-hidden="true"
                          >apartment</span
                        ><input
                          class="odv-field"
                          [formField]="authForm.company"
                          autocomplete="organization"
                          placeholder="İsteğe bağlı"
                        />
                      </span>
                    </label>
                  </div>
                }
                <label class="block"
                  ><span class="odv-label">E-posta adresi</span>
                  <span class="relative block">
                    <span class="odv-field-icon material-symbols-rounded" aria-hidden="true"
                      >mail</span
                    ><input
                      class="odv-field"
                      type="email"
                      [formField]="authForm.email"
                      autocomplete="email"
                      placeholder="ornek@sirket.com"
                    />
                  </span>
                  @if (authForm.email().touched() && authForm.email().invalid()) {
                    <span class="odv-error">Geçerli bir e-posta girin.</span>
                  }
                </label>
                <label class="block"
                  ><span class="odv-label">Şifre</span>
                  <span class="relative block">
                    <span class="odv-field-icon material-symbols-rounded" aria-hidden="true"
                      >lock</span
                    ><input
                      class="odv-field pe-12"
                      [type]="showPassword() ? 'text' : 'password'"
                      [formField]="authForm.password"
                      [autocomplete]="isRegister ? 'new-password' : 'current-password'"
                      placeholder="En az 8 karakter"
                    /><button
                      class="absolute end-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
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
                    <span class="odv-error">Şifre en az 8 karakter olmalıdır.</span>
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
                <button class="odv-submit" type="submit" [disabled]="busy()">
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

              <div
                class="my-6 flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400"
              >
                <span class="h-px flex-1 bg-slate-200 dark:bg-slate-700"></span>veya<span
                  class="h-px flex-1 bg-slate-200 dark:bg-slate-700"
                ></span>
              </div>
              <button
                type="button"
                class="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition-colors hover:border-violet-300 hover:bg-violet-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-violet-500/50 dark:hover:bg-violet-500/10"
                (click)="demo()"
              >
                <span
                  class="material-symbols-rounded text-violet-600 dark:text-violet-300"
                  aria-hidden="true"
                  >play_circle</span
                >Hesap açmadan demoyu incele
              </button>
              <p class="m-0 mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                {{ isRegister ? 'Zaten hesabınız var mı?' : 'Henüz hesabınız yok mu?' }}
                <a
                  class="font-bold text-violet-600 hover:underline dark:text-violet-300"
                  [routerLink]="isRegister ? '/login' : '/register'"
                  >{{ isRegister ? 'Giriş yapın' : 'Ücretsiz üye olun' }}</a
                >
              </p>
            </div>
            <ul
              class="m-0 mt-6 flex list-none flex-wrap justify-center gap-x-5 gap-y-2 p-0 text-xs text-indigo-100/70"
            >
              <li class="inline-flex items-center gap-1.5">
                <span
                  class="material-symbols-rounded !text-[16px] text-emerald-400"
                  aria-hidden="true"
                  >shield_lock</span
                >KVKK odaklı altyapı
              </li>
              <li class="inline-flex items-center gap-1.5">
                <span
                  class="material-symbols-rounded !text-[16px] text-emerald-400"
                  aria-hidden="true"
                  >credit_card_off</span
                >Kredi kartı gerekmez
              </li>
            </ul>
          </section>
        </div>

        <footer class="text-center text-[11px] leading-5 text-indigo-200/60">
          <p class="m-0">
            Devam ederek kullanım koşullarını ve gizlilik bildirimini kabul etmiş olursunuz.
          </p>
          <p class="m-0 mt-1">{{ version.label }}</p>
        </footer>
      </div>
    </main>
  `,
  styles: `
    .odv-grid {
      background-image:
        linear-gradient(rgb(255 255 255 / 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgb(255 255 255 / 0.05) 1px, transparent 1px);
      background-size: 56px 56px;
      mask-image: radial-gradient(ellipse at 40% 40%, black 15%, transparent 70%);
    }
    .odv-gradient-text {
      background: linear-gradient(90deg, #a5b4fc, #f0abfc 45%, #fcd34d);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .odv-tab {
      display: flex;
      min-height: 2.6rem;
      align-items: center;
      justify-content: center;
      border-radius: 0.8rem;
      font-size: 0.875rem;
      font-weight: 700;
      color: #475569;
      transition:
        background-color 0.2s,
        color 0.2s;
    }
    .odv-tab:hover {
      color: #0f172a;
    }
    .odv-tab-active {
      background: white;
      color: #5b21b6;
      box-shadow: 0 1px 3px rgb(15 23 42 / 0.12);
    }
    :host-context(.dark) .odv-tab:hover {
      color: white;
    }
    :host-context(.dark) .odv-tab-active {
      background: #334155;
      color: #ddd6fe;
    }
    .odv-label {
      display: block;
      margin-bottom: 0.4rem;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .odv-field {
      width: 100%;
      min-height: 3rem;
      border-radius: 0.85rem;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      padding-block: 0.7rem;
      padding-inline: 2.75rem 0.9rem;
      font-size: 0.875rem;
      color: #0f172a;
      outline: none;
      transition:
        border-color 0.2s,
        box-shadow 0.2s,
        background-color 0.2s;
    }
    .odv-field.pe-12 {
      padding-inline-end: 3rem;
    }
    .odv-field::placeholder {
      color: #94a3b8;
    }
    .odv-field:hover {
      border-color: #cbd5e1;
    }
    .odv-field:focus {
      border-color: #8b5cf6;
      background: white;
      box-shadow: 0 0 0 4px rgb(139 92 246 / 0.15);
    }
    :host-context(.dark) .odv-field {
      border-color: #334155;
      background: rgb(15 23 42 / 0.6);
      color: white;
    }
    :host-context(.dark) .odv-field:focus {
      border-color: #a78bfa;
      background: #0f172a;
    }
    .odv-field-icon {
      position: absolute;
      inset-inline-start: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
      pointer-events: none;
    }
    .odv-error {
      display: block;
      margin-top: 0.35rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: #e11d48;
    }
    .odv-submit {
      display: flex;
      width: 100%;
      min-height: 3.1rem;
      margin-top: 1.5rem !important;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border-radius: 0.95rem;
      background: linear-gradient(135deg, #6366f1, #8b5cf6 55%, #d946ef);
      font-size: 0.95rem;
      font-weight: 800;
      color: white;
      box-shadow: 0 12px 30px rgb(139 92 246 / 0.35);
      transition:
        transform 0.2s,
        box-shadow 0.2s,
        opacity 0.2s;
    }
    .odv-submit:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 16px 36px rgb(139 92 246 / 0.45);
    }
    .odv-submit:disabled {
      opacity: 0.7;
      cursor: progress;
    }
    a:focus-visible,
    button:focus-visible {
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
      .odv-blob {
        animation: none;
      }
    }
  `,
})
export class AuthPage {
  readonly version = inject(VersionStore);
  readonly theme = inject(ThemeStore);
  readonly demoMode = !inject(FirebaseIdentity).configured;
  readonly isRegister = inject(ActivatedRoute).snapshot.data['mode'] === 'register';
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
