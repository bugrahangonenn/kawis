# Kawis web sitesi — kısa kılavuz

## Hangi dosya ne işe yarar
- `config.js` → WhatsApp numarası, Telegram linki, e-posta, Google ID'leri, hazır WhatsApp mesajları. **Elle düzenleyeceğin tek dosya bu.**
- `data/products.json` → Katalog ürünleri (ad, kategori, görsel yolu). İlk 8 ürün ana sayfada görünür.
- `assets/img/products/` → Ürün fotoğrafları (600x750 WebP). `hero.webp` ana sayfanın sağındaki büyük fotoğraf (masaüstü).
- `index.html` ana sayfa, `catalogue.html` katalog, `privacy.html` gizlilik, `terms.html` şartlar, `404.html` bulunamadı sayfası.
- `wrangler.jsonc` → Cloudflare ayarı. `_headers` → güvenlik ve önbellek ayarları. `.assetsignore` → yayınlanmayacak dosyalar.

## config.js'yi GitHub'da düzenleme
1. GitHub'da depoyu aç → `config.js` dosyasına tıkla.
2. Sağ üstteki kalem simgesine (Edit) bas.
3. Tırnakların arasını doldur. Örnek: `WHATSAPP_NUMBER: "905321234567"` (başında + ve 0 yok, boşluk yok).
4. Yeşil **Commit changes** butonuna bas, açılan pencerede tekrar **Commit changes**.
5. Cloudflare siteyi 1-2 dakikada kendiliğinden günceller.

## Henüz eksik olanlar
- Google ID'leri boşken Google kodu hiç yüklenmez ve çerez banner'ı çıkmaz.
- Site adresi: https://kawisclothes.com (wrangler.jsonc içinde www ile birlikte tanımlı).
