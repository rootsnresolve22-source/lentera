// Render semua diagram Modul 0 menjadi SVG statis untuk PDF.
// Dijalankan lewat bundel esbuild (JSX -> JS) di Node.
import { renderToStaticMarkup } from 'react-dom/server'
import { mkdirSync, writeFileSync } from 'node:fs'
import { Diagram } from '../src/Illustrations'
import Lamp from '../src/Lamp'
import { MODUL0 } from '../src/content/modul0'

const OUT = '/tmp/lentera-pdf'
mkdirSync(OUT + '/diagrams', { recursive: true })

const manifest = {}
let n = 0

function renderDiagram(kind, props) {
  const key = kind + '|' + JSON.stringify(props || {})
  if (manifest[key]) return
  const svg = renderToStaticMarkup(<Diagram kind={kind} props={props || {}} />)
  const file = `d${String(n++).padStart(2, '0')}-${kind}.svg`
  writeFileSync(`${OUT}/diagrams/${file}`, svg)
  manifest[key] = file
}

// 1) Semua gambar materi
for (const bab of MODUL0.bab) {
  for (const b of bab.blocks) {
    if (b.t === 'img') renderDiagram(b.kind, b.props)
  }
  // 2) Gambar soal latihan (hotspot) per bab
  for (const q of bab.quiz) {
    if (q.img) renderDiagram(q.img.kind, q.img.props)
  }
}
// 3) Gambar soal ujian akhir (untuk lembar latihan tambahan? tidak dipakai — lewati)

// 4) Lampu lentera untuk sampul
const lampSvg = renderToStaticMarkup(<Lamp size={280} />)
writeFileSync(`${OUT}/lamp.svg`, lampSvg)

// 5) Konten sebagai JSON untuk pembangun PDF (python)
writeFileSync(`${OUT}/content.json`, JSON.stringify(MODUL0, null, 1))
writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 1))
console.log('diagram unik:', Object.keys(manifest).length, '| bab:', MODUL0.bab.length)
