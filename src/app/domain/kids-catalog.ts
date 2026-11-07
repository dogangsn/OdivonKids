/**
 * Ürün merkezli uyum modeli.
 * Her ürünün pazara çıkabilmesi için dört alanda kanıtı olmalı:
 * yaş sınıfı, test raporu, uyarı/talimat ve parti izlenebilirliği.
 */

export type ComplianceArea = 'age-grades' | 'test-reports' | 'warnings' | 'traceability';

export const COMPLIANCE_AREAS: readonly ComplianceArea[] = [
  'age-grades',
  'test-reports',
  'warnings',
  'traceability',
];

/** Kayıt üzerinde kullanıcının seçtiği durum. */
export type RecordStatus = 'approved' | 'review' | 'rejected';
/** Geçerlilik tarihi geçmiş kayıtlar otomatik olarak "expired" sayılır. */
export type EffectiveStatus = RecordStatus | 'expired';
/** Bir ürünün bir alandaki durumu; hiç kaydı yoksa "missing". */
export type AreaStatus = EffectiveStatus | 'missing';
/** Ürünün genel pazara hazırlık durumu. */
export type ReadinessState = 'ready' | 'incomplete' | 'blocked';

export type Market = 'TR' | 'EU' | 'UK';
export const MARKETS: readonly Market[] = ['TR', 'EU', 'UK'];

export const PRODUCT_CATEGORIES = ['Oyuncak', 'Mobilya', 'Aydınlatma', 'Bakım ürünü'] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface KidsProduct {
  readonly id: string;
  readonly name: string;
  readonly model: string;
  readonly gtin: string;
  readonly category: ProductCategory;
  readonly markets: readonly Market[];
  readonly owner: string;
  readonly updated: string;
}

export interface ComplianceRecord {
  readonly id: string;
  readonly productId: string;
  readonly area: ComplianceArea;
  readonly title: string;
  readonly reference: string;
  readonly detail: string;
  readonly status: RecordStatus;
  /** ISO tarih (YYYY-MM-DD); yalnız süreli belgelerde. */
  readonly validUntil?: string;
  readonly notes?: string;
  readonly updated: string;
}

export interface ActivityItem {
  readonly id: string;
  readonly icon: string;
  readonly title: string;
  readonly detail: string;
  readonly at: string;
}

export const STATUS_LABEL: Record<AreaStatus | ReadinessState, string> = {
  approved: 'Onaylı',
  review: 'İncelemede',
  rejected: 'Uygunsuz',
  expired: 'Süresi doldu',
  missing: 'Eksik',
  ready: 'Pazara hazır',
  incomplete: 'Eksik var',
  blocked: 'Bloke',
};

export const CATEGORY_ICON: Record<ProductCategory, string> = {
  Oyuncak: 'toys',
  Mobilya: 'chair',
  Aydınlatma: 'emoji_objects',
  'Bakım ürünü': 'child_care',
};

const DAY = 86_400_000;

