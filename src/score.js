// Indeks Lentera — logika penilaian bersama (dipakai panel admin & rapot).
// Indeks (0-100) = Penguasaan 50% + Ketelitian 20% + Kecepatan 15% + Kerajinan 15%.
// Komponen tanpa data tidak dihukum: bobotnya direnormalisasi ke komponen yang ada.

import { MODUL0, M0_ITEMS } from './content/modul0'

// Patokan waktu wajar per item (detik). Nilai kecepatan 100 bila <= patokan,
// turun linear sampai 0 pada 3x patokan.
export const PATOKAN = { bab: 300, drill: 240, final: 900 }
const DRILL_NILAI = { 0: 0, 1: 70, 2: 85, 3: 100 }

export function jalurLabel(track) {
  return track === 'cepat' ? 'Jalur Cepat' : track === 'berbekal' ? 'Pemula Berbekal' : 'Pemula'
}

function patokanFor(itemId, track) {
  const base = itemId === 'm0.drill' ? PATOKAN.drill : itemId === 'm0.final' ? PATOKAN.final : PATOKAN.bab
  return track === 'cepat' ? base * 0.75 : base // jalur cepat dinilai lebih ketat
}

function nilaiKecepatan(seconds, patokan) {
  if (!seconds || seconds <= 0) return null
  if (seconds <= patokan) return 100
  const v = 100 * (1 - (seconds - patokan) / (2 * patokan))
  return Math.max(0, Math.round(v))
}

export function ketepatanBab(p) {
  const q = Number(p?.meta?.qcount ?? 0)
  const w = Number(p?.meta?.wrong ?? 0)
  if (!q) return null
  return Math.round((q / (q + w)) * 100)
}

function bestDrillAcc(meta) {
  if (!meta) return null
  const accs = [meta.l1?.acc, meta.l2?.acc, meta.l3?.acc].filter((a) => Number.isFinite(a))
  return accs.length ? Math.round(accs.reduce((a, b) => a + b, 0) / accs.length) : null
}

// Hitung semua sub-skor untuk satu peserta.
// progress: array baris belajar_progress; activity14: ringkasan 14 hari; track: jalur.
export function hitungIndeks({ progress, activity14, track }) {
  const map = Object.fromEntries((progress || []).map((p) => [p.item_id, p]))
  const babIds = MODUL0.bab.map((b) => b.id)
  const babDoneIds = babIds.filter((id) => map[id]?.status === 'selesai')
  const drill = map['m0.drill']
  const drillLevel = Math.min(3, Number(drill?.score ?? 0))
  const fin = map['m0.final']
  const finalBest = fin?.score != null ? Number(fin.score) : null

  // P — Penguasaan
  const pctBab = (babDoneIds.length / babIds.length) * 100
  const P = Math.round(0.6 * (finalBest ?? 0) + 0.25 * DRILL_NILAI[drillLevel] + 0.15 * pctBab)

  // T — Ketelitian (benar-pertama-kali di kuis bab + akurasi drill)
  const tParts = babDoneIds.map((id) => ketepatanBab(map[id])).filter((v) => v != null)
  const dAcc = bestDrillAcc(drill?.meta)
  if (dAcc != null) tParts.push(dAcc)
  const T = tParts.length ? Math.round(tParts.reduce((a, b) => a + b, 0) / tParts.length) : null

  // C — Kecepatan relatif
  const cParts = []
  for (const id of [...babDoneIds, drillLevel >= 1 ? 'm0.drill' : null, finalBest != null ? 'm0.final' : null].filter(Boolean)) {
    const v = nilaiKecepatan(Number(map[id]?.seconds), patokanFor(id, track))
    if (v != null) cParts.push(v)
  }
  const C = cParts.length ? Math.round(cParts.reduce((a, b) => a + b, 0) / cParts.length) : null

  // K — Kerajinan (kehadiran 14 hari: target 8 hari aktif & 300 menit)
  const a = activity14 || {}
  const adaAktivitas = (a.daysActive ?? 0) > 0
  const K = adaAktivitas
    ? Math.round((0.6 * Math.min(1, (a.daysActive ?? 0) / 8) + 0.4 * Math.min(1, (a.minutes ?? 0) / 300)) * 100)
    : null

  // Indeks: bobot direnormalisasi atas komponen yang punya data
  const comps = [
    { v: P, w: 0.5 },
    { v: T, w: 0.2 },
    { v: C, w: 0.15 },
    { v: K, w: 0.15 },
  ].filter((c) => c.v != null)
  const wSum = comps.reduce((s, c) => s + c.w, 0)
  const indeks = wSum ? Math.round(comps.reduce((s, c) => s + c.v * c.w, 0) / wSum) : 0

  const predikat =
    indeks >= 85 ? 'Cemerlang' : indeks >= 70 ? 'Terang' : indeks >= 55 ? 'Menyala' : 'Baru Menyala'

  const langkahSelesai = M0_ITEMS.filter((id) => {
    const p = map[id]
    if (!p) return false
    if (id === 'm0.drill') return Number(p.score ?? 0) >= 1
    if (id === 'm0.final') return Number(p.score ?? 0) >= MODUL0.final.pass
    return p.status === 'selesai'
  }).length

  return { P, T, C, K, indeks, predikat, finalBest, drillLevel, langkahSelesai, totalLangkah: M0_ITEMS.length, map }
}

// Catatan otomatis untuk rapot — membaca pola, bukan sekadar angka.
export function insightOtomatis(s, activity14, track, placementScore) {
  const out = []
  if (s.P >= 70 && (s.K ?? 0) < 50 && s.K != null) {
    out.push('Cepat menangkap materi meski kehadirannya belum rutin — potensi besar; dorong jadwal belajar yang lebih teratur.')
  }
  if ((s.K ?? 0) >= 70 && s.P < 55) {
    out.push('Sangat tekun hadir; hasil belum mengikuti — prioritaskan pendampingan langsung saat sesi praktik.')
  }
  if (s.T != null && s.T >= 90) out.push('Ketelitian tinggi: jarang salah pada percobaan pertama.')
  if (s.T != null && s.T < 70) out.push('Sering menebak sebelum yakin — latih membaca soal sampai tuntas.')
  if (s.C != null && s.C >= 90) out.push('Tempo kerja cepat dan tetap akurat.')
  const jam = Math.max(0.25, (activity14?.minutes ?? 0) / 60)
  if ((activity14?.minutes ?? 0) > 0) {
    out.push(`Efisiensi belajar: ${Math.round(s.P / jam)} poin penguasaan per jam layar (14 hari terakhir).`)
  }
  if (track !== 'cepat' && placementScore != null && s.finalBest != null) {
    const tumbuh = s.finalBest - placementScore
    out.push(
      tumbuh > 0
        ? `Pertumbuhan nyata: dari skor penempatan ${placementScore} menjadi nilai ujian ${s.finalBest} (naik ${tumbuh} poin).`
        : `Skor penempatan ${placementScore}; nilai ujian saat ini ${s.finalBest}.`
    )
  }
  if (track === 'cepat') {
    out.push('Jalur Cepat: bab boleh dilewati secara sah; kelulusan diverifikasi lewat ujian akhir dengan patokan waktu lebih ketat.')
  }
  if (!out.length) out.push('Belum cukup data untuk catatan — ajak peserta menyelesaikan minimal dua bab.')
  return out
}
