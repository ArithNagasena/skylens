-- ===========================================================================
--  Sky Lens — admin panel schema
-- ===========================================================================
--  Run this once against a fresh Supabase project (SQL Editor -> New query ->
--  paste -> Run). It is written to be re-runnable: every object is created
--  with `if not exists` or dropped first, so re-applying it is safe.
--
--  What it sets up
--    - admins            : who is allowed into /admin
--    - site content      : hero images, latest-work strip, showreel videos,
--                          services + prices, portfolio projects
--    - documents         : quotations and bills (a bill can cite a quotation)
--    - finance           : per-project and company-wide income / expenses
--    - storage           : one public `media` bucket for every uploaded image
--
--  Security model: the public site reads content tables through the anon key
--  and can only ever see rows flagged `is_active`. Everything else -- all
--  writes, and every row of the document and finance tables -- requires an
--  authenticated user listed in `public.admins`.
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- admins ---

create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  full_name  text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- `security definer` so the check itself is not subject to RLS on `admins`,
-- which would otherwise recurse the moment a policy called it.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $fn$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$fn$;

drop policy if exists "admins read own row" on public.admins;
create policy "admins read own row" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- ------------------------------------------------------- shared machinery ---

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $fn$
begin
  new.updated_at = now();
  return new;
end;
$fn$;

-- ========================================================= site content ====

