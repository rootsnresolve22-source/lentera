import { useEffect, useState } from 'react'
import Login from './Login'
import Dashboard from './Dashboard'
import Certificate from './Certificate'
import SmartReview from './SmartReview'
import ModulePage from './ModulePage'
import LessonView from './LessonView'
import TypingDrill from './TypingDrill'
import FinalTest from './FinalTest'
import Placement from './Placement'
import AdminPanel from './AdminPanel'
import SubmissionTest from './SubmissionTest'
import HotkeysPage from './HotkeysPage'
import { getEntry, findBab } from './content'
import * as api from './api'

const TOKEN_KEY = 'lentera_token'
const getToken = () => localStorage.getItem(TOKEN_KEY)

export default function App() {
  const [state, setState] = useState({ phase: 'boot', user: null, progress: [], activity: null })
  const [view, setView] = useState({ name: 'dashboard' })

  function loadMe(token) {
    return api.me(token).then(({ user, progress, activity }) => {
      setState({ phase: 'app', user, progress, activity })
    })
  }

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setState({ phase: 'login', user: null, progress: [], activity: null })
      return
    }
    loadMe(token).catch(() => {
      localStorage.removeItem(TOKEN_KEY)
      setState({ phase: 'login', user: null, progress: [], activity: null })
    })
  }, [])

  // Denyut aktivitas: ping saat aplikasi terbuka + tiap 4 menit selama tab terlihat.
  useEffect(() => {
    if (state.phase !== 'app') return
    const send = () => {
      if (document.visibilityState === 'visible') {
        const t = getToken()
        if (t) api.ping(t).catch(() => {})
      }
    }
    send()
    const id = setInterval(send, 4 * 60 * 1000)
    return () => clearInterval(id)
  }, [state.phase, state.user?.id])

  function handleLogin({ token, user }) {
    localStorage.setItem(TOKEN_KEY, token)
    setState({ phase: 'app', user, progress: [], activity: null })
    setView({ name: 'dashboard' })
    loadMe(token).catch(() => {})
  }

  async function handleLogout() {
    const token = getToken()
    localStorage.removeItem(TOKEN_KEY)
    setState({ phase: 'login', user: null, progress: [], activity: null })
    setView({ name: 'dashboard' })
    if (token) {
      try { await api.logout(token) } catch (e) { /* aman diabaikan */ }
    }
  }

  // Simpan progres + metrik ke server lalu cerminkan ke state lokal.
  async function saveProgress(item_id, status, score = null, extra = {}) {
    const token = getToken()
    if (!token) return false
    try {
      const res = await api.saveProgress(token, item_id, status, score, extra)
      setState((s) => {
        const i = s.progress.findIndex((p) => p.item_id === res.item_id)
        const item = {
          item_id: res.item_id, status: res.status, score: res.score,
          attempts: res.attempts, seconds: res.seconds, meta: res.meta,
        }
        const progress = i === -1 ? [...s.progress, item] : s.progress.map((p, j) => (j === i ? item : p))
        return { ...s, progress }
      })
      return true
    } catch (e) {
      console.error('saveProgress', e)
      return false
    }
  }

  function go(name, extra = {}) {
    setView({ name, ...extra })
    window.scrollTo(0, 0)
  }

  if (state.phase === 'boot') {
    return (
      <div className="boot">
        <div className="boot-flame" aria-hidden="true" />
        <p>Menyiapkan…</p>
      </div>
    )
  }

  if (state.phase === 'login') return <Login onLogin={handleLogin} />

  const progressMap = Object.fromEntries(state.progress.map((p) => [p.item_id, p]))
  const isAdmin = state.user.role === 'admin'
  const track = isAdmin ? 'cepat' : progressMap['placement']?.meta?.track ?? 'pemula'

  // Gerbang penempatan: peserta baru wajib lewat tes penempatan sekali.
  if (!isAdmin && !progressMap['placement']) {
    return (
      <Placement
        onDone={async (payload) => {
          if (!payload) { go('dashboard'); return true }
          let ok = await saveProgress('placement', 'selesai', payload.score, { meta: payload.meta })
          for (const id of payload.tandaiSelesai ?? []) {
            const r = await saveProgress(id, 'selesai', null, { meta: { via: 'placement' } })
            ok = ok && r
          }
          return ok
        }}
      />
    )
  }

  if (view.name === 'admin' && isAdmin) {
    return <AdminPanel token={getToken()} onBack={() => go('dashboard')} />
  }

  if (view.name === 'module') {
    const entry = getEntry(view.moduleId ?? 'm0')
    return (
      <div className="shell">
        <ModulePage
          entry={entry}
          progressMap={progressMap}
          track={track}
          onOpenBab={(id) => go('lesson', { babId: id })}
          onOpenDrill={() => go('drill')}
          onOpenFinal={() => go('final', { moduleId: entry.module.id })}
          onOpenPraktik={() => go('praktik', { moduleId: entry.module.id })}
          onOpenReview={() => go('review', { moduleId: entry.module.id })}
          onBack={() => go('dashboard')}
        />
      </div>
    )
  }

  if (view.name === 'lesson') {
    const hit = findBab(view.babId)
    if (!hit) {
      setTimeout(() => go('module'), 0)
      return null
    }
    const { entry, bab } = hit
    const i = entry.module.bab.indexOf(bab)
    const nextBab = entry.module.bab[i + 1] || null
    return (
      <div className="shell">
        <LessonView
          key={bab.id}
          bab={bab}
          nextBab={nextBab}
          alreadyDone={progressMap[bab.id]?.status === 'selesai'}
          onComplete={(id, payload) => saveProgress(id, 'selesai', null, payload)}
          onBack={() => go('module', { moduleId: entry.module.id })}
          onOpenBab={(id) => go('lesson', { babId: id })}
        />
      </div>
    )
  }

  if (view.name === 'drill') {
    return (
      <div className="shell">
        <TypingDrill
          bestLevel={Number(progressMap['m0.drill']?.score ?? 0)}
          onPass={(level, extra) => saveProgress('m0.drill', 'selesai', level, extra)}
          onBack={() => go('module', { moduleId: 'm0' })}
        />
      </div>
    )
  }

  if (view.name === 'praktik') {
    const entry = getEntry(view.moduleId ?? 'm1')
    const praktik = entry.module.praktik
    return (
      <div className="shell">
        <SubmissionTest
          praktik={praktik}
          bestScore={progressMap[praktik.id]?.score ?? null}
          onFinish={(score, passed, seconds, meta) =>
            saveProgress(praktik.id, passed ? 'selesai' : 'sedang', score, { seconds, meta })
          }
          onBack={() => go('module', { moduleId: entry.module.id })}
        />
      </div>
    )
  }

  if (view.name === 'sertifikat') {
    return (
      <Certificate
        user={state.user}
        progress={state.progress}
        activity={state.activity}
        track={track}
        onBack={() => go('dashboard')}
      />
    )
  }

  if (view.name === 'review') {
    const entry = getEntry(view.moduleId ?? 'm0')
    return (
      <div className="shell">
        <SmartReview
          entry={entry}
          progressMap={progressMap}
          onSave={(cleared) =>
            saveProgress(entry.module.id + '.review', 'selesai', null, { meta: { cleared } })
          }
          onBack={() => go('module', { moduleId: entry.module.id })}
        />
      </div>
    )
  }

  if (view.name === 'hotkeys') {
    return (
      <div className="shell">
        <HotkeysPage onBack={() => go('dashboard')} />
      </div>
    )
  }

  if (view.name === 'final') {
    const entry = getEntry(view.moduleId ?? 'm0')
    const finalId = entry.module.final.id
    return (
      <div className="shell">
        <FinalTest
          test={entry.module.final}
          bestScore={progressMap[finalId]?.score ?? null}
          onFinish={(score, passed, seconds, wrongIdx, lockExits) =>
            saveProgress(finalId, passed ? 'selesai' : 'sedang', score, {
              seconds,
              meta: { lastScore: score, wrongIdx, qcount: entry.module.final.questions.length, lockExits },
            })
          }
          onBack={() => go('module', { moduleId: entry.module.id })}
        />
      </div>
    )
  }

  return (
    <Dashboard
      user={state.user}
      progressMap={progressMap}
      activity={state.activity}
      track={track}
      onLogout={handleLogout}
      onOpenModule={(id) => go('module', { moduleId: id ?? 'm0' })}
      onOpenHotkeys={() => go('hotkeys')}
      onOpenCertificate={() => go('sertifikat')}
      onOpenAdmin={isAdmin ? () => go('admin') : null}
    />
  )
}
