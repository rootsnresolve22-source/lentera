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

const dayKey = (iso: string) => iso.slice(0, 10)

// Sesi = rangkaian event dengan jeda antar event <= 20 menit.
// Durasi sesi = (akhir - awal) + 4 menit kredit dasar.
function summarizeEvents(events: { type: string; created_at: string }[], days: number) {
  const since = Date.now() - days * 86400000
  const ev = events
    .filter((e) => new Date(e.created_at).getTime() >= since)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
  const daysSet = new Set(ev.map((e) => dayKey(e.created_at)))
  let minutes = 0
  let sessions = 0
  let start = 0
  let prev = 0
  for (const e of ev) {
    const t = new Date(e.created_at).getTime()
    if (!start) { start = t; prev = t; sessions = 1; continue }
    if (t - prev > 20 * 60000) {
      minutes += (prev - start) / 60000 + 4
      sessions += 1
      start = t
    }
    prev = t
  }
  if (start) minutes += (prev - start) / 60000 + 4
  const logins = ev.filter((e) => e.type === 'login').length
  // streak: hari berurutan aktif sampai hari ini (atau kemarin)
  let streak = 0
  const today = new Date()
  for (let i = 0; i < days; i++) {
    const d = new Date(today.getTime() - i * 86400000)
    const k = d.toISOString().slice(0, 10)
    if (daysSet.has(k)) streak += 1
    else if (i === 0) continue // hari ini belum aktif tidak memutus streak kemarin
    else break
  }
  const lastSeen = ev.length ? ev[ev.length - 1].created_at : null
  return { daysActive: daysSet.size, minutes: Math.round(minutes), sessions, logins, streak, lastSeen }
}

Deno.serve((async (req) => {
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
      await supabase.from('belajar_events').insert({ user_id: user.id, type: 'login' })
      return json({ token, user })
    }

    if (req.method === 'POST' && path === 'ping') {
      const user = await getUser(req.headers.get('x-session'))
      if (!user) return json({ error: 'Sesi berakhir.' }, 401)
      await supabase.from('belajar_events').insert({ user_id: user.id as string, type: 'ping' })
      return json({ ok: true })
    }

    if (req.method === 'GET' && path === 'me') {
      const user = await getUser(req.headers.get('x-session'))
      if (!user) return json({ error: 'Sesi berakhir. Silakan masuk lagi.' }, 401)
      const [{ data: progress }, { data: events }] = await Promise.all([
        supabase.from('belajar_progress')
          .select('item_id, status, score, attempts, seconds, meta, updated_at')
          .eq('user_id', user.id as string),
        supabase.from('belajar_events')
          .select('type, created_at')
          .eq('user_id', user.id as string)
          .gte('created_at', new Date(Date.now() - 14 * 86400000).toISOString()),
      ])
      const activity = summarizeEvents(events ?? [], 14)
      return json({
        user: { id: user.id, username: user.username, full_name: user.full_name, role: user.role },
        progress: progress ?? [],
        activity,
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
      const seconds = body.seconds === null || body.seconds === undefined ? null : Math.min(36000, Math.max(0, Number(body.seconds)))
      const meta = body.meta && typeof body.meta === 'object' ? body.meta as Record<string, unknown> : null
      if (!itemId || itemId.length > 60) return json({ error: 'item_id tidak valid.' }, 400)
      if (!['belum', 'sedang', 'selesai'].includes(status)) return json({ error: 'status tidak valid.' }, 400)
      if (score !== null && (!Number.isFinite(score) || score < 0 || score > 1000)) {
        return json({ error: 'score tidak valid.' }, 400)
      }
      const { data: existing } = await supabase
        .from('belajar_progress')
        .select('score, status, attempts, meta, first_done_at, seconds')
        .eq('user_id', user.id as string)
        .eq('item_id', itemId)
        .maybeSingle()
      let bestScore: number | null = score
      if (existing && existing.score !== null && existing.score !== undefined) {
        bestScore = score === null ? Number(existing.score) : Math.max(Number(existing.score), score)
      }
      const finalStatus = existing && existing.status === 'selesai' ? 'selesai' : status
      const mergedMeta = { ...(existing?.meta as Record<string, unknown> ?? {}), ...(meta ?? {}) }
      const row = {
        user_id: user.id as string,
        item_id: itemId,
        status: finalStatus,
        score: bestScore,
        attempts: (existing?.attempts ?? 0) + 1,
        seconds: seconds ?? existing?.seconds ?? null,
        meta: mergedMeta,
        first_done_at: existing?.first_done_at ?? (finalStatus === 'selesai' ? new Date().toISOString() : null),
        updated_at: new Date().toISOString(),
      }
      const { error: upErr } = await supabase.from('belajar_progress').upsert(row)
      if (upErr) { console.error('progress_error', upErr); return json({ error: 'Gagal menyimpan progres.' }, 500) }
      return json({ ok: true, item_id: itemId, status: finalStatus, score: bestScore, attempts: row.attempts, seconds: row.seconds, meta: mergedMeta })
    }

    if (req.method === 'GET' && path === 'overview') {
      const user = await getUser(req.headers.get('x-session'))
      if (!user) return json({ error: 'Sesi berakhir.' }, 401)
      if (user.role !== 'admin') return json({ error: 'Khusus admin.' }, 403)
      const since30 = new Date(Date.now() - 30 * 86400000).toISOString()
      const [{ data: users }, { data: progress }, { data: events }] = await Promise.all([
        supabase.from('belajar_users').select('id, username, full_name, role, active').order('full_name'),
        supabase.from('belajar_progress').select('user_id, item_id, status, score, attempts, seconds, meta, first_done_at, updated_at'),
        supabase.from('belajar_events').select('user_id, type, created_at').gte('created_at', since30),
      ])
      const evByUser: Record<string, { type: string; created_at: string }[]> = {}
      for (const e of events ?? []) {
        ;(evByUser[e.user_id] ??= []).push(e)
      }
      const out = (users ?? []).map((u) => ({
        user: u,
        progress: (progress ?? []).filter((p) => p.user_id === u.id),
        activity14: summarizeEvents(evByUser[u.id] ?? [], 14),
        activity30: summarizeEvents(evByUser[u.id] ?? [], 30),
      }))
      return json({ peserta: out, generated_at: new Date().toISOString() })
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
