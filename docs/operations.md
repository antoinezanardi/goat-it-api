# Operations

Operational contract for health checking, deployment verification, container shutdown and uptime monitoring of the Goat It API.
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
- the low-level `408` is written by the connection handler before the application hooks, so it carries no security, cache or `Permissions-Policy` header, and a router-level `400`/`414` keeps the NestJS security headers but carries no `Permissions-Policy`, no `Cache-Control` and no `Vary`; never use either to verify the policy.

Post-deploy verification, in addition to the smoke step below:

```bash
curl -sI https://<host>/health | grep -iE "strict-transport-security|cache-control|vary"
```

Expect `strict-transport-security: max-age=31536000`, `cache-control: no-store` and `vary: Accept-Language`. `curl -sI https://<host>/public/img/logo/logo-16.avif` must instead answer `cache-control: public, max-age=0` with an `etag` and a `last-modified` header.

## Rate limiting

The global Nest throttler guard limits every business route with two API-wide, per-client budgets (`src/infrastructure/api/server/throttler/throttler.module.ts`; behaviour and contract in [Security](security.md#rate-limiting) and [API contract](api-contract.md#rate-limiting)):

| Tier | Environment keys | Default window | Default budget |
|---|---|---:|---:|
| `default` (burst) | `THROTTLER_DEFAULT_TTL_SECONDS`, `THROTTLER_DEFAULT_LIMIT` | 1 s | 20 requests |
| `sustained` | `THROTTLER_SUSTAINED_TTL_SECONDS`, `THROTTLER_SUSTAINED_LIMIT` | 60 s | 300 requests |

- The four values are validated as positive integers at boot and are deployment-owned: tune them per environment instead of redeploying code, and keep the burst window shorter than the sustained window.
- Counters live **in process memory**: a restart or redeploy resets every counter, and each instance counts independently. This matches the confirmed single-instance deployment; a second replica needs a shared counter store before the limits can be trusted as a global quota.
- The quota is per resolved client IP, not per API key: clients behind one NAT or one reverse proxy share it, and unauthenticated traffic consumes it before authentication. Probes are exempt.
- A blocking window equals the tier window: the request that exceeds a budget blocks its client for one full window counted from that request, and the client is then admitted again with a fresh counter for that tier.
- The limiter writes no log line and exposes no metric: a `429` is visible only in the client response and in the generic request log line of `pino-http`. Use the 429 rate observed at the reverse proxy or in the log stream to tune the values.

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

- The 408 comes from Fastify's low-level connection handler, so it carries no application response headers — no security header, no `Cache-Control`, no `Vary` and no `Permissions-Policy` — and no application log context. It is not produced by `GlobalExceptionFilter`. A router-level `400`/`414` answer is different: it keeps the NestJS security headers but carries no `Permissions-Policy`, no `Cache-Control` and no `Vary`.
- The 15-second handler timeout answers a sanitized 503 but does not guarantee cancellation of the underlying work. It only bounds requests without a body: on Node 16+, `http.IncomingMessage` emits `close` when the request is complete (body received), and Fastify 5.12.8 clears its handler timer on that event, so a POST/PATCH request runs without this deadline. A response-owned deadline is tracked in #1428.
- The 10-second `socketTimeoutMS` is an inactivity bound on an established socket, not a total query deadline: a command with ongoing socket activity can outlast it.
- Timeout paths are not asserted by long acceptance scenarios (the harness has no deterministic stall fixture); the configured values and the response mappings are pinned by unit specs.

## Post-deploy smoke verification

The staging and production workflows run the `health-check` composite action as a separate step after the SSH deploy step. The action executes `scripts/post-deploy-health-check.sh` against the repository variable `PREPRODUCTION_API_URL` or `PRODUCTION_API_URL`:

- 5 attempts, 5 seconds apart, with a 3-second request timeout each;
- only HTTP `200` passes; every other status, timeout or connection error keeps retrying;
- after the last failed attempt the step exits non-zero and fails the deployment job.

The probe targets the root liveness URL (`GET /`). It proves that the deployed process answers. It does **not** prove MongoDB readiness (use `/health` for that), does not verify a build SHA and does not roll back. The API URL variables must be set to the public base URL of each environment.

## External uptime monitoring

The repository does not provision an uptime monitor. If one is configured outside the repository, use the readiness endpoint and a short cadence:

| Environment  | Method          | URL                                | Expected result                                        | Suggested cadence |
|--------------|-----------------|------------------------------------|--------------------------------------------------------|-------------------|
| Production   | GET, keyword    | `https://api.goat-it.fr/health`    | HTTP `200` and body contains `"status":"ok"`           | 5 minutes         |
| Staging      | GET, keyword    | `$PREPRODUCTION_API_URL/health`    | HTTP `200` and body contains `"status":"ok"`           | 5 minutes         |

Do not point an external liveness monitor at `/health` while the container health check uses `/`; keep the two signals separate and alert on readiness when dependency availability matters.

## Out of scope

Numeric SLOs, automatic rollback, remote log shipping, Sentry configuration and Kubernetes probes are intentionally not configured here. Observability work is tracked separately in the repository issues.
