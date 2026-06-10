import { useEffect, useRef, useState } from 'react'
import { KeyboardMap } from './Illustrations'
import { Celebrate } from './Fx'

export const DRILL_LEVELS = [
  {
    no: 1,
    name: 'Baris rumah',
    desc: 'Jari belajar pulang ke rumahnya: A S D F dan J K L ;',
    lines: ['fff jjj fff jjj fjf jfj', 'ddd kkk sss lll dkd sls', 'asdf jkl; asdf jkl;', 'ada jasa lada salak'],
  },
  {
    no: 2,
    name: 'Kata sehari-hari',
    desc: 'Mulai menjelajah huruf lain lewat kata-kata pendek.',
    lines: ['kami satu dua tiga lima', 'rumah kerja surat kantor', 'buku meja pintu warga desa', 'pagi yang cerah di batam'],
  },
  {
    no: 3,
    name: 'Kalimat lengkap',
    desc: 'Huruf besar (Shift) dan tanda titik ikut bermain.',
    lines: ['Saya belajar komputer setiap hari.', 'Latihan membuat saya semakin mahir.', 'Besok saya siap bekerja di kantor.'],
  },
]

const MIN_ACC = 90

function keysForChar(ch) {
  if (ch === ' ') return ['space']
  if (ch === ';') return ['semicolon']
  if (ch === '.') return ['period']
  if (ch === ',') return ['comma']
  if (/[A-Z]/.test(ch)) return ['lshift', ch.toLowerCase()]
  if (/[a-z]/.test(ch)) return [ch]
  return []
}

