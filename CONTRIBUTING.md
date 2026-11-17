# Contributing

Thank you for helping improve this community website.

## How to contribute

1. Fork the repository.
2. Create a focused branch for your change.
3. Keep changes small, readable, accessible, and responsive.
4. Run the available checks:
   - `npm run lint`
   - `npx tsc --noEmit`
   - `npm run build`
5. Open a pull request describing the problem, solution, and tests performed.
6. Wait for maintainer review. A pull request is a proposal, not permission to change or deploy the upstream production website.

## Important safeguards

- Do not add API keys, passwords, service-role/secret keys, tokens, or environment files.
- Do not commit real student, guardian, graduate, donor, or contact-inquiry personal data.
- Do not publish unverified prayer times, donation details, leadership information, mosque history, or announcements.
- Obtain permission before adding mosque photographs, logos, recordings, or other protected materials.
- Preserve Supabase Row Level Security and server-side authorization. Never weaken access controls to make a feature easier.
- Add or update tests and documentation for security-sensitive changes.
- Keep the project clearly labeled unofficial unless authorized mosque representatives approve its official use.

## Review and merging

Maintainers may request changes or decline a contribution to protect security, accuracy, privacy, accessibility, and project scope. Only maintainers can merge changes into this repository. Contributors do not receive production hosting or database access by submitting a pull request.
