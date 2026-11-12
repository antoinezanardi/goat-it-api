# OPS — Observability & operations

Operating the Goat It API (NestJS 12 + Fastify 5, MongoDB via Mongoose): the single `/health` readiness contract and its sanitized
failure body, structured Pino logging through nestjs-pino and the logging policy, the absence of an error tracker and how 5xx
failures are triaged from server logs, SLOs and external uptime monitoring (or their recorded deferral), runbooks and incident
readiness, post-deploy verification in the deploy workflows, and the container and acceptance-database operational probes. It
checks that failures are detected, attributed and actionable, not what data may be collected or how requests are guarded.

**Decision doc:** `docs/operations.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** what may be logged, secrets in logs → SEC · error-tracker PII and data collection → PRIV · timeouts, retries, backoff → REL · Docker image build and immutable tags → PLAT · deploy workflow hardening and credentials → CICD · rate-limiting abuse → SEC

## Contents

- [1. Health & readiness contract](#1-health--readiness-contract)
- [2. Structured logs](#2-structured-logs)
- [3. Error tracking, SLOs and alerts](#3-error-tracking-slos-and-alerts)
- [4. Runbooks & post-deploy verification](#4-runbooks--post-deploy-verification)
- [5. Docker & database operational checks](#5-docker--database-operational-checks)
- [Sources](#sources)

## 1. Health & readiness contract

- **[OPS-01] Single readiness contract** — The readiness endpoint is public, unauthenticated and answers at the documented path; there is no split readiness namespace, and the root metadata endpoint stays lightweight. Both methods answer 200 when ready and 503 when not; the paths are recorded in `docs/operations.md`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/infrastructure/api/health/**`, `src/app/controllers/**` · Src: [1], [11], project: docs/operations.md, project: docs/api-contract.md
- **[OPS-02] Readiness checks only real dependencies** — Readiness is computed from the documented dependency checks and nothing else; no disk, memory, CPU, queue or external-service checks pollute the signal, and a check is added only when it represents a dependency the process cannot serve without.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/infrastructure/api/health/**` · Src: [1], project: docs/operations.md
- **[OPS-03] Sanitized 503 body** — When readiness fails, `503` carries only the generic `statusCode`/`message`/`error` body; MongoDB or documentation error text, URLs, connection strings, stack traces and component details are never sent, and the detailed cause is logged server-side before the sanitized response.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/infrastructure/api/health/**` · Src: [1], [11], project: docs/operations.md
- **[OPS-04] Health responses are never cached** — Both health methods send `Cache-Control: no-store` from one named constant, so clients, browsers, load balancers and intermediaries never cache a readiness result.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/health/**` · Src: [1], project: docs/operations.md
- **[OPS-05] HEAD performs the same checks as GET** — `HEAD /health` runs the identical readiness checks and returns the same status and application headers as `GET` with no body, because Fastify 5 auto-exposes HEAD routes for GET handlers (verified: fastify 5.12.8).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/health/**` · Src: [12], project: docs/operations.md
- **[OPS-06] Health checks complete in bounded time** — Every readiness check has an explicit timeout or a documented bound, so `/health` cannot hang on an unreachable dependency; the bounds belong in `docs/operations.md`, and a missing bound is a finding.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/health/**`, `src/infrastructure/database/constants/**` · Src: [11], project: docs/operations.md
- **[OPS-07] Readiness stays keyless and leak-free** — The health endpoint is not protected by an API key and its response contains no sensitive operational data; authentication applies to business endpoints only.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/health/**`, `src/infrastructure/api/auth/**` · Src: [1], project: docs/operations.md
- **[OPS-08] 200 body shape locked** — The healthy response body is the documented `AppHealthDto` shape — an aggregated `status` over the four terminus values plus one details entry per check — and matches the API contract and the readiness contract in the operations guide.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/health/**` · Src: [11], project: docs/operations.md, project: docs/api-contract.md

## 2. Structured logs

- **[OPS-09] Pino installed at bootstrap with buffering** — The Nest application is created with `bufferLogs` and the nestjs-pino logger installed as the application logger, so startup logs are buffered until the logger is ready and every later Nest log goes through Pino.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/server/**`, `src/app/**` · Src: [10], project: docs/security.md
- **[OPS-10] NDJSON records with a stable base schema** — Each log record is one JSON line on stdout with the numeric Pino level and timestamp; production logs are plain JSON while local development pipes through `pino-pretty` (verified: pino 10.3.1), and no file or worker-thread transport is configured.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/helpers/**`, `src/infrastructure/api/server/**` · Src: [9], [8], project: docs/security.md
- **[OPS-11] No stray console calls** — `console` output is forbidden in application source by the ESLint and Oxlint configurations, and every application log goes through the Pino logger.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: medium · Look: `oxlint.config.jsonc`, `configs/eslint/**`, `src/**` · Src: [9], [8], project: AGENTS.md
- **[OPS-12] Request context on every request log** — Every HTTP request is logged automatically at `info` with request context (request id, method, URL, status and duration) propagated to logs emitted while handling the request, so a log line is attributable to the request that produced it.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/**`, `src/infrastructure/api/server/**` · Src: [10], [8]
- **[OPS-13] Level discipline** — Unexpected failures log at `error`, degraded states (a lost database connection) at `warn` and routine startup at `info`; expected 4xx responses are not logged as errors.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/filters/global-exception/**`, `src/infrastructure/database/**` · Src: [9], project: docs/security.md
- **[OPS-14] Logging policy applied** — The logging policy documented in the security guide is implemented in code: no code path logs request bodies or headers, and the API-key secrets are removed from the process environment at boot, so secrets never reach a log line.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/**`, `src/infrastructure/api/config/**` · Src: [9], project: docs/security.md
- **[OPS-15] Logging never fails a request** — A logger write never changes a response: Pino writes are asynchronous stdout writes that do not throw into the request path, and the exception filter still answers `500` after logging an unknown error.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/filters/global-exception/**`, `src/app/helpers/**` · Src: [9], project: docs/security.md

## 3. Error tracking, SLOs and alerts

- **[OPS-16] Server-side error logs are the triage path** — Every unknown 500 is logged server-side with its message before the generic response is sent, so failures are discoverable from stdout even though no error-tracking service is wired.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/filters/global-exception/**` · Src: [9], project: docs/security.md
- **[OPS-17] Error tracking is wired with 5xx spike alerts** — An error-tracking service is wired with 5xx spike alerts and the tracker honors the PII-scrubbing allow-list owned by the privacy guide; a documented absence is a GAP, not a pass.
  Evidence: `static` · Diff: ✓ · Target: reach · Severity: high · Look: `package.json`, `src/app/app.module.ts`, `docs/security.md`, `docs/privacy.md` · Src: [2], [5], project: docs/security.md
- **[OPS-18] Error attribution structure** — Every server-side error log carries enough structure — the error message and the source context — to count and attribute failures per type when logs are aggregated.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/filters/global-exception/**`, `src/infrastructure/database/**` · Src: [9], [8]
- **[OPS-19] Uptime monitor inventory documented** — The operations guide lists one external monitor per environment probing the documented readiness endpoint with method, URL, expected result and cadence; the current inventory is in `docs/operations.md`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `docs/operations.md` · Src: [2], [1], project: docs/operations.md
- **[OPS-20] Monitor assertions match the probe contract** — A monitor asserts HTTP 200 plus the `"status":"ok"` body keyword — never an open port — and the documented keyword matches what the readiness endpoint actually returns.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/operations.md`, `src/infrastructure/api/health/**` · Src: [1], [11], project: docs/operations.md
- **[OPS-21] Numeric SLOs have an owner and an error budget** — The operations guide states numeric SLO targets with an owner and an error-budget policy; a deferral is a GAP, not a pass.
  Evidence: `static` · Diff: ✓ · Target: reach · Severity: medium · Look: `docs/operations.md` · Src: [3], [4], project: docs/operations.md

## 4. Runbooks & post-deploy verification

- **[OPS-22] Deploy and rollback runbook** — The operations guide documents how a release reaches staging and production and the manual rollback procedure with copy-pasteable commands and the expected verification.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `docs/operations.md` · Src: [6], [7], project: docs/operations.md
- **[OPS-23] Post-deploy gate in every deploy workflow** — Both deploy workflows run a health-check verification step as a separate job step after the SSH deploy, probing their environment's API URL, and a gate failure fails the deployment job.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.github/workflows/deploy-*.yml`, `.github/actions/health-check/**` · Src: [6], [1], project: docs/ci-cd.md
- **[OPS-24] Bounded gate with strict success** — The post-deploy verification script uses a bounded budget from documented constants, treats only the documented success status as success, retries every other status, timeout or connection error, and exits non-zero with an error annotation after the last attempt.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `scripts/post-deploy-health-check.sh` · Src: [1], project: docs/operations.md
- **[OPS-25] Gate probes the documented liveness target** — The gate probes the root liveness URL (`GET /`), matching the container health-check signal, and the operations guide states exactly what the probe proves and does not prove (MongoDB readiness, build SHA, rollback).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/actions/health-check/**`, `docs/operations.md` · Src: [1], [14], project: docs/operations.md
- **[OPS-26] Smoke beyond liveness** — Post-deploy verification also exercises the readiness endpoint and one authenticated business call, not only the liveness root, or the liveness-only scope is a documented decision.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/deploy-*.yml`, `docs/operations.md` · Src: [1], project: docs/operations.md
- **[OPS-27] Failure-mode table** — The operations guide states, for MongoDB unavailable, documentation endpoint unreachable, process crash or kill and host failure, the expected system behaviour and the monitor, alert or log line that detects it.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `docs/operations.md` · Src: [5], [2], project: docs/operations.md
- **[OPS-28] A failed post-deploy gate rolls back automatically** — A failed post-deploy gate redeploys the previous image tag without manual intervention, and the workflow records the recovered version; an out-of-scope decision is a GAP, not a pass.
  Evidence: `static` · Diff: ✓ · Target: reach · Severity: high · Look: `.github/workflows/deploy-*.yml`, `.github/actions/deploy/**`, `docs/operations.md` · Src: [7], project: docs/operations.md

## 5. Docker & database operational checks

- **[OPS-29] Container liveness separated from readiness** — The production image's health check probes the liveness root with a real GET and documented interval, timeout, retries and start period, and is never pointed at the readiness endpoint while that endpoint drives readiness monitoring.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `Dockerfile`, `docs/operations.md` · Src: [1], [14], project: docs/operations.md
- **[OPS-30] Acceptance database is probed and disposable** — The acceptance compose declares a bounded healthcheck for the database service, pins the image, and the teardown removes the data it created or the suite resets it per run, so the test database fails visibly when unhealthy and stays disposable.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docker/goat-it-api-acceptance-tests/**`, `package.json` · Src: [13], project: docs/data-model.md

## Sources

[1] AWS Builders' Library — Implementing health checks — https://aws.amazon.com/builders-library/implementing-health-checks/ — fetched 2026-11-04 (undated article)
[2] Google SRE Book, Ch.6 — Monitoring Distributed Systems — https://sre.google/sre-book/monitoring-distributed-systems/ — fetched 2026-11-04 (2017)
[3] Google SRE Book, Ch.4 — Service Level Objectives — https://sre.google/sre-book/service-level-objectives/ — fetched 2026-11-04 (2017)
[4] Google SRE Workbook, Ch.5 — Alerting on SLOs — https://sre.google/workbook/alerting-on-slos/ — fetched 2026-11-04 (2018)
[5] Google SRE Book, Appendix E — Launch Coordination Checklist — https://sre.google/sre-book/launch-checklist/ — fetched 2026-11-04 (2017)
[6] Mercari Production Readiness Checklist — Pre-production Checklist — https://github.com/mercari/production-readiness-checklist/blob/master/docs/references/pre-production-checklist.md — fetched 2026-11-04 (repo master)
[7] Mercari Production Readiness Checklist — Zero downtime deploy — https://github.com/mercari/production-readiness-checklist/blob/master/docs/concepts/zero-downtime-deploy.md — fetched 2026-11-04 (repo master)
[8] Mercari Production Readiness Checklist — Container log format — https://github.com/mercari/production-readiness-checklist/blob/master/docs/references/container-log-format.md — fetched 2026-11-04 (repo master)
[9] Pino — API documentation (level, redact, timestamp) — https://github.com/pinojs/pino/blob/v10.3.1/docs/api.md — fetched 2026-11-04 (docs v10.3.1; library pino 10.3.1)
[10] nestjs-pino — README (LoggerModule, pinoHttp, bufferLogs) — https://github.com/iamolegga/nestjs-pino — fetched 2026-11-04 (repo master; library nestjs-pino 5.3.1)
[11] NestJS — Healthchecks (Terminus) — https://docs.nestjs.com/recipes/terminus — fetched 2026-11-04 (docs for NestJS 12; library @nestjs/terminus 12.1.0)
[12] Fastify — Server options — https://fastify.dev/docs/latest/Reference/Server/ — fetched 2026-11-04 (docs v5.12; library fastify 5.12.8)
[13] Docker Compose — Services healthcheck — https://docs.docker.com/reference/compose-file/services/ — fetched 2026-11-04 (current docs)
[14] Docker — docker container stop — https://docs.docker.com/reference/cli/docker/container/stop/ — fetched 2026-11-04 (current docs)
