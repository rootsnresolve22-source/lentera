import Lamp from './Lamp'
import { APP_VERSION } from './config'
import { MODUL0, M0_ITEMS } from './content/modul0'
import { jalurLabel } from './score'

const LOCKED_STEPS = [
  { no: '1', title: 'Word dasar', desc: 'Mengetik surat, merapikan tulisan, menyimpan, mencetak.' },
  { no: '2', title: 'Excel dasar', desc: 'Tabel, angka, dan rumus pertamamu.' },
  { no: '3', title: 'PowerPoint dasar', desc: 'Membuat slide presentasi sederhana.' },
  { no: '4', title: 'Tingkat menengah', desc: 'Word, Excel & PowerPoint untuk pekerjaan kantor sehari-hari.' },
  { no: '5', title: 'Tingkat mahir + ujian akhir', desc: 'Mail merge, VLOOKUP, laporan, dan simulasi satu hari kerja.' },
  { no: '6', title: 'Pelengkap', desc: 'Email profesional, PDF, internet sehat, print & scan.' },
]

function itemDone(progressMap, id) {
  const p = progressMap[id]
  if (!p) return false
  if (id === 'm0.drill') return Number(p.score ?? 0) >= 1
  if (id === 'm0.final') return Number(p.score ?? 0) >= MODUL0.final.pass
  return p.status === 'selesai'
}

// Pesan motivasi kontekstual — sederhana, hangat, tidak menghakimi.
function pesanMotivasi({ done, total, streak, daysActive, finalBest }) {
  if (done === total) return 'Modul 0 tuntas. Kamu resmi sudah kenal komputer — Word dasar segera menyusul!'
  if (finalBest != null && finalBest < MODUL0.final.pass)
    return 'Nilai ujianmu hampir sampai — buka lagi bab yang masih ragu, lalu coba lagi. Kamu pasti bisa.'
  if (streak >= 3) return `Hebat, ${streak} hari berturut-turut! Api yang dijaga setiap hari tidak akan padam.`
  if (daysActive === 0 && done > 0) return 'Sudah beberapa hari tidak berlatih — yuk nyalakan lagi, 10 menit saja hari ini.'
  if (done > 0) return 'Terus nyalakan lenteramu — sedikit demi sedikit, setiap hari.'
  return 'Masuk ke aplikasi ini sendiri tadi adalah latihan pertamamu — sekarang lanjutkan ke bab pertama.'
}

export default function Dashboard({ user, progressMap, activity, track, onLogout, onOpenModule, onOpenAdmin }) {
  const firstName = (user.full_name || user.username).split(' ')[0]
  const done = M0_ITEMS.filter((id) => itemDone(progressMap, id)).length
  const total = M0_ITEMS.length
  const pct = Math.round((done / total) * 100)
  const started = done > 0
  const m0Complete = done === total
  const finalBest = progressMap['m0.final']?.score ?? null
  const streak = activity?.streak ?? 0
  const daysActive = activity?.daysActive ?? 0
  const pesan = pesanMotivasi({ done, total, streak, daysActive, finalBest })

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
            {m0Complete
              ? 'Modul 0 tuntas — luar biasa!'
              : started
              ? `${done} dari ${total} langkah Modul 0 selesai`
              : 'Perjalananmu dimulai hari ini'}
          </h2>
          {started && !m0Complete && (
            <div className="pc-bar"><div className="pc-bar-fill" style={{ width: pct + '%' }} /></div>
          )}
          <p>{pesan}</p>
          <div className="pc-meta">
            <span>Hadir {daysActive} hari (14 hari terakhir)</span>
            {streak >= 2 && <span>· Beruntun {streak} hari</span>}
            {finalBest != null && <span>· Nilai ujian terbaik: {finalBest}</span>}
          </div>
        </div>
      </div>

      <p className="section-label">Jalur belajar</p>

      <div className="path">
        <div className={`step ${m0Complete ? 'is-done' : 'is-next'}`}>
          <span className="step-dot" aria-hidden="true" />
          <button className="step-card step-btn" onClick={onOpenModule}>
            <div className="step-head">
              <span className="step-title">Modul 0 — Dasar komputer</span>
              <span className={`chip ${m0Complete ? 'chip-done' : 'chip-next'}`}>
                {m0Complete ? 'Selesai' : started ? `Lanjut ${done}/${total}` : 'Mulai'}
              </span>
            </div>
            <p className="step-desc">
              Laptop, mouse, keyboard, file & folder, WiFi, keamanan, mengetik 10 jari.
            </p>
          </button>
        </div>

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
