-- Brand proposals submitted through the public media kit form.
--
-- No Supabase Auth / admin UI in this version: proposals are triaged
-- manually from the Supabase Dashboard Table Editor (filter/sort by
-- `status` and `created_at`, edit `internal_notes` inline). RLS is
-- enabled with an INSERT-only policy, so the key used by the public API
-- route can never SELECT, UPDATE, or DELETE existing rows even if it
-- were exposed client-side.

create extension if not exists pgcrypto;

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null,
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  campaign_type text not null,
  platforms text[] not null,
  budget_range text,
  estimated_date date,
  message text,
  status text not null default 'new',
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint proposals_status_check
    check (status in ('new', 'in_conversation', 'closed', 'rejected')),
  constraint proposals_platforms_not_empty
    check (array_length(platforms, 1) > 0),
  constraint proposals_brand_name_not_blank check (btrim(brand_name) <> ''),
  constraint proposals_contact_name_not_blank check (btrim(contact_name) <> ''),
  constraint proposals_contact_email_not_blank check (btrim(contact_email) <> ''),
  constraint proposals_campaign_type_not_blank check (btrim(campaign_type) <> '')
);

comment on table public.proposals is
  'Brand proposals submitted through the public media kit form. Managed manually via Supabase Table Editor — no admin UI in this version.';
comment on column public.proposals.status is
  'new | in_conversation | closed | rejected — edit directly in Table Editor.';
comment on column public.proposals.internal_notes is
  'Free-text notes for manual triage, edited directly in Table Editor.';

create index if not exists proposals_status_idx on public.proposals (status);
create index if not exists proposals_created_at_idx on public.proposals (created_at desc);

-- Keep updated_at current whenever a row is edited from the Table Editor.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists proposals_set_updated_at on public.proposals;
create trigger proposals_set_updated_at
  before update on public.proposals
  for each row
  execute function public.set_updated_at();

-- RLS: the public form may only INSERT. No SELECT/UPDATE/DELETE grant for
-- anon/authenticated — reading and managing proposals happens exclusively
-- through the Supabase Dashboard (as the project owner), never through the
-- app or its public API key.
alter table public.proposals enable row level security;

drop policy if exists "Anyone can submit a proposal" on public.proposals;
create policy "Anyone can submit a proposal"
  on public.proposals
  for insert
  to anon, authenticated
  with check (true);
