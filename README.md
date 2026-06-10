# Lentera

Aplikasi belajar komputer untuk warga — dari nol sampai siap kerja kantoran.
created by **Mohammad Dimas Priambodo**

## Status
- Versi: **0.7.0 · D1 — Praktek, Kamus Pintasan, M1 Diperdalam**
- Produksi: Vercel (auto-build dari repo ini)
- Backend: Supabase Edge Function `belajar-api` **v3** (login, me, ping, progress, overview, logout) — arsipnya di `supabase/functions/belajar-api/index.ts`
- Database: tabel `belajar_*` (RLS deny-all; akses hanya lewat Edge Function) — arsip migrasi di `supabase/migrations/`

## Fitur v0.3.0
- Modul 0 diperkuat: 8 bab (termasuk bab baru "Aman dan sehat berkomputer"), 30 soal kuis, ujian akhir 18 soal lulus 85
- Tes penempatan transparan: skor & rincian salah + kunci jawaban + aturan ambang ditampilkan; tiap soal terpetakan ke bab
- Jalur Cepat: bab bebas, wajib lulus ujian. Pemula Berbekal: bab yang semua soalnya benar otomatis "Lulus penempatan" — mulai dari bab pertama yang belum dikuasai
- Pencatatan aktivitas: login & denyut tiap 4 menit → kehadiran, durasi sesi, streak
- Metrik per langkah: ketepatan kuis, durasi, jumlah percobaan, statistik mengetik per level
- Dashboard peserta motivasional: jalur, kehadiran 14 hari, streak, pesan kontekstual
- Panel Admin (khusus admin): tabel semua peserta + Indeks Lentera (Penguasaan 50% · Ketelitian 20% · Kecepatan 15% · Kerajinan 15%)
- Rapot per peserta siap CETAK: identitas & jalur, rincian per langkah, kehadiran, catatan otomatis (termasuk pertumbuhan dari skor penempatan), area tanda tangan
- Animasi native-feel: transisi layar, api lentera berkedip, guncangan jawaban salah, perayaan partikel saat lulus, skor berhitung naik — otomatis nonaktif bila pengguna menyetel "kurangi gerakan"
- Modul 1 — Word dasar: 8 bab bergambar (jendela Word, Save As, Print), 31 kuis, ujian akhir 18 soal lulus 85; terbuka setelah lulus ujian Modul 0
- Arsitektur multi-modul (`src/content/index.js`): menambah modul baru cukup satu entri registry — beranda, halaman modul, Indeks, dan rapot mengikuti otomatis
- Indeks Lentera lintas modul: hanya modul yang TERBUKA bagi peserta yang dihitung; ujian yang belum ditempuh tidak menghukum nilai
- Buku saku PDF Modul 0 (31 halaman, A4) di `public/Lentera-Modul-0.pdf` + tombol unduh di halaman Modul 0 — dibangkitkan dari sumber konten yang sama
- PWA: bisa di-install di HP/laptop

## Cara deploy
Upload ulang seluruh isi folder ini ke repo GitHub `lentera` (file lama tertimpa), Vercel akan build otomatis. Penanda sukses: footer beranda menunjukkan **v0.7.0 · D1 — Praktek, Kamus Pintasan, M1 Diperdalam**.

## Keterbatasan yang diketahui (by design)
- Ganti PIN dilakukan oleh admin lewat SQL (fitur ganti PIN mandiri sengaja tidak dibuat)
- Versi PDF modul menyusul di bundle berikutnya, dibangkitkan dari sumber konten yang sama (`src/content/modul0.js`)

## Regenerasi PDF (setelah konten berubah)
1. `npx esbuild scripts/render-svg.jsx --bundle --platform=node --format=cjs --jsx=automatic --outfile=/tmp/lentera-pdf/render.cjs && node /tmp/lentera-pdf/render.cjs`
2. Konversi SVG ke PNG (cairosvg, skala 2.2) lalu `python3 scripts/build-pdf.py`
3. Salin hasilnya ke `public/Lentera-Modul-0.pdf`

## Baru di v0.7.0 (Deliverable 1)
- **Ujian praktek Modul 1**: peserta membuat dokumen Word sungguhan (Surat Izin) lalu mengunggah file `.docx` — dinilai otomatis 7 butir rubrik (lulus 80), hasil per butir transparan dengan saran perbaikan. Berkas baru: `src/SubmissionTest.jsx`.
- **Kamus Pintasan**: glosarium hotkeys lengkap 8 kategori (~75 entri, bilingual Inggris-layar/Indonesia), bebas diakses semua peserta dari beranda, bisa dicari dan dicetak. Berkas baru: `src/HotkeysPage.jsx`, `src/content/hotkeys.js`.
- **Modul 1 diperdalam (v2)**: materi lebih panjang dan bilingual berpasangan (Print/Cetak, Save/Simpan), F12 dan Ctrl+W/Ctrl+H/Shift+F3 dibahas, 36 kuis; alur baru: bab → ujian praktek → ujian teori.
