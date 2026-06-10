import { useState } from 'react'
import { HOTKEYS } from './content/hotkeys'

// Kamus Pintasan — bebas diakses semua peserta, bisa dicari, bisa dicetak.
export default function HotkeysPage({ onBack }) {
  const [q, setQ] = useState('')
  const s = q.trim().toLowerCase()
  const groups = HOTKEYS.map((g) => ({
    ...g,
    items: !s ? g.items : g.items.filter((it) =>
      [it.en, it.id, it.ket, it.k.join(' ')].join(' ').toLowerCase().includes(s)
    ),
  })).filter((g) => g.items.length)

  return (
    <div className="lesson">
      <div className="no-print" style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <button className="btn-back" onClick={onBack} style={{ margin: 0 }}>← Kembali</button>
        <button className="btn-ghost" onClick={() => window.print()}>Cetak kamus</button>
      </div>
      <p className="lesson-eyebrow">Terbuka untuk semua peserta, di level mana pun</p>
      <h1 className="lesson-title">Kamus Pintasan</h1>
      <p className="lesson-desc">
        Semua jurus keyboard dalam satu halaman — ditulis berpasangan: istilah Inggris
        seperti di layar / artinya. Tidak perlu dihafal sekaligus: cari saat butuh, lama-lama melekat sendiri.
      </p>
      <input
        className="hk-search no-print"
        placeholder="Cari… (contoh: simpan, print, tab, rata)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {groups.map((g) => (
        <section key={g.cat} className="hk-group">
          <h3 className="blk-h">{g.cat}</h3>
          <ul className="hk-list">
            {g.items.map((it, i) => (
              <li key={i} className="hk-row">
                <span className="hk-keys">
                  {it.k.map((kk, j) => (
                    <span key={j}>
                      <kbd className="hk-kbd">{kk}</kbd>
                      {j < it.k.length - 1 && <span className="hk-plus">+</span>}
                    </span>
                  ))}
                </span>
                <span className="hk-desc">
                  <strong>{it.en} / {it.id}</strong>
                  <em>{it.ket}</em>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {!groups.length && <p className="lesson-desc">Tidak ada pintasan yang cocok dengan "{q}".</p>}
    </div>
  )
}
