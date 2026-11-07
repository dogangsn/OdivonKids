import { Component, computed, input } from '@angular/core';
import { AreaStatus, ReadinessState, STATUS_LABEL } from '../../domain/kids-catalog';

const STYLE: Record<AreaStatus | ReadinessState, { cls: string; icon: string }> = {
  approved: {
    cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-900',
    icon: 'check_circle',
  },
  ready: {
    cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-900',
    icon: 'verified',
  },
  review: {
    cls: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:ring-sky-900',
    icon: 'hourglass_top',
  },
  missing: {
    cls: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-900',
    icon: 'radio_button_unchecked',
  },
  incomplete: {
    cls: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-900',
    icon: 'pending',
  },
  rejected: {
    cls: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-900',
    icon: 'cancel',
  },
  expired: {
    cls: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-900',
    icon: 'event_busy',
  },
  blocked: {
    cls: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-900',
    icon: 'block',
  },
};

/** Tüm ekranlarda aynı renk ve ikonla gösterilen durum rozeti. */
@Component({
  selector: 'app-status-badge',
  template: `<span
    class="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset"
    [class]="style().cls"
    ><span class="material-symbols-rounded !text-[14px]" aria-hidden="true">{{ style().icon }}</span
    >{{ label() }}</span
  >`,
})
export class StatusBadge {
  readonly status = input.required<AreaStatus | ReadinessState>();
  readonly style = computed(() => STYLE[this.status()]);
  readonly label = computed(() => STATUS_LABEL[this.status()]);
}

/** Ürün matrisindeki küçük alan çipi (renk = durum). */
export const CHIP_CLASS: Record<AreaStatus, string> = {
  approved: 'bg-emerald-500 text-white',
  review: 'bg-sky-500 text-white',
  missing:
    'bg-white text-amber-600 ring-2 ring-inset ring-amber-300 dark:bg-slate-900 dark:ring-amber-700',
  rejected: 'bg-rose-500 text-white',
  expired: 'bg-rose-500 text-white',
};
