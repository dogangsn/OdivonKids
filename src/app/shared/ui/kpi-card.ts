import { Component, computed, input } from '@angular/core';
import { TONE_CLASSES, Tone } from '../../domain/domain-navigation';

type KpiTone = Tone | 'emerald';

const EMERALD = {
  soft: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  bar: 'bg-emerald-500',
  text: 'text-emerald-600 dark:text-emerald-300',
};

/** Odivon yönetici KPI kartı: etiket + ikon rozeti, büyük sayı, alt not. */
@Component({
  selector: 'app-kpi-card',
  template: `
    <article
      class="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="flex items-center justify-between gap-3">
        <span
          class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >{{ label() }}</span
        >
        <span class="grid size-10 place-items-center rounded-xl" [class]="tone().soft">
          <span class="material-symbols-rounded" aria-hidden="true">{{ icon() }}</span>
        </span>
      </div>
      <div class="mt-4 flex items-end gap-2">
        <strong
          class="text-4xl font-black leading-none tracking-tight text-slate-900 dark:text-white"
          >{{ value() }}</strong
        >
        @if (suffix()) {
          <span class="pb-0.5 text-sm font-bold text-slate-400">{{ suffix() }}</span>
        }
      </div>
      <p class="mb-0 mt-2 text-xs font-semibold" [class]="tone().text">{{ note() }}</p>
      @if (progress() !== null) {
        <div
          class="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
          aria-hidden="true"
        >
          <div
            class="h-full rounded-full transition-[width]"
            [class]="tone().bar"
            [style.width.%]="progress()"
          ></div>
        </div>
      }
    </article>
  `,
})
export class KpiCard {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly suffix = input('');
  readonly note = input('');
  readonly icon = input('monitoring');
  readonly toneName = input<KpiTone>('violet', { alias: 'tone' });
  readonly progress = input<number | null>(null);
  readonly tone = computed(() =>
    this.toneName() === 'emerald' ? EMERALD : TONE_CLASSES[this.toneName() as Tone],
  );
}
