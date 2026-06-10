import { useEffect, useState } from 'react'
import Login from './Login'
import Dashboard from './Dashboard'
import ModulePage from './ModulePage'
import LessonView from './LessonView'
import TypingDrill from './TypingDrill'
import FinalTest from './FinalTest'
import { MODUL0 } from './content/modul0'
import * as api from './api'

const TOKEN_KEY = 'lentera_token'

export default function App() {
  const [state, setState] = useState({ phase: 'boot', user: null, progress: [] })
  const [view, setView] = useState({ name: 'dashboard' })

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setState({ phase: 'login', user: null, progress: [] })
      return
    }
    api
      .me(token)
      .then(({ user, progress }) => setState({ phase: 'app', user, progress }))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setState({ phase: 'login', user: null, progress: [] })
      })
  }, [])

  function handleLogin({ token, user }) {
    localStorage.setItem(TOKEN_KEY, token)
    setState({ phase: 'app', user, progress: [] })
    setView({ name: 'dashboard' })
    // ambil progres tersimpan milik akun ini
    api.me(token).then(({ progress }) => {
      setState((s) => ({ ...s, progress }))
    }).catch(() => {})
  }

  async function handleLogout() {
    const token = localStorage.getItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_KEY)
    setState({ phase: 'login', user: null, progress: [] })
    setView({ name: 'dashboard' })
    if (token) {
      try { await api.logout(token) } catch (e) { /* aman diabaikan */ }
    }
  }

  // Simpan progres ke server lalu cerminkan ke state lokal.
  // Mengembalikan true/false supaya layar bisa memberi tahu kalau gagal.
  async function saveProgress(item_id, status, score = null) {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return false
    try {
      const res = await api.saveProgress(token, item_id, status, score)
      setState((s) => {
        const i = s.progress.findIndex((p) => p.item_id === res.item_id)
        const item = { item_id: res.item_id, status: res.status, score: res.score }
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

  if (view.name === 'module') {
    return (
      <div className="shell">
        <ModulePage
          progressMap={progressMap}
          onOpenBab={(id) => go('lesson', { babId: id })}
          onOpenDrill={() => go('drill')}
          onOpenFinal={() => go('final')}
          onBack={() => go('dashboard')}
        />
      </div>
    )
  }

  if (view.name === 'lesson') {
    const i = MODUL0.bab.findIndex((b) => b.id === view.babId)
    const bab = MODUL0.bab[i]
    if (!bab) {
      setTimeout(() => go('module'), 0)
      return null
    }
    const nextBab = MODUL0.bab[i + 1] || null
    return (
      <div className="shell">
        <LessonView
          key={bab.id}
          bab={bab}
          nextBab={nextBab}
          alreadyDone={progressMap[bab.id]?.status === 'selesai'}
          onComplete={(id) => saveProgress(id, 'selesai')}
          onBack={() => go('module')}
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
          onPass={(level) => saveProgress('m0.drill', 'selesai', level)}
          onBack={() => go('module')}
        />
      </div>
    )
  }

  if (view.name === 'final') {
    return (
      <div className="shell">
        <FinalTest
          test={MODUL0.final}
          bestScore={progressMap['m0.final']?.score ?? null}
          onFinish={(score, passed) =>
            saveProgress('m0.final', passed ? 'selesai' : 'sedang', score)
          }
          onBack={() => go('module')}
        />
      </div>
    )
  }

  return (
    <Dashboard
      user={state.user}
      progressMap={progressMap}
      onLogout={handleLogout}
      onOpenModule={() => go('module')}
    />
  )
}
