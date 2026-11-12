# OdivonKids

Odivon'un F‑Gas uyumluluk ve saha operasyonu ürünüdür. Angular 22, Signals, Tailwind CSS 4 ve Odivon UI Design System ile geliştirilir.

## Yerel geliştirme

```bash
npm install
npm start
```

MainAPI adresi ve Firebase web istemci ayarları `src/environments/environment.ts` içinde yerel/deployment ortamına göre sağlanır. Bu repoya service-account veya production credential eklenmez.

## Doğrulama

```bash
npm run typecheck
npm test -- --watch=false
npm run build
```

İş verisi yalnız `/api/v1/kids` MainAPI alanından alınır. Firebase yalnız Auth ve App Check için kullanılır.

## Otomatik deploy

`main` dalına her push'ta GitHub Actions (`.github/workflows/ci.yml`) önce typecheck, test ve build çalıştırır; hepsi geçerse `npm run deploy` ile Cloudflare Workers'daki `odivon-kids` worker'ına (kids.odivon.com) yayınlar. Actions sekmesinden "Run workflow" ile elle de tetiklenebilir.

Gerekli repo secret'ları (Settings → Secrets and variables → Actions):

- `CLOUDFLARE_API_TOKEN`: "Edit Cloudflare Workers" şablonuyla oluşturulmuş API token
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare hesap kimliği

Secret'lar yoksa deploy adımı uyarı verip atlanır, CI kırılmaz.

## Lisans

Bu projeye açık kaynak lisansı verilmemiştir. Tüm hakları saklıdır.
