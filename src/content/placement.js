// Tes penempatan — dikerjakan sekali oleh peserta baru (bukan admin).
// >= 10 benar: Jalur Cepat | 7-9: Pemula Berbekal | < 7 atau dilewati: Pemula.
// Tiap soal terpetakan ke bab (field `bab`). Untuk Pemula Berbekal, bab yang
// SEMUA soalnya dijawab benar otomatis berstatus "Lulus penempatan".
// Bab 7 (mengetik) dan Bab 8 (keamanan) sengaja tidak diteskan: selalu wajib.

export const PLACEMENT = {
  id: 'placement',
  title: 'Tes penempatan',
  intro:
    'Sebelum mulai, jawab 12 soal singkat ini supaya Lentera tahu titik berangkatmu. Tidak ada nilai gagal — semua jawaban hanya menentukan dari mana kamu mulai. Kalau kamu memang belum pernah memakai laptop sama sekali, ada tombol jujur di bawah: langsung mulai dari nol tanpa tes.',
  cepatMin: 10,
  berbekalMin: 7,
  questions: [
    {
      type: 'mc',
      q: 'Untuk menyalakan laptop, tombol power ditekan…',
      bab: 1,
      kunci: 'Ditekan sekali saja lalu lepas.',
      options: ['Sekali saja lalu lepas', 'Ditahan 10 detik', 'Berkali-kali sampai menyala', 'Sambil menutup layar'],
      answer: 0,
    },
    {
      type: 'mc',
      q: 'Cara mematikan laptop yang benar…',
      bab: 1,
      kunci: 'Start, Power, Shut down.',
      options: ['Tutup layar langsung', 'Start, Power, Shut down', 'Cabut charger', 'Tahan tombol power'],
      answer: 1,
    },
    {
      type: 'hotspot',
      q: 'Klik tombol untuk MENUTUP jendela ini.',
      bab: 4,
      kunci: 'Tombol X di pojok kanan atas jendela.',
      img: { kind: 'window', props: {} },
      accept: ['close'],
    },
    {
      type: 'mc',
      q: 'Klik kanan pada mouse gunanya untuk…',
      bab: 2,
      kunci: 'Memunculkan menu pilihan.',
      options: ['Membuka folder', 'Memunculkan menu pilihan', 'Menghapus file', 'Mematikan laptop'],
      answer: 1,
    },
    {
      type: 'mc',
      q: 'Untuk MEMBUKA folder, kamu harus…',
      bab: 2,
      kunci: 'Dobel klik kiri (dua kali cepat).',
      options: ['Klik kiri sekali', 'Dobel klik kiri', 'Klik kanan sekali', 'Tekan Spasi'],
      answer: 1,
    },
    {
      type: 'hotspot',
      q: 'Klik tombol untuk menghapus huruf di KIRI kursor.',
      bab: 3,
      kunci: 'Backspace, di pojok kanan atas keyboard.',
      img: { kind: 'keyboard', props: {} },
      accept: ['backspace'],
    },
    {
      type: 'mc',
      q: 'Mengetik huruf "B" besar di tengah kata: caranya…',
      bab: 3,
      kunci: 'Tahan Shift + B.',
      options: ['Tekan B dua kali', 'Tahan Shift + B', 'Nyalakan Caps Lock terus-menerus', 'Tekan Tab + B'],
      answer: 1,
    },
    {
      type: 'mc',
      q: 'Password salah terus padahal yakin benar. Tersangka utamanya…',
      bab: 3,
      kunci: 'Caps Lock yang menyala.',
      options: ['Caps Lock menyala', 'Mouse rusak', 'Layar kotor', 'WiFi lambat'],
      answer: 0,
    },
    {
      type: 'mc',
      q: 'Ctrl + C lalu Ctrl + V artinya…',
      bab: 5,
      kunci: 'Menyalin lalu menempelkan.',
      options: ['Menghapus lalu mengembalikan', 'Menyalin lalu menempelkan', 'Mengganti nama', 'Mematikan layar'],
      answer: 1,
    },
    {
      type: 'mc',
      q: 'File yang baru dihapus dengan tombol Delete akan…',
      bab: 5,
      kunci: 'Masuk Recycle Bin — masih bisa dikembalikan.',
      options: ['Hilang permanen seketika', 'Masuk Recycle Bin', 'Pindah ke Documents', 'Berubah jadi folder'],
      answer: 1,
    },
    {
      type: 'hotspot',
      q: 'Klik ikon WIFI pada layar ini.',
      bab: 6,
      kunci: 'Ikon pancaran sinyal di pojok kanan bawah, dekat jam.',
      img: { kind: 'taskbar', props: {} },
      accept: ['wifi'],
    },
    {
      type: 'mc',
      q: 'Pasangan tombol untuk berpindah cepat antar jendela…',
      bab: 4,
      kunci: 'Alt + Tab.',
      options: ['Ctrl + S', 'Alt + Tab', 'Shift + Enter', 'Win + L'],
      answer: 1,
    },
  ],
}

export function tentukanJalur(benar) {
  if (benar >= PLACEMENT.cepatMin) return 'cepat'
  if (benar >= PLACEMENT.berbekalMin) return 'berbekal'
  return 'pemula'
}

// Bab yang lulus penempatan: semua soal bertag bab tsb dijawab benar.
// Hanya berlaku untuk jalur 'berbekal' (jalur cepat sudah bebas semua bab).
export function babLulusPenempatan(detail) {
  const per = {}
  for (const d of detail) {
    if (d.bab == null) continue
    per[d.bab] = per[d.bab] ?? true
    if (!d.benar) per[d.bab] = false
  }
  return Object.keys(per)
    .filter((b) => per[b])
    .map((b) => 'm0.b' + b)
    .sort()
}
