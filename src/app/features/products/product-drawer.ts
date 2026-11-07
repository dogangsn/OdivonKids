import { Component, computed, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { AREAS, TONE_CLASSES } from '../../domain/domain-navigation';
import { CATEGORY_ICON, effectiveStatus, formatDate } from '../../domain/kids-catalog';
import { KidsStore } from '../../domain/kids-store';
import { SlideOver } from '../../shared/ui/slide-over';
import { StatusBadge } from '../../shared/ui/status-badge';

/** Ürün merkezli detay: pazara hazırlık kontrol listesi ve bağlı kayıtlar. */
@Component({
  selector: 'app-product-drawer',
  imports: [SlideOver, StatusBadge],
  template: `
    <app-slide-over
      [open]="!!item()"
      [wide]="true"
      [hideSubmit]="true"
      [icon]="item() ? categoryIcon[item()!.product.category] : 'toys'"
      eyebrow="Ürün detayı"
      [title]="item()?.product?.name ?? ''"
      [description]="item() ? item()!.product.model + ' · GTIN ' + item()!.product.gtin : ''"
      (closed)="closed.emit()"
    >
      @if (item(); as it) {
        <section
          class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500"
                >Pazara hazırlık</span
              >
              <div class="mt-1 flex items-center gap-3">
                <strong class="text-4xl font-black tracking-tight">%{{ it.percent }}</strong>
                <app-status-badge [status]="it.state" />
              </div>
            </div>
            <dl class="m-0 grid grid-cols-3 gap-x-6 gap-y-1 text-xs">
              <dt class="font-bold uppercase tracking-wider text-slate-400">Kategori</dt>
              <dt class="font-bold uppercase tracking-wider text-slate-400">Pazar</dt>
              <dt class="font-bold uppercase tracking-wider text-slate-400">Sorumlu</dt>
              <dd class="m-0 font-bold">{{ it.product.category }}</dd>
              <dd class="m-0 font-bold">{{ it.product.markets.join(' · ') }}</dd>
              <dd class="m-0 font-bold">{{ it.product.owner }}</dd>
            </dl>
          </div>
          <div
            class="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            aria-hidden="true"
          >
            <div
              class="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
              [style.width.%]="it.percent"
            ></div>
          </div>
        </section>

        <section class="space-y-3" aria-label="Uyum kontrol listesi">
          @for (area of areas; track area.key) {
            <article
              class="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <span
                    class="grid size-10 place-items-center rounded-xl"
                    [class]="tones[area.tone].soft"
                  >
                    <span class="material-symbols-rounded" aria-hidden="true">{{ area.icon }}</span>
                  </span>
                  <div>
                    <h3 class="m-0 text-sm font-black">{{ area.label }}</h3>
                    <p class="m-0 text-xs text-slate-500">{{ area.description }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <app-status-badge [status]="it.areas[area.key]" />
                  <button
                    type="button"
                    class="odv-btn-soft !min-h-9 !text-xs"
                    (click)="addRecord(area.path)"
                  >
                    <span class="material-symbols-rounded !text-base" aria-hidden="true">add</span
                    >Ekle
                  </button>
                </div>
              </div>
              @let list = records(area.key);
              @if (list.length) {
                <ul
                  class="mb-0 mt-3 space-y-2 border-t border-slate-100 ps-0 pt-3 dark:border-slate-800"
                >
                  @for (rec of list; track rec.id) {
                    <li class="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span class="min-w-0">
                        <strong class="text-slate-800 dark:text-slate-100">{{ rec.title }}</strong>
                        <span class="text-slate-500">
                          · {{ rec.reference }} · {{ rec.detail }}</span
                        >
                      </span>
                      <span class="flex items-center gap-2">
                        @if (rec.validUntil) {
                          <span class="text-slate-400"
                            >Geçerlilik {{ formatDate(rec.validUntil) }}</span
                          >
                        }
                        <app-status-badge [status]="statusOf(rec)" />
                      </span>
                    </li>
                  }
                </ul>
              }
            </article>
          }
        </section>
      }
    </app-slide-over>
  `,
})
export class ProductDrawer {
  private readonly store = inject(KidsStore);
  private readonly router = inject(Router);
  readonly productId = input<string | null>(null);
  readonly closed = output<void>();
  readonly item = computed(() => {
    const id = this.productId();
    return id ? this.store.readinessOf(id) : undefined;
  });
  readonly areas = AREAS;
  readonly tones = TONE_CLASSES;
  readonly categoryIcon = CATEGORY_ICON;
  readonly formatDate = formatDate;
  readonly statusOf = effectiveStatus;

  records(area: (typeof AREAS)[number]['key']) {
    const id = this.productId();
    return id ? this.store.recordsOf(id, area) : [];
  }

  addRecord(path: string): void {
    const id = this.productId();
    this.closed.emit();
    void this.router.navigate(['/', path], { queryParams: { product: id, new: 1 } });
  }
}
