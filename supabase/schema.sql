create table if not exists public.rooms (
  code text primary key,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.rooms enable row level security;

-- Demo policy: anyone with the six-character room code can read/update that room.
-- Before a public launch, replace this with RPC-based token validation.
create policy "demo rooms are readable"
on public.rooms for select
to anon
using (true);

create policy "demo rooms can be created"
on public.rooms for insert
to anon
with check (char_length(code) = 6);

create policy "demo rooms can be updated"
on public.rooms for update
to anon
using (true)
with check (char_length(code) = 6);
