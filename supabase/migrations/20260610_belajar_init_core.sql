-- LENTERA Paket 0: struktur inti (sudah diterapkan ke project soxirtpifyomksjsxixt sebagai migrasi belajar_init_core)

create table public.belajar_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  pin_hash text not null,
  full_name text not null,
  role text not null default 'peserta' check (role in ('peserta','admin')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.belajar_sessions (
  token text primary key,
  user_id uuid not null references public.belajar_users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index belajar_sessions_user_idx on public.belajar_sessions(user_id);

create table public.belajar_progress (
  user_id uuid not null references public.belajar_users(id) on delete cascade,
  item_id text not null,
  status text not null default 'belum' check (status in ('belum','sedang','selesai')),
  score numeric,
  updated_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

alter table public.belajar_users enable row level security;
alter table public.belajar_sessions enable row level security;
alter table public.belajar_progress enable row level security;

create or replace function public.belajar_verify_login(p_username text, p_pin text)
returns table (id uuid, username text, full_name text, role text)
language sql
security definer
set search_path = public, extensions
as $$
  select u.id, u.username, u.full_name, u.role
  from public.belajar_users u
  where u.username = lower(trim(p_username))
    and u.active
    and u.pin_hash = extensions.crypt(p_pin, u.pin_hash)
$$;

revoke all on function public.belajar_verify_login(text, text) from public;
revoke all on function public.belajar_verify_login(text, text) from anon;
revoke all on function public.belajar_verify_login(text, text) from authenticated;
grant execute on function public.belajar_verify_login(text, text) to service_role;
