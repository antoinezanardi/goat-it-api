---
description: Lint the codebase to ensure it adheres to coding standards.
agent: build
---

Run the linter and (optionally) apply automatic fixes.

Prerequisites:

- Node.js: use the project's engine version (recommended in package.json).
- pnpm: this repository uses `pnpm` as the package manager.

Quick commands:

```bash
# Check (no modifications)
pnpm run lint

# Check + autofix (mutates files)
pnpm run lint:fix
```

What this does:

- Runs both Oxlint and ESLint (the project's configured linters).
- `pnpm run lint` performs a non‑mutating check; `pnpm run lint:fix` applies safe autofixes.

After running `pnpm run lint:fix`:

- Review changes: `git status` and `git diff` (or `git diff --staged` if you staged files) to inspect autofixes.
- If something isn't aligned with project standards, adjust the code manually.

Notes and troubleshooting:

- ESLint may print notices such as about `baseline-browser-mapping` — these are informational and don't block autofixes.
- If the linter reports issues it cannot fix automatically, follow its report to address remaining problems manually and add unit tests if the change affects behavior.
- Avoid disabling lint rules unless absolutely necessary; if you must, document the reason inline as a code comment so future maintainers understand the tradeoff.
