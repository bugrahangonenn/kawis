# Kawis web sitesi — kısa kılavuz

## Hangi dosya ne işe yarar
- `config.js` → WhatsApp numarası, Telegram linki, e-posta, Google ID'leri, hazır WhatsApp mesajları. **Elle düzenleyeceğin tek dosya bu.**
- `data/products.json` → Katalog ürünleri (ad, kategori, görsel yolu). İlk 8 ürün ana sayfada görünür.
- `assets/img/` → Görseller. `placeholder-*.webp` dosyaları geçici, gerçek fotoğraflar gelince değişecek.
- `index.html` ana sayfa, `catalogue.html` katalog, `privacy.html` gizlilik, `terms.html` şartlar, `404.html` bulunamadı sayfası.
- `vercel.json` → Vercel ayarları (temiz adresler, güvenlik başlıkları, önbellek).

## config.js'yi GitHub'da düzenleme
1. GitHub'da depoyu aç → `config.js` dosyasına tıkla.
2. Sağ üstteki kalem simgesine (Edit) bas.
3. Tırnakların arasını doldur. Örnek: `WHATSAPP_NUMBER: "905321234567"` (başında + ve 0 yok, boşluk yok).
4. Yeşil **Commit changes** butonuna bas, açılan pencerede tekrar **Commit changes**.
5. Vercel siteyi yaklaşık 1 dakikada kendiliğinden günceller.

## Henüz eksik olanlar
- WhatsApp numarası boşken WhatsApp butonları gizlenir, yerine Telegram butonu çıkar.
- Google ID'leri boşken Google kodu hiç yüklenmez ve çerez banner'ı çıkmaz.
- Alan adı gelince sitedeki `https://kawis.vercel.app` adresi gerçek adresle değiştirilmeli (index, catalogue, privacy, terms, 404, sitemap.xml, robots.txt).
