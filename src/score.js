// Indeks Lentera — logika penilaian bersama (panel admin & rapot), LINTAS MODUL.
// Indeks (0-100) = Penguasaan 50% + Ketelitian 20% + Kecepatan 15% + Kerajinan 15%.
// Hanya modul yang TERBUKA bagi peserta yang ikut dihitung — adil untuk semua jalur.
// Komponen tanpa data tidak dihukum: bobotnya direnormalisasi.

import { MODULES, itemDone, moduleUnlocked, moduleDoneCount } from './content'

export const PATOKAN = { bab: 300, drill: 240, final: 900 }
const DRILL_NILAI = { 0: 0, 1: 70, 2: 85, 3: 100 }

export function jalurLabel(track) {
  return track === 'cepat' ? 'Jalur Cepat' : track === 'berbekal' ? 'Pemula Berbekal' : 'Pemula'
}

function patokanFor(itemId, track) {
  const base = itemId === 'm0.drill' ? PATOKAN.drill : itemId.endsWith('.final') ? PATOKAN.final : PATOKAN.bab
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

export function hitungIndeks({ progress, activity14, track }) {
  const map = Object.fromEntries((progress || []).map((p) => [p.item_id, p]))
  const open = MODULES.filter((e) => !e.bonus && moduleUnlocked(map, e)) // modul bonus tidak mempengaruhi Indeks

  // Nilai ujian per modul (semua modul, untuk tabel admin; null bila belum diuji)
  const finals = {}
  for (const e of MODULES) {
    const p = map[e.module.final.id]
    finals[e.module.id] = p?.score != null ? Number(p.score) : null
  }

  // Nilai ujian praktek per modul (bila modulnya punya)
  const praktiks = {}
  for (const e of MODULES) {
    if (!e.module.praktik) continue
    const p = map[e.module.praktik.id]
    praktiks[e.module.id] = p?.score != null ? Number(p.score) : null
  }

  const drill = map['m0.drill']
  const drillLevel = Math.min(3, Number(drill?.score ?? 0))

  // P — Penguasaan: ujian (rata modul terbuka yang sudah diuji), drill, persen bab modul terbuka
  const finalScores = open
    .flatMap((e) => [finals[e.module.id], e.module.praktik ? praktiks[e.module.id] : null])
    .filter((v) => v != null)
  const finalAvg = finalScores.length
    ? Math.round(finalScores.reduce((a, b) => a + b, 0) / finalScores.length)
    : 0
  const pctPerModul = open.map((e) => {
    const babIds = e.module.bab.map((b) => b.id)
    return (babIds.filter((id) => itemDone(map, id)).length / babIds.length) * 100
  })
  const pctBab = pctPerModul.reduce((a, b) => a + b, 0) / pctPerModul.length
  const P = Math.round(0.6 * finalAvg + 0.25 * DRILL_NILAI[drillLevel] + 0.15 * pctBab)

  // T — Ketelitian: benar-pertama-kali kuis bab (modul terbuka) + akurasi drill
  const tParts = []
  for (const e of open) {
    for (const b of e.module.bab) {
      if (itemDone(map, b.id)) {
        const v = ketepatanBab(map[b.id])
        if (v != null) tParts.push(v)
      }
    }
  }
  const dAcc = bestDrillAcc(drill?.meta)
  if (dAcc != null) tParts.push(dAcc)
  const T = tParts.length ? Math.round(tParts.reduce((a, b) => a + b, 0) / tParts.length) : null

  // C — Kecepatan relatif terhadap patokan per jenis item
  const cIds = []
  for (const e of open) {
    for (const b of e.module.bab) if (itemDone(map, b.id)) cIds.push(b.id)
    if (finals[e.module.id] != null) cIds.push(e.module.final.id)
  }
  if (drillLevel >= 1) cIds.push('m0.drill')
  const cParts = cIds
    .map((id) => nilaiKecepatan(Number(map[id]?.seconds), patokanFor(id, track)))
    .filter((v) => v != null)
  const C = cParts.length ? Math.round(cParts.reduce((a, b) => a + b, 0) / cParts.length) : null

  // K — Kerajinan: kehadiran 14 hari (target 8 hari aktif & 300 menit)
  const a = activity14 || {}
  const K = (a.daysActive ?? 0) > 0
    ? Math.round((0.6 * Math.min(1, (a.daysActive ?? 0) / 8) + 0.4 * Math.min(1, (a.minutes ?? 0) / 300)) * 100)
    : null

  const comps = [
    { v: P, w: 0.5 }, { v: T, w: 0.2 }, { v: C, w: 0.15 }, { v: K, w: 0.15 },
  ].filter((c) => c.v != null)
  const wSum = comps.reduce((s, c) => s + c.w, 0)
  const indeks = wSum ? Math.round(comps.reduce((s, c) => s + c.v * c.w, 0) / wSum) : 0
  const predikat =
    indeks >= 85 ? 'Cemerlang' : indeks >= 70 ? 'Terang' : indeks >= 55 ? 'Menyala' : 'Baru Menyala'

  const langkahSelesai = open.reduce((s, e) => s + moduleDoneCount(map, e), 0)
  const totalLangkah = open.reduce((s, e) => s + e.items.length, 0)

  return {
    P, T, C, K, indeks, predikat,
    finals, praktiks, finalBest: finals.m0, drillLevel,
    langkahSelesai, totalLangkah, openIds: open.map((e) => e.module.id), map,
  }
}

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
  if (s.openIds.includes('m1')) {
    out.push(
      s.finals.m1 != null
        ? `Modul Word: teori ${s.finals.m1}${s.praktiks.m1 != null ? `, praktek ${s.praktiks.m1}` : ', praktek belum'}.`
        : 'Modul Word sudah terbuka — arahkan untuk mulai Bab 1 Word.'
    )
  }
  const jam = Math.max(0.25, (activity14?.minutes ?? 0) / 60)
  if ((activity14?.minutes ?? 0) > 0) {
    out.push(`Efisiensi belajar: ${Math.round(s.P / jam)} poin penguasaan per jam layar (14 hari terakhir).`)
  }
  if (track !== 'cepat' && placementScore != null && s.finals.m0 != null) {
    const tumbuh = s.finals.m0 - placementScore
    out.push(
      tumbuh > 0
        ? `Pertumbuhan nyata: dari skor penempatan ${placementScore} menjadi nilai ujian Modul 0 ${s.finals.m0} (naik ${tumbuh} poin).`
        : `Skor penempatan ${placementScore}; nilai ujian Modul 0 saat ini ${s.finals.m0}.`
    )
  }
  if (track === 'cepat') {
    out.push('Jalur Cepat: bab Modul 0 boleh dilewati secara sah; kelulusan diverifikasi lewat ujian akhir dengan patokan waktu lebih ketat.')
  }
  if (!out.length) out.push('Belum cukup data untuk catatan — ajak peserta menyelesaikan minimal dua bab.')
  return out
}
