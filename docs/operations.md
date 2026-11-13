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
- Both responses send `Cache-Control: no-store`. Clients, browsers, load balancers and intermediaries must not cache them.
- The endpoint is not protected by an API key. Do not put sensitive operational data in its response.

### What is checked

| Check                 | Mechanism                                                                                     | Meaning                                                                                                              |
|-----------------------|-----------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| MongoDB               | Terminus `MongooseHealthIndicator.pingCheck("mongoose")`                                      | The application can reach the database configured through `MONGODB_HOST`, `MONGODB_PORT` and `MONGODB_DATABASE`.     |
| Swagger documentation | Terminus `HttpHealthIndicator.pingCheck("goat-it-docs", <local docs URL>, { timeout: 1000 })` | The same process serves the Swagger module at `/docs`. This is a same-process HTTP call, not an external dependency. |

Both probes are bounded so a stalled dependency cannot hang the readiness call: Terminus bounds the MongoDB ping to a default 1000 ms timeout, and the documentation probe passes an explicit 1000 ms timeout (`DOCS_ENDPOINT_HEALTH_CHECK_TIMEOUT_MS`, `file:src/infrastructure/api/health/constants/health.constants.ts`). A stalled `/docs` handler therefore becomes a `503` after about one second instead of blocking `/health`.

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
