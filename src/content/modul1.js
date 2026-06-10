// MODUL 1 — Word Dasar
// Lanjutan Modul 0: dari kenal komputer menjadi bisa membuat dokumen sungguhan.
// Pola belajar: baca di Lentera (kiri layar), praktik langsung di Word (kanan layar).

export const MODUL1 = {
  id: 'm1',
  title: 'Modul 1 — Word dasar',
  intro:
    'Sekarang masuk ke aplikasi kantoran pertamamu: Microsoft Word — tempat lahirnya surat, laporan, dan dokumen resmi. Di modul ini kamu akan membuat dokumen sungguhan dari nol: mengetik, merapikan, menyimpan dengan benar, sampai mencetak. Pakai jurus belah layar: Lentera di kiri, Word di kanan, dan praktikkan SETIAP kotak "Coba sekarang".',
  bab: [
    /* ============ BAB 1 ============ */
    {
      id: 'm1.b1',
      no: 1,
      title: 'Kenalan dengan Word',
      desc: 'Membuka Word, mengenal bagian-bagian layarnya, dan membuat dokumen baru.',
      blocks: [
        {
          t: 'p',
          text: 'Word itu seperti mesin tik super: kertasnya tidak pernah habis, salah ketik tinggal dihapus, dan hasilnya selalu rapi. Hampir semua pekerjaan admin, PA, dan staf kantor menyentuh Word setiap hari.',
        },
        { t: 'h', text: 'Membuka Word' },
        {
          t: 'steps',
          items: [
            'Klik tombol Start di pojok kiri bawah.',
            'Langsung ketik: word.',
            'Tekan Enter. Word terbuka.',
            'Pilih "Blank document" (dokumen kosong) untuk mulai dari kertas putih.',
          ],
        },
        { t: 'h', text: 'Peta layar Word' },
        { t: 'img', kind: 'word', props: {}, caption: 'Jendela Word: pita perintah (ribbon) di atas, kertas putih di tengah, dan bilah status di bawah.' },
        {
          t: 'list',
          items: [
            'Ribbon (pita) — deretan tombol perintah di atas. Tab Home berisi tombol yang paling sering dipakai.',
            'Halaman — kertas putih di tengah, tempatmu mengetik.',
            'Kursor teks — garis hitam berkedip di halaman. Di situlah huruf akan muncul saat kamu mengetik.',
            'Bilah status — baris paling bawah: nomor halaman dan jumlah kata.',
            'Tombol disket di pojok kiri atas — tombol Simpan. Kenalan dulu, dipakai terus mulai Bab 3.',
          ],
        },
        {
          t: 'tip',
          text: 'Ribbon-mu terlihat berbeda sedikit dengan gambar? Wajar — tiap versi Word sedikit beda dandanan, tapi posisi dan bentuk tombolnya sama. Yang kamu pelajari di sini berlaku untuk semuanya.',
        },
        {
          t: 'try',
          text: 'Buka Word lewat Start, pilih Blank document. Temukan dengan matamu: ribbon, halaman, kursor berkedip, jumlah kata di bawah, dan tombol disket. Lalu tutup Word dengan tombol X (kalau ditanya mau menyimpan, pilih Don\u2019t Save — kita belum mengetik apa-apa).',
        },
        {
          t: 'glossary',
          items: [
            { term: 'Word', def: 'Aplikasi untuk membuat dokumen tulisan.' },
            { term: 'Dokumen', def: 'File hasil kerja Word — surat, laporan, daftar.' },
            { term: 'Ribbon', def: 'Pita tombol perintah di bagian atas.' },
            { term: 'Kursor teks', def: 'Garis berkedip penanda tempat huruf muncul.' },
          ],
        },
      ],
      quiz: [
        {
          type: 'hotspot',
          q: 'Klik bagian tempat kamu MENGETIK di jendela Word ini.',
          img: { kind: 'word', props: {} },
          accept: ['page'],
          wrong: {
            bold: 'Itu tombol B untuk menebalkan huruf. Tempat mengetik adalah kertas putih besar di tengah.',
            save: 'Itu tombol simpan. Tempat mengetik adalah kertas putih besar di tengah.',
          },
          explain: 'Benar! Halaman putih itu kertasmu — kursor berkedip menunggu ketikanmu.',
        },
        {
          type: 'mc',
          q: 'Cara paling cepat membuka Word adalah…',
          options: [
            'Klik Start, ketik "word", tekan Enter',
            'Klik kanan di desktop',
            'Tekan tombol power dua kali',
            'Buka Recycle Bin',
          ],
          answer: 0,
          explain: 'Jurus Start + ketik dari Modul 0 berlaku untuk semua aplikasi, termasuk Word.',
        },
        {
          type: 'mc',
          q: 'Deretan tombol perintah di bagian atas jendela Word disebut…',
          options: ['Taskbar', 'Ribbon', 'Desktop', 'Kursor'],
          answer: 1,
          wrong: { 0: 'Taskbar itu bilah di bawah LAYAR WINDOWS. Yang di atas jendela Word namanya lain.' },
          explain: 'Tepat — ribbon, pita tombol. Tab Home adalah rumah tombol-tombol favoritmu.',
        },
        {
          type: 'mc',
          q: 'Garis hitam kecil yang berkedip di halaman menandakan…',
          options: ['Word sedang rusak', 'Tempat huruf akan muncul saat mengetik', 'Baterai lemah', 'Dokumen sudah tersimpan'],
          answer: 1,
          explain: 'Itu kursor teks — penunjuk posisi ketikanmu.',
        },
      ],
    },

    /* ============ BAB 2 ============ */
    {
      id: 'm1.b2',
      no: 2,
      title: 'Mengetik dan memilih teks',
      desc: 'Memindahkan kursor, ganti paragraf, dan jurus memilih (blok) teks.',
      blocks: [
        {
          t: 'p',
          text: 'Di Word ada DUA penunjuk: panah putih milik mouse, dan kursor teks yang berkedip. Klik kiri di mana pun pada tulisan = kursor teks pindah ke situ. Huruf selalu muncul di posisi kursor teks, bukan di posisi panah.',
        },
        {
          t: 'list',
          items: [
            'Enter = paragraf baru (turun satu baris). Jangan tekan Enter di akhir setiap baris — Word turun sendiri saat baris penuh.',
            'Backspace = hapus ke kiri; Delete = hapus ke kanan (warisan Modul 0).',
            'Tombol panah = geser kursor teks tanpa menghapus, pas untuk membetulkan huruf di tengah kata.',
          ],
        },
        { t: 'h', text: 'Memilih (mem-blok) teks — kunci semua perapian' },
        {
          t: 'p',
          text: 'Sebelum teks bisa ditebalkan, dibesarkan, atau dirapikan, teks itu harus DIPILIH dulu sampai tersorot biru. Ini aturan emas Word: pilih dulu, baru perintah.',
        },
        {
          t: 'steps',
          items: [
            'Sedikit teks: klik di awal, TAHAN, geser sampai akhir, lepas (drag).',
            'Satu kata: dobel klik pada katanya.',
            'Satu paragraf: klik tiga kali cepat pada paragrafnya.',
            'SEMUA isi dokumen: tekan Ctrl + A.',
          ],
        },
        { t: 'keys', items: [{ combo: ['Ctrl', 'A'], label: 'Pilih semua isi dokumen' }] },
        {
          t: 'tip',
          text: 'Salah pilih atau sorotan birunya nyangkut? Klik sekali di area kosong mana pun — sorotan hilang, aman. Teks yang tersorot biru akan TERGANTI kalau kamu langsung mengetik, jadi hati-hati.',
        },
        {
          t: 'try',
          text: 'Buka Word baru, ketik 3 kalimat tentang dirimu (nama, kampung, cita-cita). Lalu latih: dobel klik satu kata, klik tiga kali pada paragraf, Ctrl + A, lalu klik area kosong untuk membatalkan.',
        },
        {
          t: 'glossary',
          items: [
            { term: 'Memilih / blok', def: 'Menyorot teks sampai biru sebelum diberi perintah.' },
            { term: 'Drag', def: 'Tahan klik kiri sambil geser.' },
            { term: 'Paragraf', def: 'Sekumpulan kalimat; dibuat dengan menekan Enter.' },
          ],
        },
      ],
      quiz: [
        {
          type: 'mc',
          q: 'Cara tercepat memilih SATU KATA adalah…',
          options: ['Klik sekali pada kata', 'Dobel klik pada kata', 'Tekan Enter', 'Klik kanan dua kali'],
          answer: 1,
          explain: 'Dobel klik = satu kata tersorot. Tiga kali klik = satu paragraf.',
        },
        {
          type: 'mc',
          q: 'Untuk memilih SEMUA isi dokumen sekaligus, tekan…',
          options: ['Ctrl + A', 'Ctrl + S', 'Alt + Tab', 'Ctrl + P'],
          answer: 0,
          explain: 'Ctrl + A = all. Berlaku juga di File Explorer, ingat Modul 0?',
        },
        {
          type: 'mc',
          q: 'Aturan emas sebelum menebalkan atau membesarkan teks…',
          options: [
            'Simpan dulu dokumennya',
            'Pilih (blok) dulu teksnya sampai tersorot biru',
            'Tutup dulu Word-nya',
            'Cetak dulu dokumennya',
          ],
          answer: 1,
          explain: 'Pilih dulu, baru perintah. Tanpa dipilih, Word tidak tahu teks mana yang kamu maksud.',
        },
        {
          type: 'mc',
          q: 'Tombol Enter di Word dipakai untuk…',
          options: ['Menghapus kata', 'Membuat paragraf baru', 'Menyimpan dokumen', 'Memilih semua teks'],
          answer: 1,
          explain: 'Enter = ganti paragraf. Di tengah paragraf, biarkan Word menurunkan baris sendiri.',
        },
      ],
    },

    /* ============ BAB 3 ============ */
    {
      id: 'm1.b3',
      no: 3,
      title: 'Menyimpan dan membuka — Ctrl+S jadi refleks',
      desc: 'Menyimpan dengan nama dan tempat yang benar, lalu membuka lagi kapan pun.',
      blocks: [
        {
          t: 'p',
          text: 'Inilah bab terpenting di seluruh modul. Dokumen yang belum disimpan bisa LENYAP saat listrik padam atau laptop macet — dan di kantor, kehilangan pekerjaan satu hari adalah bencana. Obatnya satu tombol: Ctrl + S, ditekan sesering mungkin.',
        },
        { t: 'keys', items: [{ combo: ['Ctrl', 'S'], label: 'Simpan — jadikan refleks: selesai satu paragraf, tekan' }] },
        { t: 'h', text: 'Menyimpan pertama kali (Save As)' },
        {
          t: 'p',
          text: 'Saat dokumen baru pertama kali disimpan, Word akan bertanya dua hal: mau dinamai apa, dan mau ditaruh di mana.',
        },
        { t: 'img', kind: 'savedialog', props: {}, caption: 'Jendela Save As: lokasi di atas, nama file di tengah, tombol Save di bawah.' },
        {
          t: 'steps',
          items: [
            'Tekan Ctrl + S. Jendela Save As muncul.',
            'Pilih lokasi: Documents, lalu folder LATIHAN (buatan kita di Modul 0).',
            'Di kotak File name, ketik nama yang JELAS, misalnya: Surat Izin Tidak Masuk.',
            'Klik tombol Save. Selesai — nama dokumen kini tampil di bilah judul atas.',
          ],
        },
        {
          t: 'warn',
          text: 'Nama file buruk: "Document1", "fix", "baru2". Tiga bulan lagi kamu sendiri tidak tahu isinya. Nama file baik menyebut ISI dan kalau perlu TANGGAL: "Surat Izin Dimas 12 Juni".',
        },
        { t: 'h', text: 'Save vs Save As — apa bedanya?' },
        {
          t: 'list',
          items: [
            'Save (Ctrl + S) = menyimpan PERUBAHAN ke file yang sama. Dipakai terus-menerus.',
            'Save As (menu File, Save As) = menyimpan sebagai file BARU — untuk membuat salinan dengan nama lain, sementara aslinya tetap utuh.',
          ],
        },
        { t: 'h', text: 'Membuka dokumen lama' },
        {
          t: 'list',
          items: [
            'Cara 1: buka File Explorer, masuk folder LATIHAN, dobel klik dokumennya.',
            'Cara 2: buka Word, di layar awal ada daftar Recent — klik nama dokumenmu.',
          ],
        },
        {
          t: 'try',
          text: 'Ketik 2 kalimat, lalu simpan ke Documents/LATIHAN dengan nama "Latihan Word [namamu]". Tutup Word. Buka lagi lewat File Explorer dengan dobel klik. Tambah satu kalimat, tekan Ctrl + S, perhatikan: tidak ada jendela yang muncul — perubahan langsung tersimpan diam-diam.',
        },
        {
          t: 'glossary',
          items: [
            { term: 'Save', def: 'Menyimpan perubahan ke file yang sama (Ctrl + S).' },
            { term: 'Save As', def: 'Menyimpan sebagai file baru dengan nama/tempat lain.' },
            { term: '.docx', def: 'Akhiran file dokumen Word.' },
            { term: 'Recent', def: 'Daftar dokumen yang baru-baru ini dibuka.' },
          ],
        },
      ],
      quiz: [
        {
          type: 'mc',
          q: 'Pasangan tombol untuk MENYIMPAN yang harus jadi refleks…',
          options: ['Ctrl + S', 'Ctrl + P', 'Alt + F4', 'Ctrl + A'],
          answer: 0,
          explain: 'Ctrl + S — selesai satu paragraf, tekan. Selesai satu bagian, tekan lagi.',
        },
        {
          type: 'hotspot',
          q: 'Klik kotak tempat MENGETIK NAMA FILE pada jendela ini.',
          img: { kind: 'savedialog', props: {} },
          accept: ['filename'],
          wrong: {
            savebtn: 'Itu tombol Save — diklik TERAKHIR. Nama file diketik dulu di kotak yang lebih panjang.',
            location: 'Itu lokasi penyimpanan. Kotak nama file ada di sebelah tulisan "File name".',
          },
          explain: 'Benar! Di situlah nama jelas dokumenmu diketik.',
        },
        {
          type: 'hotspot',
          q: 'Nama sudah diketik, lokasi sudah benar. Klik tombol untuk MENYELESAIKAN penyimpanan.',
          img: { kind: 'savedialog', props: {} },
          accept: ['savebtn'],
          explain: 'Tepat — Save. Dokumen kini hidup aman di folder pilihanmu.',
        },
        {
          type: 'mc',
          q: 'Nama file yang BAIK untuk surat izin sakit adalah…',
          options: ['Document1', 'fix banget', 'Surat Izin Sakit Andri 12 Juni', 'asdfgh'],
          answer: 2,
          explain: 'Nama menyebut isi (dan tanggal) — tiga bulan lagi tetap ketemu dalam 5 detik.',
        },
        {
          type: 'mc',
          q: 'Kamu mau membuat SALINAN dokumen dengan nama lain tanpa mengubah aslinya. Gunakan…',
          options: ['Save (Ctrl + S)', 'Save As', 'Delete', 'Ctrl + Z'],
          answer: 1,
          wrong: { 0: 'Ctrl + S menimpa file yang sama. Untuk salinan baru, ada perintah satunya.' },
          explain: 'Save As = lahir file baru, file lama tetap utuh.',
        },
      ],
    },

    /* ============ BAB 4 ============ */
    {
      id: 'm1.b4',
      no: 4,
      title: 'Mempercantik huruf',
      desc: 'Tebal, miring, garis bawah, ukuran, dan jenis huruf.',
      blocks: [
        {
          t: 'p',
          text: 'Tiga tombol sakti di tab Home: B (Bold/tebal), I (Italic/miring), U (Underline/garis bawah). Ingat aturan emas Bab 2: PILIH teksnya dulu, baru klik tombolnya.',
        },
        { t: 'img', kind: 'word', props: { highlight: ['bold', 'italic', 'underline'] }, caption: 'Tombol B, I, U di grup Font. Klik lagi tombol yang sama untuk membatalkan efeknya.' },
        {
          t: 'keys',
          items: [
            { combo: ['Ctrl', 'B'], label: 'Bold — menebalkan (judul, kata penting)' },
            { combo: ['Ctrl', 'I'], label: 'Italic — memiringkan (istilah asing)' },
            { combo: ['Ctrl', 'U'], label: 'Underline — menggarisbawahi' },
          ],
        },
        { t: 'h', text: 'Ukuran dan jenis huruf' },
        { t: 'img', kind: 'word', props: { highlight: ['fontsize'] }, caption: 'Kotak angka di grup Font = ukuran huruf. Kotak nama di sebelahnya = jenis huruf.' },
        {
          t: 'list',
          items: [
            'Ukuran standar dokumen kantor: 11 atau 12. Judul boleh 14\u201316.',
            'Jenis huruf aman dan resmi: Calibri, Arial, atau Times New Roman. Pilih satu, pakai konsisten.',
            'Cara mengubah: pilih teksnya, klik kotak ukuran/jenis huruf, pilih nilainya.',
          ],
        },
        {
          t: 'warn',
          text: 'Dokumen resmi bukan undangan ulang tahun: jangan campur banyak jenis huruf dan warna-warni. Satu jenis huruf, hitam, rapi — itu yang terlihat profesional.',
        },
        {
          t: 'try',
          text: 'Di dokumen latihanmu: tebalkan namamu (pilih, Ctrl + B), miringkan satu kata, garis bawahi satu kata, lalu besarkan baris pertama jadi ukuran 14. Jangan lupa Ctrl + S.',
        },
        {
          t: 'glossary',
          items: [
            { term: 'Bold', def: 'Huruf tebal — untuk penekanan.' },
            { term: 'Italic', def: 'Huruf miring.' },
            { term: 'Underline', def: 'Huruf bergaris bawah.' },
            { term: 'Font', def: 'Jenis huruf, misalnya Calibri atau Arial.' },
          ],
        },
      ],
      quiz: [
        {
          type: 'hotspot',
          q: 'Klik tombol untuk MENEBALKAN teks yang sudah dipilih.',
          img: { kind: 'word', props: {} },
          accept: ['bold'],
          wrong: {
            italic: 'Itu I — memiringkan. Tombol penebal adalah huruf B tegak gemuk di sebelah kirinya.',
            underline: 'Itu U — garis bawah. Tombol penebal adalah huruf B.',
          },
          explain: 'Benar! B untuk Bold. Jalan pintasnya Ctrl + B.',
        },
        {
          type: 'hotspot',
          q: 'Klik kotak untuk mengubah UKURAN huruf.',
          img: { kind: 'word', props: {} },
          accept: ['fontsize'],
          explain: 'Tepat — kotak angka itu ukuran huruf. 11\u201312 untuk isi, 14\u201316 untuk judul.',
        },
        {
          type: 'mc',
          q: 'Urutan yang BENAR untuk menebalkan kata "PENTING"…',
          options: [
            'Klik tombol B, lalu cari katanya',
            'Pilih kata "PENTING" sampai tersorot, lalu tekan Ctrl + B',
            'Hapus katanya, ketik ulang sambil teriak',
            'Tekan Ctrl + S dua kali',
          ],
          answer: 1,
          explain: 'Pilih dulu, baru perintah — aturan emas yang sama untuk semua perapian.',
        },
        {
          type: 'mc',
          q: 'Ukuran huruf yang wajar untuk ISI surat resmi…',
          options: ['8', '11 atau 12', '36', '72'],
          answer: 1,
          explain: '11\u201312 nyaman dibaca. Ukuran raksasa hanya untuk spanduk.',
        },
      ],
    },

    /* ============ BAB 5 ============ */
    {
      id: 'm1.b5',
      no: 5,
      title: 'Merapikan paragraf',
      desc: 'Rata kiri, tengah, kanan, justify, dan spasi antar baris.',
      blocks: [
        {
          t: 'p',
          text: 'Perataan menentukan wajah dokumen. Untuk paragraf, cukup letakkan kursor teks DI DALAM paragrafnya (tidak perlu memblok semua), lalu klik tombol perataan.',
        },
        { t: 'img', kind: 'word', props: { highlight: ['alignleft', 'aligncenter', 'alignright', 'justify'] }, caption: 'Empat tombol perataan di grup Paragraph: kiri, tengah, kanan, dan justify (rata kiri-kanan).' },
        {
          t: 'keys',
          items: [
            { combo: ['Ctrl', 'L'], label: 'Rata kiri — bawaan untuk isi tulisan' },
            { combo: ['Ctrl', 'E'], label: 'Rata tengah — untuk JUDUL' },
            { combo: ['Ctrl', 'R'], label: 'Rata kanan — untuk tanggal surat' },
            { combo: ['Ctrl', 'J'], label: 'Justify — isi surat resmi, rapi kiri dan kanan' },
          ],
        },
        {
          t: 'list',
          items: [
            'Judul surat: tengah (Ctrl + E), biasanya juga tebal.',
            'Tempat dan tanggal: kanan (Ctrl + R).',
            'Isi surat resmi: justify (Ctrl + J) — kedua tepinya lurus seperti koran.',
          ],
        },
        { t: 'h', text: 'Spasi antar baris' },
        {
          t: 'p',
          text: 'Tulisan terasa sesak? Longgarkan jaraknya: pilih paragrafnya, lalu di grup Paragraph klik tombol panah naik-turun (Line and Paragraph Spacing) dan pilih 1.5. Dokumen resmi Indonesia umumnya memakai spasi 1.5.',
        },
        {
          t: 'try',
          text: 'Di dokumen latihanmu: buat baris paling atas jadi judul — tebal, ukuran 14, rata tengah. Buat satu baris berisi "Batam, 12 Juni 2026" lalu rata-kanankan. Sisanya justify dengan spasi 1.5. Ctrl + S!',
        },
        {
          t: 'glossary',
          items: [
            { term: 'Perataan', def: 'Posisi paragraf: kiri, tengah, kanan, atau justify.' },
            { term: 'Justify', def: 'Rata kiri dan kanan sekaligus — gaya surat resmi.' },
            { term: 'Spasi baris', def: 'Jarak antar baris; 1.5 paling umum untuk dokumen resmi.' },
          ],
        },
      ],
      quiz: [
        {
          type: 'hotspot',
          q: 'Klik tombol untuk membuat judul berada di TENGAH halaman.',
          img: { kind: 'word', props: {} },
          accept: ['aligncenter'],
          wrong: {
            alignleft: 'Itu rata kiri. Perhatikan gambar garis di tombolnya — yang tengah, garisnya terpusat.',
            justify: 'Itu justify — semua garisnya sama panjang. Rata tengah garisnya terpusat.',
          },
          explain: 'Benar! Rata tengah, jalan pintasnya Ctrl + E.',
        },
        {
          type: 'mc',
          q: 'Isi surat resmi yang kedua tepinya lurus rapi memakai perataan…',
          options: ['Rata kiri', 'Rata kanan', 'Rata tengah', 'Justify (Ctrl + J)'],
          answer: 3,
          explain: 'Justify — gaya koran dan surat dinas.',
        },
        {
          type: 'mc',
          q: 'Tempat dan tanggal surat ("Batam, 12 Juni 2026") biasanya diletakkan…',
          options: ['Rata kanan (Ctrl + R)', 'Rata tengah', 'Di halaman dua', 'Di dalam tabel'],
          answer: 0,
          explain: 'Rata kanan — kebiasaan surat Indonesia.',
        },
        {
          type: 'mc',
          q: 'Untuk merapikan SATU paragraf, kamu cukup…',
          options: [
            'Memblok seluruh dokumen',
            'Meletakkan kursor teks di dalam paragraf itu, lalu klik tombol perataan',
            'Menghapus paragrafnya dulu',
            'Menutup dan membuka Word',
          ],
          answer: 1,
          explain: 'Perataan bekerja per paragraf — kursor di dalamnya sudah cukup.',
        },
      ],
    },

    /* ============ BAB 6 ============ */
    {
      id: 'm1.b6',
      no: 6,
      title: 'Daftar dan penomoran',
      desc: 'Bullets, numbering, dan membuat anak daftar dengan Tab.',
      blocks: [
        {
          t: 'p',
          text: 'Daftar membuat informasi gampang dibaca: daftar belanja, urutan kerja, susunan acara. Word punya dua jenis: bullets (titik) untuk daftar tanpa urutan, dan numbering (angka) untuk langkah yang berurutan.',
        },
        { t: 'img', kind: 'word', props: { highlight: ['bullets', 'numbering'] }, caption: 'Dua tombol daftar di grup Paragraph: bullets (titik-titik) dan numbering (1-2-3).' },
        {
          t: 'steps',
          items: [
            'Klik tombol numbering — angka 1. muncul otomatis.',
            'Ketik isi pertama, tekan Enter — angka 2. muncul sendiri.',
            'Terus sampai selesai.',
            'Mau berhenti dari daftar? Tekan Enter pada baris kosong (atau klik lagi tombolnya).',
          ],
        },
        { t: 'h', text: 'Anak daftar' },
        {
          t: 'keys',
          items: [
            { combo: ['Tab'], label: 'Masuk satu tingkat — jadi anak daftar (1 menjadi a)' },
            { combo: ['Shift', 'Tab'], label: 'Keluar satu tingkat — kembali ke daftar utama' },
          ],
        },
        {
          t: 'tip',
          text: 'Jangan membuat nomor dengan mengetik "1." manual — kalau ada isi yang disisipkan, kamu harus mengubah semua nomor sendiri. Tombol numbering mengurus penomoran ulang OTOMATIS.',
        },
        {
          t: 'try',
          text: 'Buat daftar bernomor "Rencana Besok" berisi 4 kegiatan. Jadikan kegiatan ke-2 punya 2 anak daftar (tekan Tab). Lalu buat daftar bullets "Barang Bawaan" berisi 3 barang. Ctrl + S.',
        },
        {
          t: 'glossary',
          items: [
            { term: 'Bullets', def: 'Daftar bertanda titik — urutan tidak penting.' },
            { term: 'Numbering', def: 'Daftar berangka — untuk langkah berurutan.' },
            { term: 'Anak daftar', def: 'Daftar di dalam daftar; dibuat dengan Tab.' },
          ],
        },
      ],
      quiz: [
        {
          type: 'hotspot',
          q: 'Klik tombol untuk membuat daftar BERNOMOR (1, 2, 3).',
          img: { kind: 'word', props: {} },
          accept: ['numbering'],
          wrong: {
            bullets: 'Itu bullets — daftar titik. Yang bernomor ada angka kecil 1-2-3 di ikonnya, tepat di sebelahnya.',
          },
          explain: 'Benar! Numbering — angkanya melanjutkan diri sendiri tiap kamu menekan Enter.',
        },
        {
          type: 'mc',
          q: 'Saat sedang membuat daftar, menekan Tab di awal baris akan…',
          options: [
            'Menghapus daftarnya',
            'Membuat baris itu jadi ANAK daftar (masuk satu tingkat)',
            'Menyimpan dokumen',
            'Mencetak dokumen',
          ],
          answer: 1,
          explain: 'Tab masuk, Shift + Tab keluar — naik-turun tingkat daftar.',
        },
        {
          type: 'mc',
          q: 'Daftar langkah memasak yang URUTANNYA penting sebaiknya memakai…',
          options: ['Bullets (titik)', 'Numbering (angka)', 'Huruf tebal semua', 'Spasi panjang'],
          answer: 1,
          explain: 'Urutan penting = angka. Kalau urutan bebas, bullets cukup.',
        },
      ],
    },

    /* ============ BAB 7 ============ */
    {
      id: 'm1.b7',
      no: 7,
      title: 'Salin, pindah, dan cari di dalam dokumen',
      desc: 'Ctrl+C/X/V/Z di dalam tulisan, plus Ctrl+F untuk menemukan kata.',
      blocks: [
        {
          t: 'p',
          text: 'Jurus salin-tempel dari Modul 0 bekerja juga di DALAM tulisan — dan inilah yang membuatmu cepat: memindah kalimat, menggandakan bagian, membatalkan kesalahan.',
        },
        {
          t: 'keys',
          items: [
            { combo: ['Ctrl', 'C'], label: 'Salin teks terpilih' },
            { combo: ['Ctrl', 'X'], label: 'Potong teks terpilih (untuk dipindah)' },
            { combo: ['Ctrl', 'V'], label: 'Tempel di posisi kursor teks' },
            { combo: ['Ctrl', 'Z'], label: 'Batalkan — bisa ditekan berkali-kali, mundur terus' },
            { combo: ['Ctrl', 'Y'], label: 'Maju lagi (kebalikan Ctrl + Z)' },
          ],
        },
        {
          t: 'steps',
          items: [
            'Memindah kalimat: pilih kalimatnya, Ctrl + X (kalimat hilang — tenang, dia di saku).',
            'Klik posisi tujuan — kursor teks pindah ke sana.',
            'Ctrl + V. Kalimat muncul di rumah barunya.',
          ],
        },
        { t: 'h', text: 'Mencari kata di dokumen panjang' },
        { t: 'keys', items: [{ combo: ['Ctrl', 'F'], label: 'Find — cari kata; semua yang cocok disorot kuning' }] },
        {
          t: 'p',
          text: 'Tekan Ctrl + F, ketik kata yang dicari, dan Word menyorot semuanya. Di dokumen 20 halaman, ini menghemat bermenit-menit mata melotot.',
        },
        {
          t: 'tip',
          text: 'Ctrl + Z adalah sahabat terbaik pemula: apa pun kekacauannya — teks terhapus, format berantakan, tempel salah tempat — tekan Ctrl + Z sampai keadaan pulih.',
        },
        {
          t: 'try',
          text: 'Di dokumen latihan: pindahkan kalimat terakhir menjadi kalimat pertama dengan Ctrl + X dan Ctrl + V. Lalu hapus satu paragraf, dan hidupkan lagi dengan Ctrl + Z. Terakhir, cari namamu dengan Ctrl + F.',
        },
        {
          t: 'glossary',
          items: [
            { term: 'Cut', def: 'Memotong untuk dipindahkan (Ctrl + X).' },
            { term: 'Undo', def: 'Membatalkan langkah terakhir (Ctrl + Z).' },
            { term: 'Find', def: 'Mencari kata di dokumen (Ctrl + F).' },
          ],
        },
      ],
      quiz: [
        {
          type: 'mc',
          q: 'Memindahkan satu kalimat ke tempat lain: pilih kalimat, lalu…',
          options: [
            'Ctrl + C, klik tujuan, Ctrl + V (kalimat jadi dua)',
            'Ctrl + X, klik tujuan, Ctrl + V',
            'Tekan Delete saja',
            'Ctrl + S berkali-kali',
          ],
          answer: 1,
          wrong: { 0: 'Itu MENYALIN — kalimatnya jadi dobel. Untuk memindah, potong dulu dengan X.' },
          explain: 'Cut lalu Paste — kalimat pindah rumah, tidak berganda.',
        },
        {
          type: 'mc',
          q: 'Tidak sengaja menghapus satu paragraf penting. Penyelamatnya…',
          options: ['Ctrl + Z', 'Ctrl + P', 'Tutup Word cepat-cepat', 'Tekan Enter banyak-banyak'],
          answer: 0,
          explain: 'Ctrl + Z — mundur selangkah demi selangkah sampai paragrafmu hidup lagi.',
        },
        {
          type: 'mc',
          q: 'Mencari kata "honorarium" di dokumen 15 halaman paling cepat dengan…',
          options: ['Membaca dari awal pelan-pelan', 'Ctrl + F lalu ketik katanya', 'Mencetak dulu semuanya', 'Ctrl + A'],
          answer: 1,
          explain: 'Ctrl + F — Word yang melotot, bukan matamu.',
        },
      ],
    },

    /* ============ BAB 8 ============ */
    {
      id: 'm1.b8',
      no: 8,
      title: 'Mencetak dan membuat PDF',
      desc: 'Ctrl+P, memeriksa pratinjau, mengatur halaman, dan menyimpan sebagai PDF.',
      blocks: [
        {
          t: 'p',
          text: 'Dokumen selesai dan tersimpan — saatnya jadi kertas. Satu kebiasaan pekerja teliti: SELALU lihat pratinjau dulu sebelum menekan Print, supaya tidak ada kertas dan tinta terbuang untuk hasil yang salah.',
        },
        { t: 'keys', items: [{ combo: ['Ctrl', 'P'], label: 'Buka layar cetak beserta pratinjaunya' }] },
        { t: 'img', kind: 'printdialog', props: {}, caption: 'Layar Print: tombol cetak, jumlah salinan, pilihan printer, dan pratinjau dokumen di kanan.' },
        {
          t: 'steps',
          items: [
            'Tekan Ctrl + P.',
            'Periksa PRATINJAU di sebelah kanan: judul di tengah? tanggal di kanan? tidak ada halaman kosong nyasar?',
            'Pastikan nama printer berstatus Ready.',
            'Atur Copies kalau butuh lebih dari satu lembar salinan.',
            'Klik tombol Print. Ambil hasilnya di printer.',
          ],
        },
        {
          t: 'tip',
          text: 'Mau mencetak halaman tertentu saja? Di bagian Settings, ganti "Print All Pages" menjadi Custom Print, lalu ketik nomornya — misal 2 (halaman dua saja) atau 1-3 (halaman satu sampai tiga).',
        },
        { t: 'h', text: 'Menyimpan sebagai PDF' },
        {
          t: 'p',
          text: 'PDF adalah bentuk "beku" dokumen: tampilannya tidak berubah di HP atau komputer mana pun, dan tidak bisa terketik-ketik tanpa sengaja — sempurna untuk dikirim lewat WA atau email. Caranya: di daftar printer pada layar Ctrl + P, pilih "Microsoft Print to PDF", klik Print, lalu beri nama dan simpan — persis seperti Save As.',
        },
        {
          t: 'warn',
          text: 'Mengirim dokumen penting ke orang lain? Kirim PDF-nya, bukan file Word-nya — supaya isinya tidak bergeser atau terubah di laptop orang.',
        },
        {
          t: 'try',
          text: 'Buka dokumen latihanmu, tekan Ctrl + P, periksa pratinjau baik-baik. Lalu ubah printer menjadi Microsoft Print to PDF dan simpan PDF-nya di folder LATIHAN dengan nama yang jelas.',
        },
        {
          t: 'glossary',
          items: [
            { term: 'Pratinjau', def: 'Tampilan hasil cetak sebelum benar-benar dicetak.' },
            { term: 'Copies', def: 'Jumlah salinan yang dicetak.' },
            { term: 'PDF', def: 'Dokumen beku yang tampil sama di semua perangkat.' },
          ],
        },
      ],
      quiz: [
        {
          type: 'mc',
          q: 'Pasangan tombol untuk membuka layar cetak…',
          options: ['Ctrl + P', 'Ctrl + S', 'Ctrl + F', 'Alt + Tab'],
          answer: 0,
          explain: 'Ctrl + P — print. Pratinjaunya langsung tampil di kanan.',
        },
        {
          type: 'hotspot',
          q: 'Pratinjau sudah diperiksa dan benar. Klik tombol untuk MULAI MENCETAK.',
          img: { kind: 'printdialog', props: {} },
          accept: ['printbtn'],
          wrong: {
            copies: 'Itu jumlah salinan. Tombol pencetaknya yang besar berwarna oranye.',
            printer: 'Itu pilihan printer. Tombol pencetaknya yang besar di atas.',
          },
          explain: 'Benar! Print — dan kertas pun keluar.',
        },
        {
          type: 'mc',
          q: 'Kebiasaan pekerja teliti SEBELUM menekan Print…',
          options: [
            'Memeriksa pratinjau di sebelah kanan',
            'Mematikan laptop dulu',
            'Menghapus dokumennya',
            'Menambah ukuran huruf jadi 72',
          ],
          answer: 0,
          explain: 'Pratinjau dulu — hemat kertas, hemat tinta, hemat malu.',
        },
        {
          type: 'mc',
          q: 'Dokumen penting mau dikirim lewat WA agar tidak berubah-ubah. Bentuk terbaiknya…',
          options: ['File Word (.docx) langsung', 'PDF', 'Foto layar laptop', 'Diketik ulang di WA'],
          answer: 1,
          explain: 'PDF — beku, rapi, dan terbuka sama persis di HP siapa pun.',
        },
      ],
    },
  ],

  /* ============ UJIAN AKHIR MODUL 1 ============ */
  final: {
    id: 'm1.final',
    pass: 85,
    title: 'Ujian akhir Modul 1',
    intro:
      'Ujian ini berisi 18 soal dari semua bab Word dasar. Setiap soal hanya boleh dijawab SATU KALI. Nilai lulus: 85 (boleh salah maksimal 2 soal). Belum lulus? Pelajari pembahasannya, buka lagi bab yang ragu, lalu ulangi — soal akan diacak ulang.',
    questions: [
      {
        type: 'mc',
        q: 'Cara paling cepat membuka Word…',
        options: ['Start, ketik "word", Enter', 'Klik kanan desktop', 'Buka Recycle Bin', 'Tekan F12'],
        answer: 0,
        explain: 'Jurus Start + ketik — untuk semua aplikasi.',
      },
      {
        type: 'hotspot',
        q: 'Klik tempat MENGETIK pada jendela Word ini.',
        img: { kind: 'word', props: {} },
        accept: ['page'],
        explain: 'Halaman putih di tengah — di situ kursor teks berkedip.',
      },
      {
        type: 'mc',
        q: 'Memilih SATU KATA paling cepat dengan…',
        options: ['Dobel klik pada katanya', 'Ctrl + P', 'Klik kanan tiga kali', 'Menekan Spasi'],
        answer: 0,
        explain: 'Dobel klik = satu kata; tiga klik = satu paragraf.',
      },
      {
        type: 'mc',
        q: 'Memilih SEMUA isi dokumen…',
        options: ['Ctrl + A', 'Ctrl + N', 'Alt + F4', 'Ctrl + B'],
        answer: 0,
        explain: 'Ctrl + A — all.',
      },
      {
        type: 'mc',
        q: 'Tombol yang harus jadi REFLEKS setiap selesai mengetik sebagian…',
        options: ['Ctrl + S', 'Ctrl + X', 'Esc', 'Ctrl + F'],
        answer: 0,
        explain: 'Ctrl + S — dokumen aman dari listrik padam.',
      },
      {
        type: 'hotspot',
        q: 'Klik kotak tempat mengetik NAMA FILE.',
        img: { kind: 'savedialog', props: {} },
        accept: ['filename'],
        explain: 'Kotak panjang di samping "File name".',
      },
      {
        type: 'mc',
        q: 'Membuat SALINAN dokumen dengan nama baru tanpa mengubah aslinya…',
        options: ['Save As', 'Save (Ctrl + S)', 'Delete', 'Ctrl + V'],
        answer: 0,
        explain: 'Save As = file baru; Save = menimpa yang sama.',
      },
      {
        type: 'mc',
        q: 'Nama file paling BAIK…',
        options: ['Surat Undangan RT 05 Agustus', 'Document2', 'finalbangetfix', 'zzz'],
        answer: 0,
        explain: 'Nama menyebut isi — mudah ditemukan kapan pun.',
      },
      {
        type: 'hotspot',
        q: 'Klik tombol untuk MENEBALKAN teks terpilih.',
        img: { kind: 'word', props: {} },
        accept: ['bold'],
        explain: 'B — Bold. Jalan pintas Ctrl + B.',
      },
      {
        type: 'mc',
        q: 'Sebelum memberi perintah tebal/miring/besar, teks harus…',
        options: ['Dipilih (diblok) dulu', 'Dihapus dulu', 'Dicetak dulu', 'Disimpan sebagai PDF'],
        answer: 0,
        explain: 'Pilih dulu, baru perintah — aturan emas Word.',
      },
      {
        type: 'mc',
        q: 'Judul surat di tengah halaman memakai…',
        options: ['Ctrl + E (rata tengah)', 'Ctrl + R', 'Ctrl + Z', 'Tab berkali-kali'],
        answer: 0,
        explain: 'Ctrl + E. Menekan Tab atau spasi berulang membuat dokumen rapuh.',
      },
      {
        type: 'hotspot',
        q: 'Klik tombol perataan JUSTIFY (rata kiri-kanan).',
        img: { kind: 'word', props: {} },
        accept: ['justify'],
        explain: 'Ikon dengan semua garis sama panjang — gaya surat resmi.',
      },
      {
        type: 'mc',
        q: 'Daftar LANGKAH yang urutannya penting memakai…',
        options: ['Numbering (angka)', 'Bullets (titik)', 'Huruf kapital semua', 'Garis bawah'],
        answer: 0,
        explain: 'Urutan penting = angka, dan Word menomori ulang otomatis.',
      },
      {
        type: 'mc',
        q: 'Saat membuat daftar, Tab di awal baris membuat…',
        options: ['Anak daftar (masuk satu tingkat)', 'Dokumen tercetak', 'Daftar terhapus', 'Huruf menebal'],
        answer: 0,
        explain: 'Tab masuk, Shift + Tab keluar.',
      },
      {
        type: 'mc',
        q: 'MEMINDAHKAN kalimat (bukan menggandakan): pilih kalimat lalu…',
        options: ['Ctrl + X, klik tujuan, Ctrl + V', 'Ctrl + C, Ctrl + V', 'Delete, lalu ketik ulang', 'Ctrl + B'],
        answer: 0,
        explain: 'Cut lalu Paste — pindah rumah, tidak berganda.',
      },
      {
        type: 'mc',
        q: 'Format berantakan setelah salah klik. Penyelamat pertama…',
        options: ['Ctrl + Z', 'Tutup tanpa menyimpan', 'Ctrl + P', 'Hapus semua'],
        answer: 0,
        explain: 'Ctrl + Z — mundur sampai pulih.',
      },
      {
        type: 'hotspot',
        q: 'Pratinjau sudah benar. Klik tombol untuk MENCETAK.',
        img: { kind: 'printdialog', props: {} },
        accept: ['printbtn'],
        explain: 'Tombol Print besar — setelah pratinjau diperiksa.',
      },
      {
        type: 'mc',
        q: 'Mengirim dokumen penting lewat WA agar tampil sama di semua HP…',
        options: ['Kirim sebagai PDF', 'Kirim file .docx', 'Kirim foto layar', 'Ketik ulang di chat'],
        answer: 0,
        explain: 'PDF — bentuk beku dokumen.',
      },
    ],
  },
}

// 8 bab + 1 ujian akhir = 9 langkah Modul 1 (tanpa drill — latihan mengetik milik Modul 0).
export const M1_ITEMS = [
  'm1.b1', 'm1.b2', 'm1.b3', 'm1.b4', 'm1.b5', 'm1.b6', 'm1.b7', 'm1.b8', 'm1.final',
]
