import { Component } from '@angular/core';

type Cell = 'ok' | 'review' | 'missing' | 'expired';

interface PreviewRow {
  readonly name: string;
  readonly code: string;
  readonly icon: string;
  readonly cells: readonly Cell[];
  readonly score: number;
}

/**
 * Tanıtım ve giriş ekranlarında kullanılan, ürünün "pazara hazırlık" panelini
 * temsil eden süs görseli. Ekran okuyuculardan gizlidir; gerçek veri içermez.
 */
@Component({
  selector: 'odv-product-preview',
  template: `
    <div class="relative" aria-hidden="true">
      <!-- Ana pano -->
      <div
        class="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[.06] p-5 shadow-2xl shadow-indigo-950/50 ring-1 ring-inset ring-white/5 backdrop-blur-xl"
      >
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="size-2.5 rounded-full bg-rose-400/80"></span>
            <span class="size-2.5 rounded-full bg-amber-400/80"></span>
            <span class="size-2.5 rounded-full bg-emerald-400/80"></span>
          </div>
          <span
            class="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-100"
            >Ürün hazırlık matrisi</span
          >
        </div>

        <div class="mb-4 grid grid-cols-3 gap-2.5">
          @for (k of kpis; track k.label) {
            <div class="rounded-2xl bg-white/[.07] p-3 ring-1 ring-inset ring-white/10">
              <span
                class="block text-[10px] font-bold uppercase tracking-wider text-indigo-200/80"
                >{{ k.label }}</span
              >
              <strong class="mt-1 block text-2xl font-extrabold leading-none text-white">{{
                k.value
              }}</strong>
              <span class="mt-1 block text-[10px] font-semibold" [class]="k.tone">{{
                k.note
              }}</span>
            </div>
          }
        </div>

        <div class="overflow-hidden rounded-2xl bg-slate-950/30 ring-1 ring-inset ring-white/10">
          <div
            class="grid grid-cols-[1fr_repeat(4,1.9rem)_3rem] items-center gap-2 border-b border-white/10 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-indigo-200/70"
          >
            <span>Ürün</span><span class="text-center">Yaş</span
            ><span class="text-center">Test</span><span class="text-center">Uyarı</span
            ><span class="text-center">Parti</span><span class="text-end">Hazır</span>
          </div>
          @for (r of rows; track r.code) {
            <div
              class="grid grid-cols-[1fr_repeat(4,1.9rem)_3rem] items-center gap-2 border-b border-white/5 px-3 py-2.5 last:border-0"
            >
              <span class="flex min-w-0 items-center gap-2">
                <span
                  class="grid size-7 shrink-0 place-items-center rounded-lg bg-white/10 text-indigo-100"
                  ><span class="material-symbols-rounded !text-[16px]">{{ r.icon }}</span></span
                >
                <span class="min-w-0">
                  <strong class="block truncate text-[11px] font-bold text-white">{{
                    r.name
                  }}</strong>
                  <span class="block font-mono text-[9px] text-indigo-200/60">{{ r.code }}</span>
                </span>
              </span>
              @for (c of r.cells; track $index) {
                <span
                  class="mx-auto grid size-6 place-items-center rounded-md"
                  [class]="cellClass[c]"
                  ><span class="material-symbols-rounded !text-[14px]">{{
                    cellIcon[c]
                  }}</span></span
                >
              }
              <span class="text-end text-[11px] font-extrabold text-white">%{{ r.score }}</span>
            </div>
          }
        </div>
      </div>

      <!-- Yüzen bildirim kartları -->
      <div
        class="odv-float absolute -start-6 -top-6 hidden items-center gap-2.5 rounded-2xl bg-white p-3 pe-4 text-slate-900 shadow-xl shadow-indigo-950/30 sm:flex"
      >
        <span class="grid size-9 place-items-center rounded-xl bg-emerald-100 text-emerald-600"
          ><span class="material-symbols-rounded">verified</span></span
        >
        <span>
          <strong class="block text-xs font-extrabold">Pazara hazır</strong>
          <span class="text-[10px] font-semibold text-slate-500">Ahşap Öğrenme Kulesi · %100</span>
        </span>
      </div>
      <div
        class="odv-float odv-float-delay absolute -bottom-6 -end-4 hidden items-center gap-2.5 rounded-2xl bg-white p-3 pe-4 text-slate-900 shadow-xl shadow-indigo-950/30 sm:flex"
      >
        <span class="grid size-9 place-items-center rounded-xl bg-amber-100 text-amber-600"
          ><span class="material-symbols-rounded">schedule</span></span
        >
        <span>
          <strong class="block text-xs font-extrabold">Test raporu 18 gün içinde doluyor</strong>
          <span class="text-[10px] font-semibold text-slate-500">Manyetik Blok Seti · EN 71-1</span>
        </span>
      </div>
    </div>
  `,
  styles: `
    @keyframes odv-float {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-8px);
      }
    }
    .odv-float {
      animation: odv-float 6s ease-in-out infinite;
    }
    .odv-float-delay {
      animation-delay: -3s;
    }
    @media (prefers-reduced-motion: reduce) {
      .odv-float {
        animation: none;
      }
    }
  `,
})
export class ProductPreview {
  protected readonly kpis = [
    { label: 'Takip', value: '24', note: 'ürün', tone: 'text-indigo-200' },
    { label: 'Hazır', value: '17', note: '%71 oranında', tone: 'text-emerald-300' },
    { label: 'Bloke', value: '2', note: 'rapor süresi doldu', tone: 'text-rose-300' },
  ];
  protected readonly rows: readonly PreviewRow[] = [
    {
      name: 'Ahşap Öğrenme Kulesi',
      code: 'K-21',
      icon: 'chair',
      cells: ['ok', 'ok', 'ok', 'ok'],
      score: 100,
    },
    {
      name: 'Manyetik Blok Seti',
      code: 'MB-80',
      icon: 'toys',
      cells: ['ok', 'ok', 'review', 'ok'],
      score: 75,
    },
    {
      name: 'Çocuk Gece Lambası',
      code: 'NL-4',
      icon: 'lightbulb',
      cells: ['ok', 'expired', 'ok', 'missing'],
      score: 50,
    },
    {
      name: 'Peluş Uyku Arkadaşı',
      code: 'PL-12',
      icon: 'pets',
      cells: ['ok', 'review', 'ok', 'missing'],
      score: 50,
    },
  ];
  protected readonly cellClass: Record<Cell, string> = {
    ok: 'bg-emerald-400/90 text-emerald-950',
    review: 'bg-sky-400/90 text-sky-950',
    missing: 'bg-transparent text-amber-300 ring-1 ring-inset ring-amber-300/70',
    expired: 'bg-rose-500 text-white',
  };
  protected readonly cellIcon: Record<Cell, string> = {
    ok: 'check',
    review: 'hourglass_top',
    missing: 'remove',
    expired: 'close',
  };
}
