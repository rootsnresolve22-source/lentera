-- Metrik per item progres
alter table public.belajar_progress
  add column if not exists attempts int not null default 0,
  add column if not exists seconds int,
  add column if not exists meta jsonb not null default '{}'::jsonb,
  add column if not exists first_done_at timestamptz;

-- Log aktivitas (login & ping) untuk kehadiran/durasi sesi
create table if not exists public.belajar_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.belajar_users(id) on delete cascade,
  type text not null check (type in ('login','ping')),
  created_at timestamptz not null default now()
);
create index if not exists belajar_events_user_time on public.belajar_events (user_id, created_at desc);

alter table public.belajar_events enable row level security;
-- tanpa policy: deny-all untuk anon/authenticated; akses hanya service role (by design)
