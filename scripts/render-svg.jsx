// Render semua diagram satu modul menjadi SVG statis untuk PDF.
// Pilih modul lewat env MOD (m0..m4). Dijalankan lewat bundel esbuild di Node.
import { renderToStaticMarkup } from 'react-dom/server'
import { mkdirSync, writeFileSync } from 'node:fs'
import { Diagram } from '../src/Illustrations'
import Lamp from '../src/Lamp'
import { MODUL0 } from '../src/content/modul0'
import { MODUL1 } from '../src/content/modul1'
import { MODUL2 } from '../src/content/modul2'
import { MODUL3 } from '../src/content/modul3'
import { MODUL4 } from '../src/content/modul4'
import { MODUL5 } from '../src/content/modul5'

const MOD = process.env.MOD || 'm0'
const M = { m0: MODUL0, m1: MODUL1, m2: MODUL2, m3: MODUL3, m4: MODUL4, m5: MODUL5 }[MOD]
const OUT = `/tmp/lentera-pdf-${MOD}`
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

for (const bab of M.bab) {
  for (const b of bab.blocks) if (b.t === 'img') renderDiagram(b.kind, b.props)
  for (const q of bab.quiz) if (q.img) renderDiagram(q.img.kind, q.img.props)
}

const lampSvg = renderToStaticMarkup(<Lamp size={280} />)
writeFileSync(`${OUT}/lamp.svg`, lampSvg)
writeFileSync(`${OUT}/content.json`, JSON.stringify(M, null, 1))
writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 1))
console.log(MOD, '| diagram unik:', Object.keys(manifest).length, '| bab:', M.bab.length)