export function todayIso(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function addDays(days: number, now = new Date()): string {
  return todayIso(new Date(now.getTime() + days * DAY));
}

export function daysUntil(iso: string, now = new Date()): number {
  return Math.round((Date.parse(iso) - Date.parse(todayIso(now))) / DAY);
}

export function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}.${m}.${y}`;
}

export function effectiveStatus(record: ComplianceRecord, now = new Date()): EffectiveStatus {
  if (record.validUntil && daysUntil(record.validUntil, now) < 0) return 'expired';
  return record.status;
}

const SEVERITY: Record<AreaStatus, number> = {
  approved: 0,
  review: 1,
  missing: 2,
  rejected: 3,
  expired: 3,
};

/** Bir alanda birden çok kayıt varsa en kötü durum ürünün o alandaki durumudur. */
export function areaStatus(records: readonly ComplianceRecord[], now = new Date()): AreaStatus {
  if (!records.length) return 'missing';
  return records
    .map((r) => effectiveStatus(r, now) as AreaStatus)
    .reduce((worst, s) => (SEVERITY[s] > SEVERITY[worst] ? s : worst), 'approved' as AreaStatus);
}

export function readinessState(statuses: readonly AreaStatus[]): ReadinessState {
  if (statuses.some((s) => s === 'rejected' || s === 'expired')) return 'blocked';
  if (statuses.every((s) => s === 'approved')) return 'ready';
  return 'incomplete';
}

export function readinessPercent(statuses: readonly AreaStatus[]): number {
  if (!statuses.length) return 0;
  return Math.round((statuses.filter((s) => s === 'approved').length / statuses.length) * 100);
}

/** Örnek veri. MainAPI `/api/v1/kids` bağlanınca bu tohumun yerini gerçek kayıtlar alacak. */
export function seedProducts(): KidsProduct[] {
  return [
    {
      id: 'p1',
      name: 'Ahşap Öğrenme Kulesi',
      model: 'K-21',
      gtin: '8690000000211',
      category: 'Mobilya',
      markets: ['TR', 'EU'],
      owner: 'Ayşe Yılmaz',
      updated: addDays(-2),
    },
    {
      id: 'p2',
      name: 'Manyetik Blok Seti',
      model: 'MB-80',
      gtin: '0869000456789',
      category: 'Oyuncak',
      markets: ['TR', 'EU', 'UK'],
      owner: 'Mert Kaya',
      updated: addDays(-1),
    },
    {
      id: 'p3',
      name: 'Çocuk Gece Lambası',
      model: 'NL-4',
      gtin: '8690000000044',
      category: 'Aydınlatma',
      markets: ['TR'],
      owner: 'Ayşe Yılmaz',
      updated: addDays(-5),
    },
    {
      id: 'p4',
      name: 'Peluş Uyku Arkadaşı',
      model: 'PL-12',
      gtin: '8690000000129',
      category: 'Oyuncak',
      markets: ['TR', 'EU'],
      owner: 'Deniz Arslan',
      updated: addDays(-9),
    },
    {
      id: 'p5',
      name: 'Bebek Banyo Termometresi',
      model: 'BT-3',
      gtin: '8690000000037',
      category: 'Bakım ürünü',
      markets: ['EU'],
      owner: 'Mert Kaya',
      updated: addDays(-14),
    },
  ];
}

export function seedRecords(): ComplianceRecord[] {
  let n = 0;
  const r = (
    productId: string,
    area: ComplianceArea,
    title: string,
    reference: string,
    detail: string,
    status: RecordStatus,
    updatedOffset: number,
    validOffset?: number,
  ): ComplianceRecord => ({
    id: `r${++n}`,
    productId,
    area,
    title,
    reference,
    detail,
    status,
    updated: addDays(updatedOffset),
    ...(validOffset === undefined ? {} : { validUntil: addDays(validOffset) }),
  });
  return [
    // Ahşap Öğrenme Kulesi: tamamı onaylı → pazara hazır
    r(
      'p1',
      'age-grades',
      '3+ yaş',
      '3+',
      'Tırmanma ve denge; düşme riski değerlendirmesi',
      'approved',
      -40,
    ),
    r(
      'p1',
      'test-reports',
      'Mekanik/fiziksel test',
      'TÜV TR-2026-1180',
      'EN 71-1 · geçti',
      'approved',
      -40,
      300,
    ),
    r(
      'p1',
      'test-reports',
      'Göç eden elementler',
      'SGS-26-0912',
      'EN 71-3 · geçti',
      'approved',
      -38,
      280,
    ),
    r(
      'p1',
      'warnings',
      'Yetişkin gözetimi uyarısı',
      'TR · EN',
      'Yalnızca yetişkin gözetiminde kullanılmalıdır.',
      'approved',
      -20,
    ),
    r(
      'p1',
      'traceability',
      'LOT-K21-2610',
      'LOT-K21-2610',
      'İnegöl-01 · üretim 12.10',
      'approved',
      -12,
    ),
    // Manyetik Blok Seti: test raporu 18 gün içinde bitiyor, uyarı incelemede
    r('p2', 'age-grades', '3+ yaş', '3+', 'Küçük parça ve mıknatıs yutma riski', 'approved', -60),
    r(
      'p2',
      'test-reports',
      'Mekanik/fiziksel test',
      'TÜV TR-2026-4118',
      'EN 71-1 · mıknatıs akısı geçti',
      'approved',
      -340,
      18,
    ),
    r(
      'p2',
      'warnings',
      'Boğulma riski uyarısı',
      'TR · EN · DE',
      '36 aydan küçük çocuklar için uygun değildir. Küçük parçalar.',
      'review',
      -1,
    ),
    r(
      'p2',
      'traceability',
      'LOT-MB80-2610',
      'LOT-MB80-2610',
      'Bursa-02 · üretim 18.10',
      'approved',
      -6,
    ),
    // Çocuk Gece Lambası: elektrik testi süresi dolmuş → bloke
    r('p3', 'age-grades', '3+ yaş', '3+', 'Elektrikli ürün; adaptörlü kullanım', 'approved', -200),
    r(
      'p3',
      'test-reports',
      'Elektrikli oyuncak güvenliği',
      'INT-2025-0771',
      'EN 62115 · geçti',
      'approved',
      -400,
      -4,
    ),
    r(
      'p3',
      'warnings',
      'Elektrik güvenliği uyarısı',
      'TR',
      'Adaptörü yalnızca yetişkin takmalıdır.',
      'approved',
      -150,
    ),
    // Peluş Uyku Arkadaşı: yanıcılık testi incelemede, parti yok
    r(
      'p4',
      'age-grades',
      '0+ yaş',
      '0+',
      'Bebeklere uygun; çıkarılabilir parça yok',
      'approved',
      -30,
    ),
    r(
      'p4',
      'test-reports',
      'Yanıcılık testi',
      'BV-26-3304',
      'EN 71-2 · laboratuvarda',
      'review',
      -3,
      365,
    ),
    r(
      'p4',
      'warnings',
      'Yıkama talimatı',
      'TR · EN',
      '30 °C elde yıkayın; kurutucuya atmayın.',
      'approved',
      -10,
    ),
    // Bebek Banyo Termometresi: kimyasal test uygunsuz
    r(
      'p5',
      'test-reports',
      'Kimyasal analiz',
      'SGS-26-1450',
      'Ftalat sınırı aşıldı',
      'rejected',
      -7,
      200,
    ),
    r(
      'p5',
      'traceability',
      'LOT-BT3-2609',
      'LOT-BT3-2609',
      'İzmir-01 · üretim 21.09 · bloke',
      'review',
      -7,
    ),
  ];
}

export function seedActivity(): ActivityItem[] {
  return [
    {
      id: 'a1',
      icon: 'science',
      title: 'Kimyasal analiz uygunsuz',
      detail: 'Bebek Banyo Termometresi · SGS-26-1450',
      at: addDays(-7),
    },
    {
      id: 'a2',
      icon: 'warning',
      title: 'Uyarı metni incelemeye gönderildi',
      detail: 'Manyetik Blok Seti · TR · EN · DE',
      at: addDays(-1),
    },
    {
      id: 'a3',
      icon: 'qr_code_2',
      title: 'Yeni parti serbest bırakıldı',
      detail: 'Manyetik Blok Seti · LOT-MB80-2610',
      at: addDays(-6),
    },
    {
      id: 'a4',
      icon: 'event_busy',
      title: 'Test raporunun süresi doldu',
      detail: 'Çocuk Gece Lambası · INT-2025-0771',
      at: addDays(-4),
    },
  ];
}
