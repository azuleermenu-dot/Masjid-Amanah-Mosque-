-- Masjid Amanah public-content schema
-- Apply only to the dedicated Supabase project created for this mosque website.
-- No real mosque data or administrator is inserted by this migration.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'editor' check (role in ('owner', 'editor')),
  created_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 160),
  slug text not null unique check (char_length(slug) between 3 and 180),
  excerpt text not null default '' check (char_length(excerpt) <= 400),
  body text not null check (char_length(body) between 1 and 12000),
  is_published boolean not null default false,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 160),
  description text not null default '' check (char_length(description) <= 8000),
  venue text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  is_published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint event_time_order check (ends_at is null or ends_at >= starts_at)
);

create table if not exists public.prayer_times (
  id uuid primary key default gen_random_uuid(),
  prayer_date date not null,
  prayer_name text not null check (prayer_name in ('Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Jummah')),
  prayer_time time not null,
  note text,
  is_published boolean not null default false,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (prayer_date, prayer_name)
);

create table if not exists public.learning_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 180),
  resource_type text not null check (resource_type in ('quran', 'hadith', 'article', 'external')),
  summary text not null default '' check (char_length(summary) <= 500),
  body text,
  source_reference text,
  external_url text,
  reviewed_by text,
  is_published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint learning_resource_reference check (
    resource_type not in ('quran', 'hadith') or nullif(trim(source_reference), '') is not null
  )
);

create table if not exists public.donation_methods (
  id uuid primary key default gen_random_uuid(),
  label text not null check (char_length(label) between 2 and 120),
  purpose text not null default '' check (char_length(purpose) <= 500),
  instructions text not null check (char_length(instructions) between 1 and 2000),
  provider_details text,
  verified_by text,
  verified_at timestamptz,
  is_published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint published_donation_must_be_verified check (
    not is_published or (nullif(trim(verified_by), '') is not null and verified_at is not null)
  )
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 140),
  image_path text not null,
  alt_text text not null check (char_length(alt_text) between 5 and 240),
  category text,
  is_published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 100),
  email text not null check (char_length(email) <= 254 and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$'),
  message text not null check (char_length(trim(message)) between 10 and 4000),
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'spam')),
  created_at timestamptz not null default now()
);

create index if not exists announcements_public_order_idx on public.announcements (published_at desc) where is_published = true;
create index if not exists events_public_order_idx on public.events (starts_at asc) where is_published = true;
create index if not exists prayer_times_date_idx on public.prayer_times (prayer_date, prayer_time) where is_published = true;
create index if not exists learning_resources_public_order_idx on public.learning_resources (created_at desc) where is_published = true;
create index if not exists gallery_items_public_order_idx on public.gallery_items (created_at desc) where is_published = true;
create index if not exists contact_inquiries_admin_order_idx on public.contact_inquiries (created_at desc);

alter table public.admin_users enable row level security;
alter table public.announcements enable row level security;
alter table public.events enable row level security;
alter table public.prayer_times enable row level security;
alter table public.learning_resources enable row level security;
alter table public.donation_methods enable row level security;
alter table public.gallery_items enable row level security;
alter table public.contact_inquiries enable row level security;

-- Administrators can only read their own membership row. Membership changes are
-- performed by a trusted project owner in the Supabase SQL editor, never by the app.
grant select on public.admin_users to authenticated;
drop policy if exists "Admins can read their own membership" on public.admin_users;
create policy "Admins can read their own membership"
  on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

grant select on public.announcements to anon, authenticated;
grant insert, update, delete on public.announcements to authenticated;
drop policy if exists "Published announcements are public" on public.announcements;
create policy "Published announcements are public"
  on public.announcements for select to anon, authenticated using (is_published);
drop policy if exists "Admins manage announcements" on public.announcements;
create policy "Admins manage announcements"
  on public.announcements for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

grant select on public.events to anon, authenticated;
grant insert, update, delete on public.events to authenticated;
drop policy if exists "Published events are public" on public.events;
create policy "Published events are public"
  on public.events for select to anon, authenticated using (is_published);
drop policy if exists "Admins manage events" on public.events;
create policy "Admins manage events"
  on public.events for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

grant select on public.prayer_times to anon, authenticated;
grant insert, update, delete on public.prayer_times to authenticated;
drop policy if exists "Published prayer times are public" on public.prayer_times;
create policy "Published prayer times are public"
  on public.prayer_times for select to anon, authenticated using (is_published);
drop policy if exists "Admins manage prayer times" on public.prayer_times;
create policy "Admins manage prayer times"
  on public.prayer_times for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

grant select on public.learning_resources to anon, authenticated;
grant insert, update, delete on public.learning_resources to authenticated;
drop policy if exists "Published learning resources are public" on public.learning_resources;
create policy "Published learning resources are public"
  on public.learning_resources for select to anon, authenticated using (is_published);
drop policy if exists "Admins manage learning resources" on public.learning_resources;
create policy "Admins manage learning resources"
  on public.learning_resources for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

grant select on public.donation_methods to anon, authenticated;
grant insert, update, delete on public.donation_methods to authenticated;
drop policy if exists "Verified donation methods are public" on public.donation_methods;
create policy "Verified donation methods are public"
  on public.donation_methods for select to anon, authenticated using (is_published and verified_at is not null and nullif(trim(verified_by), '') is not null);
drop policy if exists "Admins manage donation methods" on public.donation_methods;
create policy "Admins manage donation methods"
  on public.donation_methods for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

grant select on public.gallery_items to anon, authenticated;
grant insert, update, delete on public.gallery_items to authenticated;
drop policy if exists "Published gallery items are public" on public.gallery_items;
create policy "Published gallery items are public"
  on public.gallery_items for select to anon, authenticated using (is_published);
drop policy if exists "Admins manage gallery items" on public.gallery_items;
create policy "Admins manage gallery items"
  on public.gallery_items for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

grant insert on public.contact_inquiries to anon, authenticated;
grant select, update on public.contact_inquiries to authenticated;
drop policy if exists "Visitors can submit contact inquiries" on public.contact_inquiries;
create policy "Visitors can submit contact inquiries"
  on public.contact_inquiries for insert to anon, authenticated
  with check (
    char_length(trim(full_name)) between 2 and 100
    and char_length(message) between 10 and 4000
  );
drop policy if exists "Admins can review contact inquiries" on public.contact_inquiries;
create policy "Admins can review contact inquiries"
  on public.contact_inquiries for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

-- Gallery files are publicly readable only because each public gallery item uses
-- approved imagery. Uploads and mutations remain restricted to mosque admins.
insert into storage.buckets (id, name, public)
values ('mosque-gallery', 'mosque-gallery', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can view approved mosque gallery files" on storage.objects;
create policy "Public can view approved mosque gallery files"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'mosque-gallery');

drop policy if exists "Mosque admins upload gallery files" on storage.objects;
create policy "Mosque admins upload gallery files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'mosque-gallery'
    and exists (select 1 from public.admin_users a where a.user_id = (select auth.uid()))
  );

drop policy if exists "Mosque admins update gallery files" on storage.objects;
create policy "Mosque admins update gallery files"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'mosque-gallery'
    and exists (select 1 from public.admin_users a where a.user_id = (select auth.uid()))
  )
  with check (
    bucket_id = 'mosque-gallery'
    and exists (select 1 from public.admin_users a where a.user_id = (select auth.uid()))
  );

drop policy if exists "Mosque admins delete gallery files" on storage.objects;
create policy "Mosque admins delete gallery files"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'mosque-gallery'
    and exists (select 1 from public.admin_users a where a.user_id = (select auth.uid()))
  );
