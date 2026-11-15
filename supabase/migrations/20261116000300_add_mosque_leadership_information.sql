-- Add leadership information to an existing mosque profile table.
-- The initial migration also includes this column for fresh installations.
-- IF NOT EXISTS keeps this safe for databases that applied the earlier schema first.
alter table public.mosque_profile
  add column if not exists leadership_information text not null default ''
  check (char_length(leadership_information) <= 3000);
