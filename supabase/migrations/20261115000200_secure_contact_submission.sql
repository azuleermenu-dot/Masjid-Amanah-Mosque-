-- Contact inquiries can only be created through the server action.
-- That action verifies the Cloudflare Turnstile token before using the
-- server-only Supabase secret key, which operates with the service_role database role. Never expose that key to the browser.

revoke insert on public.contact_inquiries from anon, authenticated;
grant insert on public.contact_inquiries to service_role;

drop policy if exists "Visitors can submit contact inquiries" on public.contact_inquiries;
