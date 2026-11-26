# Privacy and compliance

This document records the privacy and compliance posture of the Goat It API (`goat-it-api`), the headless NestJS backend serving the Goat It web game. The API has no user accounts, no sessions, no cookies and no analytics: today it persists only quiz content — questions and question themes — and no player or user personal data. Compliance obligations for player interactions sit with the consuming web game, not with this API. Every claim cites the repository file it is based on. Error tracking is the only external processor, and its allow-list is recorded under Logs and error tracking.

Last reviewed: 2026-11-24.

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
- `gameId` (required when `role` is `game`, absent on other roles): an identifier the consuming game may attach; the API does not interpret or resolve it.

What the API never persists in MongoDB: IP addresses, user agents, device identifiers, emails, player profiles, scores, answer histories, or any session/consent record. Request logs are the only request-derived output: a normal request line carries a random request ID, the method, the path without its query string, the status code and the response time, and the structured security events carry only the fields listed under Logs and error tracking. Categories and statuses are content metadata (`file:src/contexts/question/domain/constants/question.constants.ts`); the adult-content flag marks content, not its consumers. The API keys described in `docs/security.md` are shared service credentials held by the server-side consumer, not personal data: they are HMAC-hashed at boot, deleted from `process.env`, and never enter MongoDB (`file:src/infrastructure/api/config/providers/services/app-config.service.ts`). Test environments only ever hold generated content: `env/.env.test` keys are test-only values and fixtures come from `tests/shared/utils/faketories/`.

The rate limiter (`src/infrastructure/api/server/throttler/throttler.module.ts`) is the one place where request-derived state exists outside MongoDB: it keeps a SHA-256 digest of the tier name plus the library-normalized client IP (`src/infrastructure/api/server/throttler/providers/guards/api-throttler/api-throttler.guard.ts`) along with request counters and window expiries in process memory. The digest is not an IP address and is never persisted or logged; a blocked request emits only the structured `request.throttled` event with the route pattern and retry delay. The counters are never written to disk or sent to another service, and both disappear on restart. The library sweeps expired entries periodically but the map has no hard cardinality cap, which is recorded as an accepted risk with a load-test revisit trigger.

## Data minimization and retention

No user or player personal data is persisted, so there is nothing to minimize, delete or export from the datastore today, and no retention schedule applies to persisted data. Log metadata is the one exception: it is retained under the host's retention policy (see Logs and error tracking). Quiz content is the API's business data and is kept as long as the product needs it; archiving a question or theme is a content-status transition (`status` field), not a privacy operation.

Apart from the rate limiter, the API is stateless per client: authentication is a stateless key check, and the requested locale arrives per request through the `Accept-Language` header, is attached to the request object, is never written to MongoDB (`file:src/shared/infrastructure/http/middlewares/localization/localization.middleware.ts`) and is not included in the allow-listed request log line. The only per-client state is the throttler's in-memory counter and its hashed IP-derived key: it is transient, never persisted, and neither the digest nor the counters reach a log line, so there is nothing to export and nothing to purge once the process restarts.

If player data is ever added (profiles, scores, identifiers), the rules are: persist only what the game needs, for as long as it needs it; ship deletion and export paths together with the data model; and update this document in the same change.

## Logs and error tracking

Logging is pino via `nestjs-pino` (`file:src/app/app.module.ts`, `file:src/app/helpers/logger.helpers.ts`): pretty-printed in development, plain JSON in production.

Policy: log lines must never contain personal data, request bodies, headers or query values. The policy is enforced by configuration: `getLoggerConfiguration` installs an allow-list request serializer, an allow-list response serializer and a `redact` block (`file:src/app/helpers/logger.helpers.ts`, `file:src/app/helpers/constants/logger.constants.ts`). A normal request line carries only a random request ID, the method, the path without its query string, the status code and the response time; it never carries a header, the client address or port, the user-agent, a body or a query value.

Unknown errors and response serialization failures emit `request.error` with the exception class and the V8 frame lines of its stack; the stack header that embeds the message is dropped, so neither the message nor its string form reaches a log line (`file:src/app/filters/global-exception/global-exception.filter.ts`, `file:src/app/filters/global-exception/helpers/error-stack/error-stack.helpers.ts`). The other structured events are allow-listed: `auth.failed` carries the status, route pattern, audience and failure reason; `request.validation.failed` carries the status, route pattern and issue count; `request.throttled` carries the status, route pattern and retry delay. The allow-listed event fields never carry a key, header, body, query value, path-parameter value, IP address or user-agent; the shared pino request binding adds the request ID, the method and the path without its query string, so a parameterized route contributes its path-parameter values there. The request payload never reaches a log line.

The request identifier bound to each request log line is a random UUID v4 generated per request (`file:src/infrastructure/api/server/request-id/helpers/request-id.helpers.ts`). It is never derived from the client address, headers, API key or payload, and clients read the same value from the `X-Request-Id` response header. The API does not store it in MongoDB or in separate application state; a UUID written to request logs follows the host's log-retention policy. The identifier is not a client identity: it is random per request and is not linked to a user or a persistent session.

Error tracking is wired (`@sentry/nestjs`) and reports only the generic 500 path — including a response-serialization failure raised by `ZodSerializerInterceptor` — and process-level crashes to a Sentry SaaS project. Every SDK data-collection surface is denied and `beforeSend` rebuilds the event from an allow-list, so the scrubbing configuration ships with the tracker.

### Error tracking

