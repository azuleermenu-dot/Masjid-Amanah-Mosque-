# Masjid Amanah — Official Website

A responsive official website foundation for Masjid Amanah (مسجد الأمانة).

## Technology
- Next.js 15 / React 19 / TypeScript
- Tailwind CSS v4
- Framer Motion and Lucide icons
- Supabase Auth, PostgreSQL, and Storage (optional until a dedicated mosque project is connected)
- Vercel deployment target

## Local development
```bash
npm install
cp .env.example .env.local
npm run dev
```

The public website runs without Supabase credentials and displays clearly marked "pending confirmation" states. Add the two public Supabase settings to `.env.local` only after creating a dedicated Masjid Amanah project.

## Supabase setup
1. Create a separate Supabase project specifically for Masjid Amanah. Do not reuse a different organization's project.
2. Copy the project URL and publishable key into `.env.local` and the Vercel environment settings.
3. Apply `supabase/migrations/20261115000100_initial_masjid_content.sql` in the dedicated project's SQL editor.
4. Invite/create the mosque-approved administrator through Supabase Auth.
5. Update and run `supabase/authorize-first-admin.sql` with that administrator's exact verified email.
6. Keep public sign-up disabled. Never put a service-role or secret key in browser variables.
7. Test public reads and administrator writes with separate visitor and admin accounts.

The existing connected Supabase project in the developer account belongs to another application and is intentionally not used by this repository.

## Security model
- Public visitors can read published announcements, events, prayer times, learning resources, verified donation methods, and published gallery entries.
- Only user IDs explicitly listed in `public.admin_users` can manage content.
- Admin membership changes are performed directly by a trusted project owner, not from the public app.
- Contact inquiries can be submitted by visitors but can only be read and managed by authorized administrators.
- Gallery uploads are restricted to authorized admins.
- RLS is enabled on every table created by the migration.
- No service-role key is used by the frontend.

## Content accuracy
This project deliberately does not invent the mosque's history, leaders, address, prayer schedule, teachers, programs, contact channels, photographs, or donation accounts. Only content confirmed by authorized Masjid Amanah representatives should be published. Qur'an and Hadith resources must retain reliable references and receive appropriate review.

## Before production launch
1. Obtain mosque management approval for the design, wording, and content.
2. Verify official address, contact channels, socials, prayer timetable, programs, and donation instructions.
3. Add approved real mosque photos with permission.
4. Configure the dedicated Supabase project and authorized administrators.
5. Set the real Vercel production domain and update metadata/SEO configuration.
6. Remove the temporary no-index setting in `app/robots.ts` only after public content and domain are verified.
7. Run lint, production build, RLS checks, and mobile/tablet/desktop testing.
8. Connect the repository to Vercel and configure environment variables before deploying.

## Current implementation
- Responsive homepage and shared navigation/footer.
- Dedicated pages for About, Prayer Times, Programs, Learning, News, Gallery, Donations, and Contact.
- Restricted admin sign-in and server-verified administrator dashboard.
- Announcement creation and publishing UI.
- Initial Supabase schema with RLS policies, gallery storage policies, and verified-donation publication safeguards.
- Public information remains marked as pending until confirmed.
