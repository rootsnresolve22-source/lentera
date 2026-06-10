// MODUL 0 — Dasar Komputer
// Konten ditulis untuk orang yang belum pernah menyentuh laptop sama sekali.
// Satu sumber konten ini dipakai untuk: tampilan aplikasi, kuis, dan (nanti) PDF.

export const MODUL0 = {
  id: 'm0',
  title: 'Modul 0 — Dasar komputer',
  intro:
    'Selamat datang di langkah pertamamu. Di modul ini kamu akan kenalan dengan laptop dari nol: menyalakan, memakai mouse dan keyboard, mengatur file, sampai latihan mengetik. Tidak perlu takut salah — laptop tidak mudah rusak hanya karena dipencet-pencet. Pelan saja, yang penting dicoba langsung.',
  bab: [
    /* ============ BAB 1 ============ */
    {
      id: 'm0.b1',
      no: 1,
      title: 'Kenalan dengan laptop',
      desc: 'Bagian-bagian laptop, cara menyalakan, dan cara mematikan yang benar.',
      blocks: [
        {
          t: 'p',
          text: 'Laptop itu seperti tubuh: ada wajah (layar), ada tangan (keyboard dan touchpad), dan ada jantung (mesin di dalamnya). Kenali dulu bagian-bagiannya lewat gambar ini.',
        },
        { t: 'img', kind: 'laptop', props: { labels: true }, caption: 'Bagian-bagian penting laptop. Letak tombol power bisa berbeda-beda, biasanya di pojok kanan atas keyboard.' },
        { t: 'h', text: 'Cara menyalakan' },
        {
          t: 'steps',
          items: [
            'Buka layar laptop pelan-pelan dengan dua tangan.',
            'Kalau baterai lemah, pasang charger dulu ke colokan listrik dan ke laptop.',
            'Cari tombol power — bentuknya lingkaran dengan garis kecil di atasnya.',
            'Tekan SEKALI saja, lalu lepas. Tidak perlu ditahan.',
            'Tunggu 1–2 menit. Layar akan menyala dan masuk ke tampilan utama.',
          ],
        },
        {
          t: 'tip',
          text: 'Layar masih gelap padahal sudah ditekan? Tunggu 10 detik dulu. Kalau tetap gelap, periksa charger-nya — bisa jadi baterainya benar-benar habis.',
        },
        { t: 'h', text: 'Cara mematikan yang benar' },
        {
          t: 'p',
          text: 'Ini penting: mematikan laptop BUKAN dengan menutup layarnya, dan BUKAN dengan mencabut charger. Laptop harus "dipamiti" dulu lewat tombol Start supaya semua pekerjaannya dibereskan.',
        },
        {
          t: 'img',
          kind: 'taskbar',
          props: { menuOpen: true, highlight: ['start', 'power'] },
          caption: 'Klik tombol Start di pojok kiri bawah, lalu klik Power / Shut down di menu yang muncul.',
        },
        {
          t: 'steps',
          items: [
            'Klik tombol Start di pojok kiri bawah layar (logo empat kotak).',
            'Klik ikon Power (lingkaran dengan garis).',
            'Pilih Shut down.',
            'Tunggu sampai layar mati sendiri. Setelah itu baru boleh ditutup.',
          ],
        },
        {
          t: 'warn',
          text: 'Menekan tombol power lama-lama sampai laptop mati itu namanya "paksa mati". Hanya boleh dilakukan kalau laptop benar-benar macet (hang), karena bisa merusak file yang sedang terbuka.',
        },
        {
          t: 'try',
          text: 'Nyalakan laptop, tunggu sampai masuk ke layar utama, lalu matikan dengan benar lewat Start. Ulangi dua kali sampai hafal tanpa melihat panduan.',
        },
        {
          t: 'glossary',
          items: [
            { term: 'Power', def: 'Tombol untuk menyalakan laptop.' },
            { term: 'Charger', def: 'Alat untuk mengisi baterai laptop.' },
            { term: 'Shut down', def: 'Mematikan laptop dengan benar.' },
            { term: 'Restart', def: 'Mematikan lalu menyalakan lagi secara otomatis — sering jadi obat kalau laptop bertingkah aneh.' },
            { term: 'Hang / macet', def: 'Kondisi laptop diam tidak merespons apa pun.' },
          ],
        },
      ],
      quiz: [
        {
          type: 'hotspot',
          q: 'Klik tombol POWER pada gambar laptop ini.',
          img: { kind: 'laptop', props: { labels: false } },
          accept: ['power'],
          wrong: {
            touchpad: 'Itu touchpad — pengganti mouse. Cari lingkaran kecil dengan garis di pojok kanan atas keyboard.',
            keyboard: 'Itu keyboard — papan tombol untuk mengetik. Cari lingkaran kecil di pojok kanan atasnya.',
            screen: 'Itu layar. Tombol power ada di badan bawah laptop, pojok kanan atas keyboard.',
          },
          explain: 'Benar! Itu tombol power. Tekan sekali untuk menyalakan — jangan ditahan.',
        },
        {
          type: 'mc',
          q: 'Cara mematikan laptop yang BENAR adalah…',
          options: [
            'Langsung tutup layarnya',
            'Cabut charger dari colokan',
            'Klik Start, klik Power, pilih Shut down',
            'Tekan tombol power lama-lama sampai mati',
          ],
          answer: 2,
          wrong: {
            0: 'Menutup layar biasanya hanya membuat laptop "tidur", bukan mati — dan pekerjaan bisa kacau.',
            1: 'Mencabut charger tidak mematikan laptop kalau baterainya masih ada.',
            3: 'Itu "paksa mati" — hanya untuk keadaan darurat saat laptop macet.',
          },
          explain: 'Tepat. Start, Power, Shut down — itu cara pamit yang benar ke laptop.',
        },
        {
          type: 'mc',
          q: 'Untuk menyalakan laptop, tombol power ditekan…',
          options: ['Sekali saja, lalu lepas', 'Ditahan 10 detik', 'Dua kali cepat-cepat', 'Sambil menutup layar'],
          answer: 0,
          explain: 'Betul. Sekali tekan saja, lalu bersabar 1–2 menit sampai layar menyala penuh.',
        },
      ],
    },

    /* ============ BAB 2 ============ */
    {
      id: 'm0.b2',
      no: 2,
      title: 'Mouse dan touchpad',
      desc: 'Klik kiri, klik kanan, klik dobel, geser (drag), dan scroll.',
      blocks: [
        {
          t: 'p',
          text: 'Mouse adalah "tanganmu di dalam layar". Saat mouse digeser di meja, panah kecil di layar ikut bergerak — panah itu namanya kursor.',
        },
        { t: 'img', kind: 'mouse', props: { labels: true }, caption: 'Mouse punya tiga bagian penting: tombol kiri, tombol kanan, dan roda di tengah.' },
        { t: 'h', text: 'Lima jurus mouse' },
        {
          t: 'steps',
          items: [
            'Klik kiri sekali = MEMILIH sesuatu. Seperti menunjuk dengan jari.',
            'Klik kiri dua kali cepat (dobel klik) = MEMBUKA sesuatu, misalnya folder atau aplikasi.',
            'Klik kanan sekali = MEMUNCULKAN MENU pilihan. Seperti bertanya "ini bisa diapakan saja?"',
            'Tahan klik kiri sambil digeser (drag) = MEMINDAHKAN sesuatu, lalu lepas di tempat tujuan.',
            'Putar roda tengah = MENGGULUNG layar ke atas atau ke bawah (scroll).',
          ],
        },
        { t: 'h', text: 'Kalau pakai touchpad' },
        { t: 'img', kind: 'touchpad', props: {}, caption: 'Touchpad adalah pengganti mouse di laptop. Geser satu jari untuk menggerakkan kursor.' },
        {
          t: 'list',
          items: [
            'Ketuk satu kali dengan satu jari = klik kiri.',
            'Tekan area kanan bawah (atau ketuk dengan DUA jari) = klik kanan.',
            'Geser dua jari ke atas/bawah = scroll.',
          ],
        },
        {
          t: 'tip',
          text: 'Dobel klik harus cepat: tik-tik. Kalau terlalu lambat, nama file malah jadi biru siap diganti — tenang, tekan tombol Esc di pojok kiri atas keyboard, lalu coba lagi lebih cepat.',
        },
        {
          t: 'try',
          text: 'Gerakkan kursor ke empat pojok layar satu per satu. Lalu klik kanan di area kosong layar utama — lihat, muncul menu! Tekan Esc untuk menutupnya.',
        },
        {
          t: 'glossary',
          items: [
            { term: 'Kursor', def: 'Panah kecil di layar yang mengikuti gerakan mouse.' },
            { term: 'Klik', def: 'Menekan tombol mouse satu kali.' },
            { term: 'Dobel klik', def: 'Dua kali klik kiri dengan cepat — untuk membuka.' },
            { term: 'Drag', def: 'Menahan klik kiri sambil menggeser — untuk memindahkan.' },
            { term: 'Scroll', def: 'Menggulung layar ke atas atau ke bawah.' },
          ],
        },
      ],
      quiz: [
        {
          type: 'hotspot',
          q: 'Klik bagian mouse yang dipakai untuk MEMUNCULKAN MENU pilihan.',
          img: { kind: 'mouse', props: { labels: false } },
          accept: ['right'],
          wrong: {
            left: 'Itu tombol kiri — untuk memilih dan membuka. Menu pilihan muncul dari tombol satunya.',
            wheel: 'Itu roda scroll — untuk menggulung layar. Menu pilihan muncul dari tombol sebelah kanan.',
          },
          explain: 'Benar! Klik kanan memunculkan menu pilihan di hampir semua tempat.',
        },
        {
          type: 'mc',
          q: 'Untuk MEMBUKA sebuah folder, kamu harus…',
          options: ['Klik kanan satu kali', 'Klik kiri satu kali', 'Dobel klik kiri (dua kali cepat)', 'Putar roda mouse'],
          answer: 2,
          wrong: {
            1: 'Klik kiri sekali baru MEMILIH foldernya. Untuk membuka, butuh dua kali klik cepat.',
          },
          explain: 'Tepat. Sekali klik memilih, dobel klik membuka.',
        },
        {
          type: 'hotspot',
          q: 'Klik bagian mouse yang dipakai untuk SCROLL (menggulung layar).',
          img: { kind: 'mouse', props: { labels: false } },
          accept: ['wheel'],
          explain: 'Betul. Roda di tengah itu untuk scroll — putar ke bawah, layar turun.',
        },
        {
          type: 'mc',
          q: 'Di touchpad, menggeser DUA jari ke atas/bawah gunanya untuk…',
          options: ['Klik kanan', 'Scroll (menggulung layar)', 'Mematikan laptop', 'Memperbesar tulisan'],
          answer: 1,
          explain: 'Benar. Dua jari geser = scroll. Praktis sekali kalau sedang membaca halaman panjang.',
        },
      ],
    },

    /* ============ BAB 3 ============ */
    {
      id: 'm0.b3',
      no: 3,
      title: 'Peta keyboard',
      desc: 'Tombol-tombol penting: Enter, Spasi, Backspace, Shift, Caps Lock, dan Tab.',
      blocks: [
        {
          t: 'p',
          text: 'Keyboard kelihatannya penuh tombol, tapi tenang — yang penting dihafal hanya beberapa. Sisanya akan hafal sendiri seiring latihan.',
        },
        { t: 'img', kind: 'keyboard', props: {}, caption: 'Peta keyboard laptop. Perhatikan letak tombol-tombol besar di pinggir.' },
        { t: 'h', text: 'Enter — tombol "ya, lanjut"' },
        { t: 'img', kind: 'keyboard', props: { highlight: ['enter'] }, caption: 'Enter ada di sisi kanan, bentuknya besar.' },
        {
          t: 'p',
          text: 'Enter dipakai untuk menyetujui sesuatu, dan saat mengetik dipakai untuk pindah ke baris baru (ganti paragraf).',
        },
        { t: 'h', text: 'Spasi — jarak antar kata' },
        { t: 'img', kind: 'keyboard', props: { highlight: ['space'] }, caption: 'Tombol paling panjang di bawah.' },
        {
          t: 'warn',
          text: 'Spasi ditekan SEKALI saja antar kata. Menekan spasi berkali-kali untuk membuat jarak adalah kebiasaan yang nanti bikin tulisan berantakan di Word.',
        },
        { t: 'h', text: 'Backspace dan Delete — dua penghapus' },
        { t: 'img', kind: 'keyboard', props: { highlight: ['backspace', 'delete'] }, caption: 'Backspace di pojok kanan atas. (Tombol Delete biasanya di dekat situ juga.)' },
        {
          t: 'list',
          items: [
            'Backspace menghapus huruf di KIRI kursor — mundur sambil menghapus.',
            'Delete menghapus huruf di KANAN kursor — maju sambil menghapus.',
          ],
        },
        { t: 'h', text: 'Shift — huruf besar dan simbol atas' },
        { t: 'img', kind: 'keyboard', props: { highlight: ['lshift', 'rshift'] }, caption: 'Ada dua tombol Shift, kiri dan kanan. Fungsinya sama.' },
        {
          t: 'p',
          text: 'Cara membuat huruf besar: TAHAN Shift dengan satu jari, lalu tekan hurufnya, lalu lepas keduanya. Shift juga dipakai untuk simbol yang tertulis di bagian ATAS tombol — misalnya tanda seru (!) ada di atas angka 1, jadi tekan Shift + 1.',
        },
        { t: 'h', text: 'Caps Lock — kunci huruf besar' },
        { t: 'img', kind: 'keyboard', props: { highlight: ['caps'] }, caption: 'Caps Lock di sisi kiri. Sekali tekan: semua huruf jadi BESAR. Tekan lagi: kembali normal.' },
        {
          t: 'tip',
          text: 'Password salah terus padahal yakin benar? 9 dari 10 kasus penyebabnya Caps Lock tidak sengaja menyala. Cek lampunya, tekan sekali, coba lagi.',
        },
        { t: 'h', text: 'Tab — si lompat jauh' },
        { t: 'img', kind: 'keyboard', props: { highlight: ['tab'] }, caption: 'Tab ada di kiri atas, tepat di atas Caps Lock.' },
        {
          t: 'p',
          text: 'Tab membuat lompatan besar, bukan satu spasi. Kalau nanti di Word tulisanmu tiba-tiba "loncat jauh", hampir pasti yang tertekan adalah Tab — letaknya memang dekat dengan huruf Q dan A.',
        },
        {
          t: 'try',
          text: 'Lihat keyboard laptopmu sendiri. Tanpa menekan, tunjuk dengan jari: di mana Enter, Spasi, Backspace, Shift, Caps Lock, dan Tab. Ulangi sampai bisa menunjuk semuanya dalam 10 detik.',
        },
        {
          t: 'glossary',
          items: [
            { term: 'Enter', def: 'Menyetujui / pindah baris baru.' },
            { term: 'Spasi', def: 'Jarak antar kata — sekali tekan saja.' },
            { term: 'Backspace', def: 'Menghapus ke arah kiri.' },
            { term: 'Delete', def: 'Menghapus ke arah kanan.' },
            { term: 'Shift', def: 'Ditahan untuk huruf besar atau simbol atas.' },
            { term: 'Caps Lock', def: 'Mengunci huruf besar — sering jadi penyebab password salah.' },
            { term: 'Tab', def: 'Lompatan besar — penyebab tulisan loncat jauh.' },
            { term: 'Esc', def: 'Membatalkan / menutup menu yang muncul.' },
          ],
        },
      ],
      quiz: [
        {
          type: 'hotspot',
          q: 'Klik tombol untuk MENGHAPUS huruf di sebelah kiri kursor.',
          img: { kind: 'keyboard', props: {} },
          accept: ['backspace'],
          wrong: {
            enter: 'Itu Enter — untuk pindah baris. Penghapus ada di pojok kanan ATAS.',
            space: 'Itu Spasi — untuk jarak antar kata. Penghapus ada di pojok kanan atas.',
          },
          explain: 'Benar! Backspace menghapus mundur, satu huruf setiap tekan.',
        },
        {
          type: 'hotspot',
          q: 'Klik tombol yang DITAHAN untuk membuat huruf besar.',
          img: { kind: 'keyboard', props: {} },
          accept: ['lshift', 'rshift'],
          wrong: {
            caps: 'Caps Lock juga membuat huruf besar, tapi dia MENGUNCI terus-menerus. Yang ditahan sebentar untuk satu huruf besar adalah tombol di bawahnya.',
          },
          explain: 'Tepat! Tahan Shift + huruf = huruf besar. Lepas, kembali kecil.',
        },
        {
          type: 'mc',
          q: 'Kamu mau mengetik nama "Budi" dengan huruf B besar. Caranya…',
          options: [
            'Tekan Caps Lock, ketik semua, biarkan menyala',
            'Tahan Shift sambil tekan huruf B, lalu lepas dan lanjut ketik "udi"',
            'Tekan B dua kali',
            'Tekan Tab dulu sebelum huruf B',
          ],
          answer: 1,
          wrong: {
            0: 'Boleh saja, tapi kamu harus ingat mematikan Caps Lock lagi — kalau lupa, semua tulisan jadi BESAR.',
          },
          explain: 'Benar. Shift ditahan hanya untuk huruf yang mau dibesarkan.',
        },
        {
          type: 'mc',
          q: 'Antar kata, tombol Spasi ditekan berapa kali?',
          options: ['Satu kali', 'Dua kali biar lega', 'Tiga kali', 'Terserah selera'],
          answer: 0,
          explain: 'Satu kali saja. Ini kebiasaan kecil yang menyelamatkanmu dari tulisan berantakan di Word nanti.',
        },
        {
          type: 'hotspot',
          q: 'Klik tombol ENTER.',
          img: { kind: 'keyboard', props: {} },
          accept: ['enter'],
          explain: 'Betul. Enter — tombol "ya, lanjut" dan ganti baris.',
        },
      ],
    },

    /* ============ BAB 4 ============ */
    {
      id: 'm0.b4',
      no: 4,
      title: 'Jendela dan layar',
      desc: 'Membuka aplikasi, tiga tombol jendela, pindah antar jendela, dan belah layar.',
      blocks: [
        {
          t: 'p',
          text: 'Layar utama laptop namanya desktop — seperti meja kerja. Di bagian paling bawah ada taskbar — seperti rak alat yang selalu kelihatan.',
        },
        { t: 'img', kind: 'taskbar', props: {}, caption: 'Desktop (area luas) dan taskbar (bilah bawah): tombol Start di kiri, jam serta ikon WiFi dan volume di kanan.' },
        { t: 'h', text: 'Membuka aplikasi' },
        {
          t: 'steps',
          items: [
            'Klik tombol Start di pojok kiri bawah.',
            'Langsung ketik nama aplikasinya, misalnya: notepad.',
            'Aplikasi akan muncul di daftar — tekan Enter atau klik namanya.',
          ],
        },
        {
          t: 'tip',
          text: 'Trik "ketik langsung setelah Start" ini berlaku untuk SEMUA aplikasi: Word, Excel, Kalkulator, apa saja. Tidak perlu mencari-cari ikonnya.',
        },
        { t: 'h', text: 'Tiga tombol di pojok jendela' },
        { t: 'img', kind: 'window', props: {}, caption: 'Setiap aplikasi terbuka di dalam "jendela". Di pojok kanan atasnya selalu ada tiga tombol.' },
        {
          t: 'list',
          items: [
            'Garis datar ( – ) = minimize: menyembunyikan jendela sementara. Aplikasinya masih hidup di taskbar — klik ikonnya untuk memunculkan lagi.',
            'Kotak ( ▢ ) = maximize: membuat jendela memenuhi satu layar.',
            'Silang ( X ) = close: MENUTUP aplikasi. Kalau ada pekerjaan belum disimpan, aplikasi akan bertanya dulu.',
          ],
        },
        { t: 'h', text: 'Pindah antar jendela' },
        { t: 'keys', items: [{ combo: ['Alt', 'Tab'], label: 'Lompat cepat antar jendela yang terbuka' }] },
        {
          t: 'p',
          text: 'Tahan Alt, lalu tekan Tab — muncul deretan semua jendela. Tekan Tab lagi untuk berpindah pilihan, lepas Alt untuk masuk ke jendela itu.',
        },
        { t: 'h', text: 'Belah layar — jurus rahasia belajar di Lentera' },
        {
          t: 'keys',
          items: [
            { combo: ['Win', '◀'], label: 'Jendela menempel di SEBELAH KIRI layar' },
            { combo: ['Win', '▶'], label: 'Jendela menempel di SEBELAH KANAN layar' },
          ],
        },
        {
          t: 'p',
          text: 'Inilah cara belajarmu nanti: buka Lentera, tekan Win + panah kiri. Buka Word, tekan Win + panah kanan. Sekarang kamu bisa MEMBACA petunjuk di kiri sambil tanganmu LANGSUNG PRAKTIK di kanan. Tidak perlu bolak-balik.',
        },
        {
          t: 'try',
          text: 'Buka Notepad lewat Start. Coba minimize, munculkan lagi dari taskbar, maximize, lalu tekan Win + panah kiri dan Win + panah kanan. Terakhir, tutup dengan tombol X.',
        },
        {
          t: 'glossary',
          items: [
            { term: 'Desktop', def: 'Layar utama, seperti meja kerja.' },
            { term: 'Taskbar', def: 'Bilah di bawah layar berisi Start, aplikasi terbuka, dan jam.' },
            { term: 'Aplikasi', def: 'Program untuk mengerjakan sesuatu: Word untuk surat, Excel untuk tabel.' },
            { term: 'Jendela', def: 'Kotak tempat aplikasi tampil.' },
            { term: 'Minimize', def: 'Menyembunyikan jendela sementara.' },
            { term: 'Maximize', def: 'Membesarkan jendela satu layar penuh.' },
          ],
        },
      ],
      quiz: [
        {
          type: 'hotspot',
          q: 'Klik tombol untuk MENUTUP jendela ini.',
          img: { kind: 'window', props: {} },
          accept: ['close'],
          wrong: {
            min: 'Itu minimize — hanya menyembunyikan sementara. Tombol tutup ada di paling kanan.',
            max: 'Itu maximize — membesarkan jendela. Tombol tutup ada di paling kanan.',
          },
          explain: 'Benar! Tombol X menutup aplikasi.',
        },
        {
          type: 'hotspot',
          q: 'Klik tombol untuk MENYEMBUNYIKAN jendela sementara (tanpa menutup).',
          img: { kind: 'window', props: {} },
          accept: ['min'],
          wrong: {
            close: 'Itu malah MENUTUP aplikasinya. Yang menyembunyikan sementara adalah tombol bergambar garis datar.',
          },
          explain: 'Tepat. Minimize menyembunyikan; klik ikonnya di taskbar untuk memunculkan lagi.',
        },
        {
          type: 'mc',
          q: 'Untuk berpindah cepat antar jendela yang sedang terbuka, gunakan…',
          options: ['Ctrl + S', 'Alt + Tab', 'Shift + Enter', 'Tombol power'],
          answer: 1,
          explain: 'Benar. Tahan Alt, ketuk Tab — jurus wajib pekerja kantoran.',
        },
        {
          type: 'hotspot',
          q: 'Klik tombol START pada gambar layar ini.',
          img: { kind: 'taskbar', props: {} },
          accept: ['start'],
          wrong: {
            wifi: 'Itu ikon WiFi. Tombol Start ada di pojok kiri bawah, logo empat kotak.',
            clock: 'Itu jam. Tombol Start ada di pojok kiri bawah.',
          },
          explain: 'Betul. Dari Start kamu bisa membuka aplikasi apa pun dan mematikan laptop.',
        },
      ],
    },

    /* ============ BAB 5 ============ */
    {
      id: 'm0.b5',
      no: 5,
      title: 'File dan folder',
      desc: 'Membuat folder, mengganti nama, salin-tempel, menghapus, dan flashdisk.',
      blocks: [
        {
          t: 'p',
          text: 'Bayangkan begini: file itu selembar dokumen, folder itu map tempat menyimpannya, dan File Explorer itu lemari arsipnya. Semua hasil kerjamu nanti hidup di sini.',
        },
        { t: 'img', kind: 'explorer', props: {}, caption: 'File Explorer: daftar tempat di kiri (Documents, Downloads), isi folder di kanan. Folder berwarna kuning, file berwarna putih.' },
        { t: 'h', text: 'Membuat folder baru' },
        {
          t: 'steps',
          items: [
            'Buka File Explorer (ikon map kuning di taskbar), lalu klik Documents di sisi kiri.',
            'Klik kanan di area KOSONG sebelah kanan.',
            'Pilih New, lalu Folder.',
            'Langsung ketik nama foldernya, misalnya: LATIHAN.',
            'Tekan Enter. Selesai.',
          ],
        },
        { t: 'h', text: 'Mengganti nama (rename)' },
        {
          t: 'p',
          text: 'Klik kanan pada file atau folder, pilih Rename, ketik nama baru, tekan Enter. Jalan pintasnya: klik filenya sekali, lalu tekan tombol F2.',
        },
        { t: 'h', text: 'Salin-tempel — jurus paling sering dipakai sedunia' },
        {
          t: 'keys',
          items: [
            { combo: ['Ctrl', 'C'], label: 'Copy — menyalin (aslinya tetap ada)' },
            { combo: ['Ctrl', 'X'], label: 'Cut — memotong (untuk dipindahkan)' },
            { combo: ['Ctrl', 'V'], label: 'Paste — menempelkan di tempat tujuan' },
            { combo: ['Ctrl', 'Z'], label: 'Undo — membatalkan kesalahan terakhir. Tombol penyelamat!' },
          ],
        },
        {
          t: 'steps',
          items: [
            'Klik file yang mau disalin (sekali saja, sampai terpilih).',
            'Tekan Ctrl + C.',
            'Buka folder tujuan.',
            'Tekan Ctrl + V. File muncul di situ.',
          ],
        },
        {
          t: 'tip',
          text: 'Ctrl + C lalu Ctrl + V = MENYALIN (jadi dua). Ctrl + X lalu Ctrl + V = MEMINDAHKAN (tetap satu, hanya pindah rumah). Semua jurus ini juga bisa lewat klik kanan: Copy, Cut, Paste.',
        },
        { t: 'h', text: 'Menghapus dan Recycle Bin' },
        {
          t: 'p',
          text: 'Klik file, tekan tombol Delete — file masuk ke Recycle Bin (tempat sampah). Belum hilang permanen! Kalau menyesal: buka Recycle Bin, klik kanan filenya, pilih Restore — file kembali ke tempat asalnya.',
        },
        { t: 'h', text: 'Flashdisk' },
        {
          t: 'steps',
          items: [
            'Colokkan flashdisk ke port USB di sisi laptop.',
            'Buka File Explorer — flashdisk muncul di daftar kiri (di bawah This PC).',
            'Salin file ke sana dengan Ctrl + C dan Ctrl + V seperti biasa.',
            'Sebelum mencabut: klik kanan nama flashdisk, pilih Eject, baru cabut. Ini menjaga file tidak rusak.',
          ],
        },
        {
          t: 'try',
          text: 'Buat folder bernama LATIHAN LENTERA di Documents. Ganti namanya jadi LATIHAN SAYA pakai F2. Lalu hapus, buka Recycle Bin, dan kembalikan dengan Restore.',
        },
        {
          t: 'glossary',
          items: [
            { term: 'File', def: 'Satu dokumen / foto / data.' },
            { term: 'Folder', def: 'Map tempat menyimpan file.' },
            { term: 'File Explorer', def: 'Lemari arsip laptop — tempat melihat semua file.' },
            { term: 'Rename', def: 'Mengganti nama (jalan pintas: F2).' },
            { term: 'Recycle Bin', def: 'Tempat sampah — file terhapus masih bisa dikembalikan dari sini.' },
            { term: 'Eject', def: 'Pamit sebelum mencabut flashdisk.' },
          ],
        },
      ],
      quiz: [
        {
          type: 'mc',
          q: 'File yang baru saja dihapus akan masuk ke…',
          options: ['Documents', 'Recycle Bin', 'Hilang selamanya', 'Flashdisk'],
          answer: 1,
          wrong: {
            2: 'Belum! File terhapus masih mampir dulu ke tempat sampah dan bisa dikembalikan.',
          },
          explain: 'Benar. Recycle Bin adalah kesempatan keduamu — klik kanan, Restore.',
        },
        {
          type: 'mc',
          q: 'Ctrl + C lalu Ctrl + V artinya…',
          options: ['Menghapus file', 'Mengganti nama file', 'Menyalin lalu menempelkan', 'Mematikan laptop'],
          answer: 2,
          explain: 'Tepat. Copy lalu Paste — jurus yang akan kamu pakai ribuan kali.',
        },
        {
          type: 'mc',
          q: 'Urutan MEMBUAT folder baru yang benar adalah…',
          options: [
            'Klik kanan di area kosong, New, Folder, ketik nama, Enter',
            'Dobel klik di area kosong, ketik nama',
            'Tekan Ctrl + C di area kosong',
            'Klik tombol Start, ketik nama folder',
          ],
          answer: 0,
          explain: 'Benar. Klik kanan, New, Folder — lalu langsung beri nama.',
        },
        {
          type: 'mc',
          q: 'Jalan pintas untuk MENGGANTI NAMA file yang sedang dipilih adalah…',
          options: ['F2', 'F12', 'Ctrl + V', 'Esc'],
          answer: 0,
          explain: 'Betul. Klik filenya sekali, tekan F2, ketik nama baru, Enter.',
        },
        {
          type: 'mc',
          q: 'Kamu mau MEMINDAHKAN file (bukan menyalin). Pasangan tombolnya…',
          options: ['Ctrl + C lalu Ctrl + V', 'Ctrl + X lalu Ctrl + V', 'Ctrl + Z lalu Ctrl + Z', 'Delete lalu Enter'],
          answer: 1,
          wrong: {
            0: 'Itu MENYALIN — filenya jadi dua. Untuk memindahkan, huruf pertamanya X (cut).',
          },
          explain: 'Tepat. Cut (Ctrl+X) lalu Paste (Ctrl+V) — file pindah rumah.',
        },
      ],
    },

    /* ============ BAB 6 ============ */
    {
      id: 'm0.b6',
      no: 6,
      title: 'WiFi dan pengaturan cepat',
      desc: 'Menyambung WiFi, mengatur volume dan kecerahan layar.',
      blocks: [
        {
          t: 'p',
          text: 'Pojok kanan bawah layar (dekat jam) adalah "pusat kendali kecil": di sana ada ikon WiFi, volume suara, dan baterai.',
        },
        { t: 'img', kind: 'taskbar', props: { highlight: ['wifi'] }, caption: 'Ikon WiFi ada di pojok kanan bawah, di sebelah jam.' },
        { t: 'h', text: 'Menyambung ke WiFi' },
        { t: 'img', kind: 'wifi', props: {}, caption: 'Panel WiFi: pilih nama jaringan, masukkan password, klik Connect.' },
        {
          t: 'steps',
          items: [
            'Klik ikon WiFi di pojok kanan bawah.',
            'Muncul daftar nama WiFi di sekitarmu — klik nama WiFi-mu.',
            'Ketik password-nya dengan hati-hati. Awas Caps Lock!',
            'Centang "Connect automatically" supaya lain kali tersambung sendiri.',
            'Klik Connect. Kalau berhasil, ikon WiFi berubah penuh.',
          ],
        },
        {
          t: 'tip',
          text: 'Internet lambat bukan berarti laptop rusak — biasanya sinyal WiFi-nya yang lemah. Coba pindah lebih dekat ke sumber WiFi, atau pakai hotspot dari HP.',
        },
        { t: 'h', text: 'Volume dan kecerahan' },
        {
          t: 'list',
          items: [
            'Volume: klik ikon speaker di pojok kanan bawah, geser ke kanan untuk lebih keras.',
            'Kecerahan layar: di panel yang sama ada geseran bergambar matahari. Bisa juga lewat tombol keyboard bergambar matahari (kadang perlu sambil menahan tombol Fn).',
          ],
        },
        {
          t: 'try',
          text: 'Sambungkan laptop ke WiFi rumah atau hotspot HP-mu. Lalu kecilkan dan besarkan volume, dan ubah kecerahan layar.',
        },
        {
          t: 'glossary',
          items: [
            { term: 'WiFi', def: 'Sambungan internet tanpa kabel.' },
            { term: 'Password', def: 'Kata sandi — huruf besar dan kecil dibedakan!' },
            { term: 'Hotspot', def: 'Berbagi internet dari HP ke laptop.' },
            { term: 'Fn', def: 'Tombol bantu untuk fungsi tambahan seperti kecerahan.' },
          ],
        },
      ],
      quiz: [
        {
          type: 'hotspot',
          q: 'Klik ikon WIFI pada gambar layar ini.',
          img: { kind: 'taskbar', props: {} },
          accept: ['wifi'],
          wrong: {
            volume: 'Itu ikon volume (speaker). WiFi bentuknya seperti pancaran sinyal melengkung.',
            start: 'Itu tombol Start. Ikon WiFi ada di pojok KANAN bawah, dekat jam.',
            clock: 'Itu jam. Ikon WiFi ada tepat di sebelah kirinya, bentuk pancaran sinyal.',
          },
          explain: 'Benar! Dari ikon ini kamu menyambung dan memutus WiFi.',
        },
        {
          type: 'mc',
          q: 'Password WiFi ditolak terus padahal kamu yakin benar. Yang pertama dicek adalah…',
          options: ['Tombol Caps Lock — jangan-jangan menyala', 'Cabut baterai laptop', 'Tekan tombol power', 'Beli WiFi baru'],
          answer: 0,
          explain: 'Tepat. Password membedakan huruf besar-kecil; Caps Lock yang menyala adalah tersangka utamanya.',
        },
        {
          type: 'mc',
          q: 'Ikon WiFi, volume, dan jam berkumpul di…',
          options: ['Pojok kiri atas layar', 'Tengah layar', 'Pojok kanan bawah layar', 'Belakang laptop'],
          answer: 2,
          explain: 'Benar. Pojok kanan bawah — pusat kendali kecilmu.',
        },
      ],
    },

    /* ============ BAB 7 ============ */
    {
      id: 'm0.b7',
      no: 7,
      title: 'Mengetik 10 jari',
      desc: 'Posisi tangan yang benar dan persiapan latihan mengetik.',
      blocks: [
        {
          t: 'p',
          text: 'Inilah keterampilan yang paling terlihat di dunia kerja: mengetik cepat tanpa melihat keyboard. Staf admin yang mengetik lancar selalu lebih dihargai. Kabar baiknya — ini murni soal latihan, bukan bakat.',
        },
        { t: 'h', text: 'Baris rumah (home row)' },
        { t: 'img', kind: 'keyboard', props: { highlight: ['a', 's', 'd', 'f', 'j', 'k', 'l', 'semicolon'] }, caption: 'Baris rumah: A S D F untuk tangan kiri, J K L ; untuk tangan kanan.' },
        {
          t: 'p',
          text: 'Raba tombol F dan J di keyboardmu — ada tonjolan kecil! Itu sengaja dibuat supaya telunjuk kiri dan telunjuk kanan bisa menemukan "rumahnya" tanpa melihat. Jari-jari lain berbaris di sebelahnya, dan kedua jempol bertugas menekan Spasi.',
        },
        {
          t: 'list',
          items: [
            'Telunjuk kiri di F, telunjuk kanan di J. Jari lain berjajar di sebelahnya.',
            'Setiap habis menekan tombol lain, jari KEMBALI ke baris rumah.',
            'Mata melihat LAYAR, bukan keyboard. Awalnya sulit — itu normal.',
            'Mulai pelan. Kecepatan datang sendiri; yang dilatih duluan adalah KEBENARAN.',
          ],
        },
        {
          t: 'tip',
          text: 'Latihan 10 menit setiap hari jauh lebih ampuh daripada 2 jam sekali seminggu. Jadikan latihan mengetik di Lentera sebagai pemanasan setiap kali buka laptop.',
        },
        {
          t: 'try',
          text: 'Setelah kuis bab ini, buka "Latihan mengetik" di halaman Modul 0. Selesaikan minimal Level 1 (akurasi 90%) — itu syarat membuka ujian akhir.',
        },
        {
          t: 'glossary',
          items: [
            { term: 'Baris rumah', def: 'A S D F J K L ; — posisi awal semua jari.' },
            { term: 'Akurasi', def: 'Persentase ketikan yang benar.' },
            { term: 'KPM', def: 'Ketukan per menit — ukuran kecepatan mengetik.' },
          ],
        },
      ],
      quiz: [
        {
          type: 'hotspot',
          q: 'Klik tombol RUMAH untuk telunjuk tangan KANAN (yang ada tonjolan kecilnya).',
          img: { kind: 'keyboard', props: {} },
          accept: ['j'],
          wrong: {
            f: 'F memang bertonjolan juga, tapi itu rumah telunjuk KIRI. Telunjuk kanan rumahnya di huruf satunya.',
          },
          explain: 'Benar! J untuk telunjuk kanan, F untuk telunjuk kiri.',
        },
        {
          type: 'mc',
          q: 'Deretan "baris rumah" tempat jari-jari menunggu adalah…',
          options: ['Q W E R dan U I O P', 'A S D F dan J K L ;', 'Z X C V dan B N M', 'Deretan angka 1 2 3 4'],
          answer: 1,
          explain: 'Tepat. Dari baris tengah inilah semua jari berangkat dan pulang.',
        },
        {
          type: 'mc',
          q: 'Tombol Spasi ditekan menggunakan jari…',
          options: ['Kelingking', 'Telunjuk', 'Jempol', 'Jari manis'],
          answer: 2,
          explain: 'Benar. Dua jempol bertugas khusus untuk Spasi.',
        },
      ],
    },
  ],

  /* ============ UJIAN AKHIR MODUL 0 ============ */
  final: {
    id: 'm0.final',
    pass: 85,
    title: 'Ujian akhir Modul 0',
    intro:
      'Ujian ini berisi 16 soal dari semua bab. Setiap soal hanya boleh dijawab SATU KALI dan tidak bisa diulang di tengah jalan. Nilai lulus: 85 (boleh salah maksimal 2 soal). Kalau belum lulus, tenang — kamu bisa mengulang ujian dengan urutan soal yang diacak ulang.',
    questions: [
      {
        type: 'mc',
        q: 'Cara mematikan laptop yang benar adalah…',
        options: ['Tutup layar langsung', 'Start, Power, Shut down', 'Cabut charger', 'Tahan tombol power 10 detik'],
        answer: 1,
        explain: 'Start, Power, Shut down — laptop dipamiti dengan benar.',
      },
      {
        type: 'hotspot',
        q: 'Klik tombol POWER pada laptop ini.',
        img: { kind: 'laptop', props: { labels: false } },
        accept: ['power'],
        explain: 'Tombol power: lingkaran kecil dengan garis, di pojok kanan atas keyboard.',
      },
      {
        type: 'mc',
        q: 'Menekan tombol power lama-lama sampai laptop mati sebaiknya dilakukan…',
        options: ['Setiap hari supaya cepat', 'Hanya saat laptop benar-benar macet (hang)', 'Setiap selesai mengetik', 'Saat baterai penuh'],
        answer: 1,
        explain: 'Paksa mati hanya untuk darurat — bisa merusak file yang sedang terbuka.',
      },
      {
        type: 'mc',
        q: 'Untuk MEMBUKA folder, gunakan…',
        options: ['Klik kanan', 'Klik kiri sekali', 'Dobel klik kiri', 'Scroll'],
        answer: 2,
        explain: 'Sekali klik memilih, dobel klik membuka.',
      },
      {
        type: 'hotspot',
        q: 'Klik bagian mouse untuk memunculkan MENU pilihan.',
        img: { kind: 'mouse', props: { labels: false } },
        accept: ['right'],
        explain: 'Klik kanan = menu pilihan, di mana pun kamu berada.',
      },
      {
        type: 'mc',
        q: 'Menahan klik kiri sambil menggeser mouse disebut…',
        options: ['Scroll', 'Drag — untuk memindahkan', 'Dobel klik', 'Eject'],
        answer: 1,
        explain: 'Drag: tahan, geser, lepas di tempat tujuan.',
      },
      {
        type: 'hotspot',
        q: 'Klik tombol untuk menghapus huruf di KIRI kursor.',
        img: { kind: 'keyboard', props: {} },
        accept: ['backspace'],
        explain: 'Backspace — penghapus arah kiri, di pojok kanan atas.',
      },
      {
        type: 'mc',
        q: 'Password salah terus padahal yakin benar. Tersangka utamanya…',
        options: ['Tombol Tab', 'Caps Lock yang menyala', 'Tombol Enter', 'Mouse rusak'],
        answer: 1,
        explain: 'Caps Lock membuat semua huruf jadi besar — password pun jadi salah.',
      },
      {
        type: 'mc',
        q: 'Tulisanmu tiba-tiba "loncat jauh" padahal merasa menekan spasi. Kemungkinan besar yang tertekan…',
        options: ['Enter', 'Tab', 'Shift', 'Esc'],
        answer: 1,
        explain: 'Tab membuat lompatan besar, dan letaknya memang berdekatan dengan area mengetik.',
      },
      {
        type: 'mc',
        q: 'Untuk mengetik huruf "R" besar di tengah kata, caranya…',
        options: ['Tekan R dua kali', 'Nyalakan Caps Lock dan biarkan', 'Tahan Shift + R, lalu lepas', 'Tekan Tab + R'],
        answer: 2,
        explain: 'Shift ditahan hanya untuk huruf yang dibesarkan.',
      },
      {
        type: 'hotspot',
        q: 'Klik tombol untuk MENUTUP jendela.',
        img: { kind: 'window', props: {} },
        accept: ['close'],
        explain: 'Tombol X — paling kanan dari tiga tombol pojok.',
      },
      {
        type: 'mc',
        q: 'Pasangan tombol untuk berpindah cepat antar jendela…',
        options: ['Alt + Tab', 'Ctrl + C', 'Win + L', 'Shift + Esc'],
        answer: 0,
        explain: 'Alt + Tab — lompat antar jendela tanpa mouse.',
      },
      {
        type: 'mc',
        q: 'Supaya Lentera menempel di KIRI layar dan Word di KANAN (belah layar), gunakan…',
        options: ['Ctrl + panah', 'Win + panah kiri / kanan', 'Alt + Enter', 'F2'],
        answer: 1,
        explain: 'Win + panah — jurus belajar sambil praktik.',
      },
      {
        type: 'mc',
        q: 'Ctrl + Z gunanya untuk…',
        options: ['Menyalin', 'Menempel', 'Membatalkan kesalahan terakhir (undo)', 'Menghapus permanen'],
        answer: 2,
        explain: 'Undo — tombol penyelamat ketika tidak sengaja salah.',
      },
      {
        type: 'mc',
        q: 'File yang dihapus dengan tombol Delete akan…',
        options: ['Hilang permanen seketika', 'Masuk Recycle Bin dan masih bisa dikembalikan', 'Pindah ke flashdisk', 'Berubah jadi folder'],
        answer: 1,
        explain: 'Recycle Bin adalah kesempatan kedua: klik kanan, Restore.',
      },
      {
        type: 'mc',
        q: 'Sebelum mencabut flashdisk, sebaiknya…',
        options: ['Langsung cabut saja', 'Klik kanan flashdisk lalu pilih Eject', 'Matikan WiFi', 'Tekan Ctrl + V'],
        answer: 1,
        explain: 'Eject memastikan semua file selesai ditulis — flashdisk aman dicabut.',
      },
    ],
  },
}

// Item progres Modul 0 (untuk perhitungan persentase di dashboard):
// 7 bab + 1 drill + 1 ujian akhir = 9 langkah.
export const M0_ITEMS = [
  'm0.b1', 'm0.b2', 'm0.b3', 'm0.b4', 'm0.b5', 'm0.b6', 'm0.b7', 'm0.drill', 'm0.final',
]
