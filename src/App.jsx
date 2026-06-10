import { useEffect, useState } from 'react'
import Login from './Login'
import Dashboard from './Dashboard'
import * as api from './api'

const TOKEN_KEY = 'lentera_token'

export default function App() {
  const [state, setState] = useState({ phase: 'boot', user: null, progress: [] })

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
  }

  async function handleLogout() {
    const token = localStorage.getItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_KEY)
    setState({ phase: 'login', user: null, progress: [] })
    if (token) {
      try {
        await api.logout(token)
      } catch (e) {
        /* sesi lokal sudah dihapus; aman diabaikan */
      }
    }
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

  return <Dashboard user={state.user} progress={state.progress} onLogout={handleLogout} />
}
