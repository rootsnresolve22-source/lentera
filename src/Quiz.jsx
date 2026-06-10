import { useState } from 'react'
import { Diagram } from './Illustrations'

// Kuis mode latihan (dipakai di akhir tiap bab):
// jawaban salah diberi penjelasan dan boleh dicoba lagi sampai benar.
export default function Quiz({ questions, onFinish }) {
  const [idx, setIdx] = useState(0)
  const [feedback, setFeedback] = useState(null) // { ok, text }
  const [solved, setSolved] = useState(false)
  const [wrong, setWrong] = useState(0)
  const [startAt] = useState(() => Date.now())
  const [shake, setShake] = useState({ i: -1, t: 0 })

  const q = questions[idx]
  const last = idx === questions.length - 1

  function handleMc(i) {
    if (solved) return
    if (i === q.answer) {
      setSolved(true)
      setFeedback({ ok: true, text: q.explain || 'Benar!' })
    } else {
      setWrong(wrong + 1)
      setShake({ i, t: Date.now() })
      const msg = (q.wrong && q.wrong[i]) || 'Belum tepat. Coba lagi — perhatikan baik-baik.'
      setFeedback({ ok: false, text: msg })
    }
  }

  function handlePart(partId) {
    if (solved) return
    if (q.accept.includes(partId)) {
      setSolved(true)
      setFeedback({ ok: true, text: q.explain || 'Benar!' })
    } else {
      setWrong(wrong + 1)
      setShake({ i: -2, t: Date.now() })
      const msg = (q.wrong && q.wrong[partId]) || 'Belum tepat. Coba klik bagian yang lain.'
      setFeedback({ ok: false, text: msg })
    }
  }

  function next() {
    if (last) {
      onFinish({ wrong, seconds: Math.round((Date.now() - startAt) / 1000) })
      return
    }
    setIdx(idx + 1)
    setFeedback(null)
    setSolved(false)
  }

  return (
    <div className="quiz">
      <div className="quiz-dots" aria-label={`Soal ${idx + 1} dari ${questions.length}`}>
        {questions.map((_, i) => (
          <span
            key={i}
            className={`dot ${i < idx ? 'dot-done' : ''} ${i === idx ? 'dot-now' : ''}`}
          />
        ))}
      </div>

      <p className="quiz-q">
        <span className="quiz-no">Soal {idx + 1}</span>
        {q.q}
      </p>

      {q.type === 'hotspot' && (
        <div key={shake.i === -2 ? 'f' + shake.t : 'f'} className={'quiz-figure quiz-clickable' + (shake.i === -2 ? ' fx-shake' : '')}>
          <Diagram kind={q.img.kind} props={q.img.props} onPart={handlePart} />
          {!solved && <p className="quiz-hint">Klik langsung pada gambar di atas.</p>}
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
            {q.options.map((opt, i) => (
              <button
                key={shake.i === i ? 'o' + i + '-' + shake.t : 'o' + i}
                className={`opt ${solved && i === q.answer ? 'opt-correct' : ''}${shake.i === i ? ' fx-shake' : ''}`}
                onClick={() => handleMc(i)}
                disabled={solved && i !== q.answer}
              >
                <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {feedback && (
        <div key={feedback.text + wrong} className={`quiz-fb ${feedback.ok ? 'fb-ok' : 'fb-no'}`} role="status">
          {feedback.text}
        </div>
      )}

      {solved && (
        <button className="btn-primary quiz-next" onClick={next}>
          {last ? 'Selesai kuis' : 'Soal berikutnya'}
        </button>
      )}
    </div>
  )
}
