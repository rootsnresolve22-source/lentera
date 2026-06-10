import { useEffect, useState } from 'react'
import Lamp from './Lamp'
import * as api from './api'
import { MODULES, moduleUnlocked } from './content'
import { hitungIndeks, insightOtomatis, jalurLabel, ketepatanBab } from './score'

const fmtMenit = (m) => (m >= 60 ? `${Math.floor(m / 60)}j ${m % 60}m` : `${m}m`)
const fmtDetik = (s) => (s == null ? '—' : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`)
const fmtTgl = (iso) =>
  iso ? new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
const fmtTglJam = (iso) =>
  iso ? new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'belum pernah'

function olah(p) {
  const placement = (p.progress || []).find((r) => r.item_id === 'placement')
  const track = placement?.meta?.track ?? 'pemula'
  const skor = hitungIndeks({ progress: p.progress, activity14: p.activity14, track })
  return { ...p, placement, track, skor }
}

/* ================= RAPOT (siap cetak) ================= */

function Rapor({ d, generatedAt, onBack }) {
  const s = d.skor
  const insights = insightOtomatis(s, d.activity14, d.track, d.placement?.meta?.skipped ? null : d.placement?.score ?? null)
  const sub = [
    ['Penguasaan', s.P, '50%'],
    ['Ketelitian', s.T, '20%'],
    ['Kecepatan', s.C, '15%'],
    ['Kerajinan', s.K, '15%'],
  ]
  return (
    <div className="lesson">
      <div className="no-print" style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <button className="btn-back" onClick={onBack} style={{ margin: 0 }}>← Daftar peserta</button>
        <button className="btn-primary btn-sm" onClick={() => window.print()}>Cetak rapot</button>
      </div>

      <div className="rapor">
        <div className="rapor-head">
          <div className="topbar-brand">
            <Lamp size={34} />
            <div className="brand-stack">
              <span className="brand-word">Lentera</span>
              <span className="credit">created by <strong>Mohammad Dimas Priambodo</strong></span>
            </div>
          </div>
          <div className="rapor-title">
            <h1>Rapot Peserta</h1>
            <p>Data per {fmtTgl(generatedAt)} · Modul terbuka: {s.openIds.map((id) => id.toUpperCase()).join(' + ')}</p>
          </div>
        </div>

        <div className="rapor-ident">
          <div><span>Nama</span><strong>{d.user.full_name}</strong></div>
          <div><span>Akun</span><strong>{d.user.username}</strong></div>
          <div><span>Jalur</span><strong>{jalurLabel(d.track)}</strong></div>
          <div>
            <span>Penempatan</span>
            <strong>
              {d.placement
                ? d.placement.meta?.skipped
                  ? 'Mulai dari nol (tes dilewati, jujur)'
                  : `Skor ${d.placement.score} (benar ${d.placement.meta?.correct}/${d.placement.meta?.total}, salah ${(d.placement.meta?.total ?? 0) - (d.placement.meta?.correct ?? 0)})`
                : 'Belum'}
            </strong>
          </div>
        </div>

        <div className="rapor-indeks">
          <div className="ri-big">
            <span className="ri-num">{s.indeks}</span>
            <span className="ri-label">Indeks Lentera</span>
            <span className="ri-pred">{s.predikat}</span>
          </div>
          <div className="ri-subs">
            {sub.map(([nama, v, bobot]) => (
              <div className="ri-sub" key={nama}>
                <span className="ri-sub-num">{v == null ? '—' : v}</span>
                <span className="ri-sub-name">{nama}</span>
                <span className="ri-sub-w">bobot {bobot}</span>
              </div>
            ))}
          </div>
        </div>

        <h3 className="blk-h">Rincian per langkah</h3>
        <table className="rapor-tab">
          <thead>
            <tr><th>Langkah</th><th>Status</th><th>Ketepatan</th><th>Waktu</th><th>Percobaan</th></tr>
          </thead>
          <tbody>
            {MODULES.flatMap((e) => {
              const open = moduleUnlocked(s.map, e)
              const fin = s.finals[e.module.id]
              const head = (
                <tr key={e.module.id + '-h'} className="rapor-mod">
                  <td colSpan="5">{e.module.title}</td>
                </tr>
              )
              if (!open) {
                return [head, (
                  <tr key={e.module.id + '-lock'}>
                    <td colSpan="5">Terkunci — selesaikan ujian akhir Modul 0 untuk membuka.</td>
                  </tr>
                )]
              }
              const babRows = e.module.bab.map((b) => {
                const p = s.map[b.id]
                return (
                  <tr key={b.id}>
                    <td>Bab {b.no} — {b.title}</td>
                    <td>{p?.status === 'selesai' ? (p?.meta?.via === 'placement' ? 'Lulus penempatan' : 'Selesai') : p ? 'Berjalan' : 'Belum'}</td>
                    <td>{ketepatanBab(p) != null ? ketepatanBab(p) + '%' : '—'}</td>
                    <td>{fmtDetik(p?.seconds)}</td>
                    <td>{p?.attempts ?? '—'}</td>
                  </tr>
                )
              })
              const drillRow = e.hasDrill ? [(
                <tr key="m0.drill">
                  <td>Mengetik 10 jari</td>
                  <td>{s.drillLevel >= 1 ? `Level ${s.drillLevel}/3` : 'Belum'}</td>
                  <td>
                    {['l1', 'l2', 'l3']
                      .map((k, i) => (s.map['m0.drill']?.meta?.[k] ? `L${i + 1}: ${s.map['m0.drill'].meta[k].acc}% · ${s.map['m0.drill'].meta[k].kpm} kpm` : null))
                      .filter(Boolean)
                      .join('  |  ') || '—'}
                  </td>
                  <td>{fmtDetik(s.map['m0.drill']?.seconds)}</td>
                  <td>{s.map['m0.drill']?.attempts ?? '—'}</td>
                </tr>
              )] : []
              const finalRow = (
                <tr key={e.module.final.id}>
                  <td>{e.module.final.title} (lulus {e.module.final.pass})</td>
                  <td>{fin == null ? 'Belum' : fin >= e.module.final.pass ? 'LULUS' : 'Belum lulus'}</td>
                  <td>{fin == null ? '—' : `Nilai terbaik ${fin}`}</td>
                  <td>{fmtDetik(s.map[e.module.final.id]?.seconds)}</td>
                  <td>{s.map[e.module.final.id]?.attempts ?? '—'}</td>
                </tr>
              )
              const praktikRows = e.module.praktik ? [(
                <tr key={e.module.praktik.id}>
                  <td>{e.module.praktik.title} (lulus {e.module.praktik.pass})</td>
                  <td>{s.praktiks[e.module.id] == null ? 'Belum' : s.praktiks[e.module.id] >= e.module.praktik.pass ? 'LULUS' : 'Belum lulus'}</td>
                  <td>{s.praktiks[e.module.id] == null ? '—' : `Nilai terbaik ${s.praktiks[e.module.id]}`}</td>
                  <td>{fmtDetik(s.map[e.module.praktik.id]?.seconds)}</td>
                  <td>{s.map[e.module.praktik.id]?.attempts ?? '—'}</td>
                </tr>
              )] : []
              return [head, ...babRows, ...drillRow, ...praktikRows, finalRow]
            })}
          </tbody>
        </table>

        <h3 className="blk-h">Kehadiran & aktivitas</h3>
        <div className="rapor-akt">
          <div><strong>{d.activity14.daysActive}</strong><span>hari aktif / 14 hari</span></div>
          <div><strong>{fmtMenit(d.activity14.minutes)}</strong><span>waktu belajar / 14 hari</span></div>
          <div><strong>{d.activity14.sessions}</strong><span>sesi / 14 hari</span></div>
          <div><strong>{d.activity30.logins}</strong><span>kali masuk / 30 hari</span></div>
          <div><strong>{d.skor.langkahSelesai}/{d.skor.totalLangkah}</strong><span>langkah modul terbuka</span></div>
          <div><strong>{fmtTglJam(d.activity30.lastSeen)}</strong><span>terakhir aktif</span></div>
        </div>

        <h3 className="blk-h">Catatan penilaian (otomatis)</h3>
        <ul className="blk-list rapor-notes">
          {insights.map((t, i) => <li key={i}>{t}</li>)}
        </ul>

        <div className="rapor-foot">
          <div className="rapor-sign">
            <p>Batam, {fmtTgl(generatedAt)}</p>
            <p className="rapor-sign-space">Pendamping / Admin</p>
            <p><strong>Mohammad Dimas Priambodo</strong></p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================= PANEL UTAMA ================= */

export default function AdminPanel({ token, onBack }) {
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)
  const [sel, setSel] = useState(null)

  function muat() {
    setErr(null)
    api.overview(token).then(setData).catch((e) => setErr(e.message))
  }
  useEffect(muat, [])

  if (sel) {
    return (
      <div className="shell shell-wide">
        <Rapor d={sel} generatedAt={data?.generated_at} onBack={() => setSel(null)} />
      </div>
    )
  }

  const rows = (data?.peserta ?? [])
    .filter((p) => p.user.role !== 'admin' && p.user.active)
    .map(olah)
    .sort((a, b) => b.skor.indeks - a.skor.indeks)

  return (
    <div className="shell shell-wide">
      <div className="lesson">
        <button className="btn-back" onClick={onBack}>← Beranda</button>
        <p className="lesson-eyebrow">Panel Admin</p>
        <h1 className="lesson-title">Pemantauan peserta</h1>
        <p className="lesson-desc">
          Indeks Lentera = Penguasaan 50% + Ketelitian 20% + Kecepatan 15% + Kerajinan 15%.
          Klik nama peserta untuk membuka rapot lengkap yang siap dicetak.
        </p>
        {err && <div className="quiz-fb fb-no">Gagal memuat: {err} <button className="btn-ghost" onClick={muat}>Coba lagi</button></div>}
        {!data && !err && <p className="lesson-desc">Memuat data…</p>}

        {data && (
          <div className="admin-wrap">
            <table className="admin-tab">
              <thead>
                <tr>
                  <th>Peserta</th><th>Jalur</th><th>Langkah</th><th>Ujian M0/M1</th><th>Ketik</th>
                  <th>Indeks</th><th>Hadir 14h</th><th>Masuk 30h</th><th>Terakhir aktif</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.user.id} onClick={() => setSel(p)} className="admin-row">
                    <td><strong>{p.user.full_name}</strong><br /><span className="admin-sub">{p.user.username}</span></td>
                    <td>{jalurLabel(p.track)}</td>
                    <td>{p.skor.langkahSelesai}/{p.skor.totalLangkah}</td>
                    <td>{p.skor.finals.m0 ?? '—'} / {p.skor.finals.m1 ?? '—'}</td>
                    <td>{p.skor.drillLevel ? 'L' + p.skor.drillLevel : '—'}</td>
                    <td><strong>{p.skor.indeks}</strong> <span className="admin-sub">{p.skor.predikat}</span></td>
                    <td>{p.activity14.daysActive} hr · {fmtMenit(p.activity14.minutes)}</td>
                    <td>{p.activity30.logins}×</td>
                    <td>{fmtTglJam(p.activity30.lastSeen)}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan="9">Belum ada peserta aktif.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
