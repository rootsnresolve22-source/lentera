// Ujian Praktek — peserta mengerjakan tugas di aplikasi ASLI (Word), lalu
// mengunggah berkasnya. Lentera membongkar isi .docx di browser (tanpa server)
// dan menilai per butir rubrik dengan umpan balik dan saran yang jelas.
import { useRef, useState } from 'react'
import JSZip from 'jszip'

/* ---------- pembongkar & analisis OOXML (diuji di scripts/_check-sub.jsx) ---------- */

const unesc = (s) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")

export function analyzeXml(xml) {
  const paras = [...xml.matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)].map((m) => {
    const raw = m[0]
    const text = unesc([...raw.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)].map((t) => t[1]).join('')).trim()
    return {
      text,
      center: /<w:jc [^>]*w:val="center"/.test(raw),
      right: /<w:jc [^>]*w:val="right"/.test(raw),
      both: /<w:jc [^>]*w:val="both"/.test(raw),
      list: /<w:numPr>/.test(raw) || /<w:pStyle [^>]*w:val="List/.test(raw),
      bold: /<w:b\b(?![^>]*w:val="(?:0|false)")/.test(raw),
      under: /<w:u\b(?![^>]*w:val="none")/.test(raw),
      ital: /<w:i\b(?![^>]*w:val="(?:0|false)")/.test(raw),
    }
  })
  const words = paras.map((p) => p.text).join(' ').split(/\s+/).filter(Boolean).length
  return { paras, words }
}

// Pemeriksa per butir rubrik — id di konten modul merujuk ke sini.
export const CHECKS = {
  'docx-valid': (d) => d.paras.length > 0,
  'judul-surat': (d) => d.paras.some((p) => /surat\s+izin/i.test(p.text)),
  'judul-bold': (d) => d.paras.some((p) => /surat\s+izin/i.test(p.text) && p.bold),
  'judul-center': (d) => d.paras.some((p) => /surat\s+izin/i.test(p.text) && p.center),
  'ada-list': (d) => d.paras.some((p) => p.list && p.text),
  'gaya-tambahan': (d) => d.paras.some((p) => (p.ital || p.under) && p.text),
  'kata-40': (d) => d.words >= 40,
}

const SARAN = {
  'docx-valid': 'Simpan ulang dari Word sebagai Word Document (*.docx), lalu unggah file itu.',
  'judul-surat': 'Tulis judul yang memuat kata "SURAT IZIN" di baris atas dokumen.',
  'judul-bold': 'Pilih (blok) baris judul sampai biru, lalu tekan Ctrl + B.',
  'judul-center': 'Klik di baris judul lalu tekan Ctrl + E.',
  'ada-list': 'Pakai tombol Numbering/Bullets di grup Paragraph — bukan angka ketikan manual.',
  'gaya-tambahan': 'Pilih satu kata lalu tekan Ctrl + I (miring) atau Ctrl + U (garis bawah).',
  'kata-40': 'Tambah isi suratmu — sebutkan alasan izin dan tanggalnya.',
}

export function evalRubric(rubric, d) {
  return rubric.map((c) => ({ ...c, ok: !!CHECKS[c.id]?.(d), saran: SARAN[c.id] }))
}

/* ---------- komponen ---------- */

export default function SubmissionTest({ praktik, bestScore, onFinish, onBack }) {
  const [result, setResult] = useState(null)
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const startRef = useRef(Date.now())
  const fileRef = useRef(null)

  async function periksa() {
    const file = fileRef.current?.files?.[0]
    setErr(null); setResult(null); setSaved(false)
    if (!file) { setErr('Pilih dulu file Word (.docx) hasil kerjamu.'); return }
    if (!/\.docx$/i.test(file.name)) {
      setErr('File ini bukan .docx. Di Word: simpan dengan jenis "Word Document (*.docx)", lalu unggah file itu.')
      return
    }
    setBusy(true)
    try {
      const zip = await JSZip.loadAsync(file)
      const doc = zip.file('word/document.xml')
      if (!doc) throw new Error('bukan dokumen Word')
      const xml = await doc.async('string')
      const hasil = evalRubric(praktik.rubric, analyzeXml(xml))
      const benar = hasil.filter((h) => h.ok).length
      const score = Math.round((benar / hasil.length) * 100)
      const passed = score >= praktik.pass
      const seconds = Math.min(7200, Math.round((Date.now() - startRef.current) / 1000))
      setResult({ hasil, benar, score, passed, fileName: file.name })
      const ok = await onFinish(score, passed, seconds, {
        rubric: Object.fromEntries(hasil.map((h) => [h.id, h.ok])),
        fileName: file.name,
      })
      setSaved(ok)
    } catch (e) {
      setErr('File tidak bisa dibaca sebagai dokumen Word. Pastikan ini .docx asli hasil simpanan Word — bukan hasil ganti nama.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="lesson">
      <button className="btn-back" onClick={onBack}>← Kembali ke modul</button>
      <p className="lesson-eyebrow">Ujian praktek · dinilai otomatis, transparan per kriteria</p>
      <h1 className="lesson-title">{praktik.title}</h1>
      <p className="lesson-desc">
        Inilah puncaknya: bukan menjawab soal, tapi MEMBUAT dokumen sungguhan di Word.
        Kerjakan langkah-langkah di bawah, simpan, lalu unggah file .docx-mu — Lentera
        membongkar isinya dan menilai setiap butir satu per satu. Boleh diperbaiki dan
        diunggah ulang sampai lulus (nilai lulus {praktik.pass}).
      </p>
      {bestScore != null && (
        <p className="lesson-desc"><strong>Nilai terbaikmu sejauh ini: {bestScore}.</strong></p>
      )}

      <div className="blk-box blk-try">
        <span className="box-label">Tugasmu di Word</span>
        <ol className="blk-steps">
          {praktik.brief.map((t, i) => <li key={i}>{t}</li>)}
        </ol>
      </div>

      <div className="upl">
        <p><strong>Sudah selesai dan tersimpan (Ctrl + S)?</strong> Unggah file .docx-nya:</p>
        <input ref={fileRef} type="file" accept=".docx" className="upl-input" />
        <button className="btn-primary" onClick={periksa} disabled={busy}>
          {busy ? 'Memeriksa…' : 'Periksa pekerjaanku'}
        </button>
      </div>

      {err && <div className="quiz-fb fb-no">{err}</div>}

      {result && (
        <div className="sub-hasil">
          <div className={`quiz-fb ${result.passed ? 'fb-yes' : 'fb-no'}`}>
            <strong>Nilai: {result.score}</strong> — {result.benar} dari {result.hasil.length} butir terpenuhi pada "{result.fileName}".{' '}
            {result.passed
              ? 'LULUS! Dokumenmu memenuhi standar — kamu resmi bisa membuat dokumen Word sungguhan.'
              : `Belum lulus (butuh ${praktik.pass}). Perbaiki yang bertanda ✗ di Word, simpan, lalu unggah lagi.`}
            {!saved && ' (Catatan: nilai belum tersimpan ke server — periksa internet, lalu unggah ulang.)'}
          </div>
          <ul className="sub-crit">
            {result.hasil.map((h) => (
              <li key={h.id} className={h.ok ? 'ok' : 'no'}>
                <span className="sub-mark">{h.ok ? '✓' : '✗'}</span>
                <span>
                  <strong>{h.label}</strong>
                  {!h.ok && <em> — {h.saran}</em>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
