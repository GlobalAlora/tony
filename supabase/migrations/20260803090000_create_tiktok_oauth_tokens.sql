-- Stores the single TikTok OAuth token pair used to auto-refresh the
-- TikTok follower/likes/video count shown on the media kit.
--
-- Singleton table (always id = 1): Tony authorizes the app once via
-- /api/tiktok/oauth/start, and from then on a scheduled refresh keeps the
-- access_token/refresh_token pair alive indefinitely (TikTok reissues a new
-- refresh_token on every refresh call, resetting its 365-day clock — see
-- src/lib/tiktok/oauth-store.ts and live-stats.ts).
--
-- Unlike `proposals`, this table is only ever read/written from trusted
-- server code (src/lib/supabase/server.ts is server-only and the anon key
-- here is never sent to the browser), so it's safe to grant the anon role
-- full read/write on this specific table.

create table if not exists public.tiktok_oauth_tokens (
  id smallint primary key default 1,
  access_token text not null,
  refresh_token text not null,
  access_token_expires_at timestamptz not null,
  refresh_token_expires_at timestamptz not null,
  updated_at timestamptz not null default now(),
  constraint tiktok_oauth_tokens_singleton check (id = 1)
);

comment on table public.tiktok_oauth_tokens is
  'Singleton row holding the TikTok OAuth token pair for auto-refreshing follower stats. Written by /api/tiktok/oauth/callback and refreshed by src/lib/tiktok/live-stats.ts.';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tiktok_oauth_tokens_set_updated_at on public.tiktok_oauth_tokens;
create trigger tiktok_oauth_tokens_set_updated_at
  before update on public.tiktok_oauth_tokens
  for each row
  execute function public.set_updated_at();

alter table public.tiktok_oauth_tokens enable row level security;

drop policy if exists "Server can read the token row" on public.tiktok_oauth_tokens;
create policy "Server can read the token row"
  on public.tiktok_oauth_tokens
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Server can upsert the token row" on public.tiktok_oauth_tokens;
create policy "Server can upsert the token row"
  on public.tiktok_oauth_tokens
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Server can update the token row" on public.tiktok_oauth_tokens;
create policy "Server can update the token row"
  on public.tiktok_oauth_tokens
  for update
  to anon, authenticated
  using (true)
  with check (true);
