import { Component, computed, input } from '@angular/core';
import { TONE_CLASSES, Tone } from '../../domain/domain-navigation';

@Component({
  selector: 'app-page-header',
  template: `
    <header class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div class="flex min-w-0 items-center gap-4">
        <span class="grid size-12 shrink-0 place-items-center rounded-2xl" [class]="toneClass()">
          <span class="material-symbols-rounded !text-[26px]" aria-hidden="true">{{ icon() }}</span>
        </span>
        <div class="min-w-0">
          @if (eyebrow()) {
            <span
              class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >{{ eyebrow() }}</span
            >
          }
          <h1
            class="m-0 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-[28px]"
          >
            {{ title() }}
          </h1>
          @if (description()) {
            <p class="mb-0 mt-1 max-w-[70ch] text-sm text-slate-500 dark:text-slate-400">
              {{ description() }}
            </p>
          }
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-2"><ng-content select="[actions]" /></div>
    </header>
  `,
})
export class PageHeader {
  readonly eyebrow = input('');
  readonly icon = input('space_dashboard');
  readonly tone = input<Tone>('violet');
  readonly title = input.required<string>();
  readonly description = input('');
  readonly toneClass = computed(() => TONE_CLASSES[this.tone()].soft);
}
