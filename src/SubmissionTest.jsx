// Ujian Praktek — peserta mengerjakan tugas di aplikasi ASLI (Word/Excel/PowerPoint),
// lalu mengunggah berkasnya. Lentera membongkar isi file Office di browser (tanpa
// server) dan menilai per butir rubrik dengan umpan balik dan saran yang jelas.
// Jenis file ditentukan oleh praktik.ext pada konten modul.
import { useRef, useState } from 'react'
import JSZip from 'jszip'

/* ---------- pembongkar & analisis OOXML (diuji di scripts/_check-sub.jsx) ---------- */

const unesc = (s) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")

// ===== Word (.docx) =====
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

// ===== Excel (.xlsx) =====
export function analyzeSheet(sheetXml, sharedXml) {
  const shared = sharedXml
    ? [...sharedXml.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) =>
        unesc([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join('')).trim())
    : []
  const rowsFilled = new Set()
  const row1Texts = []
  const formulas = []
  let cellCount = 0
  let hasNumber = false
  for (const m of sheetXml.matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
    const attrs = m[1] || ''
    const inner = m[2] || ''
    const r = attrs.match(/r="[A-Z]+(\d+)"/)
    const row = r ? +r[1] : 0
    const t = (attrs.match(/t="(\w+)"/) || [])[1]
    const f = (inner.match(/<f[^>]*>([\s\S]*?)<\/f>/) || [])[1]
    const v = (inner.match(/<v[^>]*>([\s\S]*?)<\/v>/) || [])[1]
    let text = ''
    if (t === 's' && v != null) text = shared[+v] ?? ''
    else if (t === 'inlineStr') text = unesc([...inner.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((x) => x[1]).join('')).trim()
    else if (t === 'str' && v != null) text = unesc(v).trim()
    const isi = !!(text || f || (v != null && v !== ''))
    if (!isi) continue
    cellCount++
    if (row) rowsFilled.add(row)
    if (row === 1 && text) row1Texts.push(text)
    if (f) formulas.push(f)
    if ((!t || t === 'n') && v != null && v !== '') hasNumber = true
  }
  return { cellCount, rowCount: rowsFilled.size, row1Texts, formulas, hasNumber }
}

// ===== PowerPoint (.pptx) =====
export function analyzeSlides(slideXmls) {
  const slides = slideXmls.map((xml) => {
    const texts = [...xml.matchAll(/<a:t[^>]*>([\s\S]*?)<\/a:t>/g)].map((m) => unesc(m[1]).trim()).filter(Boolean)
    const paraCount = [...xml.matchAll(/<a:p\b[\s\S]*?<\/a:p>/g)]
      .filter((p) => /<a:t[^>]*>[^<]*\S[^<]*<\/a:t>/.test(p[0])).length
    return { hasText: texts.length > 0, paraCount, words: texts.join(' ').split(/\s+/).filter(Boolean).length }
  })
  return {
    slideCount: slides.length,
    slides,
    words: slides.reduce((a, s) => a + s.words, 0),
  }
}

// Pemeriksa per butir rubrik — id di konten modul merujuk ke sini.
export const CHECKS = {
  // Modul 1 — Word
  'docx-valid': (d) => d.paras.length > 0,
  'judul-surat': (d) => d.paras.some((p) => /surat\s+izin/i.test(p.text)),
  'judul-bold': (d) => d.paras.some((p) => /surat\s+izin/i.test(p.text) && p.bold),
  'judul-center': (d) => d.paras.some((p) => /surat\s+izin/i.test(p.text) && p.center),
  'ada-list': (d) => d.paras.some((p) => p.list && p.text),
  'gaya-tambahan': (d) => d.paras.some((p) => (p.ital || p.under) && p.text),
  'kata-40': (d) => d.words >= 40,
  // Modul 5 — Laporan harian simulasi (Word)
  'judul-laporan': (d) => d.paras.some((p) => /laporan/i.test(p.text)),
  'laporan-bold': (d) => d.paras.some((p) => /laporan/i.test(p.text) && p.bold),
  'laporan-center': (d) => d.paras.some((p) => /laporan/i.test(p.text) && p.center),
  'kata-60': (d) => d.words >= 60,
  // Modul 2 — Excel
  'xlsx-valid': (d) => d.cellCount > 0,
  'header-3': (d) => d.row1Texts.length >= 3,
  'baris-5': (d) => d.rowCount >= 6,
  'ada-angka': (d) => d.hasNumber,
  'ada-kali': (d) => d.formulas.some((f) => f.includes('*')),
  'ada-sum': (d) => d.formulas.some((f) => /SUM\s*\(/i.test(f)),
  // Modul 3 — PowerPoint
  'pptx-valid': (d) => d.slideCount > 0,
  'slide-3': (d) => d.slideCount >= 3,
  'judul-slide1': (d) => !!d.slides[0]?.hasText,
  'isi-butir': (d) => d.slides.some((s) => s.paraCount >= 3),
  'kata-30': (d) => d.words >= 30,
}

const SARAN = {
  'docx-valid': 'Simpan ulang dari Word sebagai Word Document (*.docx), lalu unggah file itu.',
  'judul-surat': 'Tulis judul yang memuat kata "SURAT IZIN" di baris atas dokumen.',
  'judul-bold': 'Pilih (blok) baris judul sampai biru, lalu tekan Ctrl + B.',
  'judul-center': 'Klik di baris judul lalu tekan Ctrl + E.',
  'ada-list': 'Pakai tombol Numbering/Bullets di grup Paragraph — bukan angka ketikan manual.',
  'gaya-tambahan': 'Pilih satu kata lalu tekan Ctrl + I (miring) atau Ctrl + U (garis bawah).',
  'kata-40': 'Tambah isi suratmu — sebutkan alasan izin dan tanggalnya.',
  'judul-laporan': 'Tulis judul yang memuat kata "LAPORAN" di baris atas dokumen.',
  'laporan-bold': 'Pilih (blok) baris judul laporan, lalu tekan Ctrl + B.',
  'laporan-center': 'Klik di baris judul laporan lalu tekan Ctrl + E.',
  'kata-60': 'Lengkapi isi laporanmu — pembuka, daftar pekerjaan, dan catatan penutup (minimal 60 kata).',
  'xlsx-valid': 'Simpan ulang dari Excel sebagai Excel Workbook (*.xlsx), lalu unggah file itu.',
  'header-3': 'Isi baris 1 dengan judul kolom — minimal 3, misalnya Barang, Harga, Jumlah.',
  'baris-5': 'Tambah barisan datamu sampai minimal 5 baris di bawah judul kolom.',
  'ada-angka': 'Ketik harga dan jumlah sebagai ANGKA polos (52000) — tanpa huruf Rp.',
  'ada-kali': 'Kolom Total isi dengan rumus perkalian, contoh =B2*C2, lalu salin ke bawah.',
  'ada-sum': 'Buat jumlah keseluruhan dengan =SUM(...) atau tombol Σ AutoSum (Alt + =).',
  'pptx-valid': 'Simpan ulang dari PowerPoint sebagai PowerPoint Presentation (*.pptx), lalu unggah file itu.',
  'slide-3': 'Tambah slide dengan Ctrl + M sampai minimal 3 slide.',
  'judul-slide1': 'Klik kotak judul di slide pertama, lalu ketik judul presentasimu.',
  'isi-butir': 'Di salah satu slide, ketik minimal 3 butir — tiap Enter membuat butir baru.',
  'kata-30': 'Isi slide-slidemu lebih lengkap — total minimal 30 kata.',
}

export function evalRubric(rubric, d) {
  return rubric.map((c) => ({ ...c, ok: !!CHECKS[c.id]?.(d), saran: SARAN[c.id] }))
}

/* ---------- pembongkar file per jenis ---------- */

const APP = {
  docx: { name: 'Word', jenis: 'Word Document (*.docx)' },
  xlsx: { name: 'Excel', jenis: 'Excel Workbook (*.xlsx)' },
  pptx: { name: 'PowerPoint', jenis: 'PowerPoint Presentation (*.pptx)' },
}

export async function bongkar(file, ext) {
  const zip = await JSZip.loadAsync(file)
  if (ext === 'docx') {
    const doc = zip.file('word/document.xml')
    if (!doc) throw new Error('bukan dokumen Word')
    return analyzeXml(await doc.async('string'))
  }
  if (ext === 'xlsx') {
    const sheet = zip.file('xl/worksheets/sheet1.xml') || zip.file(/^xl\/worksheets\/sheet\d+\.xml$/)[0]
    if (!sheet) throw new Error('bukan buku kerja Excel')
    const ss = zip.file('xl/sharedStrings.xml')
    return analyzeSheet(await sheet.async('string'), ss ? await ss.async('string') : '')
  }
  if (ext === 'pptx') {
    const files = zip.file(/^ppt\/slides\/slide\d+\.xml$/)
    if (!files.length) throw new Error('bukan presentasi PowerPoint')
    files.sort((a, b) => +a.name.match(/(\d+)/)[1] - +b.name.match(/(\d+)/)[1])
    return analyzeSlides(await Promise.all(files.map((f) => f.async('string'))))
  }
  throw new Error('jenis file tidak dikenal')
}

/* ---------- komponen ---------- */

export default function SubmissionTest({ praktik, bestScore, onFinish, onBack }) {
  const [result, setResult] = useState(null)
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const startRef = useRef(Date.now())
  const fileRef = useRef(null)

  const ext = praktik.ext[0]
  const app = APP[ext] ?? APP.docx

  async function periksa() {
    const file = fileRef.current?.files?.[0]
    setErr(null); setResult(null); setSaved(false)
    if (!file) { setErr(`Pilih dulu file ${app.name} (.${ext}) hasil kerjamu.`); return }
    if (!new RegExp(`\\.${ext}$`, 'i').test(file.name)) {
      setErr(`File ini bukan .${ext}. Di ${app.name}: simpan dengan jenis "${app.jenis}", lalu unggah file itu.`)
      return
    }
    setBusy(true)
    try {
      const hasil = evalRubric(praktik.rubric, await bongkar(file, ext))
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
      setErr(`File tidak bisa dibaca sebagai berkas ${app.name}. Pastikan ini .${ext} asli hasil simpanan ${app.name} — bukan hasil ganti nama.`)
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
        Inilah puncaknya: bukan menjawab soal, tapi MEMBUAT berkas sungguhan di {app.name}.
        Kerjakan langkah-langkah di bawah, simpan, lalu unggah file .{ext}-mu — Lentera
        membongkar isinya dan menilai setiap butir satu per satu. Boleh diperbaiki dan
        diunggah ulang sampai lulus (nilai lulus {praktik.pass}).
      </p>
      {bestScore != null && (
        <p className="lesson-desc"><strong>Nilai terbaikmu sejauh ini: {bestScore}.</strong></p>
      )}

      <div className="blk-box blk-try">
        <span className="box-label">Tugasmu di {app.name}</span>
        <ol className="blk-steps">
          {praktik.brief.map((t, i) => <li key={i}>{t}</li>)}
        </ol>
      </div>

      <div className="upl">
        <p><strong>Sudah selesai dan tersimpan (Ctrl + S)?</strong> Unggah file .{ext}-nya:</p>
        <input ref={fileRef} type="file" accept={`.${ext}`} className="upl-input" />
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
              ? `LULUS! Berkasmu memenuhi standar — kamu resmi bisa bekerja di ${app.name} sungguhan.`
              : `Belum lulus (butuh ${praktik.pass}). Perbaiki yang bertanda ✗ di ${app.name}, simpan, lalu unggah lagi.`}
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
