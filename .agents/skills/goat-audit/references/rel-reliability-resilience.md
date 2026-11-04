# REL — Reliability & resilience

How the API behaves when a dependency is slow, failing or overloaded: graceful shutdown on SIGTERM/SIGINT and the Docker stop
grace, named timeouts and the single retry layer at the MongoDB boundary, MongoDB resilience and what `/health` reports when the
database is down, failure modes and error containment (one exception filter, no partial writes, atomic multi-updates, deterministic
status mapping), concurrency and races on slug uniqueness and theme assignment, and bounded resource use (page-size caps,
request-size posture, no unbounded queries or state).

**Decision doc:** `docs/operations.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** alerting, log shipping and runbooks → OPS · rate-limiting abuse and the request-body guard → SEC · schema integrity and migrations → DATA · domain invariants → LOGIC · index design and query-performance tuning → PERF · probe design and HEALTHCHECK semantics → OPS

## Contents

- [1. Graceful shutdown & lifecycle](#1-graceful-shutdown--lifecycle)
- [2. Timeouts & retries](#2-timeouts--retries)
- [3. MongoDB resilience](#3-mongodb-resilience)
- [4. Failure modes & error containment](#4-failure-modes--error-containment)
- [5. Concurrency & races](#5-concurrency--races)
- [6. Bounded resource use](#6-bounded-resource-use)
- [Sources](#sources)

## 1. Graceful shutdown & lifecycle

- **[REL-01] Shutdown hooks enabled** — The application enables its shutdown hooks at bootstrap, so SIGTERM/SIGINT trigger the Nest shutdown lifecycle and the database module closes the MongoDB connection before the process exits.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/infrastructure/api/server/**`, `src/infrastructure/database/**` · Src: [7], project: docs/operations.md
- **[REL-02] Signals handled by the platform** — No custom SIGTERM/SIGINT handler exists in application code; Docker sends SIGTERM, waits for the container to exit, then sends SIGKILL after the stop grace period.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**`, `Dockerfile` · Src: [14], project: docs/operations.md
- **[REL-03] In-flight requests settle on shutdown** — Shutdown closes the HTTP server so no new connections are accepted and the shutdown lifecycle runs before the process exits; the application never blocks termination past the platform stop grace.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/server/**` · Src: [7], [14], project: docs/operations.md
- **[REL-04] Startup and connection lifecycle observable** — Bootstrap logs the listening URL and the documentation URL after listen succeeds, and the database connection lifecycle is logged (connecting, connected, disconnected), so startup and connection loss are visible in stdout.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/server/**`, `src/infrastructure/database/providers/**` · Src: [6]
- **[REL-05] Stop grace documented** — The operations guide documents the Linux default 10-second stop grace period, how to raise it outside the repository when the deployment needs more time, and that `HEALTHCHECK`/`STOPSIGNAL` do not configure it.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/operations.md` · Src: [14], project: docs/operations.md

## 2. Timeouts & retries

- **[REL-06] Named connection timeouts** — The MongoDB connection carries explicit named constants — 5000 ms connection and server-selection timeouts, 3000 ms retry delay, 5 retry attempts — instead of relying on the driver's 30-second server-selection default (verified: mongoose 9.11.4).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/infrastructure/database/constants/**`, `src/infrastructure/database/providers/**` · Src: [9], [1], project: docs/data-model.md
- **[REL-07] Every hop's timeout posture deliberate** — Each boundary's timeout is an explicit value or a recorded decision: the inbound request timeout and the MongoDB socket timeout are framework defaults (0 = no limit) (verified: fastify 5.12.8; verified: mongoose 9.11.4), and any reliance on them is a documented decision naming the bound.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/infrastructure/api/server/**`, `src/infrastructure/database/**`, `docs/security.md` · Src: [12], [9], [1], project: docs/security.md
- **[REL-08] One retry layer, no hand-rolled loops** — The MongoDB driver's bounded connection retries are the only retry layer: no application code re-executes a failed operation in a loop or on a timer.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**` · Src: [1], [9]
- **[REL-09] Outbound calls bounded** — The only outbound HTTP call the application makes is the same-process readiness ping; any future outbound business call adds an explicit timeout constant instead of a library default.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/health/**` · Src: [1]
- **[REL-10] Retries never re-issue writes** — No retry re-issues a non-idempotent write: the API never repeats a POST/PATCH/DELETE itself after a failure — a failed write surfaces once as its mapped status and the client decides whether to repeat it.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/*/application/use-cases/**` · Src: [2], [9]
- **[REL-11] Backoff with bounded delay** — Connection retries use a fixed documented delay (3000 ms) bounded by the retry count (5), and operation-level server selection is capped by the 5000 ms selection timeout, so a down database produces bounded failure latency.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/database/constants/**` · Src: [1], project: docs/data-model.md

## 3. MongoDB resilience

- **[REL-12] Connection loss visible** — Connection lifecycle events are logged — establishing at `info`, lost at `warn` — so a dropped connection appears in the logs before requests start failing.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/database/providers/**` · Src: [6], project: docs/data-model.md
- **[REL-13] Buffering posture deliberate** — The Mongoose buffering defaults (operations buffer while disconnected and fail after a 10-second buffer timeout) are relied on deliberately with their user-visible effect documented, or buffering is explicitly disabled (verified: mongoose 9.11.4).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/infrastructure/database/**`, `docs/operations.md` · Src: [9], [10], project: docs/data-model.md
- **[REL-14] Standalone-node posture documented** — The connection URI targets a single MongoDB node with no replica-set, read-preference or failover configuration, and the deployment topology assumptions (single node, no automatic failover) are documented.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/database/**`, `docs/data-model.md` · Src: [9], project: docs/data-model.md
- **[REL-15] Readiness reflects database availability** — `/health` answers 503 when the MongoDB ping fails while the liveness root keeps answering 200, so routing and monitoring distinguish a database outage from a dead process (verified: @nestjs/terminus 12.1.0).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/infrastructure/api/health/**`, `src/app/controllers/**` · Src: [8], [13], project: docs/operations.md
- **[REL-16] Status contract explicit** — The aggregated status maps to the documented contract — 200 for `ok`/`degraded`, 503 for `error`/`shutting_down` — and acceptance tests cover the healthy and unhealthy responses.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/health/**`, `tests/acceptance/features/**` · Src: [8], project: docs/operations.md
- **[REL-17] Outage drill** — With MongoDB stopped: `/health` answers 503 with the sanitized body, the liveness root answers 200, business endpoints fail with the generic 500, and the process stays alive until the database returns.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [4], project: docs/operations.md

## 4. Failure modes & error containment

- **[REL-18] One exception filter closes every path** — Every uncaught error becomes a JSON 500 with no stack trace, error detail or connection information sent to clients; unknown errors log their message server-side and no route can return an empty 200 or a partial body after a failure.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/app/filters/global-exception/**` · Src: [4], project: docs/security.md
- **[REL-19] Deterministic domain-error mapping** — Every domain error maps to exactly one client-actionable status (404 not-found, 400 invalid-state, 409 conflict), or is intentionally 500 with a recorded one-line justification; the intentionally-500 mappings are locked by filter tests.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: medium · Look: `src/app/filters/global-exception/**`, `src/contexts/*/domain/errors/**` · Src: [4], project: docs/architecture.md §7.4, project: AGENTS.md
- **[REL-20] No partial writes on failure paths** — Question writes re-read the document after writing and surface a failure when the read-back fails; theme writes use a single returning update, so a client never sees a torn or half-applied state as success.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/contexts/*/infrastructure/persistence/mongoose/repository/**` · Src: [4], project: docs/performance.md
- **[REL-21] Atomic multi-updates without transactions** — Primary assignment promotion/demotion runs as one bulkWrite of conditional updates so no intermediate state (two primaries, none) is observable, and MongoDB transactions are deliberately not used.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/**` · Src: [4], project: docs/architecture.md §5.5, project: docs/data-model.md
- **[REL-22] Write failures signal correctly** — A duplicate-key write on the slug index is translated to the slug-already-exists error and answered 409; every other persistence failure surfaces as a logged 500 and is never swallowed or converted into success.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question-theme/infrastructure/persistence/mongoose/repository/**`, `src/shared/infrastructure/persistence/mongoose/constants/**` · Src: [9], project: docs/domain-logic.md
- **[REL-23] Degradation matrix documented** — The operations guide maps each dependency failure (MongoDB down, documentation endpoint unreachable, slow queries) to its HTTP status, user-visible effect and detection signal.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/operations.md` · Src: [4], project: docs/operations.md

## 5. Concurrency & races

- **[REL-24] Slug uniqueness race-safe** — Theme slug uniqueness is double-enforced: a pre-check in the create and modify flows plus a unique MongoDB index whose duplicate-key error (code 11000) maps to the 409 slug-already-exists response, so concurrent creations cannot both win.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question-theme/application/use-cases/**`, `src/contexts/question-theme/infrastructure/persistence/mongoose/repository/**`, `src/shared/infrastructure/persistence/mongoose/constants/**` · Src: [11], project: docs/domain-logic.md
- **[REL-25] Concurrent modify semantics deliberate** — Partial updates are flattened into field-scoped `$set` writes, so two concurrent modifications of different fields merge instead of one overwriting the other; the semantics are documented.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/*/infrastructure/persistence/mongoose/repository/**`, `src/shared/infrastructure/persistence/mongoose/helpers/**` · Src: project: docs/data-model.md
- **[REL-26] Invariant-critical writes atomic** — The exactly-one-primary invariant is enforced by one atomic bulkWrite (demote all, then set the target) and no write invariant is enforced by check-then-act alone; every invariant-critical write is an atomic conditional update.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/**`, `src/contexts/question/application/use-cases/question-theme-assignment/**` · Src: [4], project: docs/architecture.md §5.5, project: docs/domain-logic.md
- **[REL-27] Cross-context consistency best-effort by design** — The race between archiving a theme and assigning it to a question is best-effort by documented decision, and the race is tested where it matters.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question-theme/application/use-cases/archive-question-theme/**`, `docs/architecture.md` · Src: project: docs/architecture.md §5.5
- **[REL-28] Duplicate assignment race contained** — Concurrent assignment of the same theme to one question cannot create duplicate assignments: the duplicate check is enforced by an atomic conditional write, or the check-then-act is a documented best-effort decision.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/contexts/question/application/use-cases/question-theme-assignment/**`, `src/contexts/question/infrastructure/persistence/mongoose/repository/**` · Src: [11], project: docs/domain-logic.md
- **[REL-29] Race coverage in tests** — The races that matter (concurrent slug creation, primary promotion atomicity, archive-vs-assign) have unit or acceptance coverage asserting the atomic outcome.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/features/**`, `src/contexts/**` · Src: project: docs/architecture.md §5.5

## 6. Bounded resource use

- **[REL-30] List page size bounded** — Every list endpoint enforces a maximum page size on its limit parameter, or the unlimited `limit=0` behavior is a recorded known limitation in the performance guide with a revisit trigger.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/shared/application/dto/zod/validators/limit/**`, `docs/performance.md` · Src: [5], project: docs/performance.md
- **[REL-31] Random endpoint bounded** — The random-questions endpoint caps its result size with named constants (1..50, default 20) validated before the sample query runs.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/dto/find-random-questions-body/**` · Src: [5], project: docs/performance.md
- **[REL-32] Filter arrays capped** — Every request array filter is bounded by a named maximum before any query — at most 100 ids and 5000 excluded ids — so a client cannot push unbounded work into a query.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/dto/**`, `src/shared/application/dto/zod/validators/array/**` · Src: [5], project: docs/performance.md
- **[REL-33] Documents structurally bounded** — Documents are bounded by domain constants — at most 3 theme assignments, 5 source URLs, 500-character localized texts, 10-item text arrays across at most 6 locales — so responses and payloads stay within fixed bounds.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/*/domain/constants/**`, `src/shared/application/dto/zod/validators/localization/**` · Src: [5], project: docs/performance.md, project: docs/domain-logic.md
- **[REL-34] Request-size posture deliberate** — A request-size limit is configured explicitly, or the reliance on Fastify's 1 MiB body limit default is a recorded decision naming the bound (verified: fastify 5.12.8).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/infrastructure/api/server/**`, `docs/security.md` · Src: [12], project: docs/security.md
- **[REL-35] Capacity under load** — The API has been load-tested to its breaking point on the production topology with sustainable requests per second and p95 latency recorded, or the absence of load testing is a recorded decision with a revisit trigger.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [5], [3]

## Sources

[1] AWS Builders' Library — Timeouts, retries, and backoff with jitter — https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/ — fetched 2026-11-04 (published 2019-12-05)
[2] AWS Builders' Library — Making retries safe with idempotent APIs — https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/ — fetched 2026-11-04 (online article)
[3] Google SRE Book, Ch.22 — Addressing Cascading Failures — https://sre.google/sre-book/addressing-cascading-failures/ — fetched 2026-11-04 (2017)
[4] Mercari Production Readiness Checklist — Graceful degradation — https://github.com/mercari/production-readiness-checklist/blob/master/docs/concepts/graceful-degradation.md — fetched 2026-11-04 (repo master)
[5] Mercari Production Readiness Checklist — Capacity planning — https://github.com/mercari/production-readiness-checklist/blob/master/docs/concepts/capacity-planning.md — fetched 2026-11-04 (repo master)
[6] Mercari Production Readiness Checklist — Container log format — https://github.com/mercari/production-readiness-checklist/blob/master/docs/references/container-log-format.md — fetched 2026-11-04 (repo master)
[7] NestJS — Lifecycle events — https://docs.nestjs.com/fundamentals/lifecycle-events — fetched 2026-11-04 (docs for NestJS 12; library @nestjs/core 12.3.2)
[8] NestJS — Healthchecks (Terminus) — https://docs.nestjs.com/recipes/terminus — fetched 2026-11-04 (docs for NestJS 12; library @nestjs/terminus 12.1.0)
[9] Mongoose — Connections — https://mongoosejs.com/docs/connections.html — fetched 2026-11-04 (current docs; library mongoose 9.11.4)
[10] Mongoose — Connection API — https://mongoosejs.com/docs/api/connection.html — fetched 2026-11-04 (current docs; library mongoose 9.11.4)
[11] MongoDB — Unique indexes — https://www.mongodb.com/docs/manual/core/index-unique/ — fetched 2026-11-04 (current docs)
[12] Fastify — Server options — https://fastify.dev/docs/latest/Reference/Server/ — fetched 2026-11-04 (docs v5.12; library fastify 5.12.8)
[13] AWS Builders' Library — Implementing health checks — https://aws.amazon.com/builders-library/implementing-health-checks/ — fetched 2026-11-04 (undated article)
[14] Docker — docker container stop — https://docs.docker.com/reference/cli/docker/container/stop/ — fetched 2026-11-04 (current docs)
