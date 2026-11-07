import { Injectable, computed, signal } from '@angular/core';
import {
  ActivityItem,
  AreaStatus,
  COMPLIANCE_AREAS,
  ComplianceArea,
  ComplianceRecord,
  KidsProduct,
  ReadinessState,
  areaStatus,
  daysUntil,
  effectiveStatus,
  readinessPercent,
  readinessState,
  seedActivity,
  seedProducts,
  seedRecords,
  todayIso,
} from './kids-catalog';
import { areaDef } from './domain-navigation';

export interface ProductReadiness {
  readonly product: KidsProduct;
  readonly areas: Record<ComplianceArea, AreaStatus>;
  readonly state: ReadinessState;
  readonly percent: number;
  readonly openItems: number;
}

export interface Deadline {
  readonly record: ComplianceRecord;
  readonly product: KidsProduct | undefined;
  readonly days: number;
}

/**
 * Ürün ve uyum kayıtlarının tek kaynağı.
 * Şimdilik örnek veriyle bellekte çalışır; MainAPI bağlandığında yalnız bu sınıf değişecek.
 */
@Injectable({ providedIn: 'root' })
export class KidsStore {
  readonly sampleData = true;
  readonly products = signal<KidsProduct[]>(seedProducts());
  readonly records = signal<ComplianceRecord[]>(seedRecords());
  readonly activity = signal<ActivityItem[]>(seedActivity());
  readonly recentActivity = computed(() =>
    [...this.activity()].sort((a, b) => b.at.localeCompare(a.at)),
  );

  readonly readiness = computed<ProductReadiness[]>(() => {
    const records = this.records();
    return this.products().map((product) => {
      const own = records.filter((r) => r.productId === product.id);
      const areas = Object.fromEntries(
        COMPLIANCE_AREAS.map((area) => [area, areaStatus(own.filter((r) => r.area === area))]),
      ) as Record<ComplianceArea, AreaStatus>;
      const statuses = COMPLIANCE_AREAS.map((a) => areas[a]);
      return {
        product,
        areas,
        state: readinessState(statuses),
        percent: readinessPercent(statuses),
        openItems: statuses.filter((s) => s !== 'approved').length,
      };
    });
  });

  readonly kpis = computed(() => {
    const list = this.readiness();
    return {
      total: list.length,
      ready: list.filter((r) => r.state === 'ready').length,
      incomplete: list.filter((r) => r.state === 'incomplete').length,
      blocked: list.filter((r) => r.state === 'blocked').length,
      expiringSoon: this.deadlines().filter((d) => d.days >= 0 && d.days <= 30).length,
      openItems: list.reduce((sum, r) => sum + r.openItems, 0),
    };
  });

  /** Süreli belgeler: süresi dolmuş veya 60 gün içinde dolacaklar, en yakın önce. */
  readonly deadlines = computed<Deadline[]>(() => {
    const products = this.products();
    return this.records()
      .filter((r) => r.validUntil)
      .map((record) => ({
        record,
        product: products.find((p) => p.id === record.productId),
        days: daysUntil(record.validUntil!),
      }))
      .filter((d) => d.days <= 60)
      .sort((a, b) => a.days - b.days);
  });

  areaSummary(area: ComplianceArea) {
    const records = this.records().filter((r) => r.area === area);
    const statuses = records.map((r) => effectiveStatus(r));
    const covered = new Set(records.map((r) => r.productId));
    return {
      total: records.length,
      approved: statuses.filter((s) => s === 'approved').length,
      review: statuses.filter((s) => s === 'review').length,
      problem: statuses.filter((s) => s === 'rejected' || s === 'expired').length,
      missingProducts: this.products().filter((p) => !covered.has(p.id)),
    };
  }

  productById(id: string): KidsProduct | undefined {
    return this.products().find((p) => p.id === id);
  }

  readinessOf(id: string): ProductReadiness | undefined {
    return this.readiness().find((r) => r.product.id === id);
  }

  recordsOf(productId: string, area?: ComplianceArea): ComplianceRecord[] {
    return this.records().filter((r) => r.productId === productId && (!area || r.area === area));
  }

  addProduct(value: Omit<KidsProduct, 'id' | 'updated'>): KidsProduct {
    const product: KidsProduct = { ...value, id: this.newId('p'), updated: todayIso() };
    this.products.update((list) => [product, ...list]);
    this.log('add_box', 'Yeni ürün eklendi', `${product.name} · ${product.model}`);
    return product;
  }

  saveRecord(value: Omit<ComplianceRecord, 'id' | 'updated'>, id?: string): ComplianceRecord {
    const record: ComplianceRecord = { ...value, id: id ?? this.newId('r'), updated: todayIso() };
    const product = this.productById(record.productId);
    const area = areaDef(record.area);
    if (id) {
      this.records.update((list) => list.map((r) => (r.id === id ? record : r)));
      this.log(
        'edit_note',
        `${area.shortLabel} kaydı güncellendi`,
        `${product?.name ?? ''} · ${record.title}`,
      );
    } else {
      this.records.update((list) => [record, ...list]);
      this.log(
        area.icon,
        `${area.shortLabel} kaydı eklendi`,
        `${product?.name ?? ''} · ${record.title}`,
      );
    }
    return record;
  }

  private log(icon: string, title: string, detail: string): void {
    this.activity.update((list) => [
      { id: this.newId('a'), icon, title, detail, at: todayIso() },
      ...list,
    ]);
  }

  private newId(prefix: string): string {
    return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  }
}
