import { MODULES, moduleUnlocked } from '../src/content'
import { hitungIndeks } from '../src/score'
import { MODULBONUS, MB_ITEMS } from '../src/content/modulBonus'
const bonus = MODULES.find((e) => e.bonus)
console.log('terdaftar:', !!bonus, '| id:', bonus.module.id, '| items:', bonus.items.length, '| gate:', bonus.gate)
console.log('terbuka tanpa progress apa pun:', moduleUnlocked({}, bonus))
const s = hitungIndeks({ progress: [], activity14: [], track: 'pemula' })
console.log('openIds tanpa mb:', !s.openIds.includes('mb'), '| totalLangkah (harus 10, m0 saja):', s.totalLangkah)
console.log('finals punya slot mb utk rapot:', 'mb' in s.finals)
const k = MODULBONUS.bab.reduce((a, b) => a + b.quiz.length, 0)
console.log('mb:', MODULBONUS.bab.length, 'bab,', k, 'kuis,', MODULBONUS.final.questions.length, 'final, praktik:', MODULBONUS.praktik)
