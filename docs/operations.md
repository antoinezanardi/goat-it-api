# Operations

Operational contract for health checking, deployment verification, container shutdown, error tracking and uptime monitoring of the Goat It API.
Architecture and file placement are owned by [Architecture](architecture.md); CI, deployment jobs and repository variables are owned by [CI/CD](ci-cd.md).

## Health endpoint

`GET /health` and `HEAD /health` are public, unauthenticated, and answer at the application root. There is no `/healthz` or `/readyz` split: `/health` is the single **readiness** endpoint. The root `GET /` remains the lightweight application-metadata endpoint.

| Endpoint       | Meaning                                                                                                       | Success                                  | Failure                    |
|----------------|---------------------------------------------------------------------------------------------------------------|------------------------------------------|----------------------------|
| `GET /health`  | Readiness: the process answers **and** its MongoDB connection and Swagger documentation endpoint are reachable. | `200` with the `AppHealthDto` body.       | `503` with a generic error. |
| `HEAD /health` | Same readiness check as `GET`, without a response body.                                                        | `200`, same headers as `GET`, no body.    | `503`, same headers as `GET`, no body. |

- Fastify 5 exposes HEAD routes for GET handlers by default (`exposeHeadRoutes: true`), and NestJS runs the same handler. `HEAD /health` therefore performs the same checks and returns the same status and application headers as `GET`, with no body.
- Both responses send `Cache-Control: no-store` and `Vary: Accept-Language` (the response policy is described in [Security](security.md#response-caching)). Clients, browsers, load balancers and intermediaries must not cache them.
- The endpoint is not protected by an API key. Do not put sensitive operational data in its response.
- `GET /`, `GET /health` and `HEAD /health` skip both global rate-limit tiers (`@SkipThrottle` in `src/app/controllers/app.controller.ts` and `src/infrastructure/api/health/controllers/health.controller.ts`), so a monitoring loop never consumes a client budget and a throttled client can still observe readiness.

### What is checked

| Check                   | Mechanism                                                                                                                        | Meaning                                                                                                                |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| MongoDB                 | Terminus `MongooseHealthIndicator.pingCheck("mongoose")`                                                                         | The application can reach the database configured through `MONGODB_HOST`, `MONGODB_PORT` and `MONGODB_DATABASE`.       |
| Swagger documentation   | Terminus `FetchHealthIndicator.pingCheck("goat-it-docs", <local docs URL>).withTimeout(1000)`                                    | The same process serves the Swagger module at `/docs`. This is a same-process HTTP call, not an external dependency.   |

Both probes are bounded so a stalled dependency cannot hang the readiness call: Terminus bounds the MongoDB ping to a default 1000 ms timeout, and the documentation probe applies `withTimeout(DOCS_ENDPOINT_HEALTH_CHECK_TIMEOUT_MS)` to its `FetchHealthIndicator` attempt, which aborts the in-flight native `fetch` after 1000 ms (`file:src/infrastructure/api/health/constants/health.constants.ts`). A `/docs` handler that stalls or drip-feeds its body therefore becomes a `503` after about one second instead of blocking `/health`.

Not checked: disk, memory, CPU, queues, external services, authentication configuration, migrations and data integrity. Add a check only when it represents a real dependency the process cannot serve without.

### Status contract

- `200`: the aggregated status is `ok` or `degraded`. The body is the `AppHealthDto` shape with per-component details.
- `503`: the aggregated status is `error` or `shutting_down`. The body is generic and never contains MongoDB or documentation error text, URLs, stack traces, connection strings or component details:

  ```json
  {
    "statusCode": 503,
    "message": "Application is not ready yet",
    "error": "Service Unavailable"
  }
  ```

  Terminus logs the detailed cause server-side before the sanitized response is sent.
- `HEAD` answers the same status as `GET` and suppresses the body.

## Response headers and caching

Every application response carries the security-header matrix and `Cache-Control: no-store` with `Vary: Accept-Language`; values and rationale live in [Security](security.md#http-security-headers). In front of the API:

- a reverse proxy, a CDN or a corporate intermediary must forward these headers and must not cache an API response; do not enable a caching layer until a caching design lands;
- the only cacheable responses are the game assets under `/public/`, which keep `Cache-Control: public, max-age=0`, `ETag` and `Last-Modified` so a client revalidates instead of re-downloading; do not expect a positive `max-age` or `immutable` there;
- a missing asset (`/public/unknown`), a Swagger asset under `/docs/**` and every error answer `no-store`;
- the low-level `408` is written by the connection handler before the application hooks, so it carries no security, cache or `Permissions-Policy` header, and a router-level `400`/`414` keeps the NestJS security headers but carries no `Permissions-Policy`, no `Cache-Control` and no `Vary`; never use either to verify the policy. The request-identifier header follows the same rule: application-managed responses carry `X-Request-Id`, while the low-level `408` and a router-level `400`/`414` may lack it — never verify the ID contract through those paths.

A deployed `GET /health` answer carries `strict-transport-security: max-age=31536000`, `cache-control: no-store` and `vary: Accept-Language`; a game asset under `/public/` instead carries `cache-control: public, max-age=0` with `etag` and `last-modified`. Verify those headers on an application-managed response, never through the low-level `408` or a router-level `400`/`414`.

## Rate limiting

The global Nest throttler guard limits every business route with two API-wide, per-client budgets (`src/infrastructure/api/server/throttler/throttler.module.ts`; behaviour and contract in [Security](security.md#rate-limiting) and [API contract](api-contract.md#rate-limiting)):

| Tier | Environment keys | Default window | Default budget |
|---|---|---:|---:|
| `default` (burst) | `THROTTLER_DEFAULT_TTL_SECONDS`, `THROTTLER_DEFAULT_LIMIT` | 1 s | 20 requests |
| `sustained` | `THROTTLER_SUSTAINED_TTL_SECONDS`, `THROTTLER_SUSTAINED_LIMIT` | 60 s | 300 requests |

- The four values are validated as positive integers at boot and are deployment-owned: tune them per environment instead of redeploying code, and keep the burst window shorter than the sustained window.
- Counters live **in process memory**: a restart or redeploy resets every counter, and each instance counts independently. This matches the confirmed single-instance deployment; a second replica needs a shared counter store before the limits can be trusted as a global quota.
- The quota is per resolved client IP, not per API key: clients behind one NAT or one reverse proxy share it, and unauthenticated traffic consumes it before authentication. Behind the production Nginx the operator sets `TRUST_PROXY` to the exact proxy peer (see [Proxy trust and client identity](#proxy-trust-and-client-identity)); without it every proxied client shares the peer's bucket. Probes are exempt.
- A blocking window equals the tier window: the request that exceeds a budget blocks its client for one full window counted from that request, and the client is then admitted again with a fresh counter for that tier.
- The limiter writes no log line and exposes no metric: a `429` is visible only in the client response and in the generic request log line of `pino-http`. Use the 429 rate observed at the reverse proxy or in the log stream to tune the values.

## Proxy trust and client identity

The limiter keys on Fastify's resolved client address, so any reverse proxy in front of the API changes what that address means. The application ships proxy trust **off**; the trust boundary is deployment-owned.

| Setting | Value | Owner |
|---|---|---|
| `TRUST_PROXY` | the single IPv4/IPv6 address or CIDR block of the Nginx-to-API peer; empty disables trust | remote environment of the deployment |
| Published API port | bound to IPv4 loopback only, for example `127.0.0.1:<port>:<port>` | Compose stack, outside this repository |
| Nginx upstream | explicit `127.0.0.1:<published port>` | Nginx server block, outside this repository |
| `X-Forwarded-For` | overwritten with `$remote_addr`, never `$proxy_add_x_forwarded_for` | Nginx server block, outside this repository |

- The schema accepts exactly one address or CIDR block; comma-separated lists, `true`/`false`, hop counts and malformed values abort startup (`file:src/infrastructure/api/config/schemas/env.schema.ts`). Configure the **observed** peer, never the shared Docker subnet: a trusted subnet lets any container on it choose its own bucket.
- Overwriting `X-Forwarded-For` discards a client-supplied prefix before Fastify reads the chain. `X-Forwarded-Proto` keeps describing the TLS-facing scheme; no application code consumes `request.protocol` today.
- The peer address changes when the external Docker network is recreated. Re-observe it and update the remote variable before blaming the limiter for merged buckets.
- `web-game` and `web-admin` use Docker service-name networking and therefore share one bucket per container IP. Measure their aggregate request rate and set a deliberate budget: raising the global limits also raises the external-client ceiling.
Bucket separation is asserted by the `@rate-limit-429` acceptance scenario, which forwards two distinct client addresses through the trusted loopback peer. The published port must stay bound to loopback, so it must not answer from a remote host.

## Container health check

The production stage of the `Dockerfile` probes the process-liveness endpoint with a real GET every 30 seconds, with a 5-second timeout, 3 retries and a 10-second start period:

```text
GET http://localhost:${SERVER_PORT}/
```

This is intentionally **liveness**, not readiness: the container becomes unhealthy only when the Node process stops answering. A MongoDB or Swagger outage does not mark the container unhealthy and does not trigger a restart on platforms that restart unhealthy containers. `/health` remains the readiness probe for load balancers, orchestrators and external monitors.

If dependency-based restarts are preferred over keeping a healthy process alive during a database outage, point `HEALTHCHECK` at `/health` and accept that MongoDB downtime restarts the API. Never point a container liveness probe at `/health` while relying on that endpoint for readiness monitoring.

## Graceful shutdown

`src/infrastructure/api/server/server.ts` calls `app.enableShutdownHooks()`. On `SIGTERM`/`SIGINT`, Nest runs application-shutdown hooks; `@nestjs/mongoose` closes the MongoDB connection as part of that lifecycle.

Docker sends `SIGTERM` and waits for the container to exit before sending `SIGKILL`. The Linux default stop grace period is 10 seconds. If the deployment runtime needs more time, set it outside this repository, for example `stop_grace_period: 30s` in Compose or `docker stop --time 30 <container>`. `HEALTHCHECK` and `STOPSIGNAL` do not configure the stop grace period.

## Request, handler and database time bounds

The HTTP server and the database connection carry explicit bounds. Every value is fixed in code — there is no environment variable for it.

| Bound | Value | Source | Failure behaviour |
|---|---:|---|---|
| Request body size (`bodyLimit`) | 512 KiB (524,288 bytes) | `file:src/infrastructure/api/server/fastify/constants/fastify.constants.ts` | `413` `{ "statusCode": 413, "message": "Request body is too large", "error": "Payload Too Large" }` before the payload is buffered |
| Request receipt (`requestTimeout`, both Fastify and Node) | 30 s | same | Fastify's default `clientErrorHandler` writes `408` `{ "statusCode": 408, "message": "Client Timeout", "error": "Request Timeout" }` over the raw socket and destroys it before Nest's filter runs |
| Header receipt (`headersTimeout`) | 30 s | same | same `408` |
| Connection expiry check (`connectionsCheckingInterval`) | 5 s | same | Node re-evaluates incomplete requests every 5 s, so the effective receive deadline is about 30–35 s |
| Routed handler duration (`handlerTimeout`) | 15 s | same | `503` `{ "statusCode": 503, "message": "Request timed out", "error": "Service Unavailable" }`; Fastify aborts cooperatively, so in-flight database work is not cancelled. Bounds requests without a body only (see below). |
| MongoDB established-socket inactivity (`socketTimeoutMS`) | 10 s | `file:src/infrastructure/database/constants/database.constants.ts` | The driver raises `MongoNetworkTimeoutError`. The client gets the sanitized `500` when the error reaches the handler; retryable operations retry once with a fresh 10 s inactivity timer, so a GET can outlast the 15 s handler deadline and answer `503` first. A body-bearing request is not bounded by that deadline (see below). |

- The 408 comes from Fastify's low-level connection handler, so it carries no application response headers — no security header, no `Cache-Control`, no `Vary` and no `Permissions-Policy` — and no application log context. It is not produced by `GlobalExceptionFilter`. A router-level `400`/`414` answer is different: it keeps the NestJS security headers but carries no `Permissions-Policy`, no `Cache-Control` and no `Vary`. `X-Request-Id` is missing there too, for the same reason.
- The 15-second handler timeout answers a sanitized 503 but does not guarantee cancellation of the underlying work. It only bounds requests without a body: on Node 16+, `http.IncomingMessage` emits `close` when the request is complete (body received), and Fastify clears its handler timer on that event, so a POST/PATCH request runs without this deadline. A response-owned deadline is tracked in #1428.
- The 10-second `socketTimeoutMS` is an inactivity bound on an established socket, not a total query deadline: a command with ongoing socket activity can outlast it.
- Timeout paths are not asserted by long acceptance scenarios (the harness has no deterministic stall fixture); the configured values and the response mappings are pinned by unit specs.

## Database index builds

Both context schemas enable `autoIndex` through `DEFAULT_MONGOOSE_SCHEMA_OPTIONS` (`src/shared/infrastructure/persistence/mongoose/constants/mongoose.constants.ts`), so Mongoose builds any missing index when the application starts. There is no migration tooling.

- An index change ships with the deployment that needs it. A large build can consume database resources and delay the first fully indexed queries; schedule it with the release window and watch the deployment.
- A failed build does not crash the process: Mongoose reports it as an `index` event on the model and the app keeps serving without that index, so the `getIndexes()` check below is mandatory after any deploy that changes an index, not optional.
- Mongoose never drops an index. Removing a declaration leaves the existing index in place; drop the superseded index manually only after its replacement has been built.
- Confirm the result with `db.questions.getIndexes()` / `db.question_themes.getIndexes()`; the expected declarations are recorded in [data-model.md](data-model.md#indexes) and [performance.md](performance.md#indexing-policy-and-current-indexes).

## Post-deploy smoke verification

The staging and production workflows run the `health-check` composite action as a separate step after the SSH deploy step. The action executes `scripts/post-deploy-health-check.sh` against the `PREPRODUCTION_API_URL` or `PRODUCTION_API_URL` variable; those variables must be scoped to the matching `Docker Image Staging` / `Docker Image Production` GitHub environment once the #1321 manual migration lands:

- 5 attempts, 5 seconds apart, with a 3-second request timeout each;
- only HTTP `200` passes; every other status, timeout or connection error keeps retrying;
- after the last failed attempt the step exits non-zero and fails the deployment job.

The probe targets the root liveness URL (`GET /`). It proves that the deployed process answers. It does **not** prove MongoDB readiness (use `/health` for that), does not verify a build SHA and does not roll back. The API URL variables must be set to the public base URL of each environment.

## External uptime monitoring

The repository does not provision an uptime monitor. If one is configured outside the repository, use the readiness endpoint and a short cadence:

| Environment  | Method          | URL                                | Expected result                                        | Suggested cadence |
|--------------|-----------------|------------------------------------|--------------------------------------------------------|-------------------|
| Production   | GET, keyword    | `<production-base-url>/health`    | HTTP `200` and body contains `"status":"ok"`           | 5 minutes         |
| Staging      | GET, keyword    | `<staging-base-url>/health`       | HTTP `200` and body contains `"status":"ok"`           | 5 minutes         |

Do not point an external liveness monitor at `/health` while the container health check uses `/`; keep the two signals separate and alert on readiness when dependency availability matters.

## Error tracking

Unexpected server errors and process-level crashes are reported to a Sentry SaaS project through the Sentry SDK (`@sentry/nestjs`), initialized once by `initializeSentry()` (`src/infrastructure/api/observability/sentry/helpers/sentry.helpers.ts`) as the first statement of `bootstrap()` (`src/infrastructure/api/server/server.ts`). The HTTP response contract is unchanged: the filter still answers the stock generic `500` body.

- Only the generic-500 branch is reported. Mapped 4xx domain errors, explicit `HttpException`s (including the health `503` and the throttler `429`) and Fastify-mapped responses never reach the tracker.
- The event carries the error class, the matched Fastify route template, the request method, the `500` status tag and stack frames reduced to file, function, line, column and in-app flag. The error value is always `[REDACTED]`; the full stack message header is dropped, and frames are dropped when the exception message spans several lines.
- No request, user, header, cookie, query, body, breadcrumb or server-name data is collected: every `dataCollection` surface is denied, `beforeSend` rebuilds the event from an allow-list and `beforeBreadcrumb` drops everything.
- Tracing is left unconfigured (`tracesSampleRate` and `tracesSampler` omitted) and the SDK's ambient `SENTRY_TRACES_SAMPLE_RATE` fallback is removed before init, so no tracing integration is installed and no span, transaction or SDK Fastify auto-capture path is loaded. SDK debug output is pinned off (`debug: false`), so an inherited `SENTRY_DEBUG` cannot print an event payload.
- The server-side log line records the exception class only (`Error.isError(exception) ? exception.constructor.name : "NonErrorThrown"`), never the message or a stack.
- Startup is fail-fast. `SENTRY_DSN` is required whenever `SENTRY_ENVIRONMENT` is `staging` or `production`; with `NODE_ENV=production` the environment must also be `staging` or `production`, and a deployment environment must not set `SENTRY_DISABLED=true`. Any violation aborts boot in `validateEnv()` before the tracker is initialized, so a deployment cannot start unmonitored.
- Release is the `package.json` version baked into the image. There is no `SENTRY_RELEASE`, no auth token and no source-map upload.

### Sentry failure modes

| Failure | Expected behaviour | Detection |
|---|---|---|
| Tracker unreachable or transport error | Events are dropped; responses, statuses and bodies are unaffected, and a request is never blocked. | A missing event for a known incident: the production 5xx alert stays silent. |
| A report call throws | `GlobalExceptionFilter` logs `Failed to report an unexpected error to Sentry` and still writes the stock `500`. | The fixed log line in the host log stream. |
| Tracker configuration missing or malformed on a deployment host | Startup aborts in `validateEnv()`; the post-deploy health gate then fails the job. | A failed container start and a failed deployment job. |
| Uncaught exception | The event is captured, the client is closed within 2 000 ms and the process exits with code `1`, printing nothing. When another `uncaughtException` listener is installed, the SDK still captures but does not force the exit. A second uncaught exception raised while the close is pending is printed raw to stderr by the SDK; the two-second window is the only raw-error path. | Container restart plus the event in the Sentry project. |
| Unhandled promise rejection | The Sentry rejection integration is removed, so Node's default escalation to the uncaught-exception path stays intact and delivery remains best-effort. | Same as the uncaught-exception row. |

The complete failure-mode matrix for database, documentation endpoint and host failures remains #1324; the rows above cover the tracker only.

### Enabling error tracking

Before deploying either environment, the Sentry project administrator must provision the project and its DSN, choose the Sentry data region, review the DPA and retention terms (then record them in `docs/privacy.md`), inject `SENTRY_DSN`, `SENTRY_ENVIRONMENT` (`staging` or `production`) and `SENTRY_DISABLED=false` into the host environment, and configure a production 5xx spike alert with its threshold and notification destination. The alert threshold and the channel are project-owned settings, not repository variables.

## Out of scope

Numeric SLOs, automatic rollback, remote log shipping and Kubernetes probes are intentionally not configured here. Error tracking is configured as described in [Error tracking](#error-tracking); numeric alert thresholds and error budgets stay in #1407/#1411. Observability work is tracked separately in the repository issues.

## GOAT audit decisions

Recorded GOAT audit decisions. /goat-audit, final-reviewer and plan-writer honor these entries until their revisit condition is met.

### [REL-18] Unknown errors are identified by class, not by message — Accepted risk (2026-11-20)

- **Finding:** `file:src/app/filters/global-exception/global-exception.filter.ts` logs only `exception.constructor.name` / `NonErrorThrown`, while REL-18 and OPS-16 still required the exception message server-side.
- **Decision:** The class-only log is the approved posture; both criteria are rewritten to require a non-request-derived identity plus a redacted tracker event, and to forbid the raw message, its string form and the stack.
- **Rationale:** The message can embed a connection string, a payload fragment or a user-supplied route segment; the tracker event carries the error class, route template, method, status and stack location, which is the triage path.
- **Revisit when:** the `pino-http` allow-list (#1332/#1343) ships a reviewed structured error field, or the tracker is disabled or replaced.
- **Checklist change:** REL-18 and OPS-16 rewritten; IDs, counts, Core and Reach marks unchanged. Original REL-18 criterion, restored if the revisit condition is met: "Every uncaught error becomes a JSON 500 with no stack trace, error detail or connection information sent to clients; unknown errors log their message server-side and no route can return an empty 200 or a partial body after a failure."
- **Recorded by:** orchestrator final review (feat/sentry-error-tracking)

