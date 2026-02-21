-- User entitlements table — written by RevenueCat webhook, read by the app.
-- Users never write directly; service role key writes via Edge Function.

create table if not exists public.user_entitlements (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  is_active             boolean not null default false,
  product_id            text,
  purchase_date         timestamptz,
  expiration_date       timestamptz,
  revenuecat_event_id   text,
  revenuecat_event_type text,
  updated_at            timestamptz not null default now(),

  constraint user_entitlements_user_id_key unique (user_id)
);

-- Row-level security
alter table public.user_entitlements enable row level security;

-- Users can read their own entitlement row only
create policy "user can read own entitlement"
  on public.user_entitlements
  for select
  using (auth.uid() = user_id);

-- Only service role may insert/update (webhook uses service role key)
-- No public insert/update/delete policies — clients never write here directly

-- Index for fast lookup by user_id
create index if not exists idx_user_entitlements_user_id
  on public.user_entitlements (user_id);
