# Privacy and compliance

This document records the privacy and compliance posture of the Goat It API (`goat-it-api`), the headless NestJS backend serving the Goat It web game. The API has no user accounts, no sessions, no cookies and no analytics: today it persists only quiz content — questions and question themes — and no player or user personal data. Compliance obligations for player interactions sit with the consuming web game, not with this API. Every claim cites the repository file it is based on. Related issue: #1262 (error tracking).

Last reviewed: 2026-11-04.

## Data inventory

The API persists exactly two MongoDB collections, owned by the two bounded contexts under `src/contexts/` (`question` and `question-theme`; there is no player, user or account context). MongoDB is the only datastore — no cache, queue or secondary store is wired (`package.json` dependencies).

Request data flow (`docs/architecture.md` §7): client → API-key guard → Zod validation → use case → Mongoose adapter → one of the two collections. Only validated quiz-content fields are written; nothing else about the request is persisted.

| Collection | Purpose | Contents | Recipients | Storage | Retention | Defined in |
|---|---|---|---|---|---|---|
| `questions` | Serve quiz content to the game and admin tooling | theme assignments, localized content, category, cognitive difficulty, adult-content flag, author, status, source URLs, locales, rejection, timestamps | Goat It web game (server-side) and admin tooling | Self-hosted MongoDB (`MONGODB_*` env) | Until product removal; archiving is a status transition | `file:src/contexts/question/contracts/persistence/question.persistence.contracts.constants.ts` |
| `question_themes` | Group and describe questions for the game and admin tooling | unique slug, localized label/aliases/description, optional color, status, timestamps | Goat It web game (server-side) and admin tooling | Self-hosted MongoDB (`MONGODB_*` env) | Until product removal; archiving is a status transition | `file:src/contexts/question-theme/contracts/persistence/question-theme.persistence.contracts.constants.ts` |

Question documents (`file:src/contexts/question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema.ts`) break down as follows:

- `themes`: 1–3 references to question-theme documents (`themeId`, `isPrimary`, `isHint`) — `file:src/contexts/question/infrastructure/persistence/mongoose/schemas/question-theme-assignment/question-theme-assignment.mongoose.schema.ts`;
- `content`: localized quiz text — statement, answer, optional context and trivia — `file:src/contexts/question/infrastructure/persistence/mongoose/schemas/question-content/question-content.mongoose.schema.ts`;
- `category`, `cognitiveDifficulty`, `isAdultContent`, `status`, 1–5 `sourceUrls`, optional `applicableLocales`;
- optional `rejection` — `file:src/contexts/question/infrastructure/persistence/mongoose/schemas/question-rejection/question-rejection.mongoose.schema.ts`;
- `createdAt`/`updatedAt`.

Theme documents (`file:src/contexts/question-theme/infrastructure/persistence/mongoose/schemas/question-theme.mongoose.schema.ts`): `slug`, localized `label`/`aliases`/`description`, optional `color`, `status`, timestamps.

Localized fields hold quiz translations per supported locale (`file:src/shared/infrastructure/persistence/mongoose/schemas/localization/localized-text.mongoose.schema.ts`); they are content, not personal data.

The only author-related data is the `author` sub-document (`file:src/contexts/question/infrastructure/persistence/mongoose/schemas/question-author/question-author.mongoose.schema.ts`):

- `role`: one of `admin`, `game`, `ai` — `file:src/contexts/question/domain/constants/question.constants.ts`;
- `name` (optional): a free-text display string bounded to 3–30 characters (same constants file), not a verified identity — nothing excludes a real person's name, so it may contain personal data; it links to no user record;
- `gameId` (optional): an identifier the consuming game may attach; the API does not interpret or resolve it.

What the API never persists in MongoDB: IP addresses, user agents, device identifiers, emails, player profiles, scores, answer histories, or any session/consent record. Request metadata is a different matter at the logging layer: the default `pino-http` request logger currently emits request headers, the client address/port and the user-agent to stdout — see Logs and error tracking; this is a known limitation, not a data-model field. Categories and statuses are content metadata (`file:src/contexts/question/domain/constants/question.constants.ts`); the adult-content flag marks content, not its consumers. The API keys described in `docs/security.md` are shared service credentials held by the server-side consumer, not personal data: they are HMAC-hashed at boot, deleted from `process.env`, and never enter MongoDB (`file:src/infrastructure/api/config/providers/services/app-config.service.ts`). Test environments only ever hold generated content: `env/.env.test` keys are test-only values and fixtures come from `tests/shared/utils/faketories/`.

