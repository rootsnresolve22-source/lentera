// Ulangan Pintar — kuis terarah dari soal-soal yang PERNAH dijawab salah
// (kuis bab maupun ujian teori). Soal yang kini dijawab benar dihapus dari
// daftar; sisanya muncul lagi sampai benar-benar dikuasai. Tidak menyentuh
// nilai atau hitungan percobaan resmi.
import { useState } from 'react'
import { Diagram } from './Illustrations'

export function daftarReview(entry, progressMap) {
  const cleared = progressMap[entry.module.id + '.review']?.meta?.cleared ?? {}
  const out = []
  const ambil = (itemId, soalArr, letak) => {
    for (const i of progressMap[itemId]?.meta?.wrongIdx ?? []) {
      if ((cleared[itemId] ?? []).includes(i)) continue
      if (soalArr[i]) out.push({ itemId, idx: i, q: soalArr[i], letak })
    }
  }
  for (const bab of entry.module.bab) ambil(bab.id, bab.quiz, `Bab ${bab.no}`)
  ambil(entry.module.final.id, entry.module.final.questions, 'Ujian akhir')
  return out
}

export default function SmartReview({ entry, progressMap, onSave, onBack }) {
  const [daftar] = useState(() => daftarReview(entry, progressMap))
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState(null) // { ok, i }
  const [benar, setBenar] = useState([])
  const [done, setDone] = useState(null) // { saved }

  if (daftar.length === 0) {
    return (
      <div className="lesson">
        <button className="btn-back" onClick={onBack}>← Kembali ke modul</button>
        <h1 className="lesson-title">Ulangan Pintar</h1>
        <p className="lesson-desc">Tidak ada soal yang perlu diulang — semua kesalahanmu sudah dikuasai. Nyala lenteramu terang.</p>
      </div>
    )
  }

  const it = daftar[idx]
  const last = idx === daftar.length - 1

  function jawabMc(i) {
    if (picked) return
    setPicked({ ok: i === it.q.answer, i })
    if (i === it.q.answer) setBenar((b) => [...b, it])
  }
  function jawabPart(partId) {
    if (picked) return
    const ok = it.q.accept.includes(partId)
    setPicked({ ok, i: -2 })
    if (ok) setBenar((b) => [...b, it])
  }

  async function lanjut() {
    if (!last) {
      setIdx(idx + 1)
      setPicked(null)
      return
    }
    const clearedLama = progressMap[entry.module.id + '.review']?.meta?.cleared ?? {}
    const clearedBaru = { ...clearedLama }
    for (const b of benar) {
      clearedBaru[b.itemId] = [...new Set([...(clearedBaru[b.itemId] ?? []), b.idx])]
    }
    const saved = await onSave(clearedBaru)
    setDone({ saved })
    window.scrollTo(0, 0)
  }

  if (done) {
    const n = benar.length
    const sisa = daftar.length - n
    return (
      <div className="lesson">
        <button className="btn-back" onClick={onBack}>← Kembali ke modul</button>
        <h1 className="lesson-title">Hasil Ulangan Pintar</h1>
        <div className={`quiz-fb ${sisa === 0 ? 'fb-ok' : 'fb-no'}`}>
          <strong>{n} dari {daftar.length} soal kini kamu kuasai.</strong>{' '}
          {sisa === 0
            ? 'Daftar kesalahanmu bersih — luar biasa.'
            : `${sisa} soal akan muncul lagi di Ulangan Pintar berikutnya. Buka kembali babnya, lalu coba lagi.`}
          {done.saved === false && ' (Catatan: hasil belum tersimpan ke server — periksa internet.)'}
        </div>
      </div>
    )
  }

  return (
    <div className="lesson">
      <button className="btn-back" onClick={onBack}>← Kembali ke modul</button>
      <p className="lesson-eyebrow">Ulangan Pintar · {entry.module.title} · dari soal yang pernah salah</p>
      <div className="quiz">
        <div className="quiz-dots" aria-label={`Soal ${idx + 1} dari ${daftar.length}`}>
          {daftar.map((_, i) => (
            <span key={i} className={`dot ${i < idx ? 'dot-done' : ''} ${i === idx ? 'dot-now' : ''}`} />
          ))}
        </div>
        <p className="quiz-q">
          <span className="quiz-no">Soal {idx + 1} · {it.letak}</span>
          {it.q.q}
        </p>

        {it.q.type === 'hotspot' && (
          <div className="quiz-figure quiz-clickable">
            <Diagram kind={it.q.img.kind} props={it.q.img.props} onPart={jawabPart} />
            {!picked && <p className="quiz-hint">Klik langsung pada gambar. Satu kali jawab.</p>}
          </div>
        )}

        {it.q.type === 'mc' && (
          <div className="quiz-options">
            {it.q.options.map((opt, i) => (
              <button
                key={i}
                className={`opt ${picked && i === it.q.answer ? 'opt-correct' : ''}`}
                onClick={() => jawabMc(i)}
                disabled={!!picked && i !== it.q.answer}
              >
                <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            ))}
          </div>
        )}

        {picked && (
          <div className={`quiz-fb ${picked.ok ? 'fb-ok' : 'fb-no'}`} role="status">
            {picked.ok ? 'Benar! ' : 'Masih belum tepat. '}
            {it.q.explain}
          </div>
        )}

        {picked && (
          <button className="btn-primary quiz-next" onClick={lanjut}>
            {last ? 'Selesai ulangan' : 'Soal berikutnya'}
          </button>
        )}
      </div>
    </div>
  )
}
