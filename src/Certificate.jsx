// Sertifikat Kelulusan Lentera — terbit saat seluruh kurikulum M0–M4 tuntas.
// Dicetak lewat dialog cetak browser (pola yang sama dengan rapot).
import Lamp from './Lamp'
import { MODULES } from './content'
import { hitungIndeks } from './score'

export default function Certificate({ user, progress, activity, track, onBack }) {
  const s = hitungIndeks({ progress, activity14: activity, track })
  const nama = user.full_name || user.username
  const tanggal = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  const finals = ['m0', 'm1', 'm2', 'm3', 'm4', 'm5']
  const praktiks = ['m1', 'm2', 'm3', 'm5']
  return (
    <div className="lesson">
      <div className="no-print" style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <button className="btn-back" style={{ margin: 0 }} onClick={onBack}>← Kembali</button>
        <button className="btn-primary" onClick={() => window.print()}>Cetak / simpan PDF</button>
      </div>
      <div className="cert">
        <div className="cert-inner">
          <Lamp size={84} />
          <p className="cert-eyebrow">LENTERA — PROGRAM KOMPUTER DASAR</p>
          <h1 className="cert-title">Sertifikat Kelulusan</h1>
          <p className="cert-sub">diberikan kepada</p>
          <p className="cert-name">{nama}</p>
          <p className="cert-body">
            yang telah menuntaskan seluruh kurikulum Lentera — enam modul (M0–M5)
            ({s.totalLangkah} langkah): ujian teori lima modul serta ujian praktek
            Word, Excel, PowerPoint, serta simulasi satu hari kerja penuh dengan berkas karya sendiri.
          </p>
          <div className="cert-grid">
            <div>
              <span className="cert-k">Ujian teori M0–M5</span>
              <span className="cert-v">{finals.map((k) => s.finals[k] ?? '—').join(' · ')}</span>
            </div>
            <div>
              <span className="cert-k">Ujian praktek M1–M3 & M5</span>
              <span className="cert-v">{praktiks.map((k) => s.praktiks?.[k] ?? '—').join(' · ')}</span>
            </div>
          </div>
          <p className="cert-indeks">Indeks Lentera: <strong>{s.indeks}</strong> — {s.predikat}</p>
          <div className="cert-foot">
            <div className="cert-date">Rempang, {tanggal}</div>
            <div className="cert-sign">
              <div className="cert-line" />
              <strong>Mohammad Dimas Priambodo</strong>
              <span>Pembimbing Program Lentera</span>
            </div>
          </div>
          <p className="cert-note">
            Modul: {MODULES.filter((e) => !e.bonus).map((e) => e.module.title.split(' — ')[0]).join(' · ')} — dinilai otomatis dan transparan oleh aplikasi Lentera.
          </p>
        </div>
      </div>
    </div>
  )
}
