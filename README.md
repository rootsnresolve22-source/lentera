# Lentera

Aplikasi belajar komputer untuk warga — dari nol sampai siap kerja kantoran.
created by **Mohammad Dimas Priambodo**

## Status
- Versi: **2.1.0 · Bonus — Bekerja Cerdas dengan AI**
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
Upload ulang seluruh isi folder ini ke repo GitHub `lentera` (file lama tertimpa), Vercel akan build otomatis. Penanda sukses: footer beranda menunjukkan **v2.1.0 · Bonus — Bekerja Cerdas dengan AI**.

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

## Baru di v1.0.0 — Ready to Launch
- **Modul 2 — Excel dasar** (10 langkah): 8 bab, 28 kuis, ujian praktek unggah .xlsx (6 rubrik: header, 5 baris data, rumus, perkalian, SUM), ujian teori 15 soal.
- **Modul 3 — PowerPoint dasar** (9 langkah): 7 bab, 28 kuis, ujian praktek unggah .pptx (5 rubrik: 3 slide, judul, butir, 30 kata), ujian teori 15 soal.
- **Modul 4 — Pelengkap kerja** (7 langkah): email, lampiran & Reply All, PDF, cetak-pindai, internet sehat & phishing, etika digital + Win+L. Ujian teori 15 soal.
- **Mesin praktek multi-format**: pembongkar .docx/.xlsx/.pptx di browser, penilaian per rubrik dengan saran perbaikan.
- **Gerbang berantai penuh**: M1 dibuka ujian M0 → M2 dibuka praktek Word → M3 dibuka praktek Excel → M4 dibuka praktek PowerPoint.
- Ilustrasi PowerPoint kini punya kotak judul/isi yang dapat diklik; rapot & panel admin mencakup M0–M4.

## Baru di v1.1.0 — Bukti & Arsip
- **Buku saku PDF semua modul**: M1 Word (27 hal), M2 Excel (22), M3 PowerPoint (20), M4 Pelengkap (17) — pipeline render yang sama dengan buku M0; tiap modul kini punya tombol "Unduh PDF". Latihan tertulis per bab + kunci jawaban di belakang.
- **Sertifikat Kelulusan**: tombol muncul di beranda saat seluruh M0–M4 tuntas — memuat nama, nilai ujian teori 5 modul, praktek 3 modul, Indeks Lentera + predikat, tanggal, dan tanda tangan pembimbing; cetak/simpan PDF dari browser.
- **Ekspor rekap (Excel/CSV)**: satu klik di Panel Admin — 20 kolom (identitas, langkah, ujian M0–M4, praktek M1–M3, level ketik, P/T/C/K, Indeks, predikat), siap dibuka di Excel.

## Baru di v1.2.0 — Lingkaran Mutu
- **Ekspor rekap kini file Excel asli (.xlsx)** — bukan CSV lagi: header oranye tebal, baris judul beku, lebar kolom pas, angka sebagai angka. Tidak tergantung pengaturan regional Excel. Penulis .xlsx mandiri (tanpa pustaka tambahan).
- **Ulangan Pintar per modul**: aplikasi kini mencatat soal mana yang dijawab salah (kuis bab & ujian teori). Kartu "Ulangan Pintar — N soal" muncul di halaman modul; soal yang dijawab benar terhapus dari daftar, sisanya muncul lagi sampai dikuasai. Tidak menyentuh nilai/percobaan resmi.
- **Analitik "Soal tersulit"** di Panel Admin: peringkat soal yang paling sering disalahjawab lintas peserta — bahan langsung untuk merevisi materi.

## Baru di v1.3.0 — Kelola & Kawal
- **Kelola akun dari Panel Admin** (backend baru `belajar-admin`, fungsi inti tak tersentuh): form "Tambah peserta baru" (nama + username + PIN 4–6 digit, langsung aktif), tombol **Reset PIN** dan **Nonaktifkan/Aktifkan akun** di rapot tiap peserta. PIN di-hash bcrypt seperti sistem login lama; admin tidak bisa menonaktifkan dirinya sendiri.
- **Mode ujian terkunci**: ujian teori berjalan satu layar penuh (fullscreen); pindah jendela/tab atau keluar dari layar penuh tercatat dan ditampilkan peringatan. Jumlah "keluar layar" tampil di rapot admin pada baris ujian — mengawal kejujuran tanpa menghukum otomatis. Ujian praktek sengaja TIDAK dikunci (peserta memang harus membuka Word/Excel/PowerPoint).

## Baru di v2.0.0 — Graduate (Fase D inti)
- **Modul 5 — Simulasi Satu Hari Kerja** (7 langkah, gerbang: lulus ujian M4): capstone berbentuk skenario pagi-sampai-sore sebagai staf admin — memilah email & phishing, **Mail Merge** (surat massal dari daftar Excel), **VLOOKUP & IF** (rekap dari daftar induk), slide laporan & ritme kerja, lalu pengiriman + arsip. 20 kuis situasional, ujian teori 15 soal, ujian praktek unggah **Laporan Harian (.docx, 6 rubrik)**. Buku saku PDF M5 (16+ hal) tersedia.
- Sertifikat, rapot, kolom panel, dan ekspor Excel kini mencakup enam modul (M0–M5). Peta jenjang di beranda ditandai tuntas.
- Bagian Fase D lain (multi-organisasi, jalur adaptif) sengaja menunggu kebutuhan nyata angkatan pertama — sesuai rancangan.

## Baru di v2.1.0 — Modul Bonus: Bekerja Cerdas dengan AI
- **Modul Bonus (ChatGPT & Gemini)** — terbuka untuk SIAPA SAJA sejak hari pertama, level apa pun, tanpa gerbang: 5 bab (kenalan & watak AI, resep prompt **PINTA**, AI di meja kerja, AI sebagai guru pribadi, etika & keamanan), 20 kuis, ujian akhir 15 soal (lulus 80), buku saku PDF 15 halaman.
- Bonus **tidak mempengaruhi** Indeks Lentera, jumlah langkah inti, maupun syarat Sertifikat — murni nilai tambah; namun nilainya tetap tampil di rapot per peserta, dan ikut sistem Ulangan Pintar serta analitik Soal Tersulit.
