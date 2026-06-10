import { MODUL0 } from './content/modul0'

export default function ModulePage({ progressMap, track = 'pemula', onOpenBab, onOpenDrill, onOpenFinal, onBack }) {
  const cepat = track === 'cepat'
  const babDone = (no) => progressMap['m0.b' + no]?.status === 'selesai'
  const drillScore = Number(progressMap['m0.drill']?.score ?? 0)
  const finalScore = progressMap['m0.final']?.score ?? null
  const finalPassed = finalScore !== null && Number(finalScore) >= MODUL0.final.pass

  const allBab = MODUL0.bab.every((b) => babDone(b.no))
  const drillUnlocked = cepat || babDone(3)
  const finalUnlocked = cepat ? drillScore >= 1 : allBab && drillScore >= 1

  const doneCount =
    MODUL0.bab.filter((b) => babDone(b.no)).length +
    (drillScore >= 1 ? 1 : 0) +
    (finalPassed ? 1 : 0)

  return (
    <div className="lesson">
      <button className="btn-back" onClick={onBack}>← Beranda</button>
      <p className="lesson-eyebrow">Modul 0 · {doneCount} dari {2 + MODUL0.bab.length} langkah selesai</p>
      <h1 className="lesson-title">Dasar komputer</h1>
      <p className="lesson-desc">{MODUL0.intro}</p>
      <div className="pdf-card">
        <div>
          <strong>Buku saku PDF Modul 0</strong>
          <span>31 halaman, materi sama persis — enak dibaca di HP atau dicetak.</span>
        </div>
        <a className="btn-ghost btn-sm no-print" href="/Lentera-Modul-0.pdf" download>
          Unduh PDF
        </a>
      </div>
      {cepat && (
        <div className="blk-box blk-tip">
          <span className="box-label">Jalur Cepat</span>
          <p>Semua bab terbuka bebas — boleh dibaca kilat atau dilewati. Wajib: latihan mengetik minimal Level 1 dan lulus ujian akhir.</p>
        </div>
      )}

      <p className="section-label">Bab demi bab</p>
      <div className="path">
        {MODUL0.bab.map((b) => {
          const done = babDone(b.no)
          const open = cepat || b.no === 1 || babDone(b.no - 1)
          const state = done ? 'done' : open ? 'next' : 'locked'
          return (
            <div key={b.id} className={`step is-${state === 'next' ? 'next' : state === 'done' ? 'done' : 'locked'}`}>
              <span className="step-dot" aria-hidden="true" />
              <button
                className="step-card step-btn"
                disabled={!open && !done}
                onClick={() => onOpenBab(b.id)}
              >
                <div className="step-head">
                  <span className="step-title">Bab {b.no} — {b.title}</span>
                  <span className={`chip ${done ? 'chip-done' : open ? 'chip-next' : 'chip-locked'}`}>
                    {done ? (progressMap['m0.b' + b.no]?.meta?.via === 'placement' ? 'Lulus tes' : 'Selesai') : open ? 'Belajar' : 'Terkunci'}
                  </span>
                </div>
                <p className="step-desc">{b.desc}</p>
              </button>
            </div>
          )
        })}
      </div>

      <p className="section-label">Latihan dan ujian</p>

      <div className={`step is-${drillScore >= 1 ? 'done' : drillUnlocked ? 'next' : 'locked'}`} style={{ marginLeft: 0 }}>
        <button className="step-card step-btn" disabled={!drillUnlocked} onClick={onOpenDrill}>
          <div className="step-head">
            <span className="step-title">Latihan mengetik 10 jari</span>
            <span className={`chip ${drillScore >= 1 ? 'chip-done' : drillUnlocked ? 'chip-next' : 'chip-locked'}`}>
              {drillScore >= 1 ? `Level ${drillScore}/3` : drillUnlocked ? 'Terbuka' : 'Selesaikan Bab 3'}
            </span>
          </div>
          <p className="step-desc">
            Tiga level latihan dengan papan ketik penunjuk. Minimal Level 1 untuk membuka ujian akhir.
          </p>
        </button>
      </div>

      <div className={`step is-${finalPassed ? 'done' : finalUnlocked ? 'next' : 'locked'}`} style={{ marginLeft: 0 }}>
        <button className="step-card step-btn" disabled={!finalUnlocked} onClick={onOpenFinal}>
          <div className="step-head">
            <span className="step-title">Ujian akhir Modul 0</span>
            <span className={`chip ${finalPassed ? 'chip-done' : finalUnlocked ? 'chip-next' : 'chip-locked'}`}>
              {finalScore !== null ? `Nilai ${finalScore}` : finalUnlocked ? 'Siap diuji' : 'Terkunci'}
            </span>
          </div>
          <p className="step-desc">
            {MODUL0.final.questions.length} soal dari semua bab, lulus {MODUL0.final.pass}. {finalUnlocked || finalPassed ? 'Kamu sudah memenuhi syarat — semoga berhasil!' : cepat ? 'Terbuka setelah Level 1 mengetik lulus.' : 'Terbuka setelah semua bab selesai dan Level 1 mengetik lulus.'}
          </p>
        </button>
      </div>
    </div>
  )
}
