import { ComplianceArea } from './kids-catalog';

export type Tone = 'violet' | 'sky' | 'rose' | 'amber' | 'teal';

/** Tailwind sınıfları burada tam yazılır ki derleyici tarayabilsin. */
export const TONE_CLASSES: Record<
  Tone,
  { readonly soft: string; readonly bar: string; readonly text: string }
> = {
  violet: {
    soft: 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
    bar: 'bg-violet-500',
    text: 'text-violet-600 dark:text-violet-300',
  },
  sky: {
    soft: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
    bar: 'bg-sky-500',
    text: 'text-sky-600 dark:text-sky-300',
  },
  rose: {
    soft: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
    bar: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-300',
  },
  amber: {
    soft: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    bar: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-300',
  },
  teal: {
    soft: 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300',
    bar: 'bg-teal-500',
    text: 'text-teal-600 dark:text-teal-300',
  },
};

export interface AreaDefinition {
  readonly key: ComplianceArea;
  readonly path: string;
  readonly icon: string;
  readonly tone: Tone;
  readonly label: string;
  readonly shortLabel: string;
  readonly title: string;
  readonly description: string;
  readonly titleLabel: string;
  readonly titlePlaceholder: string;
  readonly referenceLabel: string;
  readonly referencePlaceholder: string;
  readonly detailLabel: string;
  readonly detailPlaceholder: string;
  /** Süreli belge mi (ör. test raporu)? */
  readonly hasValidity: boolean;
}

export const AREAS: readonly AreaDefinition[] = [
  {
    key: 'age-grades',
    path: 'age-grades',
    icon: 'child_care',
    tone: 'sky',
    label: 'Yaş Sınıfları',
    shortLabel: 'Yaş',
    title: 'Yaş Sınıflandırması',
    description: 'Her ürünün yaş uygunluğunu ve gerekçesini kayıt altına alın.',
    titleLabel: 'Yaş sınıfı',
    titlePlaceholder: 'Örn. 3+ yaş',
    referenceLabel: 'Kısa kod',
    referencePlaceholder: 'Örn. 3+',
    detailLabel: 'Gerekçe',
    detailPlaceholder: 'Örn. küçük parça değerlendirmesi',
    hasValidity: false,
  },
  {
    key: 'test-reports',
    path: 'test-reports',
    icon: 'science',
    tone: 'rose',
    label: 'Test Raporları',
    shortLabel: 'Test',
    title: 'Güvenlik Test Raporları',
    description:
      'Fiziksel, kimyasal, yanıcılık ve elektrik testlerini geçerlilik süreleriyle izleyin.',
    titleLabel: 'Test grubu',
    titlePlaceholder: 'Örn. Mekanik/fiziksel test',
    referenceLabel: 'Rapor numarası',
    referencePlaceholder: 'Örn. TÜV TR-2026-4118',
    detailLabel: 'Standart ve sonuç',
    detailPlaceholder: 'Örn. EN 71-1 · geçti',
    hasValidity: true,
  },
  {
    key: 'warnings',
    path: 'warnings',
    icon: 'warning',
    tone: 'amber',
    label: 'Uyarı Kontrolü',
    shortLabel: 'Uyarı',
    title: 'Uyarı ve Talimat Kontrolü',
    description: 'Zorunlu uyarıları, dillerini ve kullanım talimatlarını doğrulayın.',
    titleLabel: 'Uyarı türü',
    titlePlaceholder: 'Örn. Boğulma riski uyarısı',
    referenceLabel: 'Diller',
    referencePlaceholder: 'Örn. TR · EN',
    detailLabel: 'Uyarı metni',
    detailPlaceholder: 'Örn. 36 aydan küçük çocuklar için uygun değildir.',
    hasValidity: false,
  },
  {
    key: 'traceability',
    path: 'traceability',
    icon: 'qr_code_2',
    tone: 'teal',
    label: 'İzlenebilirlik',
    shortLabel: 'Parti',
    title: 'Parti ve İzlenebilirlik',
    description: 'Parti numaralarını, üretim yerini ve serbest bırakma durumunu takip edin.',
    titleLabel: 'Parti adı',
    titlePlaceholder: 'Örn. LOT-MB80-2610',
    referenceLabel: 'Parti / seri numarası',
    referencePlaceholder: 'Örn. LOT-MB80-2610',
    detailLabel: 'Tesis ve üretim tarihi',
    detailPlaceholder: 'Örn. Bursa-02 · 18.10.2026',
    hasValidity: false,
  },
];

export function areaDef(key: ComplianceArea): AreaDefinition {
  return AREAS.find((a) => a.key === key) ?? AREAS[0];
}

export interface NavItem {
  readonly path: string;
  readonly icon: string;
  readonly label: string;
  readonly tone: Tone;
}

export interface NavGroup {
  readonly label: string;
  readonly items: readonly NavItem[];
}

export const NAV_GROUPS: readonly NavGroup[] = [
  {
    label: 'Genel',
    items: [
      { path: '/overview', icon: 'space_dashboard', label: 'Genel Bakış', tone: 'violet' },
      { path: '/products', icon: 'toys', label: 'Ürün Kataloğu', tone: 'violet' },
    ],
  },
  {
    label: 'Uyumluluk',
    items: AREAS.map((a) => ({ path: `/${a.path}`, icon: a.icon, label: a.label, tone: a.tone })),
  },
  {
    label: 'Sistem',
    items: [
      { path: '/activity', icon: 'history', label: 'Aktiviteler', tone: 'violet' },
      { path: '/settings', icon: 'tune', label: 'Ayarlar', tone: 'violet' },
    ],
  },
];
