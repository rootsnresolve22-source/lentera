import fs from 'node:fs'
import { bongkar, evalRubric } from '../src/SubmissionTest'
import { MODUL2 } from '../src/content/modul2'
import { MODUL3 } from '../src/content/modul3'
async function main() {
  const cases = [
    ['/tmp/good.xlsx', 'xlsx', MODUL2.praktik],
    ['/tmp/bad.xlsx', 'xlsx', MODUL2.praktik],
    ['/tmp/good.pptx', 'pptx', MODUL3.praktik],
    ['/tmp/bad.pptx', 'pptx', MODUL3.praktik],
  ]
  for (const [p, ext, pk] of cases) {
    const hasil = evalRubric(pk.rubric, await bongkar(fs.readFileSync(p), ext))
    const benar = hasil.filter((h) => h.ok).length
    const score = Math.round((benar / hasil.length) * 100)
    console.log(p.padEnd(16), 'skor', score, score >= pk.pass ? 'LULUS' : 'gagal', '| gugur:', hasil.filter((h) => !h.ok).map((h) => h.id).join(',') || '-')
  }
}
main()