-- Rotating frames inside the landing-page hero viewfinder.
create table if not exists public.hero_images (
  id           uuid primary key default gen_random_uuid(),
  url          text not null,
  storage_path text,
  alt          text not null default '',
  sort_order   integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- The "Our Latest Work" strip on the landing page.
create table if not exists public.latest_work_images (
  id           uuid primary key default gen_random_uuid(),
  url          text not null,
  storage_path text,
  alt          text not null default '',
  sort_order   integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- "Recently completed projects" -- up to four YouTube embeds.
create table if not exists public.showreel_videos (
  id         uuid primary key default gen_random_uuid(),
  youtube_id text not null,
  title      text not null default '',
  sort_order integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Services and their starting prices, shown on the landing page and /services.
create table if not exists public.services (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  description    text not null default '',
  starting_price numeric(14, 2),
  price_note     text not null default '',
  icon           text not null default 'Camera',
  -- Which block of the /services page the card sits in. 'core' is the
  -- photography and film group, 'specialist' the survey and inspection one.
  tier           text not null default 'core' check (tier in ('core', 'specialist')),
  sort_order     integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Portfolio entries rendered as cards on /work.
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  category    text not null default 'Tourism',
  location    text not null default '',
  description text not null default '',
  youtube_url text not null default '',
  -- [{ "url": "...", "path": "...", "alt": "..." }, ...] in display order.
  images      jsonb not null default '[]'::jsonb,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ======================================================= quotations =======

create sequence if not exists public.quotation_number_seq;
create sequence if not exists public.bill_number_seq;

create table if not exists public.quotations (
  id             uuid primary key default gen_random_uuid(),
  quote_number   text not null unique
                 default 'SLQ-' || to_char(now(), 'YYYY') || '-'
                      || lpad(nextval('public.quotation_number_seq')::text, 4, '0'),
  client_name    text not null,
  client_company text not null default '',
  client_email   text not null default '',
  client_phone   text not null default '',
  client_address text not null default '',
  project_title  text not null default '',
  location       text not null default '',
  issue_date     date not null default current_date,
  valid_until    date,
  currency       text not null default 'LKR',
  discount       numeric(14, 2) not null default 0,
  tax_rate       numeric(5, 2) not null default 0,
  notes          text not null default '',
  terms          text not null default '',
  status         text not null default 'draft'
                 check (status in ('draft', 'sent', 'accepted', 'declined', 'expired')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists public.quotation_items (
  id           uuid primary key default gen_random_uuid(),
  quotation_id uuid not null references public.quotations (id) on delete cascade,
  description  text not null default '',
  quantity     numeric(12, 2) not null default 1,
  unit_price   numeric(14, 2) not null default 0,
  sort_order   integer not null default 0
);

create index if not exists quotation_items_quotation_id_idx
  on public.quotation_items (quotation_id);

-- ============================================================ bills =======

create table if not exists public.bills (
  id              uuid primary key default gen_random_uuid(),
  bill_number     text not null unique
                  default 'SLB-' || to_char(now(), 'YYYY') || '-'
                       || lpad(nextval('public.bill_number_seq')::text, 4, '0'),
  -- A bill may be raised against a quotation. `quote_reference` is kept
  -- alongside the foreign key so the printed document still shows the
  -- quotation number even if that quotation is later deleted.
  quotation_id    uuid references public.quotations (id) on delete set null,
  quote_reference text not null default '',
  client_name     text not null,
  client_company  text not null default '',
  client_email    text not null default '',
  client_phone    text not null default '',
  client_address  text not null default '',
  project_title   text not null default '',
  location        text not null default '',
  issue_date      date not null default current_date,
  due_date        date,
  currency        text not null default 'LKR',
  discount        numeric(14, 2) not null default 0,
  tax_rate        numeric(5, 2) not null default 0,
  amount_paid     numeric(14, 2) not null default 0,
  payment_method  text not null default '',
  notes           text not null default '',
  terms           text not null default '',
  status          text not null default 'unpaid'
                  check (status in ('unpaid', 'partial', 'paid', 'cancelled')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists public.bill_items (
  id          uuid primary key default gen_random_uuid(),
  bill_id     uuid not null references public.bills (id) on delete cascade,
  description text not null default '',
  quantity    numeric(12, 2) not null default 1,
  unit_price  numeric(14, 2) not null default 0,
  sort_order  integer not null default 0
);

create index if not exists bill_items_bill_id_idx on public.bill_items (bill_id);
create index if not exists bills_quotation_id_idx on public.bills (quotation_id);

-- ========================================================== finance =======

-- A job being tracked financially. Deliberately separate from
-- `public.projects` (the portfolio): plenty of paid work never becomes a
-- published case study, and a published case study outlives its ledger.
create table if not exists public.finance_projects (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  client     text not null default '',
  reference  text not null default '',
  status     text not null default 'active'
             check (status in ('active', 'completed', 'cancelled')),
  start_date date not null default current_date,
  notes      text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One row per money movement. `scope` separates money attached to a specific
-- job from company overhead (management, advertising, equipment and so on),
-- which is what lets the dashboard show both per-project profit and the real
-- company-wide figure after overhead.
create table if not exists public.finance_entries (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null check (kind in ('income', 'expense')),
  scope       text not null check (scope in ('project', 'company')),
  project_id  uuid references public.finance_projects (id) on delete cascade,
  category    text not null default 'general',
  description text not null default '',
  amount      numeric(14, 2) not null default 0,
  entry_date  date not null default current_date,
  created_at  timestamptz not null default now(),
  constraint project_scope_needs_project
    check (scope <> 'project' or project_id is not null)
);

create index if not exists finance_entries_project_id_idx on public.finance_entries (project_id);
create index if not exists finance_entries_entry_date_idx on public.finance_entries (entry_date);

-- ============================================== updated_at triggers =======

do $do$
declare t text;
begin
  foreach t in array array[
    'hero_images', 'latest_work_images', 'showreel_videos', 'services',
    'projects', 'quotations', 'bills', 'finance_projects'
  ] loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format(
      'create trigger touch_%1$s before update on public.%1$s
         for each row execute function public.touch_updated_at()', t);
  end loop;
end $do$;

-- ========================================================= row security ===

do $do$
declare t text;
begin
  foreach t in array array[
    'hero_images', 'latest_work_images', 'showreel_videos', 'services',
    'projects', 'quotations', 'quotation_items', 'bills', 'bill_items',
    'finance_projects', 'finance_entries'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "admin full access" on public.%I', t);
    execute format(
      'create policy "admin full access" on public.%I
         for all to authenticated
         using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $do$;

-- Public, anonymous read -- content tables only, and only live rows.
do $do$
declare t text;
begin
  foreach t in array array[
    'hero_images', 'latest_work_images', 'showreel_videos', 'services', 'projects'
  ] loop
    execute format('drop policy if exists "public reads live rows" on public.%I', t);
    execute format(
      'create policy "public reads live rows" on public.%I
         for select to anon, authenticated using (is_active)', t);
  end loop;
end $do$;

-- ========================================================== storage =======

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media is publicly readable" on storage.objects;
create policy "media is publicly readable" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

drop policy if exists "admins upload media" on storage.objects;
create policy "admins upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admins update media" on storage.objects;
create policy "admins update media" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admins delete media" on storage.objects;
create policy "admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