## Data minimization and retention

No user or player personal data is persisted, so there is nothing to minimize, delete or export from the datastore today, and no retention schedule applies to persisted data. Log metadata is the one exception: it is retained under the host's retention policy (see Logs and error tracking). Quiz content is the API's business data and is kept as long as the product needs it; archiving a question or theme is a content-status transition (`status` field), not a privacy operation.

The API is stateless per client: authentication is a stateless key check, and the requested locale arrives per request through the `Accept-Language` header, is attached to the request object and is never written to MongoDB (`file:src/shared/infrastructure/http/middlewares/localization/localization.middleware.ts`) — note that the header may appear in host-retained logs until the pino default serializer is fixed. There is no per-client state to retain or purge.

If player data is ever added (profiles, scores, identifiers), the rules are: persist only what the game needs, for as long as it needs it; ship deletion and export paths together with the data model; and update this document in the same change.

## Logs and error tracking

Logging is pino via `nestjs-pino` (`file:src/app/app.module.ts`, `file:src/app/helpers/logger.helpers.ts`): pretty-printed in development, plain JSON in production.

Policy: log lines must never contain personal data, request bodies or authorization headers. That policy is **not enforced today**: `getLoggerConfiguration` only configures the transport, so `pino-http`'s default request serializer emits request headers, the client address/port and the `user-agent` (`file:src/app/helpers/logger.helpers.ts`, `file:src/app/app.module.ts`). No `redact` or custom serializer is configured. The only application-level error logging is the exception message of unknown errors, recorded server-side by the global exception filter (`file:src/app/filters/global-exception/global-exception.filter.ts`) — never the request payload.

Error tracking is pending #1262 — no error-tracking service is wired (no Sentry or equivalent dependency in `package.json`). The constraint for any future tracker: it must scrub personal data at the source, before events leave the server, and the scrubbing configuration lands together with the tracker, not after.

### Log retention and review

- The API writes JSON logs to stdout; there is no in-app log store, rotation or retention policy. Retention, rotation and reader access are owned by the deployment host/platform, which must apply its own retention window and access control.
- While the `pino-http` default request logging remains, request metadata (including IP addresses and request headers) is retained for as long as the host retains logs. This is the highest-priority privacy gap in this document and must be fixed at the logger configuration, not accepted silently.
- Last reviewed: 2026-11-04.

## Third parties and data transfers

None today. MongoDB is self-hosted rather than a managed service: configuration is a plain host/port/database (`env/.env.example`), the acceptance suite runs a local `mongo` container (`docker/goat-it-api-acceptance-tests/docker-compose.yml`), and production deploys over SSH to a self-hosted server (`.github/workflows/deploy-to-production.yml`). `package.json` contains no analytics, telemetry or error-tracking dependency. Quiz content therefore does not leave the deployment to any third-party processor, and no data-processing agreement is required today. If the deployment ever moves to a managed database or adds an error tracker, this section must be updated at the same time with the processor, the transferred data and the applicable agreement.

## GDPR and legal posture

**This section records the maintainer's current understanding, not legal advice; it must be reviewed by counsel before being relied on.**

Because the API's business data holds no personal data, it carries no consent, access/erasure or data-transfer obligations of its own for that data; no consent management, DPO duties or processing records follow from what it stores, and cross-border transfer rules do not apply. The author display names are unvalidated free text that may contain personal data; the API cannot correct or delete an author name today (the admin modification shape has no `author` field and there is no question delete route), so such a request must be handled by a manual database operation until an author-update or delete route exists. The adult-content flag is metadata about content, not about users. The one exception is request metadata in logs (IP address, user-agent, headers) while the `pino-http` default request logging remains: that metadata is personal data in the GDPR sense, it is retained under the host's log-retention policy for operational logging, and it must be removed at the logger configuration. Until it is, the API's no-personal-data posture is not fully true and this gap must be disclosed in any processing record. Compliance responsibilities for player interactions sit with the consuming web game, which is the data controller for its users. If the API ever starts storing player data, this posture changes and this document must be revisited before the data model changes — not after.
