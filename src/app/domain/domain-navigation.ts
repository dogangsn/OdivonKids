export interface DomainNavigationItem {
  readonly key: string;
  readonly path: string;
  readonly icon: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
}

export const PRODUCT_NAVIGATION: readonly DomainNavigationItem[] = [
  {
    key: 'products',
    path: 'products',
    icon: 'toys',
    label: 'Ürün Kataloğu',
    title: 'Çocuk Ürünleri Kataloğu',
    description: 'Çocuk ürünlerini yaş, model, parti ve hedef pazar bilgileriyle yönetin.',
  },
  {
    key: 'age-grades',
    path: 'age-grades',
    icon: 'child_care',
    label: 'Yaş Sınıfları',
    title: 'Yaş Sınıflandırması',
    description: 'Yaş uygunluğu, gelişim seviyesi ve kullanım senaryolarını değerlendirin.',
  },
  {
    key: 'test-reports',
    path: 'test-reports',
    icon: 'science',
    label: 'Test Raporları',
    title: 'Güvenlik Test Raporları',
    description: 'Fiziksel, kimyasal ve yanıcılık test sonuçlarını yönetin.',
  },
  {
    key: 'warnings',
    path: 'warnings',
    icon: 'warning',
    label: 'Uyarı Kontrolü',
    title: 'Uyarı ve Talimat Kontrolü',
    description: 'Zorunlu uyarıları, piktogramları ve kullanım talimatlarını doğrulayın.',
  },
  {
    key: 'traceability',
    path: 'traceability',
    icon: 'qr_code_2',
    label: 'İzlenebilirlik',
    title: 'Parti ve İzlenebilirlik',
    description: 'Üretici, ithalatçı, parti ve geri çağırma kanıtlarını takip edin.',
  },
];
