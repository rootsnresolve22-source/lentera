# Lentera

Aplikasi belajar komputer untuk warga — dari nol sampai siap kerja kantoran.
created by **Mohammad Dimas Priambodo**

## Status
- Versi: **0.2.0 · Bundle 1 — Modul 0**
- Produksi: Vercel (auto-build dari repo ini)
- Backend: Supabase Edge Function `belajar-api` **v2** (login, me, progress, logout) — arsipnya di `supabase/functions/belajar-api/index.ts`
- Database: tabel `belajar_*` (RLS deny-all; akses hanya lewat Edge Function) — arsip migrasi di `supabase/migrations/`

## Fitur v0.2.0
- Modul 0 lengkap: 7 bab bergambar (laptop, mouse/touchpad, keyboard, jendela, file & folder, WiFi, mengetik 10 jari)
- Kuis di tiap bab (27 soal): pilihan ganda + klik-gambar, salah boleh diulang dengan penjelasan
- Latihan mengetik 10 jari 3 level dengan papan ketik penunjuk (akurasi minimal 90%)
- Ujian akhir 16 soal, lulus 85, soal & opsi diacak, pembahasan untuk soal yang salah, boleh mengulang
- Progres tersimpan per akun di database; bab terkunci berurutan
- PWA: bisa di-install di HP/laptop

## Cara deploy
Upload ulang seluruh isi folder ini ke repo GitHub `lentera` (file lama tertimpa), Vercel akan build otomatis. Penanda sukses: footer beranda menunjukkan **v0.2.0 · Bundle 1 — Modul 0**.

## Keterbatasan yang diketahui (by design)
- Ganti PIN dilakukan oleh admin lewat SQL (fitur ganti PIN mandiri sengaja tidak dibuat)
- Versi PDF modul menyusul di bundle berikutnya, dibangkitkan dari sumber konten yang sama (`src/content/modul0.js`)
