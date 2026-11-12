# PRIV — Privacy, compliance & legal

Personal-data and legal posture of the Goat It API: the processing inventory (two quiz-content collections and the optional author sub-document), data minimization and the absence of player, account and analytics data; what the pino log pipeline and the pending error tracker may carry; retention, deletion and export triggers; third parties, self-hosted MongoDB and international transfers; the GDPR division of responsibility with the consuming web game; and the maintenance of the privacy decision record. Checks that depend on facts outside the repository are `manual` and need maintainer or legal confirmation. This is not legal advice.

**Decision doc:** `docs/privacy.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** log operation, rotation and alerting → OPS · secret storage, API-key hashing and exposure → SEC · Mongoose schema shapes and field constraints → DATA · hosted error-tracking SDK initialization, sampling and release tagging → OPS · licence inventory of dependencies → SUP · authentication and authorization behaviour → SEC

## Contents

- [1. Data inventory and minimization](#1-data-inventory-and-minimization)
- [2. Logs and telemetry](#2-logs-and-telemetry)
- [3. Retention and deletion](#3-retention-and-deletion)
- [4. Third parties and transfers](#4-third-parties-and-transfers)
- [5. Legal posture](#5-legal-posture)
- [6. Privacy documentation maintenance](#6-privacy-documentation-maintenance)
- [Sources](#sources)

## 1. Data inventory and minimization

- **[PRIV-01] The processing inventory matches the persisted data** — The privacy decision record lists every processing activity and every persisted collection with its fields, purpose, recipients, storage location and retention, and the list matches the Mongoose schemas and published persistence contracts one-to-one.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `docs/*.md`, `src/contexts/question/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/question-theme/infrastructure/persistence/mongoose/schemas/**` · Src: [1], [3], project: docs/privacy.md
- **[PRIV-02] Only quiz content is persisted; no player or account data** — The API writes only questions and question themes; there is no player, user, account, session, score, answer-history or consent collection, and the two bounded contexts are the only owners of persisted data.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: critical · Look: `src/contexts/**`, `src/infrastructure/database/**`, `src/contexts/question/contracts/persistence/**`, `src/contexts/question-theme/contracts/persistence/**` · Src: [2], [3], project: docs/privacy.md
- **[PRIV-03] Author data is minimal and non-identifying** — The author sub-document carries a role from the closed role list, an optional bounded display name that is explicitly not a verified identity, and an optional game-side identifier the API does not resolve; no email, IP address or account reference is stored beside it.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/persistence/mongoose/schemas/question-author/**`, `src/contexts/question/domain/constants/**` · Src: [2], project: docs/privacy.md
- **[PRIV-04] The request data flow proves minimization** — The documented flow is client → API-key guard → Zod validation → use case → Mongoose adapter → one of the two collections, extra request fields are stripped by the non-strict request schemas, and nothing outside the validated quiz-content fields is persisted.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/application/dto/**`, `src/app/filters/global-exception/**`, `docs/architecture.md` · Src: [2], project: docs/privacy.md
- **[PRIV-05] API keys are service credentials, not personal data** — The two API keys authenticate a server-side consumer, are hashed with HMAC at boot, removed from `process.env` once consumed and never written to MongoDB; no per-user identity is derived from them.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/config/providers/services/app-config.service.ts`, `src/infrastructure/api/config/schemas/env.schema.ts`, `src/infrastructure/api/auth/**` · Src: [2], [6], project: docs/privacy.md
- **[PRIV-06] Test environments contain only generated content** — Tracked environment files hold test-only key values, and fixtures, payloads and faketories generate their data; no real person, email, token or production record is committed under the test trees.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `env/.env.test`, `tests/shared/utils/faketories/**`, `tests/acceptance/support/fixtures/**`, `tests/acceptance/support/payloads/**` · Src: [1], project: docs/privacy.md

## 2. Logs and telemetry

- **[PRIV-07] Logs never carry personal data, request bodies or authorization headers** — The logging policy forbids personal data, request bodies and auth headers in log lines, and no code path logs a request payload, a header value or an API key; the only error log field is the documented sanitized one, recorded server-side.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: critical · Look: `src/app/helpers/logger.helpers.ts`, `src/app/app.module.ts`, `src/app/filters/global-exception/**`, `src/**` · Src: [2], [8], project: docs/privacy.md
- **[PRIV-08] Log configuration enforces the policy** — The logger serializes an explicit allow-list and redacts sensitive paths, so request headers, the API key, the client address and the user-agent cannot reach a log line by default; a convention-only policy is not a pass.
  Evidence: `static` · Diff: ✓ · Target: reach · Severity: medium · Look: `src/app/helpers/logger.helpers.ts`, `src/app/app.module.ts`, `docs/*.md` · Src: [8], [9], project: docs/privacy.md
- **[PRIV-09] Unknown-error logging stays server-side and non-request-derived** — The global exception filter logs an unknown error through a field that cannot contain request-derived values (error class or a fixed code), never the raw exception message when it may carry request data, and answers with a generic 500 body that exposes no internals; the current field is recorded in `docs/privacy.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/filters/global-exception/**`, `src/shared/application/dto/api-response-exception/**` · Src: [2], [8], project: docs/privacy.md
- **[PRIV-10] Error trackers scrub personal data at the source** — When an error-tracking SDK is wired, every tracker initializes a data-collection allow-list that excludes user identity, cookies, headers, request bodies, query strings and IP-derived data before events leave the server, and the scrubbing configuration lands in the same change as the tracker; with no tracker wired this check is N/A and [OPS-17] owns the missing capability.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: critical · Look: `package.json`, `src/app/app.module.ts`, `src/app/helpers/logger.helpers.ts`, `src/infrastructure/api/server/**` · Src: [2], [8], project: docs/privacy.md
- **[PRIV-11] Log retention and rotation are stated** — The privacy decision record states how long application and host logs are kept, who can read them and when they are rotated or deleted, or states that the hosting layer owns rotation together with the retention window.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/*.md`, `.github/workflows/deploy-to-production.yml` · Src: [7], project: docs/privacy.md
- **[PRIV-12] No debug or console payload logging remains** — No production or development path writes a request/response body, a raw error object carrying request data, or a secret to `console` or an ad-hoc logger; debugging output is scoped to local execution and removed before merge.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**`, `tests/acceptance/support/helpers/setup/**` · Src: [8], project: docs/privacy.md
- **[PRIV-13] Request identifiers and log fields stay minimal** — Log lines carry no IP address, user agent, device identifier, referrer, full URL with query string or session identifier; if a request id is added, it is a random opaque value, not derived from client data.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/helpers/logger.helpers.ts`, `src/app/app.module.ts`, `src/shared/infrastructure/http/middlewares/**` · Src: [8], [9], project: docs/privacy.md
- **[PRIV-14] Error responses expose no personal data or internals** — Client-facing 4xx bodies carry only the domain message, derived error code and validation details needed to act; unknown 5xx bodies carry the stock generic message, and no persistence message, stack trace or key material reaches a client.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/filters/global-exception/**`, `src/shared/infrastructure/http/errors/**` · Src: [2], project: docs/security.md §Error handling

## 3. Retention and deletion

- **[PRIV-15] The retention conclusion is documented** — The privacy decision record states that no retention schedule applies to persisted data because no personal data is persisted, points to the host-owned retention of log metadata, names the last review date and the condition that reopens the conclusion.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/*.md` · Src: [2], [7], project: docs/privacy.md
- **[PRIV-16] Quiz-content retention is a product rule, not a privacy rule** — The record states that questions and themes are kept as long as the product needs them and that archiving is a content-status transition, so no user-facing erasure request can be satisfied by archiving content.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/contexts/question/domain/constants/**`, `src/contexts/question-theme/domain/constants/**`, `docs/*.md` · Src: [2], project: docs/privacy.md
- **[PRIV-17] The player-data trigger ships deletion and export with the model** — If profiles, scores or identifiers are ever added, the same change defines what is persisted, why, for how long, and provides deletion and export paths together with the data model and the updated privacy record; the trigger is written down before the data exists.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `docs/*.md`, `src/contexts/**` · Src: [2], [3], project: docs/privacy.md
- **[PRIV-18] The API is stateless per client** — Authentication is a stateless key check and the requested locale arrives per request, is attached to the request object and is never written to storage; there is no per-client state, session or cache to retain or purge.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/infrastructure/http/middlewares/localization/**`, `src/infrastructure/api/auth/**`, `src/infrastructure/api/config/**` · Src: [2], project: docs/privacy.md
- **[PRIV-19] Archiving is never described as a privacy operation** — The API documentation, the domain guide and the privacy record agree that archiving changes a content status and does not delete or anonymize any personal data, because there is none to delete.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `docs/*.md`, `src/contexts/question/domain/constants/**`, `src/contexts/question-theme/domain/constants/**` · Src: [2], project: docs/privacy.md

## 4. Third parties and transfers

- **[PRIV-20] No third-party processor receives quiz content or personal data** — No analytics, telemetry, error-tracking, email, CDN or managed-database SDK is a production dependency, and no code path sends request or content data to an external origin; the only network peers are the self-hosted MongoDB and the deployment tooling.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `package.json`, `src/**`, `pnpm-lock.yaml` · Src: [4], project: docs/privacy.md
- **[PRIV-21] MongoDB is self-hosted and the deployment path is recorded** — The database connection is a plain host/port/database configuration, the acceptance database runs locally in a pinned container and production deploys over SSH to a self-hosted server; no managed database or third-party hosting processor is introduced without updating the record.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `env/.env.example`, `docker/goat-it-api-acceptance-tests/**`, `.github/workflows/deploy-to-production.yml` · Src: [4], [11], project: docs/privacy.md
- **[PRIV-22] International transfers are assessed as not applicable** — The privacy record states that no quiz content or personal data leaves the deployment to a third country today, and the conclusion is dated; the statement is revisited when a managed service is added.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/*.md` · Src: [11], project: docs/privacy.md
- **[PRIV-23] The processor-agreement trigger is written down** — The record names who becomes a processor if a managed database, error tracker or hosting service is adopted, what data would be transferred and which agreement and safeguard must land in the same change.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/*.md` · Src: [4], [11], project: docs/privacy.md

## 5. Legal posture

- **[PRIV-24] The GDPR posture is minimal, explicit and dated** — The privacy record states that the API holds no persisted personal data (request metadata in logs is the documented exception), that no consent, access, erasure or data-transfer obligation follows from what it stores today, and the date on which that conclusion was verified.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/*.md` · Src: [1], [2], project: docs/privacy.md
- **[PRIV-25] Controller responsibility sits with the consuming web game** — The record states that the web game is the controller for its players' data and that the API is a headless content service, so a change that starts collecting player data must move or share that responsibility explicitly rather than silently inherit it.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `docs/*.md` · Src: [1], [10], project: docs/privacy.md
- **[PRIV-26] Data-subject rights are answered from the actual data set** — The record explains what a rights request can and cannot return today (no account, no player record, content only) and names the channel and owner for such a request; it is never answered by a generic privacy-policy promise.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `docs/*.md`, `.github/CONTRIBUTING.md` · Src: [5], project: docs/privacy.md

## 6. Privacy documentation maintenance

- **[PRIV-27] The privacy record changes with the data model** — A diff that adds, removes or reshapes a persisted field, collection, log field or third-party integration updates the privacy decision record in the same change; a stale record is a finding even when the code is correct.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `docs/*.md`, `src/contexts/**/contracts/persistence/**`, `src/contexts/**/infrastructure/persistence/**` · Src: [1], project: docs/privacy.md
- **[PRIV-28] The privacy record is registered and its issues are current** — The privacy record appears in the root agent guide's useful-docs list, its related issues resolve, and its "pending" statements name an open issue or an accepted decision rather than an unowned TODO.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `AGENTS.md`, `docs/*.md` · Src: [1], project: AGENTS.md

## Sources

[1] GDPR.eu — GDPR checklist for data controllers: https://gdpr.eu/checklist/ (fetched 2026-11-04)
[2] GDPR.eu — Art. 5 GDPR: Principles relating to processing of personal data: https://gdpr.eu/article-5-how-to-process-personal-data/ (fetched 2026-11-04)
[3] GDPR.eu — Art. 30 GDPR: Records of processing activities: https://gdpr.eu/article-30-records-of-processing-activities/ (fetched 2026-11-04)
[4] GDPR.eu — Art. 28 GDPR: Processor: https://gdpr.eu/article-28-processor/ (fetched 2026-11-04)
[5] GDPR.eu — Art. 13 GDPR: Information to be provided: https://gdpr.eu/article-13-personal-data-collected/ (fetched 2026-11-04)
[6] GDPR.eu — Art. 32 GDPR: Security of processing: https://gdpr.eu/article-32-security-of-processing/ (fetched 2026-11-04)
[7] CNIL — Les durées de conservation des données: https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees (fetched 2026-11-04)
[8] OWASP — Logging Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html (fetched 2026-11-04)
[9] pino — Redaction: https://getpino.io/#/docs/redaction (fetched 2026-11-04)
[10] GDPR.eu — Art. 4 GDPR: Definitions: https://gdpr.eu/article-4-definitions/ (fetched 2026-11-04)
[11] GDPR-info — Art. 44 GDPR: General principle for transfers: https://gdpr-info.eu/art-44-gdpr/ (fetched 2026-11-04)
