-- Run this manually in the dedicated Masjid Amanah Supabase SQL Editor
-- only after the first administrator has been invited/created in Supabase Auth.
-- Replace the email with the mosque-approved administrator's exact email.
-- Do not add an administrator based on an unverified request.

insert into public.admin_users (user_id, display_name, role)
select id, 'Mosque Administrator', 'owner'
from auth.users
where lower(email) = lower('REPLACE_WITH_APPROVED_ADMIN_EMAIL')
on conflict (user_id) do update
set role = excluded.role;
