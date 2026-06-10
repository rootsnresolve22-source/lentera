# Lentera — Belajar Komputer dari Nol

Aplikasi belajar komputer untuk warga kampung (PWA), target kemahiran level
administrative assistant / personal assistant / purchasing staff.

## Status

v0.1.0 — Paket 0 (Fondasi): login, akun, struktur database, deploy.

## Arsitektur

- Frontend: React + Vite (PWA, mobile-first), tanpa framework UI tambahan.
- Backend: Supabase Edge Function `belajar-api` (project `dashboard-kendali`,
  ref `soxirtpifyomksjsxixt`) — semua akses data lewat fungsi ini dengan
  service role. Frontend tidak membawa kunci API Supabase sama sekali.
- Database: tabel berprefix `belajar_` di schema public, RLS aktif tanpa
  policy (akses anon/authenticated tertutup penuh; hanya service role).

## Tabel

- `belajar_users` — id, username (unik), pin_hash (bcrypt), full_name,
  role (peserta/admin), active.
- `belajar_sessions` — token sesi, kedaluwarsa 60 hari.
- `belajar_progress` — progres per item per user (dipakai mulai Paket 1).

## Endpoint (Edge Function `belajar-api`)

- `POST /login` — body `{ username, pin }` → `{ token, user }`.
- `GET /me` — header `x-session: <token>` → `{ user, progress }`.
- `POST /logout` — header `x-session` → `{ ok: true }`.

Catatan keamanan: `verify_jwt` sengaja dimatikan karena fungsi ini memakai
autentikasi sendiri (username + PIN bcrypt + token sesi di tabel). PIN salah
diberi jeda 400 ms untuk memperlambat tebak-tebakan.

## Menjalankan lokal

```
npm install
npm run dev
```

## Keterbatasan yang disadari (v0.1.0)

- Belum ada UI ganti PIN (perubahan PIN sementara lewat SQL oleh admin).
- Belum ada pembatasan jumlah percobaan login (baru jeda 400 ms).
- Konten modul belum ada — menyusul di Paket 1.
