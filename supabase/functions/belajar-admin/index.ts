// Lentera — endpoint admin: kelola akun peserta (buat, reset PIN, aktif/nonaktif).
// Terpisah dari belajar-api agar fungsi inti yang sudah berjalan tidak tersentuh.
// Deploy: supabase functions deploy belajar-admin (verify_jwt = false).
import { createClient } from 'npm:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

async function getAdmin(token: string | null) {
  if (!token) return null
  const { data } = await supabase
    .from('belajar_sessions')
    .select('expires_at, user:belajar_users(id, username, full_name, role, active)')
    .eq('token', token)
    .maybeSingle()
  if (!data?.user) return null
  if (new Date(data.expires_at) < new Date()) return null
  const u = data.user as Record<string, unknown>
  if (u.role !== 'admin' || !u.active) return null
  return u
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  const path = new URL(req.url).pathname.split('/').filter(Boolean).pop()
  try {
    if (req.method !== 'POST') return json({ error: 'Metode tidak didukung.' }, 405)
    const admin = await getAdmin(req.headers.get('x-session'))
    if (!admin) return json({ error: 'Hanya admin yang boleh mengelola akun.' }, 403)
    const body = await req.json().catch(() => ({}))

    if (path === 'user-create') {
      const username = String(body.username ?? '').toLowerCase().trim()
      const fullName = String(body.full_name ?? '').trim()
      const pin = String(body.pin ?? '').trim()
      if (!/^[a-z0-9._-]{3,20}$/.test(username)) return json({ error: 'Username 3–20 huruf kecil/angka, tanpa spasi.' }, 400)
      if (fullName.length < 2 || fullName.length > 60) return json({ error: 'Nama lengkap 2–60 huruf.' }, 400)
      if (!/^\d{4,6}$/.test(pin)) return json({ error: 'PIN harus 4–6 digit angka.' }, 400)
      const { data, error } = await supabase.rpc('belajar_admin_create_user', {
        p_username: username, p_full_name: fullName, p_pin: pin,
      })
      if (error) {
        if (String(error.message).includes('duplicate') || String(error.code) === '23505')
          return json({ error: `Username "${username}" sudah dipakai.` }, 409)
        return json({ error: 'Gagal membuat akun.' }, 500)
      }
      return json({ user: Array.isArray(data) ? data[0] : data })
    }

    if (path === 'user-pin') {
      const userId = String(body.user_id ?? '')
      const pin = String(body.pin ?? '').trim()
      if (!userId) return json({ error: 'user_id wajib.' }, 400)
      if (!/^\d{4,6}$/.test(pin)) return json({ error: 'PIN harus 4–6 digit angka.' }, 400)
      const { data, error } = await supabase.rpc('belajar_admin_set_pin', { p_user_id: userId, p_pin: pin })
      if (error || !data) return json({ error: 'Gagal mengganti PIN.' }, 500)
      return json({ ok: true })
    }

    if (path === 'user-active') {
      const userId = String(body.user_id ?? '')
      const active = Boolean(body.active)
      if (!userId) return json({ error: 'user_id wajib.' }, 400)
      const me = admin as { id?: string }
      if (me.id === userId && !active) return json({ error: 'Tidak bisa menonaktifkan akunmu sendiri.' }, 400)
      const { data, error } = await supabase.rpc('belajar_admin_set_active', { p_user_id: userId, p_active: active })
      if (error || !data) return json({ error: 'Gagal mengubah status akun.' }, 500)
      return json({ ok: true })
    }

    return json({ error: 'Rute tidak dikenal.' }, 404)
  } catch (e) {
    console.error(e)
    return json({ error: 'Kesalahan server.' }, 500)
  }
})
