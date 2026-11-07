import { Component, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PRODUCT } from '../../domain/product-manifest';
import { PageHeader } from '../../shared/ui/page-header';

interface NotificationPref {
  readonly key: string;
  readonly label: string;
  readonly note: string;
}

const STORAGE_KEY = 'odivon:kids:notifications';

function readPrefs(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, boolean>;
  } catch {
    return {};
  }
}

@Component({
  selector: 'app-settings-page',
  imports: [PageHeader],
  template: `
    <app-page-header
      eyebrow="Yapılandırma"
      icon="tune"
      title="Ayarlar"
      description="Bildirim tercihleri ve bağlantı bilgileri."
    />
    <div class="grid gap-6 xl:grid-cols-2">
      <section class="odv-card p-6" aria-labelledby="notif-title">
        <h2 id="notif-title" class="m-0 text-base font-black">Bildirimler</h2>
        <p class="mb-2 mt-1 text-xs text-slate-500">Tercihler bu tarayıcıda saklanır.</p>
        @for (option of options; track option.key) {
          <label
            class="flex cursor-pointer items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-0 dark:border-slate-800"
          >
            <span>
              <strong class="block text-sm">{{ option.label }}</strong>
              <small class="text-slate-500">{{ option.note }}</small>
            </span>
            <input
              type="checkbox"
              role="switch"
              class="size-5 accent-violet-600"
              [checked]="prefs()[option.key] ?? true"
              (change)="toggle(option.key, $any($event.target).checked)"
            />
          </label>
        }
      </section>
      <section class="odv-card p-6" aria-labelledby="conn-title">
        <h2 id="conn-title" class="m-0 text-base font-black">Bağlantı</h2>
        <dl class="mb-0 mt-4 space-y-4 text-sm">
          <div>
            <dt class="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              MainAPI alanı
            </dt>
            <dd class="m-0 mt-1 break-all font-mono text-xs">{{ apiBaseUrl }}{{ namespace }}</dd>
          </div>
          <div>
            <dt class="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Veri kaynağı
            </dt>
            <dd class="m-0 mt-1">
              <span
                class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-900"
                >Örnek veri</span
              >
              <span class="ms-2 text-xs text-slate-500"
                >Kayıtlar şimdilik bu oturumda tutuluyor.</span
              >
            </dd>
          </div>
        </dl>
      </section>
    </div>
  `,
})
export class SettingsPage {
  readonly apiBaseUrl = environment.apiBaseUrl.replace(/\/api\/v1$/, '');
  readonly namespace = PRODUCT.apiNamespace;
  readonly options: readonly NotificationPref[] = [
    {
      key: 'expiry',
      label: 'Belge süresi dolmak üzere',
      note: 'Test raporu bitmeden 30 gün önce haber ver',
    },
    {
      key: 'blocked',
      label: 'Ürün bloke oldu',
      note: 'Uygunsuz veya süresi dolmuş belge eklendiğinde',
    },
    { key: 'weekly', label: 'Haftalık özet', note: 'Her pazartesi pazara hazırlık özeti' },
  ];
  readonly prefs = signal<Record<string, boolean>>(readPrefs());

  toggle(key: string, value: boolean): void {
    this.prefs.update((p) => ({ ...p, [key]: value }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.prefs()));
  }
}
