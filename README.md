# Bilim do'sti: uyga vazifa platformasi

O'qituvchi uyga vazifani rasm, PDF yoki test qilib yuboradi. O'quvchi telefonidan topshiradi. Baholar va hisobot o'zi yig'iladi.

**Raqamli avlod qizlari** tanlovi uchun prototip, **Ta'lim** yo'nalishi.

![Bosh sahifa](docs/screenshots/landing.png)

## Imkoniyatlar

**O'qituvchi profili**
- Ro'yxatdan o'tishda ism-familiya, viloyat, tuman yoki shahar, maktab, biriktirilgan sinflar va fanlar kiritiladi.
- **Sinflar va o'quvchilar:** o'quvchilar bittalab yoki butun ro'yxat bilan qo'shiladi. Login va parol avtomatik yaratiladi, ularni CSV qilib yuklab olsa bo'ladi.
- **Uyga vazifa:** sinf va fan tanlanadi, vazifa rasm yoki PDF qilib yuboriladi yoki test tuziladi. Vazifa sinfdagi barcha o'quvchilarga boradi.
- **Kelgan javoblar:** javoblar o'quvchining ism-familiyasi bilan keladi. Baho (2–5) va izoh qo'yiladi.
- **Hisobotlar:** sinf va fan bo'yicha natijalar jadvali. Excel'da ochiladigan CSV fayl qilib yuklab olinadi.

**O'quvchi profili**
- **Vazifalar:** qaysi fandan vazifa kelgani ko'rinadi. Savol-javob turidagi vazifaga javob rasm yoki PDF qilib yuklanadi. Test shu yerda ishlanadi va ball darhol chiqadi.
- **Natijalarim:** baholar, test ballari va o'qituvchi izohlari.
- **AI yordamchi:** vazifani tushunishga yordam beradi, lekin javobni aytmaydi. Hozircha faqat claude.ai versiyasida ishlaydi.

| O'qituvchi: vazifa yuborish | O'quvchi: vazifalar |
| --- | --- |
| ![O'qituvchi](docs/screenshots/teacher-homework.png) | ![O'quvchi](docs/screenshots/student-tasks.png) |
| **O'qituvchi: kelgan javoblar** | **O'qituvchi: hisobot** |
| ![Javoblar](docs/screenshots/teacher-inbox.png) | ![Hisobot](docs/screenshots/teacher-report.png) |

## Sinab ko'rish

1. `index.html` faylini brauzerda oching yoki GitHub Pages manzilidan kiring.
2. **Kirish** sahifasida **Demo hisoblarni yaratish** tugmasini bosing.
3. Quyidagi hisoblar bilan kiring:

| Kim | Login | Parol |
| --- | --- | --- |
| O'qituvchi | `oqituvchi` | `demo123` |
| O'quvchi | `aziza` | `demo123` |
| O'quvchi | `jasur`, `madina` | `demo123` |

Bu versiyada (GitHub Pages yoki kompyuterdagi fayl) ma'lumotlar **faqat shu brauzerda** saqlanadi. Boshqa telefon yoki kompyuterda ular ko'rinmaydi. O'qituvchi va o'quvchini bitta qurilmada navbat bilan sinab ko'ring: "Chiqish" tugmasini bosib, boshqa login bilan kiring.

## GitHub Pages'ga joylash

1. [github.com](https://github.com) saytida hisob oching yoki kiring.
2. **New repository** tugmasini bosing. Nomi `bilim-dosti` bo'lsin, turi **Public**. Keyin **Create repository**.
3. **uploading an existing file** havolasini bosing. Arxivdan chiqarilgan papka ichidagi hamma narsani (`index.html`, `README.md`, `src`, `docs`, `build.py`) sudrab tashlang va **Commit changes** tugmasini bosing.
4. **Settings → Pages** bo'limiga kiring. **Source** uchun **Deploy from a branch**, **Branch** uchun `main` va `/ (root)` ni tanlab, **Save** tugmasini bosing.
5. 1–2 daqiqadan keyin sayt shu manzilda ochiladi: `https://<foydalanuvchi-nomi>.github.io/bilim-dosti/`

## Texnik tuzilma

- Butun platforma bitta `index.html` faylida ishlaydi: HTML, CSS va JavaScript, hech qanday kutubxonasiz.
- Manba fayllar `src/` papkasida: `styles.css` (dizayn), `ill.js` (chizilgan rasmlar), `app.js` (mantiq). O'zgartirgandan keyin `python3 build.py` buyrug'i ularni `index.html` ga yig'adi.
- Ma'lumotlar saqlanadigan joy ikkita:
  - **claude.ai versiyasi:** ma'lumotlar artefakt bazasida saqlanadi, fayllar alohida yuklanadi, AI yordamchi ishlaydi.
  - **Mustaqil versiya (GitHub Pages):** ma'lumotlar brauzerning IndexedDB xotirasida, demo rejimida saqlanadi.
- Parollar SHA-256 bilan, tasodifiy "tuz" (salt) qo'shib saqlanadi. Bu prototip uchun yetarli, lekin haqiqiy xavfsizlik emas.

## Cheklovlar va keyingi qadamlar

- **Ko'p qurilmada ishlash.** Haqiqiy maktabda ishlatish uchun umumiy server kerak: o'qituvchi bir qurilmadan, o'quvchilar o'z telefonlaridan kirishi uchun. Buning uchun Supabase yoki Firebase kabi tayyor xizmatlarning bepul rejasi yetarli.
- **Xavfsiz kirish.** Login va parol server tomonda tekshirilishi kerak.
- **AI yordamchi.** U AI xizmati kaliti saqlanadigan kichik server funksiyasi orqali ulanadi.
- **Qo'shimcha imkoniyatlar:** ota-onalar uchun hisobot, eslatmalar, rus va qoraqalpoq tillari.

## Jamoa

- _Ism Familiya_: g'oya va taqdimot
- _Ism Familiya_: dizayn va sinov
- _Ism Familiya_: tadqiqot va so'rovnoma
