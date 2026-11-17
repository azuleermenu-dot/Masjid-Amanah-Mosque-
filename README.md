# Masjid Amanah — Unofficial Website

A responsive, independently developed unofficial website for sharing information about Masjid Amanah (مسجد الأمانة).

> **Unofficial community project:** This repository is not an official publication of Masjid Amanah and does not imply mosque management endorsement. The project must remain clearly identified as unofficial until authorized representatives formally approve and claim it.

## Open-source license

The original source code in this repository is released under the **MIT License**. Everyone may use, study, copy, modify, merge, publish, distribute, sublicense, and deploy their own version, including for commercial purposes, provided the license and copyright notice are retained.

The MIT License applies only to original code and materials that the project author has the right to license. It does **not** grant permission to use Masjid Amanah's name, logo, mosque photographs, personal information, third-party assets, or other materials owned by someone else. See [COPYRIGHT.md](./COPYRIGHT.md).

You may modify and deploy your own fork. You cannot directly change the original repository or the official production deployment unless the repository owner separately grants you access. Changes proposed to this repository must go through a pull request and require maintainer approval. A public repository is not the same as public write access.

## Technology
- Next.js 16.4.6 / React 19.3.1 / TypeScript
- Tailwind CSS v4
- ESLint 9 with the native Next.js flat configuration
- Framer Motion and Lucide icons
- Supabase Auth, PostgreSQL, and Storage (optional until a dedicated mosque project is connected)
- Vercel deployment target

## Local development
```bash
npm install
cp .env.example .env.local
npm run dev
```

The public website runs without Supabase credentials and displays clearly marked "pending confirmation" states. Add the public Supabase URL and publishable key to `.env.local` only after creating a dedicated Masjid Amanah project. Configure `SUPABASE_SECRET_KEY` only in the server environment before enabling the contact form.

## Supabase setup
1. Create a separate Supabase project specifically for Masjid Amanah. Do not reuse a different organization's project.
2. Copy the project URL and publishable key into `.env.local` and the Vercel environment settings. Add the secret key only as a server-side secret named `SUPABASE_SECRET_KEY`; never expose it in client code or a `NEXT_PUBLIC_*` variable.
3. Apply every SQL migration in `supabase/migrations/` in filename order. This includes the initial content schema, the secure contact-submission permission change, the forward-only leadership profile field migration, and the Madrasah education schema.
4. Invite/create the mosque-approved administrator through Supabase Auth.
5. Update and run `supabase/authorize-first-admin.sql` with that administrator's exact verified email.
6. Keep public sign-up disabled. Never expose the secret key in browser code or a `NEXT_PUBLIC_*` variable.
7. Test public reads and administrator writes with separate visitor and admin accounts.

The existing connected Supabase project in the developer account belongs to another application and is intentionally not used by this repository.

## Security model
- Public visitors can read published announcements, events, prayer times, learning resources, verified donation methods, and published gallery entries.
- Only user IDs explicitly listed in `public.admin_users` can manage content.
- Admin membership changes are performed directly by a trusted project owner, not from the public app.
- Contact inquiries can be submitted after Cloudflare Turnstile is configured. The server verifies the token and inserts through a server-only Supabase client using the secret key; direct public REST inserts are revoked. Only authorized administrators can read and manage inquiries.
- Turnstile tokens are validated server-side, including action and configured hostname checks.
- Gallery uploads are restricted to authorized admins. The storage bucket is private; public visitors can receive short-lived signed image URLs only for gallery records marked as published.
- RLS is enabled on every table created by the migration.
- The secret key is used only by the isolated server-side contact submission module after Turnstile verification. It is never imported into client components or sent to the browser.

## Content accuracy
This project deliberately does not invent the mosque's history, leaders, address, prayer schedule, teachers, programs, contact channels, photographs, or donation accounts. Only content confirmed by authorized Masjid Amanah representatives should be published. Qur'an and Hadith resources must retain reliable references and receive appropriate review.

## Before production launch
1. Obtain mosque management approval for the design, wording, and content.
2. Verify official address, contact channels, socials, prayer timetable, programs, and donation instructions.
3. Add approved real mosque photos with permission.
4. Configure the dedicated Supabase project and authorized administrators.
5. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain. Keep `PUBLIC_CONTENT_APPROVED=false` until mosque management approves the content and domain; switch it to `true` only after that review.
6. Configure Cloudflare Turnstile site key, secret, and allowed production hostnames before enabling public contact submissions.
7. Remove the temporary no-index setting in `app/robots.ts` only after public content and domain are verified.
8. Run lint, production build, RLS checks, and mobile/tablet/desktop testing.
9. Connect the repository to Vercel and configure environment variables before deploying.

## Current implementation
- Responsive homepage and shared navigation/footer, including live approved mosque introduction, location, and latest announcement when the public database is configured.
- Prayer countdown checks both today and tomorrow when verified entries are available, without generating missing prayer times.
- Authorized mosque-profile editor for approved history, mission, vision, facilities, address, contact, and social links.
- Dedicated pages for About, Prayer Times, Programs, Learning (including full resource reading pages), Madrasah Education (including approved program listings and a consent-based graduate directory), News (including individual announcement pages), Gallery, Donations, Contact, and a draft Privacy Notice.
- Restricted admin sign-in and server-verified administrator dashboard.
- Full announcement create, edit, publish/unpublish, and delete workflow.
- Event create, edit, publish/unpublish, and delete workflow, with an iCalendar download for upcoming public events.
- Prayer schedule single-entry and full-day bulk editors, publication controls, and deletion.
- Learning resource create, edit, review, publish/unpublish, delete, and public detail pages.
- Madrasah program and graduate-directory administration, with publication gated by recorded student/guardian consent and administrator approval. Private student, guardian, class, academic-year, and enrollment tables are protected by RLS.
- Donation method create, edit, verify, publish/unpublish, and delete workflow; edited payment details require fresh confirmation.
- Mosque gallery uploads and deletion with private storage and short-lived signed public image URLs.
- Private contact inquiry inbox with status management and a Turnstile-protected submission form.
- Draft privacy notice covering form data, processing purpose, access controls, service providers, retention, and privacy requests; management approval is required before launch.
- Branded loading, error, and not-found states; installable web app manifest and icon.
- Initial Supabase schema with RLS policies, gallery storage policies, and verified-donation publication safeguards.
- Public information remains marked as pending until confirmed.
- GitHub Actions checks TypeScript, the production build, and dependency audit reporting on repository changes.
- Approval-gated sitemap includes published announcement and learning-resource detail pages when the production HTTPS domain and content approval switch are configured.
- Global response headers disable MIME sniffing, block framing, limit referrer leakage, and disable unused device permissions.

## Contributing
Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request. Never include real personal data, private student records, credentials, API keys, or unapproved mosque content in a contribution.
