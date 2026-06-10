import { useState } from 'react'
import { Diagram } from './Illustrations'
import Lamp from './Lamp'
import { CountUp } from './Fx'
import { PLACEMENT, tentukanJalur, babLulusPenempatan } from './content/placement'
import { MODUL0 } from './content/modul0'

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
    isi: 'Kamu sudah akrab dengan komputer. Semua bab terbuka bebas — boleh dibaca kilat atau dilewati. Yang wajib: latihan mengetik minimal Level 1 dan LULUS ujian akhir (nilai 85) sebagai bukti.',
  },
  berbekal: {
    judul: 'Pemula Berbekal',
    isi: 'Kamu sudah menguasai sebagian dasar — dan itu dihargai: bab yang semua soalnya kamu jawab benar langsung berstatus LULUS PENEMPATAN. Kamu mulai dari bab pertama yang belum kamu kuasai.',
  },
  pemula: {
    judul: 'Pemula',
    isi: 'Titik berangkat terbaik: dari nol, pelan, dan pasti. Semua orang hebat pernah mulai dari sini. Bab 1 sudah menunggumu.',
  },
}

const babTitle = (id) => {
  const b = MODUL0.bab.find((x) => x.id === id)
  return b ? `Bab ${b.no} — ${b.title}` : id
}

export default function Placement({ onDone }) {
  // screen: 'intro' | 'soal' | 'hasil'
  const [screen, setScreen] = useState('intro')
  const [items, setItems] = useState([])
  const [idx, setIdx] = useState(0)
  const [detail, setDetail] = useState([])
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
    setDetail([])
    setScreen('soal')
    window.scrollTo(0, 0)
  }

  async function selesai(detailAkhir, dilewati) {
    const total = PLACEMENT.questions.length
    const benar = dilewati ? 0 : detailAkhir.filter((d) => d.benar).length
    const score = dilewati ? 0 : Math.round((benar / total) * 100)
    const track = dilewati ? 'pemula' : tentukanJalur(benar)
    const semuaLulus = dilewati ? [] : babLulusPenempatan(detailAkhir)
    const tandaiSelesai = track === 'berbekal' ? semuaLulus : []
    const salahList = dilewati ? [] : detailAkhir.filter((d) => !d.benar)
    const ok = await onDone({
      score,
      meta: {
        track,
        correct: benar,
        total,
        skipped: !!dilewati,
        babLulus: semuaLulus,
        salah: salahList.map((d) => ({ q: d.q.slice(0, 70), bab: d.bab })),
      },
      tandaiSelesai,
    })
    setSaveWarn(!ok)
    setHasil({ track, benar, total, salahList, babLulus: tandaiSelesai, skipped: !!dilewati })
    setScreen('hasil')
    window.scrollTo(0, 0)
  }

  function jawab(benar, q) {
    const d = [...detail, { benar, q: q.q, kunci: q.kunci, bab: q.bab }]
    if (idx + 1 < items.length) {
      setDetail(d)
      setIdx(idx + 1)
    } else {
      setDetail(d)
      selesai(d, false)
    }
  }

  /* ---------- Intro ---------- */
  if (screen === 'intro') {
    return (
      <div className="shell">
        <div className="lesson">
          <div className="place-head"><Lamp size={48} /></div>
          <p className="lesson-eyebrow">Langkah pertama</p>
          <h1 className="lesson-title">{PLACEMENT.title}</h1>
          <p className="lesson-desc">{PLACEMENT.intro}</p>
          <div className="blk-box blk-tip">
            <span className="box-label">Aturan penempatan — terbuka, tidak ada rahasia</span>
            <p>
              Benar 10–12: <strong>Jalur Cepat</strong> (bab bebas, wajib lulus ujian akhir). Benar 7–9:{' '}
              <strong>Pemula Berbekal</strong> (bab yang kamu kuasai langsung lulus penempatan). Benar 0–6:{' '}
              <strong>Pemula</strong> (mulai dari Bab 1).
            </p>
          </div>
          <div className="lesson-cta">
            <button className="btn-primary" onClick={start}>Mulai tes (12 soal singkat)</button>
            <button className="btn-ghost btn-wide" style={{ marginTop: 10 }} onClick={() => selesai([], true)}>
              Saya belum pernah pakai laptop — mulai dari nol saja
            </button>
            <p className="lesson-cta-note">Tes ini hanya sekali. Hasilnya bukan nilai gagal — murni penentu titik berangkat, dan kamu akan melihat rinciannya.</p>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- Hasil (transparan penuh) ---------- */
  if (screen === 'hasil' && hasil) {
    const t = JALUR_TEXT[hasil.track]
    return (
      <div className="shell">
        <div className="lesson">
          <div className="done-card">
            <Lamp size={56} />
            {!hasil.skipped && (
              <p className="place-score">
                <CountUp value={hasil.benar} className="place-score-num" />
                <span className="place-score-of"> / {hasil.total} benar</span>
              </p>
            )}
            <h1 className="done-title">{t.judul}</h1>
            <p className="done-text">{t.isi}</p>
            {saveWarn && <p className="done-warn">Hasil belum tersimpan — periksa internet lalu muat ulang halaman.</p>}
          </div>

          {!hasil.skipped && (
            <div className="blk-box blk-tip">
              <span className="box-label">Kenapa kamu di sini</span>
              <p>
                Aturannya: benar 10–12 → Jalur Cepat · benar 7–9 → Pemula Berbekal · benar 0–6 → Pemula.
                Kamu benar <strong>{hasil.benar}</strong>, maka jalurmu: <strong>{t.judul}</strong>.
              </p>
            </div>
          )}

          {hasil.babLulus.length > 0 && (
            <div className="place-pass">
              <h3 className="blk-h">Lulus penempatan (boleh dilewati)</h3>
              <ul className="blk-list">
                {hasil.babLulus.map((id) => <li key={id}>{babTitle(id)} — semua soalnya kamu jawab benar.</li>)}
              </ul>
            </div>
          )}

          {hasil.salahList.length > 0 && (
            <div className="review">
              <h3 className="blk-h">Yang masih salah ({hasil.salahList.length} soal) — pelajari di babnya</h3>
              {hasil.salahList.map((d, i) => (
                <div className="review-item" key={i}>
                  <p className="review-q">{d.q}</p>
                  <p className="review-a">Jawaban benar: {d.kunci}</p>
                  <p className="review-x">Dibahas di {babTitle('m0.b' + d.bab)}.</p>
                </div>
              ))}
            </div>
          )}

          <div className="done-actions" style={{ marginTop: 18 }}>
            <button className="btn-primary" onClick={() => onDone(null)}>Masuk ke beranda</button>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- Soal ---------- */
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
            <Diagram kind={q.img.kind} props={q.img.props} onPart={(p) => jawab(q.accept.includes(p), q)} />
            <p className="quiz-hint">Klik langsung pada gambar. Tidak yakin? Klik saja sebisamu — ini bukan ujian.</p>
          </div>
        )}
        {q.type === 'mc' && (
          <div className="quiz-options">
            {q.display.map((opt, i) => (
              <button key={i} className="opt" onClick={() => jawab(opt.correct, q)}>
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
