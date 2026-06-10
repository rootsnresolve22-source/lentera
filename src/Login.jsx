import { useState } from 'react'
import Lamp from './Lamp'
import * as api from './api'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setError('')
    if (!username.trim() || !pin.trim()) {
      setError('Isi dulu username dan PIN-mu, ya.')
      return
    }
    setBusy(true)
    try {
      const data = await api.login(username, pin)
      onLogin(data)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="login">
      <div className="login-inner">
        <div className="brand">
          <Lamp size={64} />
          <h1 className="brand-name">Lentera</h1>
          <p className="brand-tag">Belajar komputer dari nol sampai siap kerja.</p>
          <p className="credit credit-login">
            created by <strong>Mohammad Dimas Priambodo</strong>
          </p>
        </div>

        <form className="card" onSubmit={submit} noValidate>
          {error && <div className="error" role="alert">{error}</div>}

          <div className="field">
            <label htmlFor="username">
              Username <span className="hint">— nama akunmu dari pendamping</span>
            </label>
            <div className="input-row">
              <input
                id="username"
                type="text"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="contoh: siti"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="pin">
              PIN <span className="hint">— angka rahasiamu</span>
            </label>
            <div className="input-row">
              <input
                id="pin"
                className="pin"
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="current-password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="••••"
              />
              <button
                type="button"
                className="toggle-pin"
                onClick={() => setShowPin((s) => !s)}
                aria-pressed={showPin}
              >
                {showPin ? 'Sembunyikan' : 'Lihat'}
              </button>
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={busy}>
            {busy ? 'Memeriksa…' : 'Masuk'}
          </button>
        </form>

        <p className="login-foot">
          Belum punya akun? Akun dibuatkan oleh pendamping program di kampungmu.
        </p>
      </div>
    </div>
  )
}
