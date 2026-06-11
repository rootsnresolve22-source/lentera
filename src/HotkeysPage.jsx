import { useState } from 'react'
import { HOTKEYS } from './content/hotkeys'
import { P3K } from './content/p3k'

// Kamus Pintasan & P3K — bebas diakses semua peserta, bisa dicari, bisa dicetak.
export default function HotkeysPage({ onBack }) {
  const [tab, setTab] = useState('pintasan')
  const [q, setQ] = useState('')
  const s = q.trim().toLowerCase()

  const groups = HOTKEYS.map((g) => ({
    ...g,
    items: !s ? g.items : g.items.filter((it) =>
      [it.en, it.id, it.ket, it.k.join(' ')].join(' ').toLowerCase().includes(s)
    ),
  })).filter((g) => g.items.length)

  const p3k = P3K.map((g) => ({
    ...g,
    items: !s ? g.items : g.items.filter((it) =>
      [it.q, it.fix, it.jurus, (it.k || []).join(' ')].join(' ').toLowerCase().includes(s)
    ),
  })).filter((g) => g.items.length)

  return (
    <div className="lesson">
      <div className="no-print" style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <button className="btn-back" onClick={onBack} style={{ margin: 0 }}>← Kembali</button>
        <button className="btn-ghost" onClick={() => window.print()}>Cetak halaman ini</button>
      </div>
      <p className="lesson-eyebrow">Terbuka untuk semua peserta, di level mana pun</p>
      <h1 className="lesson-title">{tab === 'pintasan' ? 'Kamus Pintasan' : 'P3K — Pertolongan Pertama Pada Komputer'}</h1>
      <p className="lesson-desc">
        {tab === 'pintasan'
          ? 'Semua jurus keyboard dalam satu halaman — ditulis berpasangan: istilah Inggris seperti di layar / artinya. Cari saat butuh, lama-lama melekat sendiri.'
          : '"1001" masalah yang paling sering bikin panik — dan jurus cepat menyelesaikannya. Sebelum bertanya ke siapa pun, intip dulu di sini: kemungkinan besar obatnya cuma satu-dua tekan.'}
      </p>
      <div className="hk-tabs no-print">
        <button className={tab === 'pintasan' ? 'hk-tab hk-tab-on' : 'hk-tab'} onClick={() => setTab('pintasan')}>Kamus Pintasan</button>
        <button className={tab === 'p3k' ? 'hk-tab hk-tab-on' : 'hk-tab'} onClick={() => setTab('p3k')}>P3K — Masalah Umum</button>
      </div>
      <input
        className="hk-search no-print"
        placeholder={tab === 'pintasan' ? 'Cari… (contoh: simpan, print, tab, rata)' : 'Cari masalahmu… (contoh: hang, #N/A, terpotong, blank)'}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {tab === 'pintasan' && groups.map((g) => (
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
      {tab === 'pintasan' && !groups.length && <p className="lesson-desc">Tidak ada pintasan yang cocok dengan "{q}".</p>}

      {tab === 'p3k' && p3k.map((g) => (
        <section key={g.cat} className="hk-group">
          <h3 className="blk-h">{g.cat}</h3>
          <ul className="hk-list">
            {g.items.map((it, i) => (
              <li key={i} className="hk-row">
                <span className="hk-keys">
                  {it.k ? it.k.map((kk, j) => (
                    <span key={j}>
                      <kbd className="hk-kbd">{kk}</kbd>
                      {j < it.k.length - 1 && <span className="hk-plus">+</span>}
                    </span>
                  )) : <span className="hk-chip">{it.jurus}</span>}
                </span>
                <span className="hk-desc">
                  <strong>{it.q}</strong>
                  <em>{it.fix}</em>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {tab === 'p3k' && !p3k.length && <p className="lesson-desc">Tidak ada masalah yang cocok dengan "{q}" — coba kata yang lebih pendek.</p>}
    </div>
  )
}
