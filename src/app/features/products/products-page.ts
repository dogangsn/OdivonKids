import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormField, form, minLength, required, submit } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { AREAS } from '../../domain/domain-navigation';
import {
  CATEGORY_ICON,
  MARKETS,
  Market,
  PRODUCT_CATEGORIES,
  ProductCategory,
  ReadinessState,
  STATUS_LABEL,
} from '../../domain/kids-catalog';
import { KidsStore } from '../../domain/kids-store';
import { KpiCard } from '../../shared/ui/kpi-card';
import { PageHeader } from '../../shared/ui/page-header';
import { SlideOver } from '../../shared/ui/slide-over';
import { CHIP_CLASS, StatusBadge } from '../../shared/ui/status-badge';
import { ProductDrawer } from './product-drawer';
import { ACTIVE_SEGMENT } from '../../shared/ui/styles';

type StateFilter = 'all' | ReadinessState;

@Component({
  selector: 'app-products-page',
  imports: [PageHeader, KpiCard, StatusBadge, ProductDrawer, SlideOver, FormField],
  template: `
    <app-page-header
      eyebrow="Ürünler"
      icon="toys"
      title="Ürün Kataloğu"
      description="Her ürünün yaş sınıfı, test raporu, uyarı ve parti kanıtları tek kartta."
    >
      <button actions type="button" class="odv-btn-primary" (click)="openCreate()">
        <span class="material-symbols-rounded" aria-hidden="true">add</span>Yeni ürün
      </button>
    </app-page-header>

    <section aria-label="Ürün özeti" class="grid gap-4 sm:grid-cols-3">
      <app-kpi-card
        label="Pazara hazır"
        [value]="kpi().ready"
        note="Tüm kanıtlar onaylı"
        icon="verified"
        tone="emerald"
      />
      <app-kpi-card
        label="Eksik var"
        [value]="kpi().incomplete"
        note="Kayıt bekleyen ya da incelemede"
        icon="pending"
        tone="amber"
      />
      <app-kpi-card
        label="Bloke"
        [value]="kpi().blocked"
        note="Uygunsuz veya süresi dolmuş belge"
        icon="block"
        tone="rose"
      />
    </section>

    <div
      class="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center"
    >
      <label class="relative flex-1">
        <span class="sr-only">Ürünlerde ara</span>
        <span
          class="material-symbols-rounded pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
          >search</span
        >
        <input
          class="odv-input !border-transparent !bg-slate-50 ps-10 dark:!bg-slate-800/60"
          type="search"
          placeholder="Ad, model veya GTIN ara…"
          [value]="search()"
          (input)="search.set($any($event.target).value)"
        />
      </label>
      <div
        class="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
        role="group"
        aria-label="Durum filtresi"
      >
        @for (f of filters; track f.key) {
          <button
            type="button"
            class="rounded-lg px-3 py-2 text-xs font-bold text-slate-600 transition-colors dark:text-slate-300"
            [class]="state() === f.key ? activeSegment : ''"
            [attr.aria-pressed]="state() === f.key"
            (click)="state.set(f.key)"
          >
            {{ f.label }} <span class="ms-1 text-slate-400">{{ count(f.key) }}</span>
          </button>
        }
      </div>
    </div>

    @if (filtered().length) {
      <section class="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-3" aria-label="Ürünler">
        @for (row of filtered(); track row.product.id) {
          <button
            type="button"
            class="group rounded-2xl border border-slate-200/80 bg-white p-5 text-start shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-3 focus-visible:outline-violet-500/40 dark:border-slate-800 dark:bg-slate-900"
            (click)="openProduct.set(row.product.id)"
          >
            <div class="flex items-start justify-between gap-3">
              <span
                class="grid size-12 shrink-0 place-items-center rounded-2xl bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
              >
                <span class="material-symbols-rounded !text-[26px]" aria-hidden="true">{{
                  categoryIcon[row.product.category]
                }}</span>
              </span>
              <app-status-badge [status]="row.state" />
            </div>
            <h2
              class="mb-0 mt-4 text-base font-black tracking-tight text-slate-900 dark:text-white"
            >
              {{ row.product.name }}
            </h2>
            <p class="m-0 mt-0.5 font-mono text-[11px] text-slate-500">
              {{ row.product.model }} · {{ row.product.gtin }}
            </p>
            <div class="mt-3 flex flex-wrap gap-1.5">
              <span
                class="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >{{ row.product.category }}</span
              >
              @for (m of row.product.markets; track m) {
                <span
                  class="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >{{ m }}</span
                >
              }
            </div>
            <div
              class="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800"
            >
              <div class="flex gap-1.5">
                @for (area of areas; track area.key) {
                  <span
                    class="inline-grid size-7 place-items-center rounded-lg"
                    [class]="chip[row.areas[area.key]]"
                    [attr.title]="area.label + ': ' + statusLabel[row.areas[area.key]]"
                  >
                    <span class="material-symbols-rounded !text-[16px]" aria-hidden="true">{{
                      area.icon
                    }}</span>
                    <span class="sr-only"
                      >{{ area.label }}: {{ statusLabel[row.areas[area.key]] }}</span
                    >
                  </span>
                }
              </div>
              <span class="text-xs font-black text-slate-700 dark:text-slate-200"
                >%{{ row.percent }}</span
              >
            </div>
          </button>
        }
      </section>
    } @else {
      <div class="odv-card mt-5 p-12 text-center">
        <span class="material-symbols-rounded mb-2 !text-5xl text-slate-300" aria-hidden="true"
          >inventory_2</span
        >
        <h2 class="m-0 text-base font-black">Bu filtrede ürün yok</h2>
        <p class="mb-0 mt-1 text-sm text-slate-500">Aramayı temizleyin veya yeni ürün ekleyin.</p>
      </div>
    }

    <app-product-drawer [productId]="openProduct()" (closed)="openProduct.set(null)" />

    <app-slide-over
      [open]="creating()"
      [dirty]="!!draft().name"
      icon="add_box"
      eyebrow="Ürün kataloğu"
      title="Yeni ürün"
      description="Ürünü ekledikten sonra yaş sınıfı, test, uyarı ve parti kayıtlarını bağlayın."
      submitLabel="Ürünü ekle"
      (closed)="creating.set(false)"
      (submitted)="save()"
    >
      <section class="odv-card space-y-4 p-5">
        <label class="block">
          <span class="mb-1.5 block text-xs font-bold">Ürün adı *</span>
          <input
            class="odv-input"
            [formField]="productForm.name"
            autocomplete="off"
            placeholder="Örn. Manyetik Blok Seti"
          />
          @if (productForm.name().touched() && productForm.name().invalid()) {
            <span class="mt-1 block text-xs text-rose-600">En az 3 karakterlik bir ad girin.</span>
          }
        </label>
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block">
            <span class="mb-1.5 block text-xs font-bold">Model *</span>
            <input
              class="odv-input"
              [formField]="productForm.model"
              autocomplete="off"
              placeholder="Örn. MB-80"
            />
          </label>
          <label class="block">
            <span class="mb-1.5 block text-xs font-bold">GTIN / barkod</span>
            <input
              class="odv-input font-mono"
              [formField]="productForm.gtin"
              autocomplete="off"
              inputmode="numeric"
            />
          </label>
          <label class="block">
            <span class="mb-1.5 block text-xs font-bold">Kategori</span>
            <select class="odv-input" [formField]="productForm.category">
              @for (c of categories; track c) {
                <option [value]="c">{{ c }}</option>
              }
            </select>
          </label>
          <label class="block">
            <span class="mb-1.5 block text-xs font-bold">Sorumlu</span>
            <input class="odv-input" [formField]="productForm.owner" autocomplete="off" />
          </label>
        </div>
        <fieldset class="m-0 border-0 p-0">
          <legend class="mb-1.5 text-xs font-bold">Hedef pazarlar</legend>
          <div class="flex gap-2">
            @for (m of markets; track m) {
              <label
                class="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold dark:border-slate-700"
              >
                <input
                  type="checkbox"
                  class="size-4 accent-violet-600"
                  [checked]="selectedMarkets().includes(m)"
                  (change)="toggleMarket(m)"
                />{{ m }}
              </label>
            }
          </div>
        </fieldset>
      </section>
    </app-slide-over>
  `,
})
export class ProductsPage {
  readonly store = inject(KidsStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly kpi = this.store.kpis;
  readonly activeSegment = ACTIVE_SEGMENT;
  readonly areas = AREAS;
  readonly chip = CHIP_CLASS;
  readonly statusLabel = STATUS_LABEL;
  readonly categoryIcon = CATEGORY_ICON;
  readonly categories = PRODUCT_CATEGORIES;
  readonly markets = MARKETS;
  readonly filters: readonly { key: StateFilter; label: string }[] = [
    { key: 'all', label: 'Tümü' },
    { key: 'ready', label: 'Hazır' },
    { key: 'incomplete', label: 'Eksik' },
    { key: 'blocked', label: 'Bloke' },
  ];
  readonly search = signal('');
  readonly state = signal<StateFilter>('all');
  readonly openProduct = signal<string | null>(null);
  readonly creating = signal(false);
  readonly selectedMarkets = signal<Market[]>(['TR']);
  readonly draft = signal({
    name: '',
    model: '',
    gtin: '',
    category: 'Oyuncak' as ProductCategory,
    owner: '',
  });
  readonly productForm = form(this.draft, (p) => {
    required(p.name);
    minLength(p.name, 3);
    required(p.model);
  });

  readonly searched = computed(() => {
    const q = this.search().trim().toLocaleLowerCase('tr');
    return this.store
      .readiness()
      .filter(
        (r) =>
          !q ||
          `${r.product.name} ${r.product.model} ${r.product.gtin}`
            .toLocaleLowerCase('tr')
            .includes(q),
      );
  });
  readonly filtered = computed(() =>
    this.searched().filter((r) => this.state() === 'all' || r.state === this.state()),
  );

  private readonly query = toSignal(this.route.queryParamMap);

  constructor() {
    // Üst çubuktaki genel arama bu sayfaya ?q= ile gelir; sayfa açıkken de güncellenir.
    effect(() => {
      const params = this.query();
      if (!params) return;
      if (params.has('q')) this.search.set(params.get('q') ?? '');
      if (params.get('new')) this.openCreate();
    });
  }

  count(key: StateFilter): number {
    return this.searched().filter((r) => key === 'all' || r.state === key).length;
  }

  openCreate(): void {
    this.draft.set({ name: '', model: '', gtin: '', category: 'Oyuncak', owner: '' });
    this.selectedMarkets.set(['TR']);
    this.productForm().reset();
    this.creating.set(true);
  }

  toggleMarket(m: Market): void {
    this.selectedMarkets.update((list) =>
      list.includes(m) ? list.filter((x) => x !== m) : [...list, m],
    );
  }

  save(): void {
    submit(this.productForm, async () => {
      const v = this.draft();
      const product = this.store.addProduct({
        ...v,
        owner: v.owner || 'Atanmadı',
        gtin: v.gtin || '—',
        markets: this.selectedMarkets(),
      });
      this.creating.set(false);
      void this.router.navigate([], { queryParams: {} });
      this.openProduct.set(product.id);
    });
  }
}
