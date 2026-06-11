import fs from 'node:fs'
import { bongkar, evalRubric } from '../src/SubmissionTest'
import { MODUL5 } from '../src/content/modul5'
async function main() {
  for (const p of ['/tmp/good5.docx', '/tmp/bad5.docx']) {
    const hasil = evalRubric(MODUL5.praktik.rubric, await bongkar(fs.readFileSync(p), 'docx'))
    const benar = hasil.filter((h) => h.ok).length
    const score = Math.round((benar / hasil.length) * 100)
    console.log(p.padEnd(16), 'skor', score, score >= MODUL5.praktik.pass ? 'LULUS' : 'gagal', '| gugur:', hasil.filter((h) => !h.ok).map((h) => h.id).join(',') || '-')
  }
}
main()
