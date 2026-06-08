-- Forma Supabase setup.
-- Run this in the Supabase SQL editor after creating the project.
-- Use the public anon key in js/supabase-config.js. Never expose the service-role key.

create table if not exists public.forma_user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.forma_user_state enable row level security;

drop policy if exists "Users can read their own Forma state" on public.forma_user_state;
create policy "Users can read their own Forma state"
on public.forma_user_state
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own Forma state" on public.forma_user_state;
create policy "Users can insert their own Forma state"
on public.forma_user_state
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own Forma state" on public.forma_user_state;
create policy "Users can update their own Forma state"
on public.forma_user_state
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
