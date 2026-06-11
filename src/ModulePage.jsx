import { itemDone, moduleDoneCount } from './content'
import { daftarReview } from './SmartReview'

export default function ModulePage({ entry, progressMap, track = 'pemula', onOpenBab, onOpenDrill, onOpenFinal, onOpenPraktik, onOpenReview, onBack }) {
  const { module, items, hasDrill, hasPdf } = entry
  const cepat = track === 'cepat' && module.id === 'm0'

  const babDone = (id) => itemDone(progressMap, id)
  const drillScore = Number(progressMap['m0.drill']?.score ?? 0)
  const finalScore = progressMap[module.final.id]?.score ?? null
  const finalPassed = finalScore !== null && Number(finalScore) >= module.final.pass

  const praktik = module.praktik ?? null
  const praktikScore = praktik ? progressMap[praktik.id]?.score ?? null : null
  const praktikPassed = !!praktik && praktikScore !== null && Number(praktikScore) >= praktik.pass

  const allBab = module.bab.every((b) => babDone(b.id))
  const drillUnlocked = hasDrill && (cepat || babDone('m0.b3'))
  const praktikUnlocked = !!praktik && allBab
  const finalUnlocked = hasDrill
    ? (cepat ? drillScore >= 1 : allBab && drillScore >= 1)
    : praktik ? praktikPassed : allBab

  const doneCount = moduleDoneCount(progressMap, entry)
  const [judulKiri, judulKanan] = module.title.split(' — ')

  return (
    <div className="lesson">
      <button className="btn-back" onClick={onBack}>← Beranda</button>
      <p className="lesson-eyebrow">{judulKiri} · {doneCount} dari {items.length} langkah selesai</p>
      <h1 className="lesson-title">{judulKanan ?? module.title}</h1>
      <p className="lesson-desc">{module.intro}</p>

      {hasPdf && (
        <div className="pdf-card">
          <div>
            <strong>Buku saku PDF {module.title.split(' — ')[0]}</strong>
            <span>Materi sama persis — enak dibaca di HP atau dicetak.</span>
          </div>
          <a className="btn-ghost btn-sm no-print" href={`/Lentera-Modul-${module.id.slice(1)}.pdf`} download>
            Unduh PDF
          </a>
        </div>
      )}
      {daftarReview(entry, progressMap).length > 0 && (
        <div className="pdf-card">
          <div>
            <strong>Ulangan Pintar — {daftarReview(entry, progressMap).length} soal</strong>
            <span>Soal yang pernah kamu jawab salah. Kuasai sampai daftarnya kosong.</span>
          </div>
          <button className="btn-ghost btn-sm no-print" onClick={onOpenReview}>Mulai ulangan</button>
        </div>
      )}


      {cepat && (
        <div className="blk-box blk-tip">
          <span className="box-label">Jalur Cepat</span>
          <p>Semua bab terbuka bebas — boleh dibaca kilat atau dilewati. Wajib: latihan mengetik minimal Level 1 dan lulus ujian akhir.</p>
        </div>
      )}

      <p className="section-label">Bab demi bab</p>
      <div className="path">
        {module.bab.map((b, i) => {
          const done = babDone(b.id)
          const prevDone = i === 0 || babDone(module.bab[i - 1].id)
          const open = cepat || prevDone
          return (
            <div key={b.id} className={`step is-${done ? 'done' : open ? 'next' : 'locked'}`}>
              <span className="step-dot" aria-hidden="true" />
              <button
                className="step-card step-btn"
                disabled={!open && !done}
                onClick={() => onOpenBab(b.id)}
              >
                <div className="step-head">
                  <span className="step-title">Bab {b.no} — {b.title}</span>
                  <span className={`chip ${done ? 'chip-done' : open ? 'chip-next' : 'chip-locked'}`}>
                    {done ? (progressMap[b.id]?.meta?.via === 'placement' ? 'Lulus tes' : 'Selesai') : open ? 'Belajar' : 'Terkunci'}
                  </span>
                </div>
                <p className="step-desc">{b.desc}</p>
              </button>
            </div>
          )
        })}
      </div>

      <p className="section-label">{hasDrill ? 'Latihan dan ujian' : praktik ? 'Ujian praktek dan teori' : 'Ujian'}</p>

      {hasDrill && (
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
      )}

      {praktik && (
        <div className={`step is-${praktikPassed ? 'done' : praktikUnlocked ? 'next' : 'locked'}`} style={{ marginLeft: 0 }}>
          <button className="step-card step-btn" disabled={!praktikUnlocked} onClick={onOpenPraktik}>
            <div className="step-head">
              <span className="step-title">{praktik.title}</span>
              <span className={`chip ${praktikPassed ? 'chip-done' : praktikUnlocked ? 'chip-next' : 'chip-locked'}`}>
                {praktikScore !== null ? `Nilai ${praktikScore}` : praktikUnlocked ? 'Siap dikerjakan' : 'Selesaikan semua bab'}
              </span>
            </div>
            <p className="step-desc">
              Puncak modul: buat dokumen sungguhan di Word, unggah file .docx-mu — dinilai
              otomatis per butir rubrik dengan saran perbaikan. Lulus {praktik.pass}.
            </p>
          </button>
        </div>
      )}

      <div className={`step is-${finalPassed ? 'done' : finalUnlocked ? 'next' : 'locked'}`} style={{ marginLeft: 0 }}>
        <button className="step-card step-btn" disabled={!finalUnlocked} onClick={onOpenFinal}>
          <div className="step-head">
            <span className="step-title">{module.final.title}</span>
            <span className={`chip ${finalPassed ? 'chip-done' : finalUnlocked ? 'chip-next' : 'chip-locked'}`}>
              {finalScore !== null ? `Nilai ${finalScore}` : finalUnlocked ? 'Siap diuji' : 'Terkunci'}
            </span>
          </div>
          <p className="step-desc">
            {module.final.questions.length} soal dari semua bab, lulus {module.final.pass}.{' '}
            {finalUnlocked || finalPassed
              ? 'Kamu sudah memenuhi syarat — semoga berhasil!'
              : hasDrill
              ? (cepat ? 'Terbuka setelah Level 1 mengetik lulus.' : 'Terbuka setelah semua bab selesai dan Level 1 mengetik lulus.')
              : praktik ? 'Terbuka setelah ujian praktek lulus.' : 'Terbuka setelah semua bab selesai.'}
          </p>
        </button>
      </div>
    </div>
  )
}
