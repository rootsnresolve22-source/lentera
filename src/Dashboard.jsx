import Lamp from './Lamp'
import { APP_VERSION } from './config'
import { MODUL0, M0_ITEMS } from './content/modul0'

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

export default function Dashboard({ user, progressMap, onLogout, onOpenModule }) {
  const firstName = (user.full_name || user.username).split(' ')[0]
  const done = M0_ITEMS.filter((id) => itemDone(progressMap, id)).length
  const total = M0_ITEMS.length
  const pct = Math.round((done / total) * 100)
  const started = done > 0
  const m0Complete = done === total

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
        <button className="btn-ghost" onClick={onLogout}>
          Keluar
        </button>
      </header>

      <h1 className="hello">Halo, {firstName}!</h1>
      <p className="hello-sub">
        Selamat datang di kelas belajarmu.
        {user.role === 'admin' && <span className="badge-admin">Admin</span>}
      </p>

      <div className="progress-card">
        <div className="pc-flame">
          <Lamp size={46} line="#f4efe6" />
        </div>
        <div>
          {!started && (
            <>
              <h2>Perjalananmu dimulai hari ini</h2>
              <p>
                Modul 0 sudah terbuka! Masuk ke aplikasi ini sendiri tadi adalah latihan
                pertamamu — sekarang lanjutkan ke bab pertama.
              </p>
            </>
          )}
          {started && !m0Complete && (
            <>
              <h2>{done} dari {total} langkah Modul 0 selesai</h2>
              <div className="pc-bar"><div className="pc-bar-fill" style={{ width: pct + '%' }} /></div>
              <p>Terus nyalakan lenteramu — sedikit demi sedikit, setiap hari.</p>
            </>
          )}
          {m0Complete && (
            <>
              <h2>Modul 0 tuntas — luar biasa!</h2>
              <p>Kamu resmi sudah kenal komputer. Modul Word dasar segera menyusul.</p>
            </>
          )}
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
              Menyalakan laptop, mouse, keyboard, file & folder, mengetik 10 jari.
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