| Aspect | Value |
|---|---|
| Processor | Sentry (SaaS), provisioned per environment by the maintainer |
| Trigger | Unexpected server errors on the API's generic 500 path (including response-serialization failures raised by `ZodSerializerInterceptor`), and process-level crashes |
| Fields transferred | event id, timestamp, level, platform, SDK name and version, environment, release, the tags `errorClass`, route template, request method and HTTP status, exception type, exception value `[REDACTED]`, and stack frames reduced to file, function, line, column and in-app flag |
| Never transferred | request URL, query string, headers, cookies, bodies, user identity, IP address, server name, modules, breadcrumbs, stack-frame source context and local variables, the raw exception message, the full stack message header and every frame of an exception whose message spans several lines |
| Purpose | Detect and alert on 5xx spikes and process crashes |
| Region, DPA and retention | Chosen and reviewed by the Sentry project administration; recorded here once provisioned, never assumed |
| Disabled state | `SENTRY_DISABLED=true` or an empty `SENTRY_DSN`: no client, no transport, no event |

The allow-list lives in `file:src/infrastructure/api/observability/sentry/helpers/sentry.helpers.ts` and `file:src/infrastructure/api/observability/sentry/constants/sentry.constants.ts`. The reported value is always `[REDACTED]`; the full stack message header is dropped and frames are dropped for a multiline-message exception before the event leaves the process. SDK debug output is pinned off (`debug: false`), so an inherited `SENTRY_DEBUG` cannot print an event payload to stdout. The route tag is the registered Fastify route template, never the request URL; an unmatched or middleware request sends the literal `unknown`.

During the SDK's two-second shutdown window, a second uncaught exception is printed raw to stderr by `logAndExitProcess`; this is the only raw-error path in the tracker integration and is an accepted risk.

### Log retention and review

- The API writes JSON logs to stdout; there is no in-app log store, rotation or retention policy. Retention, rotation and reader access are owned by the deployment host/platform, which must apply its own retention window and access control.
- Request logs carry only the allow-listed fields.
- Tracker events are retained by the Sentry project administration under the term recorded in Error tracking; the host log stream and the tracker have separate retention owners.
- Last reviewed: 2026-11-24.

## Third parties and data transfers

Sentry (SaaS) is the only external processor. It receives the allow-listed error events described in Error tracking and never quiz content, request data or personal data. Its data region, the DPA and the retention terms are chosen and reviewed by the maintainer before either environment is deployed; this document records them once confirmed and never assumes a region, a retention value or a signed agreement. MongoDB is self-hosted rather than a managed service: configuration is a plain host/port/database (`env/.env.example`), the acceptance suite runs a local `mongo` container (`docker/goat-it-api-acceptance-tests/docker-compose.yml`), and production deploys over SSH to a self-hosted server (`.github/workflows/deploy-to-production.yml`). `package.json` contains no analytics, telemetry, email, CDN or managed-database dependency. Quiz content therefore never leaves the deployment to a third-party processor.

If the deployment ever moves to a managed database or adds another processor, this section must be updated at the same time with the processor, the transferred data and the applicable agreement.

## GDPR and legal posture

**This section records the maintainer's current understanding, not legal advice; it must be reviewed by counsel before being relied on.**

Because the API's business data holds no personal data, it carries no consent, access/erasure or data-transfer obligations of its own for that data; no consent management, DPO duties or processing records follow from what it stores. The allow-listed error events carry no personal data, so no transfer safeguard is required for the tracker today; the Sentry data region is recorded here once provisioned, and this conclusion is revisited if the allow-list, the processor or the region changes. The author display names are unvalidated free text that may contain personal data; the API cannot correct or delete an author name today (the admin modification shape has no `author` field and there is no question delete route), so such a request must be handled by a manual database operation until an author-update or delete route exists. The adult-content flag is metadata about content, not about users. Request logs carry only a random request ID, method, path without query, status, response time and the allow-listed security-event fields, none of which identifies a person. Error events are allow-listed to carry no personal data (see Error tracking), so the tracker does not change this posture. Compliance responsibilities for player interactions sit with the consuming web game, which is the data controller for its users. If the API ever starts storing player data, this posture changes and this document must be revisited before the data model changes — not after.

## GOAT audit decisions

Recorded GOAT audit decisions. /goat-audit, final-reviewer and plan-writer honor these entries until their revisit condition is met.

### [PRIV-20] Privacy-reviewed error tracking is permitted while general telemetry stays prohibited — Accepted risk (2026-11-20)

- **Finding:** `package.json` gained `@sentry/nestjs`, so an external processor now receives error events; the criterion as written forbade every error-tracking SDK as a production dependency.
- **Decision:** Error tracking is allowed when it is privacy-reviewed and scrubbed at the source: every `dataCollection` surface denied, an allow-list `beforeSend` rebuild, no breadcrumbs, no server name, no tracing, an error log with the exception class and frame lines only (never the message), a `[REDACTED]` error value with the message header removed from the stack, and the processor plus the exact transferred fields recorded in this document. General analytics and telemetry stay prohibited.
- **Rationale:** An unmonitored 500 path is the larger operational risk, and the allow-list sends only the error class, route template, method, status and stack location — never request, user, content or query data.
- **Revisit when:** any event carries request, user, content or query data beyond the registered route template and request method; a second third-party SDK is added; or the allow-list under `src/infrastructure/api/observability/sentry/` widens.
- **Checklist change:** the `[PRIV-20]` criterion is rewritten so privacy-reviewed, allow-listed error tracking is the only permitted third-party client, the registered route template and request method are the only request-derived fields it may transfer, and every other analytics, telemetry or tracker SDK remains a failure. Original criterion, restored if the revisit condition is met: "No analytics, telemetry, error-tracking, email, CDN or managed-database SDK is a production dependency, and no code path sends request or content data to an external origin; the only network peers are the self-hosted MongoDB and the deployment tooling."
- **Recorded by:** orchestrator final review (feat/sentry-error-tracking)
