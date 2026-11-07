import { Injectable, Pipe, PipeTransform, computed, inject, signal } from '@angular/core';
export type SupportedLang = 'tr' | 'en' | 'de' | 'fr' | 'es' | 'it' | 'nl' | 'ar';
export interface LanguageOption {
  readonly code: SupportedLang;
  readonly nativeName: string;
  readonly flag: string;
  readonly dir: 'ltr' | 'rtl';
}
export const LANGUAGES: readonly LanguageOption[] = [
  { code: 'tr', nativeName: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'en', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'de', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'fr', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'it', nativeName: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  { code: 'nl', nativeName: 'Nederlands', flag: '🇳🇱', dir: 'ltr' },
  { code: 'ar', nativeName: 'العربية', flag: '🇦🇪', dir: 'rtl' },
];
const TR: Record<string, string> = {
  'common.search': 'Ad, kod veya açıklama ara…',
  'common.save': 'Kaydet',
  'common.cancel': 'Vazgeç',
  'product.category': 'Çocuk ürünleri güvenliği',
  'product.tagline': 'Çocuklara ulaşan her ürün için daha güçlü güvence.',
  'product.promise':
    'Yaş sınıfı, test raporu, uyarı metni ve izlenebilirlik kanıtlarını ürün bazında yönetin; hangi ürünün pazara hazır olduğunu tek bakışta görün.',
};
const EN: Record<string, string> = {
  'common.search': 'Search by name, code or description…',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'product.category': "Children's product safety",
  'product.tagline': 'Stronger assurance for every product that reaches children.',
  'product.promise':
    'Manage age grading, test reports, warnings and traceability evidence per product, and see which products are ready for market at a glance.',
};
const DICTS: Partial<Record<SupportedLang, Record<string, string>>> = { tr: TR, en: EN };
@Injectable({ providedIn: 'root' })
export class I18nStore {
  readonly currentLang = signal<SupportedLang>(this.initial());
  readonly options = LANGUAGES;
  readonly active = computed(
    () => LANGUAGES.find((x) => x.code === this.currentLang()) ?? LANGUAGES[0],
  );
  setLanguage(lang: SupportedLang): void {
    this.currentLang.set(lang);
    localStorage.setItem('odivon:preferred_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = this.active().dir;
    document.documentElement.classList.toggle('rtl', this.active().dir === 'rtl');
  }
  t(key: string): string {
    return DICTS[this.currentLang()]?.[key] ?? TR[key] ?? key;
  }
  private initial(): SupportedLang {
    const value = localStorage.getItem('odivon:preferred_lang') as SupportedLang | null;
    return LANGUAGES.some((x) => x.code === value) ? value! : 'tr';
  }
}
@Pipe({ name: 't', pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nStore);
  transform(key: string): string {
    this.i18n.currentLang();
    return this.i18n.t(key);
  }
}
