import { Component, computed, inject, signal } from '@angular/core';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { TONE_CLASSES, areaDef } from '../../domain/domain-navigation';
import {
  ComplianceArea,
  ComplianceRecord,
  EffectiveStatus,
  RecordStatus,
  STATUS_LABEL,
  daysUntil,
  effectiveStatus,
  formatDate,
} from '../../domain/kids-catalog';
import { KidsStore } from '../../domain/kids-store';
import { KpiCard } from '../../shared/ui/kpi-card';
import { PageHeader } from '../../shared/ui/page-header';
import { SlideOver } from '../../shared/ui/slide-over';
import { StatusBadge } from '../../shared/ui/status-badge';
import { ACTIVE_SEGMENT } from '../../shared/ui/styles';
import { ProductDrawer } from '../products/product-drawer';

type StatusFilter = 'all' | 'approved' | 'review' | 'problem';

interface RecordDraft {
  productId: string;
  title: string;
  reference: string;
  detail: string;
  status: RecordStatus;
  validUntil: string;
  notes: string;
}

/** Yaş sınıfı, test raporu, uyarı ve izlenebilirlik için ortak alan sayfası. */
@Component({
  selector: 'app-compliance-page',
  imports: [PageHeader, KpiCard, StatusBadge, SlideOver, ProductDrawer, FormField],
  template: `
    <app-page-header
      [eyebrow]="'Uyumluluk · ' + area.shortLabel"
      [icon]="area.icon"
      [tone]="area.tone"
      [title]="area.title"
      [description]="area.description"
    >
      <button actions type="button" class="odv-btn-primary" (click)="openCreate()">
        <span class="material-symbols-rounded" aria-hidden="true">add</span>Yeni kayıt
      </button>
    </app-page-header>

    <section aria-label="Alan özeti" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <app-kpi-card
        label="Toplam kayıt"
        [value]="summary().total"
        note="Bu alandaki tüm kanıtlar"
        [icon]="area.icon"
        [tone]="area.tone"
      />
      <app-kpi-card
        label="Onaylı"
        [value]="summary().approved"
        note="Geçerli ve onaylanmış"
        icon="check_circle"
        tone="emerald"
      />
      <app-kpi-card
        label="İncelemede"
        [value]="summary().review"
        note="Onay bekleyen kayıtlar"
        icon="hourglass_top"
        tone="sky"
      />
      <app-kpi-card
        label="Sorunlu"
        [value]="summary().problem"
        note="Uygunsuz veya süresi dolmuş"
        icon="report"
        tone="rose"
      />
    </section>

    @if (summary().missingProducts.length) {
      <section
        class="mt-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900 dark:bg-amber-950/30 md:flex-row md:items-center"
        aria-label="Kaydı olmayan ürünler"
      >
        <span class="material-symbols-rounded text-amber-600" aria-hidden="true">info</span>
        <p class="m-0 flex-1 text-sm text-amber-900 dark:text-amber-100">
          <strong>{{ summary().missingProducts.length }} ürünün</strong> bu alanda hiç kaydı yok, bu
          yüzden pazara hazır sayılmıyor.
        </p>
        <div class="flex flex-wrap gap-2">
          @for (p of summary().missingProducts; track p.id) {
            <button
              type="button"
              class="odv-btn-soft !min-h-9 !bg-white !text-xs dark:!bg-slate-900"
              (click)="openCreate(p.id)"
            >
              <span class="material-symbols-rounded !text-base" aria-hidden="true">add</span
              >{{ p.name }}
            </button>
          }
        </div>
      </section>
    }

    <section class="odv-card mt-6 overflow-hidden">
      <div
        class="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-800 md:flex-row md:items-center"
      >
        <label class="relative flex-1">
          <span class="sr-only">{{ area.title }} kayıtlarında ara</span>
          <span
            class="material-symbols-rounded pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
            >search</span
          >
          <input
            class="odv-input !border-transparent !bg-slate-50 ps-10 dark:!bg-slate-800/60"
            type="search"
            [placeholder]="
              'Ürün, ' + area.referenceLabel.toLocaleLowerCase('tr') + ' veya açıklama ara…'
            "
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
              class="rounded-lg px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300"
              [class]="statusFilter() === f.key ? activeSegment : ''"
              [attr.aria-pressed]="statusFilter() === f.key"
              (click)="statusFilter.set(f.key)"
            >
              {{ f.label }}
            </button>
          }
        </div>
      </div>
      <div class="custom-scroll relative overflow-x-auto">
        <table class="w-full min-w-[760px]">
          <thead>
            <tr>
              <th class="odv-th">Ürün</th>
              <th class="odv-th">{{ area.titleLabel }}</th>
              <th class="odv-th">{{ area.referenceLabel }}</th>
              <th class="odv-th">{{ area.detailLabel }}</th>
              @if (area.hasValidity) {
                <th class="odv-th">Geçerlilik</th>
              }
              <th class="odv-th">Durum</th>
              <th class="odv-th"><span class="sr-only">İşlem</span></th>
            </tr>
          </thead>
          <tbody>
            @for (row of rows(); track row.record.id) {
              <tr class="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td class="odv-td">
                  <button
                    type="button"
                    class="text-start font-bold text-slate-900 hover:underline dark:text-white"
                    (click)="openProduct.set(row.record.productId)"
                  >
                    {{ row.productName }}
                  </button>
                </td>
                <td class="odv-td font-semibold">{{ row.record.title }}</td>
                <td class="odv-td whitespace-nowrap font-mono text-xs text-slate-500">
                  {{ row.record.reference }}
                </td>
                <td
                  class="odv-td max-w-[280px] truncate text-slate-500"
                  [attr.title]="row.record.detail"
                >
                  {{ row.record.detail }}
                </td>
                @if (area.hasValidity) {
                  <td class="odv-td whitespace-nowrap text-xs">
                    <span class="font-semibold">{{ formatDate(row.record.validUntil) }}</span>
                    @if (row.days !== null && row.days >= 0 && row.days <= 30) {
                      <span class="ms-1 font-bold text-amber-600">· {{ row.days }} gün</span>
                    }
                  </td>
                }
                <td class="odv-td"><app-status-badge [status]="row.status" /></td>
                <td class="odv-td text-end">
                  <button
                    type="button"
                    class="odv-icon-btn"
                    [attr.aria-label]="row.record.title + ' kaydını düzenle'"
                    (click)="openEdit(row.record)"
                  >
                    <span class="material-symbols-rounded">edit</span>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td [attr.colspan]="area.hasValidity ? 7 : 6" class="p-12 text-center">
                  <span
                    class="material-symbols-rounded mb-2 !text-5xl text-slate-300"
                    aria-hidden="true"
                    >{{ area.icon }}</span
                  >
                  <strong class="block">Bu filtrede kayıt yok</strong>
                  <span class="text-sm text-slate-500"
                    >Filtreyi değiştirin veya yeni kayıt ekleyin.</span
                  >
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <footer
        class="border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-800"
      >
        <strong>{{ rows().length }}</strong> kayıt gösteriliyor
      </footer>
    </section>

    <app-product-drawer [productId]="openProduct()" (closed)="openProduct.set(null)" />

    <app-slide-over
      [open]="drawerOpen()"
      [dirty]="dirty()"
      [icon]="area.icon"
      [eyebrow]="area.title"
      [title]="
        editingId() ? 'Kaydı düzenle' : 'Yeni ' + area.shortLabel.toLocaleLowerCase('tr') + ' kaydı'
      "
      description="Zorunlu alanlar * ile işaretli. Kayıt, seçilen ürünün pazara hazırlık durumunu hemen günceller."
      [submitLabel]="editingId() ? 'Değişiklikleri kaydet' : 'Kaydı oluştur'"
      (closed)="closeDrawer()"
      (submitted)="save()"
    >
      <section class="odv-card space-y-4 p-5">
        <label class="block">
          <span class="mb-1.5 block text-xs font-bold">Ürün *</span>
          <select class="odv-input" [formField]="recordForm.productId">
            <option value="" disabled>Ürün seçin</option>
            @for (p of store.products(); track p.id) {
              <option [value]="p.id">{{ p.name }} · {{ p.model }}</option>
            }
          </select>
          @if (recordForm.productId().touched() && recordForm.productId().invalid()) {
            <span class="mt-1 block text-xs text-rose-600">Bir ürün seçin.</span>
          }
        </label>
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block">
            <span class="mb-1.5 block text-xs font-bold">{{ area.titleLabel }} *</span>
            <input
              class="odv-input"
              [formField]="recordForm.title"
              [placeholder]="area.titlePlaceholder"
              autocomplete="off"
            />
            @if (recordForm.title().touched() && recordForm.title().invalid()) {
              <span class="mt-1 block text-xs text-rose-600">Bu alan zorunludur.</span>
            }
          </label>
          <label class="block">
            <span class="mb-1.5 block text-xs font-bold">{{ area.referenceLabel }} *</span>
            <input
              class="odv-input"
              [formField]="recordForm.reference"
              [placeholder]="area.referencePlaceholder"
              autocomplete="off"
            />
            @if (recordForm.reference().touched() && recordForm.reference().invalid()) {
              <span class="mt-1 block text-xs text-rose-600">Bu alan zorunludur.</span>
            }
          </label>
        </div>
        <label class="block">
          <span class="mb-1.5 block text-xs font-bold">{{ area.detailLabel }}</span>
          <input
            class="odv-input"
            [formField]="recordForm.detail"
            [placeholder]="area.detailPlaceholder"
            autocomplete="off"
          />
        </label>
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block">
            <span class="mb-1.5 block text-xs font-bold">Durum</span>
            <select class="odv-input" [formField]="recordForm.status">
              <option value="review">İncelemede</option>
              <option value="approved">Onaylı</option>
              <option value="rejected">Uygunsuz</option>
            </select>
          </label>
          @if (area.hasValidity) {
            <label class="block">
              <span class="mb-1.5 block text-xs font-bold">Geçerlilik tarihi *</span>
              <input class="odv-input" type="date" [formField]="recordForm.validUntil" />
              @if (recordForm.validUntil().touched() && recordForm.validUntil().invalid()) {
                <span class="mt-1 block text-xs text-rose-600"
                  >Test raporları için geçerlilik tarihi zorunludur.</span
                >
              }
            </label>
          }
        </div>
        <label class="block">
          <span class="mb-1.5 block text-xs font-bold">Notlar</span>
          <textarea
            class="odv-input min-h-24 resize-y"
            [formField]="recordForm.notes"
            placeholder="İstisnalar, takip notları…"
          ></textarea>
        </label>
      </section>
    </app-slide-over>
  `,
})
export class CompliancePage {
  readonly store = inject(KidsStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly area = areaDef(this.route.snapshot.data['section'] as ComplianceArea);
  readonly tones = TONE_CLASSES;
  readonly activeSegment = ACTIVE_SEGMENT;
  readonly formatDate = formatDate;
  readonly filters: readonly { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'Tümü' },
    { key: 'approved', label: 'Onaylı' },
    { key: 'review', label: 'İncelemede' },
    { key: 'problem', label: 'Sorunlu' },
  ];
  readonly search = signal('');
  readonly statusFilter = signal<StatusFilter>('all');
  readonly openProduct = signal<string | null>(null);
  readonly drawerOpen = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly draft = signal<RecordDraft>(this.emptyDraft());
  private initialDraft = JSON.stringify(this.draft());
  readonly recordForm = form(this.draft, (p) => {
    required(p.productId);
    required(p.title);
    required(p.reference);
    if (this.area.hasValidity) required(p.validUntil);
  });
  readonly dirty = computed(() => JSON.stringify(this.draft()) !== this.initialDraft);

