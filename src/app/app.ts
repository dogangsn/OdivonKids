import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VersionStore } from './core/version/version-store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <router-outlet />
    @if (version.updateRequired()) {
      <div
        class="fixed inset-0 z-[90] grid place-items-center bg-slate-950/70 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-title"
      >
        <section class="odv-card max-w-md p-7 text-center">
          <span class="material-symbols-rounded mb-3 text-5xl text-violet-600">system_update</span>
          <h2 id="update-title" class="text-xl font-black">Uygulama güncellemesi hazır</h2>
          <p class="text-sm text-slate-500">
            Güvenli biçimde en güncel sürüme geçin. Oturumunuz kapatılacak ve giriş sayfasına
            yönlendirileceksiniz.
          </p>
          <p class="mt-2 text-xs text-slate-400">
            {{ version.label }}
            @if (version.remote()?.version; as next) {
              → v{{ next }}
            }
          </p>
          <button
            type="button"
            class="odv-btn-primary mt-3 w-full"
            [disabled]="version.updating()"
            (click)="version.applyUpdate()"
          >
            {{ version.updating() ? 'Güncelleniyor…' : 'Şimdi güncelle' }}
          </button>
        </section>
      </div>
    }
  `,
})
export class App {
  readonly version = inject(VersionStore);
  constructor() {
    this.version.start();
  }
}
