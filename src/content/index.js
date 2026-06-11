// Registry modul Lentera — satu pintu untuk semua modul belajar.
// Menambah modul baru = tambah satu entri di MODULES; Dashboard, halaman modul,
// skor, dan rapot mengikuti otomatis.

import { MODUL0, M0_ITEMS } from './modul0'
import { MODUL1, M1_ITEMS } from './modul1'
import { MODUL2, M2_ITEMS } from './modul2'
import { MODUL3, M3_ITEMS } from './modul3'
import { MODUL4, M4_ITEMS } from './modul4'
import { MODUL5, M5_ITEMS } from './modul5'
import { MODULBONUS, MB_ITEMS } from './modulBonus'

export const MODULES = [
  {
    module: MODUL0,
    items: M0_ITEMS,
    hasDrill: true,
    hasPdf: true,
    gate: null,
    dashDesc: 'Laptop, mouse, keyboard, file & folder, WiFi, keamanan, mengetik 10 jari.',
  },
  {
    module: MODUL1,
    items: M1_ITEMS,
    hasDrill: false,
    hasPdf: true,
    gate: {
      finalItem: 'm0.final',
      label: 'Lulus ujian Modul 0 dulu',
      desc: 'Terbuka setelah ujian akhir Modul 0 lulus (nilai 85).',
    },
    dashDesc: 'Mengetik dokumen, Ctrl+S jadi refleks, merapikan, daftar, mencetak & PDF.',
  },
  {
    module: MODUL2,
    items: M2_ITEMS,
    hasDrill: false,
    hasPdf: true,
    gate: {
      finalItem: 'm1.praktik',
      label: 'Lulus ujian praktek Modul 1 dulu',
      desc: 'Terbuka setelah ujian praktek Word (Modul 1) lulus.',
    },
    dashDesc: 'Tabel, rumus, dan rekap angka — kalkulator raksasa kantor.',
  },
  {
    module: MODUL3,
    items: M3_ITEMS,
    hasDrill: false,
    hasPdf: true,
    gate: {
      finalItem: 'm2.praktik',
      label: 'Lulus ujian praktek Modul 2 dulu',
      desc: 'Terbuka setelah ujian praktek Excel (Modul 2) lulus.',
    },
    dashDesc: 'Slide presentasi: tampil meyakinkan di depan orang.',
  },
  {
    module: MODUL4,
    items: M4_ITEMS,
    hasDrill: false,
    hasPdf: true,
    gate: {
      finalItem: 'm3.praktik',
      label: 'Lulus ujian praktek Modul 3 dulu',
      desc: 'Terbuka setelah ujian praktek PowerPoint (Modul 3) lulus.',
    },
    dashDesc: 'Email, PDF, cetak-pindai, internet sehat — siap kerja penuh.',
  },
  {
    module: MODUL5,
    items: M5_ITEMS,
    hasDrill: false,
    hasPdf: true,
    gate: {
      finalItem: 'm4.final',
      label: 'Lulus ujian Modul 4 dulu',
      desc: 'Terbuka setelah ujian akhir Modul 4 lulus (nilai 85).',
    },
    dashDesc: 'Capstone: jalani satu hari kerja penuh — mail merge & VLOOKUP termasuk.',
  },
  {
    module: MODULBONUS,
    items: MB_ITEMS,
    hasDrill: false,
    hasPdf: true,
    gate: null,
    bonus: true,
    dashDesc: 'Terbuka untuk semua sejak hari pertama: ChatGPT & Gemini — prompt, kerja, belajar, etika.',
  },
]

export const getEntry = (moduleId) => MODULES.find((e) => e.module.id === moduleId)

export const findBab = (babId) => {
  for (const e of MODULES) {
    const bab = e.module.bab.find((b) => b.id === babId)
    if (bab) return { entry: e, bab }
  }
  return null
}

// Satu definisi "langkah selesai" untuk seluruh aplikasi.
export function itemDone(progressMap, id) {
  const p = progressMap[id]
  if (!p) return false
  if (id === 'm0.drill') return Number(p.score ?? 0) >= 1
  if (id.endsWith('.final')) {
    const e = getEntry(id.split('.')[0])
    return Number(p.score ?? 0) >= (e?.module.final.pass ?? 85)
  }
  if (id.endsWith('.praktik')) {
    const e = getEntry(id.split('.')[0])
    return Number(p.score ?? 0) >= (e?.module.praktik?.pass ?? 85)
  }
  return p.status === 'selesai'
}

export const moduleUnlocked = (progressMap, entry) =>
  !entry.gate || itemDone(progressMap, entry.gate.finalItem)

export const moduleDoneCount = (progressMap, entry) =>
  entry.items.filter((id) => itemDone(progressMap, id)).length

export const moduleComplete = (progressMap, entry) =>
  moduleDoneCount(progressMap, entry) === entry.items.length

// Modul yang sedang aktif dikerjakan: terbuka & belum tuntas (untuk kartu beranda).
export function activeEntry(progressMap) {
  for (const e of MODULES) {
    if (moduleUnlocked(progressMap, e) && !moduleComplete(progressMap, e)) return e
  }
  return MODULES[MODULES.length - 1]
}
