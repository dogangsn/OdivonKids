import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../core/auth/auth-store';
import { AREAS, TONE_CLASSES } from '../../domain/domain-navigation';
import { CATEGORY_ICON, STATUS_LABEL, formatDate } from '../../domain/kids-catalog';
import { KidsStore } from '../../domain/kids-store';
import { KpiCard } from '../../shared/ui/kpi-card';
import { PageHeader } from '../../shared/ui/page-header';
import { CHIP_CLASS, StatusBadge } from '../../shared/ui/status-badge';
import { ProductDrawer } from '../products/product-drawer';

@Component({
  selector: 'app-overview-page',
  imports: [PageHeader, KpiCard, StatusBadge, ProductDrawer, RouterLink],
  template: `
    <app-page-header
      eyebrow="Genel bakış"
      icon="space_dashboard"
      [title]="'Merhaba, ' + firstName()"
      description="Ürünlerinizin pazara hazırlık durumu, eksik kanıtlar ve yaklaşan son tarihler."
    >
      <a actions routerLink="/products" [queryParams]="{ new: 1 }" class="odv-btn-primary">
        <span class="material-symbols-rounded" aria-hidden="true">add</span>Ürün ekle
      </a>
    </app-page-header>

    <section aria-label="Temel göstergeler" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <app-kpi-card
        label="Takip edilen ürün"
        [value]="kpi().total"
        [note]="kpi().openItems + ' açık kontrol maddesi'"
        icon="inventory_2"
        tone="violet"
      />
      <app-kpi-card
        label="Pazara hazır"
        [value]="kpi().ready"
        [suffix]="'/ ' + kpi().total"
        note="Dört alanın tamamı onaylı"
        icon="verified"
        tone="emerald"
        [progress]="kpi().total ? (kpi().ready / kpi().total) * 100 : 0"
      />
      <app-kpi-card
        label="Eksik veya bloke"
        [value]="kpi().incomplete + kpi().blocked"
        [note]="kpi().blocked + ' ürün bloke durumda'"
        icon="report"
        tone="rose"
      />
      <app-kpi-card
        label="30 günde dolacak"
        [value]="kpi().expiringSoon"
        note="Yenilenmesi gereken test raporu"
        icon="event_upcoming"
        tone="amber"
      />
    </section>

    <div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section class="odv-card overflow-hidden" aria-labelledby="matrix-title">
        <div
          class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5 dark:border-slate-800"
        >
          <div>
            <h2 id="matrix-title" class="m-0 text-lg font-black tracking-tight">
              Ürün hazırlık matrisi
            </h2>
            <p class="mb-0 mt-0.5 text-xs text-slate-500">
              Her ürün için dört zorunlu alanın durumu
            </p>
          </div>
          <ul
            class="m-0 flex flex-wrap gap-3 ps-0 text-[11px] font-semibold text-slate-500"
            aria-label="Renk açıklaması"
          >
            @for (s of legend; track s) {
              <li class="flex items-center gap-1.5">
                <span class="size-3 rounded" [class]="chip[s]"></span>{{ statusLabel[s] }}
              </li>
            }
          </ul>
        </div>
        <div class="custom-scroll relative overflow-x-auto">
          <table class="w-full min-w-[720px]">
            <thead>
              <tr>
                <th class="odv-th">Ürün</th>
                @for (area of areas; track area.key) {
                  <th class="odv-th !text-center">{{ area.shortLabel }}</th>
                }
                <th class="odv-th">Hazırlık</th>
                <th class="odv-th">Durum</th>
                <th class="odv-th"><span class="sr-only">İşlem</span></th>
              </tr>
            </thead>
            <tbody>
              @for (row of store.readiness(); track row.product.id) {
                <tr class="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td class="odv-td">
                    <div class="flex items-center gap-3">
                      <span
                        class="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
                        ><span class="material-symbols-rounded" aria-hidden="true">{{
                          categoryIcon[row.product.category]
                        }}</span></span
                      >
                      <div class="min-w-0">
                        <strong class="block truncate">{{ row.product.name }}</strong>
                        <span class="font-mono text-[11px] text-slate-500">{{
                          row.product.model
                        }}</span>
                      </div>
                    </div>
                  </td>
                  @for (area of areas; track area.key) {
                    <td class="odv-td text-center">
                      <span
                        class="inline-grid size-8 place-items-center rounded-lg"
                        [class]="chip[row.areas[area.key]]"
                        [attr.title]="area.label + ': ' + statusLabel[row.areas[area.key]]"
                      >
                        <span class="material-symbols-rounded !text-[18px]" aria-hidden="true">{{
                          area.icon
                        }}</span>
                        <span class="sr-only"
                          >{{ area.label }}: {{ statusLabel[row.areas[area.key]] }}</span
                        >
                      </span>
                    </td>
                  }
                  <td class="odv-td">
                    <div class="flex items-center gap-2">
                      <div
                        class="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                        aria-hidden="true"
                      >
                        <div
                          class="h-full rounded-full bg-violet-500"
                          [style.width.%]="row.percent"
                        ></div>
                      </div>
                      <span class="text-xs font-bold">%{{ row.percent }}</span>
                    </div>
                  </td>
                  <td class="odv-td"><app-status-badge [status]="row.state" /></td>
                  <td class="odv-td text-end">
                    <button
                      type="button"
                      class="odv-icon-btn"
                      [attr.aria-label]="row.product.name + ' detayını aç'"
                      (click)="openProduct.set(row.product.id)"
                    >
                      <span class="material-symbols-rounded directional-icon">chevron_right</span>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <div class="space-y-6">
        <section class="odv-card p-5" aria-labelledby="deadline-title">
          <div class="mb-4 flex items-center justify-between">
            <h2 id="deadline-title" class="m-0 text-base font-black">Yaklaşan son tarihler</h2>
            <a
              routerLink="/test-reports"
              class="text-xs font-bold text-violet-600 hover:underline dark:text-violet-300"
              >Tümü</a
            >
          </div>
          @if (store.deadlines().length) {
            <ul class="m-0 space-y-3 ps-0">
              @for (d of store.deadlines(); track d.record.id) {
                <li class="flex items-center gap-3">
                  <span
                    class="grid size-11 shrink-0 place-items-center rounded-xl text-center leading-none"
                    [class]="
                      d.days < 0
                        ? tones.rose.soft
                        : d.days <= 30
                          ? tones.amber.soft
                          : tones.sky.soft
                    "
                  >
                    <span class="text-sm font-black">{{ d.days < 0 ? '!' : d.days }}</span>
                  </span>
                  <div class="min-w-0 flex-1">
                    <strong class="block truncate text-sm">{{ d.product?.name }}</strong>
                    <span class="block truncate text-xs text-slate-500"
                      >{{ d.record.title }} · {{ d.record.reference }}</span
                    >
                  </div>
                  <span
                    class="whitespace-nowrap text-[11px] font-bold"
                    [class]="d.days < 0 ? tones.rose.text : 'text-slate-500'"
                  >
                    {{ d.days < 0 ? 'Süresi doldu' : d.days + ' gün' }}
                  </span>
                </li>
              }
            </ul>
          } @else {
            <p class="m-0 text-sm text-slate-500">60 gün içinde dolan belge yok.</p>
          }
        </section>

        <section class="odv-card p-5" aria-labelledby="areas-title">
          <h2 id="areas-title" class="mb-4 mt-0 text-base font-black">Alan bazında ilerleme</h2>
          <ul class="m-0 space-y-4 ps-0">
            @for (a of areaProgress(); track a.def.key) {
              <li>
                <a [routerLink]="'/' + a.def.path" class="group flex items-center gap-3">
                  <span
                    class="grid size-9 place-items-center rounded-xl"
                    [class]="tones[a.def.tone].soft"
                  >
                    <span class="material-symbols-rounded !text-[18px]" aria-hidden="true">{{
                      a.def.icon
                    }}</span>
                  </span>
                  <div class="flex-1">
                    <div class="flex items-center justify-between text-xs">
                      <strong class="group-hover:underline">{{ a.def.label }}</strong>
                      <span class="font-semibold text-slate-500"
                        >{{ a.approved }}/{{ total() }} ürün</span
                      >
                    </div>
                    <div
                      class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                      aria-hidden="true"
                    >
                      <div
                        class="h-full rounded-full"
                        [class]="tones[a.def.tone].bar"
                        [style.width.%]="a.percent"
                      ></div>
                    </div>
                  </div>
                </a>
              </li>
            }
          </ul>
        </section>
      </div>
    </div>

    <section class="odv-card mt-6 p-5" aria-labelledby="activity-title">
      <div class="mb-2 flex items-center justify-between">
        <h2 id="activity-title" class="m-0 text-base font-black">Son aktiviteler</h2>
        <a
          routerLink="/activity"
          class="text-xs font-bold text-violet-600 hover:underline dark:text-violet-300"
          >Tümü</a
        >
      </div>
      <ul class="m-0 grid grid-cols-1 gap-x-6 ps-0 md:grid-cols-2">
        @for (item of store.recentActivity().slice(0, 4); track item.id) {
          <li
            class="flex min-w-0 items-center gap-3 border-b border-slate-100 py-3 dark:border-slate-800"
          >
            <span
              class="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              ><span class="material-symbols-rounded !text-[18px]" aria-hidden="true">{{
                item.icon
              }}</span></span
            >
            <div class="min-w-0 flex-1">
              <strong class="block truncate text-sm">{{ item.title }}</strong>
              <span class="block truncate text-xs text-slate-500">{{ item.detail }}</span>
            </div>
            <time
              class="shrink-0 text-[11px] font-semibold text-slate-400"
              [attr.datetime]="item.at"
              >{{ formatDate(item.at) }}</time
            >
          </li>
        }
      </ul>
    </section>

    <app-product-drawer [productId]="openProduct()" (closed)="openProduct.set(null)" />
  `,
})
export class OverviewPage {
  readonly store = inject(KidsStore);
  private readonly auth = inject(AuthStore);
  readonly kpi = this.store.kpis;
  readonly areas = AREAS;
  readonly tones = TONE_CLASSES;
  readonly chip = CHIP_CLASS;
  readonly statusLabel = STATUS_LABEL;
  readonly categoryIcon = CATEGORY_ICON;
  readonly formatDate = formatDate;
  readonly legend = ['approved', 'review', 'missing', 'expired'] as const;
  readonly openProduct = signal<string | null>(null);
  readonly firstName = computed(() => (this.auth.session()?.name ?? 'ekip').split(' ')[0]);
  readonly total = computed(() => this.store.products().length);
  readonly areaProgress = computed(() => {
    const rows = this.store.readiness();
    return AREAS.map((def) => {
      const approved = rows.filter((r) => r.areas[def.key] === 'approved').length;
      return { def, approved, percent: rows.length ? (approved / rows.length) * 100 : 0 };
    });
  });
}
