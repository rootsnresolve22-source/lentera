import { createClient } from 'npm:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}

async function getUser(token: string | null) {
  if (!token) return null
  const { data, error } = await supabase
    .from('belajar_sessions')
    .select('expires_at, user:belajar_users(id, username, full_name, role, active)')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()
  if (error || !data || !data.user) return null
  const u = data.user as Record<string, unknown>
  if (!u.active) return null
  return u
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  const path = new URL(req.url).pathname.split('/').filter(Boolean).pop()
  try {
    if (req.method === 'POST' && path === 'login') {
      let body: Record<string, unknown> = {}
      try { body = await req.json() } catch (_e) { body = {} }
      const username = String(body.username ?? '').trim()
      const pin = String(body.pin ?? '')
      if (!username || !pin) return json({ error: 'Username dan PIN wajib diisi.' }, 400)
      const { data, error } = await supabase.rpc('belajar_verify_login', { p_username: username, p_pin: pin })
      if (error) { console.error('rpc_error', error); return json({ error: 'Terjadi kesalahan server.' }, 500) }
      const user = Array.isArray(data) ? data[0] : data
      if (!user) {
        await new Promise((r) => setTimeout(r, 400))
        return json({ error: 'Username atau PIN salah.' }, 401)
      }
      const token = crypto.randomUUID().replaceAll('-', '') + crypto.randomUUID().replaceAll('-', '')
      const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
      const { error: insErr } = await supabase
        .from('belajar_sessions')
        .insert({ token, user_id: user.id, expires_at: expiresAt })
      if (insErr) { console.error('session_error', insErr); return json({ error: 'Terjadi kesalahan server.' }, 500) }
      return json({ token, user })
    }

    if (req.method === 'GET' && path === 'me') {
      const user = await getUser(req.headers.get('x-session'))
      if (!user) return json({ error: 'Sesi berakhir. Silakan masuk lagi.' }, 401)
      const { data: progress } = await supabase
        .from('belajar_progress')
        .select('item_id, status, score, updated_at')
        .eq('user_id', user.id as string)
      return json({
        user: { id: user.id, username: user.username, full_name: user.full_name, role: user.role },
        progress: progress ?? [],
      })
    }

    if (req.method === 'POST' && path === 'progress') {
      const user = await getUser(req.headers.get('x-session'))
      if (!user) return json({ error: 'Sesi berakhir. Silakan masuk lagi.' }, 401)
      let body: Record<string, unknown> = {}
      try { body = await req.json() } catch (_e) { body = {} }
      const itemId = String(body.item_id ?? '').trim()
      const status = String(body.status ?? 'selesai')
      const rawScore = body.score
      const score = rawScore === null || rawScore === undefined ? null : Number(rawScore)
      if (!itemId || itemId.length > 60) return json({ error: 'item_id tidak valid.' }, 400)
      if (!['belum', 'sedang', 'selesai'].includes(status)) return json({ error: 'status tidak valid.' }, 400)
      if (score !== null && (!Number.isFinite(score) || score < 0 || score > 1000)) {
        return json({ error: 'score tidak valid.' }, 400)
      }
      const { data: existing } = await supabase
        .from('belajar_progress')
        .select('score, status')
        .eq('user_id', user.id as string)
        .eq('item_id', itemId)
        .maybeSingle()
      let bestScore: number | null = score
      if (existing && existing.score !== null && existing.score !== undefined) {
        bestScore = score === null ? Number(existing.score) : Math.max(Number(existing.score), score)
      }
      const finalStatus = existing && existing.status === 'selesai' ? 'selesai' : status
      const { error: upErr } = await supabase.from('belajar_progress').upsert({
        user_id: user.id as string,
        item_id: itemId,
        status: finalStatus,
        score: bestScore,
        updated_at: new Date().toISOString(),
      })
      if (upErr) { console.error('progress_error', upErr); return json({ error: 'Gagal menyimpan progres.' }, 500) }
      return json({ ok: true, item_id: itemId, status: finalStatus, score: bestScore })
    }

    if (req.method === 'POST' && path === 'logout') {
      const token = req.headers.get('x-session')
      if (token) await supabase.from('belajar_sessions').delete().eq('token', token)
      return json({ ok: true })
    }

    return json({ error: 'Not found' }, 404)
  } catch (e) {
    console.error('unhandled', e)
    return json({ error: 'Terjadi kesalahan server.' }, 500)
  }
})