  readonly summary = computed(() => this.store.areaSummary(this.area.key));

  readonly rows = computed(() => {
    const q = this.search().trim().toLocaleLowerCase('tr');
    const filter = this.statusFilter();
    return this.store
      .records()
      .filter((r) => r.area === this.area.key)
      .map((record) => {
        const status: EffectiveStatus = effectiveStatus(record);
        return {
          record,
          status,
          productName: this.store.productById(record.productId)?.name ?? '—',
          days: record.validUntil ? daysUntil(record.validUntil) : null,
        };
      })
      .filter(
        (row) =>
          (filter === 'all' ||
            (filter === 'problem'
              ? row.status === 'rejected' || row.status === 'expired'
              : row.status === filter)) &&
          (!q ||
            `${row.productName} ${row.record.title} ${row.record.reference} ${row.record.detail}`
              .toLocaleLowerCase('tr')
              .includes(q)),
      );
  });

  readonly statusLabel = STATUS_LABEL;

  constructor() {
    const params = this.route.snapshot.queryParamMap;
    if (params.get('new')) this.openCreate(params.get('product') ?? '');
  }

  openCreate(productId = ''): void {
    this.editingId.set(null);
    this.resetDraft({ ...this.emptyDraft(), productId });
    this.drawerOpen.set(true);
  }

