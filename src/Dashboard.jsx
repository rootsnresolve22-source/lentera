import Lamp from './Lamp'
import { APP_VERSION } from './config'
import {
  MODULES, itemDone, moduleUnlocked, moduleDoneCount, moduleComplete, activeEntry,
} from './content'
import { jalurLabel } from './score'

// Tahapan yang belum dibangun — sekadar peta jalan di beranda.
const LOCKED_STEPS = [
  { no: '★', title: 'Jenjang menengah & mahir', desc: 'Mail merge, VLOOKUP, simulasi satu hari kerja — dibuka setelah peluncuran.' },
]

// Pesan motivasi kontekstual — sederhana, hangat, tidak menghakimi.
function pesanMotivasi({ aktif, done, allComplete, streak, daysActive, finalAktif }) {
  if (allComplete) return 'Semua modul yang tersedia sudah tuntas. Excel dasar segera menyusul — istirahat dulu, kamu pantas bangga!'
  if (aktif.module.id === 'm1' && done === 0)
    return 'Modul 0 tuntas dan gerbang Word terbuka. Dokumen pertamamu menunggu di Bab 1!'
  if (finalAktif != null && finalAktif < aktif.module.final.pass)
    return 'Nilai ujianmu hampir sampai — buka lagi bab yang masih ragu, lalu coba lagi. Kamu pasti bisa.'
  if (streak >= 3) return `Hebat, ${streak} hari berturut-turut! Api yang dijaga setiap hari tidak akan padam.`
  if (daysActive === 0 && done > 0) return 'Sudah beberapa hari tidak berlatih — yuk nyalakan lagi, 10 menit saja hari ini.'
  if (done > 0) return 'Terus nyalakan lenteramu — sedikit demi sedikit, setiap hari.'
  return 'Masuk ke aplikasi ini sendiri tadi adalah latihan pertamamu — sekarang lanjutkan ke bab pertama.'
}

export default function Dashboard({ user, progressMap, activity, track, onLogout, onOpenModule, onOpenHotkeys, onOpenAdmin, onOpenCertificate }) {
  const firstName = (user.full_name || user.username).split(' ')[0]

  const aktif = activeEntry(progressMap)
  const done = moduleDoneCount(progressMap, aktif)
  const total = aktif.items.length
  const pct = Math.round((done / total) * 100)
  const started = done > 0
  const allComplete = MODULES.every((e) => moduleComplete(progressMap, e))
  const namaAktif = aktif.module.title.split(' — ')[0]
  const finalAktif = progressMap[aktif.module.final.id]?.score ?? null
  const finalM0 = progressMap['m0.final']?.score ?? null
  const finalM1 = progressMap['m1.final']?.score ?? null
  const streak = activity?.streak ?? 0
  const daysActive = activity?.daysActive ?? 0
  const pesan = pesanMotivasi({ aktif, done, allComplete, streak, daysActive, finalAktif })

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-brand">
          <Lamp size={30} />
          <div className="brand-stack">
            <span className="brand-word">Lentera</span>
            <span className="credit">
              created by <strong>Mohammad Dimas Priambodo</strong>
            </span>
          </div>
        </div>
        <div className="topbar-actions">
          {onOpenAdmin && (
            <button className="btn-primary btn-sm" onClick={onOpenAdmin}>Panel Admin</button>
          )}
          <button className="btn-ghost" onClick={onOpenHotkeys}>Kamus Pintasan</button>
          {allComplete && (
            <button className="btn-primary" onClick={onOpenCertificate}>Sertifikat Kelulusan</button>
          )}
          <button className="btn-ghost" onClick={onLogout}>Keluar</button>
        </div>
      </header>

      <h1 className="hello">Halo, {firstName}!</h1>
      <p className="hello-sub">
        Selamat datang di kelas belajarmu.
        {user.role === 'admin' ? (
          <span className="badge-admin">Admin</span>
        ) : (
          <span className="badge-track">{jalurLabel(track)}</span>
        )}
      </p>

      <div className="progress-card">
        <div className="pc-flame">
          <Lamp size={46} line="#f4efe6" />
        </div>
        <div>
          <h2>
            {allComplete
              ? 'Semua modul tuntas — luar biasa!'
              : started
              ? `${done} dari ${total} langkah ${namaAktif} selesai`
              : aktif.module.id === 'm1'
              ? 'Gerbang baru terbuka: Word!'
              : 'Perjalananmu dimulai hari ini'}
          </h2>
          {started && !allComplete && (
            <div className="pc-bar"><div className="pc-bar-fill" style={{ width: pct + '%' }} /></div>
          )}
          <p>{pesan}</p>
          <div className="pc-meta">
            <span>Hadir {daysActive} hari (14 hari terakhir)</span>
            {streak >= 2 && <span>· Beruntun {streak} hari</span>}
            {finalM0 != null && <span>· Ujian M0: {finalM0}</span>}
            {finalM1 != null && <span>· Ujian M1: {finalM1}</span>}
          </div>
        </div>
      </div>

      <p className="section-label">Jalur belajar</p>

      <div className="path">
        {MODULES.map((e) => {
          const unlocked = moduleUnlocked(progressMap, e)
          const mDone = moduleDoneCount(progressMap, e)
          const mTotal = e.items.length
          const complete = mDone === mTotal
          if (!unlocked) {
            return (
              <div key={e.module.id} className="step is-locked">
                <span className="step-dot" aria-hidden="true" />
                <div className="step-card">
                  <div className="step-head">
                    <span className="step-title">{e.module.title}</span>
                    <span className="chip chip-locked">{e.gate.label}</span>
                  </div>
                  <p className="step-desc">{e.gate.desc}</p>
                </div>
              </div>
            )
          }
          return (
            <div key={e.module.id} className={`step ${complete ? 'is-done' : 'is-next'}`}>
              <span className="step-dot" aria-hidden="true" />
              <button className="step-card step-btn" onClick={() => onOpenModule(e.module.id)}>
                <div className="step-head">
                  <span className="step-title">{e.module.title}</span>
                  <span className={`chip ${complete ? 'chip-done' : 'chip-next'}`}>
                    {complete ? 'Selesai' : mDone > 0 ? `Lanjut ${mDone}/${mTotal}` : 'Mulai'}
                  </span>
                </div>
                <p className="step-desc">{e.dashDesc}</p>
              </button>
            </div>
          )
        })}

        {LOCKED_STEPS.map((s) => (
          <div key={s.no} className="step is-locked">
            <span className="step-dot" aria-hidden="true" />
            <div className="step-card">
              <div className="step-head">
                <span className="step-title">{s.title}</span>
                <span className="chip chip-locked">Terkunci</span>
              </div>
              <p className="step-desc">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="foot">Lentera v{APP_VERSION}</p>
    </div>
  )
}
