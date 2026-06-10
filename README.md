# Lentera

Aplikasi belajar komputer untuk warga — dari nol sampai siap kerja kantoran.
created by **Mohammad Dimas Priambodo**

## Status
- Versi: **0.3.0 · Revisi Modul 0**
- Produksi: Vercel (auto-build dari repo ini)
- Backend: Supabase Edge Function `belajar-api` **v3** (login, me, ping, progress, overview, logout) — arsipnya di `supabase/functions/belajar-api/index.ts`
- Database: tabel `belajar_*` (RLS deny-all; akses hanya lewat Edge Function) — arsip migrasi di `supabase/migrations/`

## Fitur v0.3.0
- Modul 0 diperkuat: 8 bab (termasuk bab baru "Aman dan sehat berkomputer"), 30 soal kuis, ujian akhir 18 soal lulus 85
- Tes penempatan untuk peserta baru → Jalur Cepat / Pemula Berbekal / Pemula (Jalur Cepat: bab bebas, wajib lulus ujian)
- Pencatatan aktivitas: login & denyut tiap 4 menit → kehadiran, durasi sesi, streak
- Metrik per langkah: ketepatan kuis, durasi, jumlah percobaan, statistik mengetik per level
- Dashboard peserta motivasional: jalur, kehadiran 14 hari, streak, pesan kontekstual
- Panel Admin (khusus admin): tabel semua peserta + Indeks Lentera (Penguasaan 50% · Ketelitian 20% · Kecepatan 15% · Kerajinan 15%)
- Rapot per peserta siap CETAK: identitas & jalur, rincian per langkah, kehadiran, catatan otomatis (termasuk pertumbuhan dari skor penempatan), area tanda tangan
- PWA: bisa di-install di HP/laptop

## Cara deploy
Upload ulang seluruh isi folder ini ke repo GitHub `lentera` (file lama tertimpa), Vercel akan build otomatis. Penanda sukses: footer beranda menunjukkan **v0.3.0 · Revisi Modul 0**.

## Keterbatasan yang diketahui (by design)
- Ganti PIN dilakukan oleh admin lewat SQL (fitur ganti PIN mandiri sengaja tidak dibuat)
- Versi PDF modul menyusul di bundle berikutnya, dibangkitkan dari sumber konten yang sama (`src/content/modul0.js`)
