-- Madrasah education foundation for Masjid Amanah.
-- Apply to the dedicated mosque Supabase project after reviewing the existing schema.
-- No student, graduate, program, or teacher records are fabricated.

create table if not exists public.madrasah_programs (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 2 and 120),
  description text not null default '' check (char_length(description) <= 2000),
  age_guidance text not null default '' check (char_length(age_guidance) <= 120),
  is_published boolean not null default false,
  display_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.madrasah_academic_years (
  id uuid primary key default gen_random_uuid(),
  label text not null unique check (char_length(trim(label)) between 2 and 40),
  starts_on date,
  ends_on date,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  constraint madrasah_year_dates check (ends_on is null or starts_on is null or ends_on >= starts_on)
);

create table if not exists public.madrasah_classes (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references public.madrasah_programs(id) on delete set null,
  academic_year_id uuid references public.madrasah_academic_years(id) on delete set null,
  name text not null check (char_length(trim(name)) between 2 and 100),
  teacher_name text,
  schedule_description text not null default '' check (char_length(schedule_description) <= 500),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Student and guardian information is private and never included in public queries.
create table if not exists public.madrasah_students (
  id uuid primary key default gen_random_uuid(),
  student_number text unique,
  full_name text not null check (char_length(trim(full_name)) between 2 and 160),
  guardian_name text,
  guardian_contact text,
  private_notes text not null default '' check (char_length(private_notes) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.madrasah_enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.madrasah_students(id) on delete cascade,
  class_id uuid not null references public.madrasah_classes(id) on delete restrict,
  academic_year_id uuid references public.madrasah_academic_years(id) on delete set null,
  status text not null default 'enrolled' check (status in ('enrolled', 'completed', 'withdrawn')),
  enrolled_at date not null default current_date,
  created_at timestamptz not null default now(),
  unique (student_id, class_id)
);

-- This intentionally contains only information suitable for an approved public graduate directory.
-- Do not put birth dates, contact details, guardian details, addresses, or private student IDs here.
create table if not exists public.madrasah_public_graduates (
  id uuid primary key default gen_random_uuid(),
  graduate_name text not null check (char_length(trim(graduate_name)) between 2 and 160),
  program_label text not null check (char_length(trim(program_label)) between 2 and 120),
  completion_year integer not null check (completion_year between 1900 and 2200),
  distinction text not null default '' check (char_length(distinction) <= 160),
  publication_consent_recorded boolean not null default false,
  approved_for_publication boolean not null default false,
  is_published boolean not null default false,
  display_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint graduate_publication_requires_consent
    check (not is_published or (publication_consent_recorded and approved_for_publication))
);

create index if not exists madrasah_programs_public_order_idx
  on public.madrasah_programs (display_order, title) where is_published = true;
create index if not exists madrasah_graduates_public_order_idx
  on public.madrasah_public_graduates (completion_year desc, display_order, graduate_name)
  where is_published = true;
create index if not exists madrasah_enrollments_student_idx
  on public.madrasah_enrollments (student_id, status);
create index if not exists madrasah_classes_year_idx
  on public.madrasah_classes (academic_year_id, is_active);

alter table public.madrasah_programs enable row level security;
alter table public.madrasah_academic_years enable row level security;
alter table public.madrasah_classes enable row level security;
alter table public.madrasah_students enable row level security;
alter table public.madrasah_enrollments enable row level security;
alter table public.madrasah_public_graduates enable row level security;

grant select on public.madrasah_programs to anon, authenticated;
grant insert, update, delete on public.madrasah_programs to authenticated;
create policy "Published Madrasah programs are public"
  on public.madrasah_programs for select to anon, authenticated using (is_published);
create policy "Admins manage Madrasah programs"
  on public.madrasah_programs for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

-- Academic years, classes, students and enrollments are administrator-only.
grant select, insert, update, delete on public.madrasah_academic_years,
  public.madrasah_classes, public.madrasah_students, public.madrasah_enrollments to authenticated;

create policy "Admins manage Madrasah academic years"
  on public.madrasah_academic_years for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Admins manage Madrasah classes"
  on public.madrasah_classes for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Admins manage Madrasah students"
  on public.madrasah_students for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Admins manage Madrasah enrollments"
  on public.madrasah_enrollments for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

grant select on public.madrasah_public_graduates to anon, authenticated;
grant insert, update, delete on public.madrasah_public_graduates to authenticated;
create policy "Approved consenting graduates are public"
  on public.madrasah_public_graduates for select to anon, authenticated
  using (is_published and publication_consent_recorded and approved_for_publication);
create policy "Admins manage Madrasah graduate directory"
  on public.madrasah_public_graduates for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

comment on table public.madrasah_students is
  'Private student and guardian records. Never expose through public pages or public views.';
comment on table public.madrasah_public_graduates is
  'Minimal public graduate directory. Publication requires recorded consent and administrator approval.';
