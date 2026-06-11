import { useState } from 'react'
import { Diagram } from './Illustrations'
import { CountUp, Celebrate } from './Fx'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function prepare(questions) {
  return shuffle(questions).map((q) => {
    if (q.type === 'mc') {
      const opts = q.options.map((label, i) => ({ label, correct: i === q.answer }))
      return { ...q, display: shuffle(opts) }
    }
    return q
  })
}

export default function FinalTest({ test, bestScore, onFinish, onBack }) {
  // screen: 'intro' | 'soal' | 'hasil'
  const [screen, setScreen] = useState('intro')
  const [items, setItems] = useState([])
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const [startAt, setStartAt] = useState(null)

  function start() {
    setItems(prepare(test.questions))
    setIdx(0)
    setAnswers([])
    setResult(null)
    setStartAt(Date.now())
    setScreen('soal')
    window.scrollTo(0, 0)
  }

  async function record(correct, q) {
    if (answers.length !== idx) return // pelindung klik ganda
    const newAnswers = [...answers, { q, correct }]
    if (newAnswers.length < items.length) {
      setAnswers(newAnswers)
      setIdx(idx + 1)
      return
    }
    const right = newAnswers.filter((a) => a.correct).length
    const score = Math.round((right / items.length) * 100)
    const passed = score >= test.pass
    const seconds = Math.round((Date.now() - startAt) / 1000)
    const wrongIdx = newAnswers
      .filter((a) => !a.correct)
      .map((a) => test.questions.indexOf(a.q))
      .filter((i) => i >= 0)
    const saved = await onFinish(score, passed, seconds, wrongIdx)
    setAnswers(newAnswers)
    setResult({ score, right, passed, saved })
    setScreen('hasil')
    window.scrollTo(0, 0)
  }

  /* ---------- Intro ---------- */
  if (screen === 'intro') {
    return (
      <div className="lesson">
        <button className="btn-back" onClick={onBack}>← Modul 0</button>
        <p className="lesson-eyebrow">Ujian akhir</p>
        <h1 className="lesson-title">{test.title}</h1>
        <p className="lesson-desc">{test.intro}</p>
        {bestScore !== null && (
          <div className={`blk-box ${bestScore >= test.pass ? 'blk-tip' : 'blk-try'}`}>
            <span className="box-label">Nilai terbaikmu</span>
            <p>
              {bestScore} dari 100 {bestScore >= test.pass ? '— sudah LULUS. Mengulang boleh, nilai terbaik yang disimpan.' : '— belum mencapai 85. Ayo coba lagi!'}
            </p>
          </div>
        )}
        <div className="lesson-cta">
          <button className="btn-primary" onClick={start}>Mulai ujian</button>
          <p className="lesson-cta-note">Pastikan kamu sudah tenang dan siap. Tidak ada batas waktu, tapi setiap soal hanya satu kali jawab.</p>
        </div>
      </div>
    )
  }

  /* ---------- Hasil ---------- */
  if (screen === 'hasil' && result) {
    const wrongs = answers.filter((a) => !a.correct)
    return (
      <div className="lesson">
        <div className="done-card">
          {result.passed && <Celebrate />}
          <h1 className="done-title">{result.passed ? 'LULUS!' : 'Belum lulus'}</h1>
          <div className="drill-stats">
            <div className="stat">
              <CountUp value={result.score} className="stat-num" />
              <span className="stat-label">Nilai</span>
            </div>
            <div className="stat">
              <span className="stat-num">{result.right}/{items.length}</span>
              <span className="stat-label">Benar</span>
            </div>
            <div className="stat">
              <span className="stat-num">{test.pass}</span>
              <span className="stat-label">Batas lulus</span>
            </div>
          </div>
          <p className="done-text">
            {result.passed
              ? 'Selamat! Modul 0 tuntas — kamu resmi sudah kenal komputer. Modul Word menantimu di paket berikutnya.'
              : 'Tidak apa-apa. Pelajari pembahasan di bawah, buka lagi bab yang masih ragu, lalu ulangi ujian — soalnya akan diacak ulang.'}
          </p>
          {result.passed && !result.saved && (
            <p className="done-warn">Nilai belum tersimpan — periksa internet lalu ulangi ujian.</p>
          )}
          <div className="done-actions">
            <button className="btn-primary" onClick={start}>Ulangi ujian</button>
            <button className="btn-ghost btn-wide" onClick={onBack}>Kembali ke Modul 0</button>
          </div>
        </div>

        {wrongs.length > 0 && (
          <div className="review">
            <h3 className="blk-h">Pembahasan soal yang salah</h3>
            {wrongs.map((a, i) => (
              <div className="review-item" key={i}>
                <p className="review-q">{a.q.q}</p>
                <p className="review-a">
                  {a.q.type === 'mc'
                    ? 'Jawaban benar: ' + a.q.options[a.q.answer]
                    : 'Jawaban benar: lihat kembali gambarnya di bab terkait.'}
                </p>
                {a.q.explain && <p className="review-x">{a.q.explain}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  /* ---------- Soal ---------- */
  const q = items[idx]
  return (
    <div className="lesson">
      <p className="lesson-eyebrow">{test.title}</p>
      <div className="test-bar">
        <div className="test-bar-fill" style={{ width: `${(idx / items.length) * 100}%` }} />
      </div>
      <p className="quiz-q">
        <span className="quiz-no">Soal {idx + 1} dari {items.length}</span>
        {q.q}
      </p>

      {q.type === 'hotspot' && (
        <div className="quiz-figure quiz-clickable">
          <Diagram
            kind={q.img.kind}
            props={q.img.props}
            onPart={(partId) => record(q.accept.includes(partId), q)}
          />
          <p className="quiz-hint">Klik langsung pada gambar. Klik pertamamu adalah jawabanmu.</p>
        </div>
      )}

      {q.type === 'mc' && (
        <div>
          {q.img && (
            <div className="quiz-figure">
              <Diagram kind={q.img.kind} props={q.img.props} />
            </div>
          )}
          <div className="quiz-options">
            {q.display.map((opt, i) => (
              <button key={i} className="opt" onClick={() => record(opt.correct, q)}>
                <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
