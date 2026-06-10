// Tes penempatan — dikerjakan sekali oleh peserta baru (bukan admin).
// >= 10 benar: Jalur Cepat | 7-9: Pemula Berbekal | < 7 atau dilewati: Pemula.

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
      options: ['Sekali saja lalu lepas', 'Ditahan 10 detik', 'Berkali-kali sampai menyala', 'Sambil menutup layar'],
      answer: 0,
    },
    {
      type: 'mc',
      q: 'Cara mematikan laptop yang benar…',
      options: ['Tutup layar langsung', 'Start, Power, Shut down', 'Cabut charger', 'Tahan tombol power'],
      answer: 1,
    },
    {
      type: 'hotspot',
      q: 'Klik tombol untuk MENUTUP jendela ini.',
      img: { kind: 'window', props: {} },
      accept: ['close'],
    },
    {
      type: 'mc',
      q: 'Klik kanan pada mouse gunanya untuk…',
      options: ['Membuka folder', 'Memunculkan menu pilihan', 'Menghapus file', 'Mematikan laptop'],
      answer: 1,
    },
    {
      type: 'mc',
      q: 'Untuk MEMBUKA folder, kamu harus…',
      options: ['Klik kiri sekali', 'Dobel klik kiri', 'Klik kanan sekali', 'Tekan Spasi'],
      answer: 1,
    },
    {
      type: 'hotspot',
      q: 'Klik tombol untuk menghapus huruf di KIRI kursor.',
      img: { kind: 'keyboard', props: {} },
      accept: ['backspace'],
    },
    {
      type: 'mc',
      q: 'Mengetik huruf "B" besar di tengah kata: caranya…',
      options: ['Tekan B dua kali', 'Tahan Shift + B', 'Nyalakan Caps Lock terus-menerus', 'Tekan Tab + B'],
      answer: 1,
    },
    {
      type: 'mc',
      q: 'Password salah terus padahal yakin benar. Tersangka utamanya…',
      options: ['Caps Lock menyala', 'Mouse rusak', 'Layar kotor', 'WiFi lambat'],
      answer: 0,
    },
    {
      type: 'mc',
      q: 'Ctrl + C lalu Ctrl + V artinya…',
      options: ['Menghapus lalu mengembalikan', 'Menyalin lalu menempelkan', 'Mengganti nama', 'Mematikan layar'],
      answer: 1,
    },
    {
      type: 'mc',
      q: 'File yang baru dihapus dengan tombol Delete akan…',
      options: ['Hilang permanen seketika', 'Masuk Recycle Bin', 'Pindah ke Documents', 'Berubah jadi folder'],
      answer: 1,
    },
    {
      type: 'hotspot',
      q: 'Klik ikon WIFI pada layar ini.',
      img: { kind: 'taskbar', props: {} },
      accept: ['wifi'],
    },
    {
      type: 'mc',
      q: 'Pasangan tombol untuk berpindah cepat antar jendela…',
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
