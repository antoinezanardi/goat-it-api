# Bruno Collection

Quick guide to the Bruno collection shipped in `configs/bruno/Goat It` and how developers can set it up and use it.

## Table of Contents

- [What is included](#what-is-included)
- [Goals](#goals)
- [Important environment variables](#important-environment-variables)
- [Setup (local)](#setup-local)
- [Best practices used in this repo](#best-practices-used-in-this-repo)
- [Recommendations](#recommendations)
- [Where to find things](#where-to-find-things)

## What is included

- `configs/bruno/Goat It/bruno.json` — collection metadata.
- `configs/bruno/Goat It/collection.bru` — global headers and shared settings.
- `configs/bruno/Goat It/environments/` — environment variable sets (`local.bru`, `preproduction.bru`, `production.bru`).
- `configs/bruno/Goat It/admin/`, `play/`, `public/` — request folders for admin and public APIs (questions, question-themes, health, metadata). Public endpoints refer to unauthenticated requests.

## Goals

- Provide an executable collection developers can run locally for manual testing and debugging.
- Keep requests environment-agnostic by using variables for secrets and resource ids.
- Maintain example payloads that mirror acceptance-test fixtures.

## Important environment variables

- `baseUrl` — API base URL. Set in `environments/*` (for local it's `http://localhost:3000`).
- `adminApiKey`, `gameApiKey` — secret API keys used by requests requiring auth. Declared as `vars:secret`.
- `questionThemeId`, `questionId` — optional secrets that hold resource ids used by example requests.

## Setup (local)

1. Install and open Bruno (the collection runner) per your OS.
2. In Bruno, import the folder `configs/bruno/Goat It` (or open from disk depending on Bruno UI).
3. Switch environment to `local`:
   - `baseUrl` defaults to `http://localhost:3000` in `environments/local.bru`.
   - Set `adminApiKey` and `gameApiKey` as secrets in Bruno (copy from your `.env` or local config).
4. (Optional but recommended) Create a theme with `POST /admin/question-themes` then copy the `id` returned and paste into the `questionThemeId` secret (so subsequent requests like create-question work without editing requests).

## Best practices used in this repo

- Use `auth: inherit` to avoid repeating auth settings in each request.
- Use `vars:secret` for environment-specific credentials and ids.
- Use `body: json` blocks with strict JSON (no trailing commas) for compatibility with strict runners.
- Keep example payloads aligned with acceptance tests (locales, author names, etc.).

## Recommendations

1. Keep environment secrets out of source control: do not commit real keys to `environments/*.bru` — Bruno supports secure secrets per environment.
2. Run the collection after starting the app (`pnpm run start:dev`) and ensure the `baseUrl` matches your running server.

## Where to find things

- Request definitions: `configs/bruno/Goat It/admin/`, `configs/bruno/Goat It/play/`, `configs/bruno/Goat It/public/`.
- Global headers: `configs/bruno/Goat It/collection.bru`.
- Environment templates: `configs/bruno/Goat It/environments/*.bru`.
- Collection metadata: `configs/bruno/Goat It/bruno.json`.
