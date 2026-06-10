# PELAJARAN — Catatan kualitas kumulatif Lentera

Daftar ini lahir dari kesalahan nyata. Setiap bundle baru WAJIB diaudit terhadap seluruh butir di sini sebelum diserahkan.

## P1 — Daftar bernomor PDF menempel ke teks (v0.5.0, hal. 4 dst.)
Gejala: "1Buka layar...", nomor tanpa jarak ke kalimat.
Akar: kalibrasi `leftIndent`/`bulletDedent` ListFlowable reportlab tidak diverifikasi visual.
Aturan: setiap elemen tipografi PDF (daftar bernomor, bullet, tabel, kotak) wajib punya
satu halaman bukti render yang DIPERIKSA MATA sebelum rilis.

## P2 — Judul yatim di dasar halaman (v0.5.0, "Latihan tertulis Bab 2")
Gejala: judul bagian sendirian di akhir halaman, isinya pindah ke halaman berikut.
Akar: judul tidak diikat dengan isi pertamanya (tanpa KeepTogether / keepWithNext).
Aturan: SEMUA heading di dokumen cetak wajib `keepWithNext` atau dibungkus
KeepTogether bersama minimal elemen pertama di bawahnya.

## P3 — Inspeksi sampling itu jebakan
Akar proses dari P1 & P2: hanya 3 dari 31 halaman diperiksa visual.
Aturan: verifikasi visual = SENSUS JENIS, bukan sampel halaman — setiap JENIS elemen
(list bernomor, bullet, kotak, tabel, gambar+caption, heading di batas halaman, kunci
jawaban) minimal satu bukti render diperiksa; ditambah pemeriksaan setiap TRANSISI
bagian (akhir bab -> latihan -> bab berikut).

## P4 — Teks SVG bisa terpotong di tepi viewBox (v0.5.0, label "Tombol power")
Aturan: semua teks dekat tepi diagram pakai anchor yang menjauhi tepi (end/middle)
dan diberi margin; setiap diagram baru dirender dan diperiksa mata sebelum dipakai.

## P5 — Layar sempit adalah layar utama warga
Konten dilihat dari HP. Aturan: elemen UI dan diagram diuji nalar pada lebar ~360px;
tidak boleh ada teks/tombol yang berdesakan atau tumpang tindih pada lebar itu.

## P6 — Glyph di luar cp1252 jadi kotak hitam di PDF font standar
Aturan: pipeline PDF wajib lewat fungsi sanitasi `tx()` dengan tabel substitusi,
dan build wajib selesai dengan NOL peringatan glyph.

## P7 — Satu sumber kebenaran untuk konten dan gambar
Konten modul & diagram dirender dari sumber yang sama untuk aplikasi dan PDF.
Perbaikan bug visual dilakukan DI SUMBER, bukan di hasil.

## P8 — Skrip verifikasi harus hidup DI DALAM proyek (Bundle 3)
Gejala: skrip uji render di /tmp gagal dengan error React palsu ("Objects are not
valid as a React child") padahal kode benar — karena bundler menarik salinan React
yang berbeda dari milik proyek.
Aturan: semua skrip verifikasi/render diletakkan di `scripts/` dalam proyek dengan
import relatif, sehingga memakai dependensi yang sama persis dengan aplikasi.
