<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Authentication integration rules

- Authentication providers may split account fields across `user`, nested
  `body.user`/`body.data`, and `body`. Required signed-session claims MUST be
  normalized across all supported payload locations before rejecting a login;
  choosing one profile object MUST NOT hide claims present in another.
- Network failures, malformed upstream responses, and missing/invalid account
  claims MUST have distinct error messages. NEVER report parsing,
  normalization, or session-contract failures as “cannot connect”.
- When adding a required `AuthUser` claim, update login normalization, signed
  session validation, every consumer, and a smoke scenario where the selected
  profile object and the claim-bearing object are different.
