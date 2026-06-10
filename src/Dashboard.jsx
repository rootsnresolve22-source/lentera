import Lamp from './Lamp'
import { APP_VERSION } from './config'

const STEPS = [
  {
    no: '0',
    title: 'Modul 0 — Dasar komputer',
    desc: 'Menyalakan laptop, mouse, keyboard, file & folder, mengetik.',
    state: 'next',
    chip: 'Segera dibuka',
  },
  {
    no: '1',
    title: 'Word dasar',
    desc: 'Mengetik surat, merapikan tulisan, menyimpan, mencetak.',
    state: 'locked',
    chip: 'Terkunci',
  },
  {
    no: '2',
    title: 'Excel dasar',
    desc: 'Tabel, angka, dan rumus pertamamu.',
    state: 'locked',
    chip: 'Terkunci',
  },
  {
    no: '3',
    title: 'PowerPoint dasar',
    desc: 'Membuat slide presentasi sederhana.',
    state: 'locked',
    chip: 'Terkunci',
  },
  {
    no: '4',
    title: 'Tingkat menengah',
    desc: 'Word, Excel & PowerPoint untuk pekerjaan kantor sehari-hari.',
    state: 'locked',
    chip: 'Terkunci',
  },
  {
    no: '5',
    title: 'Tingkat mahir + ujian akhir',
    desc: 'Mail merge, VLOOKUP, laporan, dan simulasi satu hari kerja.',
    state: 'locked',
    chip: 'Terkunci',
  },
  {
    no: '6',
    title: 'Pelengkap',
    desc: 'Email profesional, PDF, internet sehat, print & scan.',
    state: 'locked',
    chip: 'Terkunci',
  },
]

export default function Dashboard({ user, onLogout }) {
  const firstName = (user.full_name || user.username).split(' ')[0]

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
          <h2>Perjalananmu belum dimulai</h2>
          <p>
            Modul 0 segera dibuka. Sementara itu, kamu sudah berhasil melakukan
            latihan pertamamu: masuk ke aplikasi ini sendiri. Hebat!
          </p>
        </div>
      </div>

      <p className="section-label">Jalur belajar</p>

      <div className="path">
        {STEPS.map((s) => (
          <div key={s.no} className={`step is-${s.state === 'next' ? 'next' : 'locked'}`}>
            <span className="step-dot" aria-hidden="true" />
            <div className="step-card">
              <div className="step-head">
                <span className="step-title">{s.title}</span>
                <span className={`chip ${s.state === 'next' ? 'chip-next' : 'chip-locked'}`}>
                  {s.chip}
                </span>
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
