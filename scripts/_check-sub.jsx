import JSZip from 'jszip'
import { readFileSync } from 'node:fs'
import { analyzeXml, evalRubric } from '../src/SubmissionTest'
import { MODUL1 } from '../src/content/modul1'
async function main() {
  for (const f of ['/tmp/good.docx', '/tmp/bad.docx']) {
    const zip = await JSZip.loadAsync(readFileSync(f))
    const xml = await zip.file('word/document.xml').async('string')
    const hasil = evalRubric(MODUL1.praktik.rubric, analyzeXml(xml))
    const benar = hasil.filter((h) => h.ok).length
    const skor = Math.round((benar / hasil.length) * 100)
    console.log(f.split('/').pop(), '->', skor, '|', hasil.map((h) => `${h.ok ? '+' : '-'}${h.id}`).join(' '))
  }
}
main()
