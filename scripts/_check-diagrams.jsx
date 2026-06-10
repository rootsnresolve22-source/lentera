import { renderToStaticMarkup } from 'react-dom/server'
import { writeFileSync } from 'node:fs'
import { Diagram } from '../src/Illustrations'
for (const k of ['laptop', 'word', 'savedialog', 'printdialog']) {
  try {
    writeFileSync(`/tmp/${k}.svg`, renderToStaticMarkup(<Diagram kind={k} props={{}} />))
    console.log('OK ', k)
  } catch (e) {
    console.log('GAGAL', k, '->', e.message.slice(0, 80))
  }
}