export default function TypingDrill({ bestLevel = 0, onPass, onBack }) {
  // screen: 'levels' | 'typing' | 'result'
  const [screen, setScreen] = useState('levels')
  const [level, setLevel] = useState(null)
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [errors, setErrors] = useState(0)
  const [startedAt, setStartedAt] = useState(null)
  const [result, setResult] = useState(null)
  const [focused, setFocused] = useState(false)
  const [sessionBest, setSessionBest] = useState(0)
  const areaRef = useRef(null)

  const unlocked = Math.max(bestLevel, sessionBest)

  function startLevel(lv) {
    setLevel(lv)
    setLineIdx(0)
    setCharIdx(0)
    setCorrect(0)
    setErrors(0)
    setStartedAt(null)
    setResult(null)
    setScreen('typing')
  }

  useEffect(() => {
    if (screen === 'typing' && areaRef.current) areaRef.current.focus()
  }, [screen, lineIdx])

  async function finishLevel(finalCorrect, finalErrors, start) {
    const total = finalCorrect + finalErrors
    const acc = total === 0 ? 0 : Math.round((finalCorrect / total) * 100)
    const seconds = Math.max(1, Math.round((Date.now() - start) / 1000))
    const kpm = Math.round(finalCorrect / (seconds / 60))
    const passed = acc >= MIN_ACC
    let saved = true
    if (passed) {
      setSessionBest((s) => Math.max(s, level.no))
      saved = await onPass(level.no, {
        seconds,
        meta: { ['l' + level.no]: { acc, kpm, seconds } },
      })
    }
    setResult({ acc, seconds, kpm, passed, saved })
    setScreen('result')
  }

  function handleKey(e) {
    if (screen !== 'typing' || !level) return
    if (e.key === 'Tab') e.preventDefault()
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(e.key)) return
    if (e.key === ' ') e.preventDefault()
    if (e.key.length !== 1) return

    const line = level.lines[lineIdx]
    const expected = line[charIdx]
    const start = startedAt ?? Date.now()
    if (!startedAt) setStartedAt(start)

    if (e.key === expected) {
      const newCorrect = correct + 1
      setCorrect(newCorrect)
      if (charIdx + 1 < line.length) {
        setCharIdx(charIdx + 1)
      } else if (lineIdx + 1 < level.lines.length) {
        setLineIdx(lineIdx + 1)
        setCharIdx(0)
      } else {
        finishLevel(newCorrect, errors, start)
      }
    } else {
      setErrors(errors + 1)
    }
  }

  /* ---------- Layar pilih level ---------- */
  if (screen === 'levels') {
    return (
      <div className="lesson">
        <button className="btn-back" onClick={onBack}>← Modul 0</button>
        <p className="lesson-eyebrow">Latihan</p>
        <h1 className="lesson-title">Mengetik 10 jari</h1>
        <p className="lesson-desc">
          Selesaikan level secara berurutan dengan akurasi minimal {MIN_ACC}%. Mata ke layar,
          jari pulang ke baris rumah. Latihan ini dikerjakan di laptop dengan keyboard fisik.
        </p>
        <div className="drill-levels">
          {DRILL_LEVELS.map((lv) => {
            const done = unlocked >= lv.no
            const open = lv.no === 1 || unlocked >= lv.no - 1
            return (
              <div key={lv.no} className={`drill-card ${!open ? 'is-locked' : ''}`}>
                <div className="step-head">
                  <span className="step-title">Level {lv.no} — {lv.name}</span>
                  <span className={`chip ${done ? 'chip-done' : open ? 'chip-next' : 'chip-locked'}`}>
                    {done ? 'Selesai' : open ? 'Terbuka' : 'Terkunci'}
                  </span>
                </div>
                <p className="step-desc">{lv.desc}</p>
                {open && (
                  <button className="btn-primary btn-sm" onClick={() => startLevel(lv)}>
                    {done ? 'Latih lagi' : 'Mulai level ini'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  /* ---------- Layar hasil ---------- */
  if (screen === 'result' && result) {
    return (
      <div className="lesson">
        <div className="done-card">
          {result.passed && <Celebrate />}
          <h1 className="done-title">{result.passed ? 'Level ' + level.no + ' lulus!' : 'Hampir!'}</h1>
          <div className="drill-stats">
            <div className="stat">
              <span className="stat-num">{result.acc}%</span>
              <span className="stat-label">Akurasi</span>
            </div>
            <div className="stat">
              <span className="stat-num">{result.kpm}</span>
              <span className="stat-label">Ketukan/menit</span>
            </div>
            <div className="stat">
              <span className="stat-num">{result.seconds}d</span>
              <span className="stat-label">Waktu</span>
            </div>
          </div>
          <p className="done-text">
            {result.passed
              ? 'Akurasimu di atas ' + MIN_ACC + '%. Pertahankan: pelan tapi benar mengalahkan cepat tapi salah.'
              : 'Butuh akurasi minimal ' + MIN_ACC + '%. Pelankan ritme — kebenaran dulu, kecepatan menyusul.'}
          </p>
          {result.passed && !result.saved && (
            <p className="done-warn">Progres belum tersimpan — periksa internet lalu ulangi level ini.</p>
          )}
          <div className="done-actions">
            {!result.passed && (
              <button className="btn-primary" onClick={() => startLevel(level)}>Coba lagi</button>
            )}
            {result.passed && level.no < 3 && (
              <button className="btn-primary" onClick={() => startLevel(DRILL_LEVELS[level.no])}>
                Lanjut Level {level.no + 1}
              </button>
            )}
            <button className="btn-ghost btn-wide" onClick={() => setScreen('levels')}>
              Daftar level
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- Layar mengetik ---------- */
  const line = level.lines[lineIdx]
  const nextChar = line[charIdx]
  const highlight = keysForChar(nextChar)
  const typedTotal = correct + errors
  const liveAcc = typedTotal === 0 ? 100 : Math.round((correct / typedTotal) * 100)

  return (
    <div className="lesson">
      <button className="btn-back" onClick={() => setScreen('levels')}>← Daftar level</button>
      <p className="lesson-eyebrow">Level {level.no} — {level.name} · Baris {lineIdx + 1} dari {level.lines.length}</p>

      <div
        ref={areaRef}
        className={`drill-area ${focused ? 'is-focused' : ''}`}
        tabIndex={0}
        onKeyDown={handleKey}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        role="application"
        aria-label="Area latihan mengetik"
      >
        {!focused && <div className="drill-overlay">Klik di sini, lalu mulai mengetik</div>}
        <p className="drill-line" aria-hidden="true">
          {line.split('').map((ch, i) => (
            <span
              key={i}
              className={i < charIdx ? 'ch-done' : i === charIdx ? 'ch-now' : 'ch-up'}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </p>
        <p className="drill-live">Akurasi: {liveAcc}% · Salah: {errors}</p>
      </div>

      <p className="drill-help">
        {/[A-Z]/.test(nextChar)
          ? 'Huruf besar: tahan Shift (menyala oranye) sambil tekan hurufnya.'
          : 'Tekan tombol yang menyala oranye di gambar bawah — tanpa melihat keyboard asli.'}
      </p>
      <KeyboardMap highlight={highlight} />
    </div>
  )
}
