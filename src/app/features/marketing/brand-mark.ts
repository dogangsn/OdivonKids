import { Component, computed, input } from '@angular/core';

/** OdivonKids logosu: simge + kelime markası. `tone` arka plana göre renkleri seçer. */
@Component({
  selector: 'odv-brand-mark',
  template: `
    <span class="inline-flex items-center gap-2.5">
      <span
        class="relative grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30"
      >
        <span class="material-symbols-rounded !text-[22px]" aria-hidden="true">toys</span>
        <span
          class="absolute -end-1 -top-1 size-3 rounded-full bg-amber-400 ring-2"
          [class]="ringClass()"
        ></span>
      </span>
      <span class="leading-none">
        <strong class="block text-lg font-extrabold tracking-tight" [class]="nameClass()"
          >Odivon<span [class]="kidsClass()">Kids</span></strong
        >
        @if (subtitle()) {
          <span class="mt-1 block text-[11px] font-semibold" [class]="subClass()">{{
            subtitle()
          }}</span>
        }
      </span>
    </span>
  `,
})
export class BrandMark {
  /** `light`: koyu zemin üzerinde açık yazı. `dark`: açık zemin üzerinde koyu yazı. */
  readonly tone = input<'light' | 'dark'>('dark');
  readonly subtitle = input('');
  protected readonly ringClass = computed(() =>
    this.tone() === 'light' ? 'ring-[#0c0a1f]' : 'ring-white dark:ring-[#0b1120]',
  );
  protected readonly nameClass = computed(() =>
    this.tone() === 'light' ? 'text-white' : 'text-slate-900 dark:text-white',
  );
  protected readonly kidsClass = computed(() =>
    this.tone() === 'light' ? 'text-amber-400' : 'text-violet-600 dark:text-amber-400',
  );
  protected readonly subClass = computed(() =>
    this.tone() === 'light' ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400',
  );
}
