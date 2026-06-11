import fs from 'node:fs'
import { buatZipRekap } from '../src/xlsxExport'
async function main() {
  const head = ['Nama', 'Username', 'Jalur', 'Langkah', 'Ujian M0', 'Indeks', 'Predikat']
  const rows = [
    ['Peserta Demo', 'demo', 'Jalur Cepat', 0, 90, 72, 'Terang'],
    ['Fauzi A', 'fauzi', 'Pemula', 10, '', 9, 'Baru Menyala'],
  ]
  const buf = await buatZipRekap(head, rows).generateAsync({ type: 'nodebuffer' })
  fs.writeFileSync('/tmp/rekap-test.xlsx', buf)
  console.log('xlsx ditulis:', buf.length, 'byte')
}
main()
