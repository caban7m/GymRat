-- ─────────────────────────────────────────────────
-- USER PLANS — one active plan per user
-- ─────────────────────────────────────────────────

create table if not exists public.user_plans (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  template_id      uuid not null references public.plan_templates(id),
  goal             text not null,
  level            text not null,
  days_per_week    int not null,
  session_duration int not null,
  assigned_at      timestamptz not null default now(),
  constraint user_plans_user_id_key unique (user_id)
);

alter table public.user_plans enable row level security;

create policy "user can read own plan"
  on public.user_plans for select
  using (auth.uid() = user_id);

create policy "user can insert own plan"
  on public.user_plans for insert
  with check (auth.uid() = user_id);

create policy "user can update own plan"
  on public.user_plans for update
  using (auth.uid() = user_id);

create policy "user can delete own plan"
  on public.user_plans for delete
  using (auth.uid() = user_id);

create index if not exists idx_user_plans_user_id on public.user_plans (user_id);
