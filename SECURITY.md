# Security Policy

## Reporting a vulnerability

Please do not publish exploitable vulnerability details in a public issue. Contact the repository maintainer privately through the contact information on the maintainer's GitHub profile and include:

- A concise description of the issue.
- The affected file, route, or component.
- Reproduction steps and impact.
- Any suggested mitigation.

Do not include real user data, credentials, or private student/community information in a report.

## Security expectations

- Never commit secrets or production environment files.
- Keep Supabase Row Level Security enabled and test visitor/admin access separately.
- Keep privileged Supabase keys server-side only.
- Validate and authorize all server-side mutations.
- Protect public forms against automated abuse and validate tokens server-side.
- Report suspected exposed credentials immediately so they can be revoked and rotated.
