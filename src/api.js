import { API_URL } from './config'

async function request(path, { method = 'GET', body, token } = {}) {
  let res
  try {
    res = await fetch(`${API_URL}/${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'x-session': token } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (e) {
    throw new Error('Tidak bisa terhubung. Periksa sinyal internetmu, lalu coba lagi.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || 'Terjadi kesalahan. Coba lagi sebentar lagi.')
    err.status = res.status
    throw err
  }
  return data
}

export const login = (username, pin) =>
  request('login', { method: 'POST', body: { username, pin } })

export const me = (token) => request('me', { token })

export const logout = (token) => request('logout', { method: 'POST', token })
