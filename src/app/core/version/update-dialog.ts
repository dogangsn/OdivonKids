import { Component, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { VersionStore } from './version-store';

/**
 * "Yeni sürüm hazır" penceresi. Güncelleme zorunludur: kapatma düğmesi yoktur,
 * tek eylem oturumu temizleyip yeni sürümü giriş sayfasında açar.
 */
@Component({
  selector: 'app-update-dialog',
  template: `
    <div class="odv-update-backdrop fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-md dark:bg-black/65">
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="update-title"
        aria-describedby="update-body"
        class="odv-update-panel relative w-full max-w-[26rem] overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-violet-950/20 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/50"
      >
        <!-- Üst bant -->
        <div class="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 px-6 pb-14 pt-6 text-white">
          <div class="pointer-events-none absolute -end-16 -top-20 size-56 rounded-full bg-white/15 blur-2xl" aria-hidden="true"></div>
          <div class="pointer-events-none absolute -bottom-24 -start-10 size-56 rounded-full bg-fuchsia-400/30 blur-3xl" aria-hidden="true"></div>
          <div class="odv-update-grid pointer-events-none absolute inset-0 opacity-25" aria-hidden="true"></div>

          <div class="relative flex items-center justify-between">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 ring-inset ring-white/25 backdrop-blur">
              <span class="relative flex size-2">
                <span class="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300 opacity-75 motion-reduce:hidden"></span>
                <span class="relative inline-flex size-2 rounded-full bg-emerald-300"></span>
              </span>
              Yeni sürüm
            </span>
            <span class="text-[11px] font-semibold text-white/70">Odivon Kids</span>
          </div>
        </div>

        <!-- Simge -->
        <div class="relative -mt-10 flex justify-center">
          <div class="grid size-20 place-items-center rounded-[1.4rem] bg-white shadow-xl shadow-violet-900/20 ring-1 ring-slate-200/80 dark:bg-slate-800 dark:shadow-black/40 dark:ring-slate-700">
            <div class="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-500/30">
              <span class="material-symbols-rounded odv-update-icon !text-[30px]" aria-hidden="true">rocket_launch</span>
            </div>
          </div>
        </div>

        <!-- İçerik -->
        <div class="px-6 pb-6 pt-4 text-center sm:px-7">
          <h2 id="update-title" class="m-0 text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Güncelleme hazır
          </h2>
          <p id="update-body" class="mx-auto mt-1.5 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
            Odivon Kids'in yeni sürümü yayında. Devam etmek için uygulamayı güncelleyin.
          </p>

          <!-- Sürüm karşılaştırması -->
          <div class="mt-5 flex items-center justify-center gap-2.5" aria-label="Sürüm bilgisi">
            <div class="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-start dark:border-slate-700/80 dark:bg-slate-800/60">
              <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Şu anki</span>
              <span class="mt-0.5 block truncate font-mono text-sm font-bold text-slate-600 dark:text-slate-300">v{{ version.current.version }}</span>
            </div>
            <span class="grid size-8 shrink-0 place-items-center rounded-full bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300" aria-hidden="true">
              <span class="material-symbols-rounded directional-icon !text-[18px]">arrow_forward</span>
            </span>
            <div class="min-w-0 flex-1 rounded-2xl border border-violet-200 bg-violet-50 px-3 py-2.5 text-start dark:border-violet-500/30 dark:bg-violet-500/10">
              <span class="block text-[10px] font-bold uppercase tracking-wider text-violet-500 dark:text-violet-300">Yeni</span>
              <span class="mt-0.5 block truncate font-mono text-sm font-bold text-violet-700 dark:text-violet-200">v{{ version.remote()?.version ?? '—' }}</span>
            </div>
          </div>

          @if (version.remote()?.releaseNotes?.length) {
            <div class="mt-4 rounded-2xl border border-slate-200 p-4 text-start dark:border-slate-700/80">
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Bu sürümde</span>
              <ul class="custom-scroll m-0 mt-2.5 max-h-36 list-none space-y-2 overflow-y-auto p-0">
                @for (note of version.remote()!.releaseNotes!; track $index) {
                  <li class="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span class="material-symbols-rounded mt-0.5 !text-[16px] text-emerald-500" aria-hidden="true">check_circle</span>
                    <span>{{ note }}</span>
                  </li>
                }
              </ul>
            </div>
          }

          <!-- Bilgi notu -->
          <div class="mt-4 flex items-start gap-2.5 rounded-xl bg-amber-50 p-3 text-start text-xs font-medium leading-5 text-amber-800 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-900/60">
            <span class="material-symbols-rounded !text-[18px]" aria-hidden="true">lock_reset</span>
            <span>Güvenliğiniz için oturumunuz kapatılır; güncellemeden sonra yeniden giriş yapmanız gerekir.</span>
          </div>

          <button
            #action
            type="button"
            class="odv-btn-primary mt-5 w-full !min-h-12 !rounded-xl text-sm disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0"
            [disabled]="version.updating()"
            (click)="version.applyUpdate()"
          >
            @if (version.updating()) {
              <span class="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true"></span>
              Güncelleniyor…
            } @else {
              <span class="material-symbols-rounded !text-[20px]" aria-hidden="true">download</span>
              Şimdi güncelle
            }
          </button>

          <p class="m-0 mt-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            {{ version.label }}
          </p>
        </div>
      </section>
    </div>
  `,
  styles: `
    .odv-update-grid {
      background-image:
        linear-gradient(rgb(255 255 255 / .18) 1px, transparent 1px),
        linear-gradient(90deg, rgb(255 255 255 / .18) 1px, transparent 1px);
      background-size: 22px 22px;
      mask-image: radial-gradient(ellipse at 70% 0%, black 20%, transparent 75%);
    }
    .odv-update-backdrop { animation: odv-update-fade .2s ease-out both; }
    .odv-update-panel { animation: odv-update-pop .32s cubic-bezier(.2, .9, .3, 1.15) both; }
    .odv-update-icon { animation: odv-update-float 3s ease-in-out infinite; }
    @keyframes odv-update-fade { from { opacity: 0; } }
    @keyframes odv-update-pop { from { opacity: 0; transform: translateY(12px) scale(.96); } }
    @keyframes odv-update-float { 50% { transform: translateY(-3px); } }
    @media (prefers-reduced-motion: reduce) {
      .odv-update-backdrop, .odv-update-panel, .odv-update-icon { animation: none; }
    }
  `,
})
export class UpdateDialog {
  readonly version = inject(VersionStore);
  private readonly action = viewChild.required<ElementRef<HTMLButtonElement>>('action');

  constructor() {
    afterNextRender(() => this.action().nativeElement.focus());
  }
}