  openEdit(record: ComplianceRecord): void {
    this.editingId.set(record.id);
    this.resetDraft({
      productId: record.productId,
      title: record.title,
      reference: record.reference,
      detail: record.detail,
      status: record.status,
      validUntil: record.validUntil ?? '',
      notes: record.notes ?? '',
    });
    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
    this.editingId.set(null);
    if (this.route.snapshot.queryParamMap.get('new')) {
      void this.router.navigate([], { queryParams: {}, replaceUrl: true });
    }
  }

  save(): void {
    submit(this.recordForm, async () => {
      const v = this.draft();
      this.store.saveRecord(
        {
          productId: v.productId,
          area: this.area.key,
          title: v.title.trim(),
          reference: v.reference.trim(),
          detail: v.detail.trim(),
          status: v.status,
          notes: v.notes.trim() || undefined,
          ...(this.area.hasValidity && v.validUntil ? { validUntil: v.validUntil } : {}),
        },
        this.editingId() ?? undefined,
      );
      this.closeDrawer();
    });
  }

  private resetDraft(value: RecordDraft): void {
    this.draft.set(value);
    this.initialDraft = JSON.stringify(value);
    this.recordForm().reset();
  }

  private emptyDraft(): RecordDraft {
    return {
      productId: '',
      title: '',
      reference: '',
      detail: '',
      status: 'review',
      validUntil: '',
      notes: '',
    };
  }
}
