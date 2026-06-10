import { useState } from 'react'
import { Diagram } from './Illustrations'
import Lamp from './Lamp'
import { PLACEMENT, tentukanJalur } from './content/placement'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const JALUR_TEXT = {
  cepat: {
    judul: 'Jalur Cepat',
    isi: 'Kamu sudah cukup akrab dengan komputer. Semua bab Modul 0 terbuka bebas — boleh dibaca cepat atau dilewati. Yang wajib: latihan mengetik minimal Level 1 dan LULUS ujian akhir (nilai 85) sebagai bukti.',
  },
  berbekal: {
    judul: 'Pemula Berbekal',
    isi: 'Kamu sudah punya bekal dasar — bagus! Tetap mulai dari Bab 1 secara berurutan supaya fondasinya kokoh, tapi kamu akan melaju lebih cepat dari yang lain.',
  },
  pemula: {
    judul: 'Pemula',
    isi: 'Titik berangkat terbaik: dari nol, pelan, dan pasti. Semua orang hebat pernah mulai dari sini. Bab 1 sudah menunggumu.',
  },
}

export default function Placement({ onDone }) {
  // screen: 'intro' | 'soal' | 'hasil'
  const [screen, setScreen] = useState('intro')
  const [items, setItems] = useState([])
  const [idx, setIdx] = useState(0)
  const [benar, setBenar] = useState(0)
  const [hasil, setHasil] = useState(null)
  const [saveWarn, setSaveWarn] = useState(false)

  function start() {
    setItems(
      shuffle(PLACEMENT.questions).map((q) =>
        q.type === 'mc'
          ? { ...q, display: shuffle(q.options.map((label, i) => ({ label, correct: i === q.answer }))) }
          : q
      )
    )
    setIdx(0)
    setBenar(0)
    setScreen('soal')
    window.scrollTo(0, 0)
  }

  async function selesai(totalBenar, dilewati) {
    const total = PLACEMENT.questions.length
    const score = dilewati ? 0 : Math.round((totalBenar / total) * 100)
    const track = dilewati ? 'pemula' : tentukanJalur(totalBenar)
    const ok = await onDone({
      score,
      meta: { track, correct: dilewati ? 0 : totalBenar, total, skipped: !!dilewati },
    })
    setSaveWarn(!ok)
    setHasil({ track, totalBenar: dilewati ? null : totalBenar, total })
    setScreen('hasil')
    window.scrollTo(0, 0)
  }

  function jawab(correct) {
    const b = benar + (correct ? 1 : 0)
    if (idx + 1 < items.length) {
      setBenar(b)
      setIdx(idx + 1)
    } else {
      setBenar(b)
      selesai(b, false)
    }
  }

  if (screen === 'intro') {
    return (
      <div className="shell">
        <div className="lesson">
          <div className="place-head">
            <Lamp size={48} />
          </div>
          <p className="lesson-eyebrow">Langkah pertama</p>
          <h1 className="lesson-title">{PLACEMENT.title}</h1>
          <p className="lesson-desc">{PLACEMENT.intro}</p>
          <div className="lesson-cta">
            <button className="btn-primary" onClick={start}>Mulai tes (12 soal singkat)</button>
            <button className="btn-ghost btn-wide" style={{ marginTop: 10 }} onClick={() => selesai(0, true)}>
              Saya belum pernah pakai laptop — mulai dari nol saja
            </button>
            <p className="lesson-cta-note">Tes ini hanya sekali dan tidak masuk nilai rapot sebagai kegagalan — murni penentu titik berangkat.</p>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'hasil' && hasil) {
    const t = JALUR_TEXT[hasil.track]
    return (
      <div className="shell">
        <div className="lesson">
          <div className="done-card">
            <Lamp size={56} />
            <h1 className="done-title">{t.judul}</h1>
            {hasil.totalBenar !== null && (
              <p className="lesson-eyebrow">Benar {hasil.totalBenar} dari {hasil.total}</p>
            )}
            <p className="done-text">{t.isi}</p>
            {saveWarn && (
              <p className="done-warn">Hasil belum tersimpan — periksa internet lalu muat ulang halaman.</p>
            )}
            <div className="done-actions">
              <button className="btn-primary" onClick={() => onDone(null)}>Masuk ke beranda</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const q = items[idx]
  return (
    <div className="shell">
      <div className="lesson">
        <p className="lesson-eyebrow">{PLACEMENT.title}</p>
        <div className="test-bar">
          <div className="test-bar-fill" style={{ width: `${(idx / items.length) * 100}%` }} />
        </div>
        <p className="quiz-q">
          <span className="quiz-no">Soal {idx + 1} dari {items.length}</span>
          {q.q}
        </p>
        {q.type === 'hotspot' && (
          <div className="quiz-figure quiz-clickable">
            <Diagram kind={q.img.kind} props={q.img.props} onPart={(p) => jawab(q.accept.includes(p))} />
            <p className="quiz-hint">Klik langsung pada gambar. Tidak yakin? Klik saja sebisamu — ini bukan ujian.</p>
          </div>
        )}
        {q.type === 'mc' && (
          <div className="quiz-options">
            {q.display.map((opt, i) => (
              <button key={i} className="opt" onClick={() => jawab(opt.correct)}>
                <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
