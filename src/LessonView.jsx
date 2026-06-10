import { useState } from 'react'
import { Diagram } from './Illustrations'
import Quiz from './Quiz'
import Lamp from './Lamp'

function Keys({ items }) {
  return (
    <div className="blk-keys">
      {items.map((k, i) => (
        <div className="keys-row" key={i}>
          <span className="keys-combo">
            {k.combo.map((key, j) => (
              <span key={j}>
                <kbd>{key}</kbd>
                {j < k.combo.length - 1 && <span className="keys-plus">+</span>}
              </span>
            ))}
          </span>
          <span className="keys-label">{k.label}</span>
        </div>
      ))}
    </div>
  )
}

function Block({ b }) {
  switch (b.t) {
    case 'p':
      return <p className="blk-p">{b.text}</p>
    case 'h':
      return <h3 className="blk-h">{b.text}</h3>
    case 'img':
      return (
        <figure className="blk-img">
          <Diagram kind={b.kind} props={b.props || {}} />
          {b.caption && <figcaption>{b.caption}</figcaption>}
        </figure>
      )
    case 'steps':
      return (
        <ol className="blk-steps">
          {b.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ol>
      )
    case 'list':
      return (
        <ul className="blk-list">
          {b.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      )
    case 'tip':
      return (
        <div className="blk-box blk-tip">
          <span className="box-label">Tips</span>
          <p>{b.text}</p>
        </div>
      )
    case 'warn':
      return (
        <div className="blk-box blk-warn">
          <span className="box-label">Hati-hati</span>
          <p>{b.text}</p>
        </div>
      )
    case 'try':
      return (
        <div className="blk-box blk-try">
          <span className="box-label">Coba sekarang</span>
          <p>{b.text}</p>
        </div>
      )
    case 'keys':
      return <Keys items={b.items} />
    case 'glossary':
      return (
        <div className="blk-glossary">
          <h3 className="blk-h">Kamus bab ini</h3>
          <dl>
            {b.items.map((g, i) => (
              <div className="glo-row" key={i}>
                <dt>{g.term}</dt>
                <dd>{g.def}</dd>
              </div>
            ))}
          </dl>
        </div>
      )
    default:
      return null
  }
}

export default function LessonView({ bab, nextBab, alreadyDone, onComplete, onBack, onOpenBab }) {
  // phase: 'materi' | 'kuis' | 'selesai'
  const [phase, setPhase] = useState('materi')
  const [saveWarn, setSaveWarn] = useState(false)

  async function finishQuiz(stats) {
    if (!alreadyDone) {
      const ok = await onComplete(bab.id, {
        seconds: stats.seconds,
        meta: { wrong: stats.wrong, qcount: bab.quiz.length },
      })
      setSaveWarn(!ok)
    }
    setPhase('selesai')
    window.scrollTo(0, 0)
  }

  return (
    <div className="lesson">
      <button className="btn-back" onClick={onBack}>← Modul 0</button>

      {phase === 'materi' && (
        <div>
          <p className="lesson-eyebrow">Bab {bab.no}</p>
          <h1 className="lesson-title">{bab.title}</h1>
          <p className="lesson-desc">{bab.desc}</p>
          {bab.blocks.map((b, i) => (
            <Block b={b} key={i} />
          ))}
          <div className="lesson-cta">
            <button
              className="btn-primary"
              onClick={() => {
                setPhase('kuis')
                window.scrollTo(0, 0)
              }}
            >
              {alreadyDone ? 'Ulangi kuis bab ini' : 'Lanjut ke kuis bab ini'}
            </button>
            <p className="lesson-cta-note">
              {alreadyDone
                ? 'Bab ini sudah selesai — mengulang kuis bagus untuk mengasah ingatan.'
                : 'Jawab semua soal dengan benar untuk menyelesaikan bab. Salah tidak apa-apa, bisa dicoba lagi.'}
            </p>
          </div>
        </div>
      )}

      {phase === 'kuis' && (
        <div>
          <p className="lesson-eyebrow">Kuis bab {bab.no}</p>
          <h1 className="lesson-title">{bab.title}</h1>
          <Quiz questions={bab.quiz} onFinish={finishQuiz} />
        </div>
      )}

      {phase === 'selesai' && (
        <div className="done-card">
          <Lamp size={64} />
          <h1 className="done-title">Bab {bab.no} selesai!</h1>
          <p className="done-text">
            Semua soal terjawab benar. Nyala lenteramu makin terang.
          </p>
          {saveWarn && (
            <p className="done-warn">
              Progres belum berhasil tersimpan — periksa internet, lalu buka ulang bab ini dan
              selesaikan kuisnya sekali lagi.
            </p>
          )}
          <div className="done-actions">
            {nextBab && (
              <button className="btn-primary" onClick={() => onOpenBab(nextBab.id)}>
                Lanjut Bab {nextBab.no}: {nextBab.title.length > 26 ? nextBab.title.slice(0, 26) + '…' : nextBab.title}
              </button>
            )}
            <button className="btn-ghost btn-wide" onClick={onBack}>
              Kembali ke daftar bab
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
