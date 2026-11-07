import { Component, inject } from '@angular/core';
import { formatDate } from '../../domain/kids-catalog';
import { KidsStore } from '../../domain/kids-store';
import { PageHeader } from '../../shared/ui/page-header';

@Component({
  selector: 'app-activity-page',
  imports: [PageHeader],
  template: `
    <app-page-header
      eyebrow="Denetim izi"
      icon="history"
      title="Aktiviteler"
      description="Ürün ve uyum kayıtlarında yapılan son işlemler, en yeni önce."
    />
    <section class="odv-card p-6">
      <ol class="relative m-0 space-y-6 border-s-2 border-slate-100 ps-0 dark:border-slate-800">
        @for (item of store.recentActivity(); track item.id) {
          <li class="relative ms-6 list-none">
            <span
              class="absolute -start-[42px] grid size-8 place-items-center rounded-full bg-violet-50 text-violet-700 ring-4 ring-white dark:bg-violet-950 dark:text-violet-300 dark:ring-slate-900"
              ><span class="material-symbols-rounded !text-[16px]" aria-hidden="true">{{
                item.icon
              }}</span></span
            >
            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <strong class="text-sm">{{ item.title }}</strong>
              <time class="text-xs font-semibold text-slate-400" [attr.datetime]="item.at">{{
                formatDate(item.at)
              }}</time>
            </div>
            <p class="mb-0 mt-0.5 text-xs text-slate-500">{{ item.detail }}</p>
          </li>
        }
      </ol>
    </section>
  `,
})
export class ActivityPage {
  readonly store = inject(KidsStore);
  readonly formatDate = formatDate;
}
