# PLAT — Runtime platform (containers, config, deployment)

Runtime platform of the Goat It API: the multi-stage `Dockerfile` that turns the NestJS 12 + Fastify 5 application into a Node ESM image running the built `dist/` entrypoint, build-secret handling and image hygiene, twelve-factor runtime configuration (Zod environment schema, boot validation, toolchain versions), process lifecycle and graceful shutdown, the container `HEALTHCHECK` liveness probe kept separate from the `/health` readiness endpoint, the acceptance-test MongoDB Compose stack (there is no production Compose), and how the multi-arch images are tagged and run on the VPS through the SSH deploy.

**Decision doc:** `docs/operations.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** workflow definitions, required checks, deploy credentials, digest promotion → CICD · health checks at runtime, uptime monitors, runbooks, rollback procedure, post-deploy verification → OPS · shutdown/timeout semantics inside the app → REL · headers/rate limiting → SEC

## Contents

- [1. Dockerfile and image](#1-dockerfile-and-image)
- [2. Build secrets and image scanning](#2-build-secrets-and-image-scanning)
- [3. Container and compose configuration](#3-container-and-compose-configuration)
- [4. Environment and configuration](#4-environment-and-configuration)
- [5. Node and engine](#5-node-and-engine)
- [6. Build pipeline](#6-build-pipeline)
- [7. Server bootstrap and runtime configuration](#7-server-bootstrap-and-runtime-configuration)
- [8. Deployment runtime](#8-deployment-runtime)
- [Sources](#sources)

## 1. Dockerfile and image

- **[PLAT-01] Base images pinned by exact tag and digest** — Every `FROM` of every stage uses an exact version tag plus digest (`node:<x.y.z>-alpine<a.b>@sha256:<64 hex>`); no `latest`, variant-only (`node:alpine`, `node:lts`) or untagged image (hadolint DL3006/DL3007 clean).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `Dockerfile` · Src: [1], [6]
- **[PLAT-02] Production stage ships only the build output** — The final `production` stage starts from a clean runtime base and copies only the pruned `node_modules` and the built `dist/` from the `build` stage: no source tree, no lockfile-driven install at runtime, no compilers (`python3`, `make`, `g++`, `build-base`).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `Dockerfile` · Src: [1], [5], [7]
- **[PLAT-03] Non-root user owns the app files** — The final stage's last `USER` is the non-root `node` user (hadolint DL3002) and every `COPY` into that stage uses `--chown=node:node` (Docker's default owner is UID/GID 0).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `Dockerfile` · Src: [3], [4], [5], [6]
- **[PLAT-04] Complete .dockerignore** — `.dockerignore` excludes at least `.git`, `node_modules`, `dist`, `coverage`, `tests`, `docs`, `.github`, environment files, `Dockerfile*` and `docker-compose*.yml`, plus `.npmrc`, `*.pem` and `*.key` whenever such files can exist, so no `COPY` can pull secrets or local artefacts into a layer.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.dockerignore` · Src: [1], [7]
- **[PLAT-05] Cache-friendly layer order** — Dependency manifests (`package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`) and only the files the install/postinstall step needs are copied before `pnpm install`; application sources are copied after it, so a source-only change does not invalidate the install layer.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `Dockerfile` · Src: [1], [7]
- **[PLAT-06] Production node_modules pruned** — The `build` stage runs `pnpm prune --prod` after the build and only that pruned store is copied into the `production` stage, so no dev dependency ships in the final image.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `Dockerfile` · Src: [1], [7]
- **[PLAT-07] NODE_ENV=production at runtime** — The final stage sets `ENV NODE_ENV=production`, and the production start command keeps it, so the process never boots with development semantics.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `Dockerfile` · Src: [5], [7]
- **[PLAT-08] Exec-form CMD without package-manager wrapper** — The final `CMD`/`ENTRYPOINT` is a JSON array that starts `node` directly on the built entrypoint, with no shell form and no `npm start`/`pnpm start` indirection (hadolint DL3025), so the stop signal reaches Node.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `Dockerfile` · Src: [1], [5], [6], [7]
- **[PLAT-09] Container HEALTHCHECK targets liveness** — The `HEALTHCHECK` performs a real GET on the liveness root (`http://localhost:${SERVER_PORT}/`), never the readiness endpoint, with `--timeout` lower than `--interval`, at least 3 retries and a start period that covers cold boot.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `Dockerfile`, `docs/operations.md` · Src: [4], [8], project: docs/operations.md
- **[PLAT-10] Init process and stop signal declared** — Node does not run as an unguarded PID 1: the image uses an init entrypoint (`tini`/`dumb-init`) or the documented run configuration sets `--init`/`init: true`, and `SIGTERM` is the declared or documented stop signal.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `Dockerfile`, `docs/operations.md` · Src: [4], [5], [9], project: docs/operations.md

## 2. Build secrets and image scanning

- **[PLAT-11] No credential in ARG or ENV** — No `ARG`/`ENV` of any stage carries a token, key or password (hadolint DL3064); a build step that needs a credential uses `RUN --mount=type=secret,id=<id>,required=true`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: critical · Look: `Dockerfile`, `.github/workflows/deploy-*.yml` · Src: [2], [3], [6]
- **[PLAT-12] No secret files matching the scan patterns in the final image** — The documented scan for its own secret filename patterns prints nothing; a filename outside that pattern list is not covered by the check, and the pattern list is the check's contract.
  Evidence: `command` · Diff: ✗ · Core: ✓ · Severity: critical · Src: [3], [7]
- **[PLAT-13] Dockerfile lint clean** — `hadolint --failure-threshold warning Dockerfile` exits 0 and every inline `# hadolint ignore=` carries a written justification.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [6]

## 3. Container and compose configuration

- **[PLAT-14] Acceptance Mongo stack pinned and health-checked** — The acceptance-test compose pins the Mongo image to an exact tag and declares a healthcheck on the `ping` command that the CI job relies on before running the suite.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docker/goat-it-api-acceptance-tests/**` · Src: [17]
- **[PLAT-15] No production compose; runtime supervision documented** — The repository ships no production compose file pretending to define the production runtime; the restart policy, stop grace period and environment injection are documented in a repository doc with the external file they live in.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docker/**`, `docs/operations.md` · Src: [9], [11], project: docs/operations.md
- **[PLAT-16] No privileged or host-networked test containers** — No compose service uses `privileged: true`, `network_mode: host` or a bind-mount of host paths into the container.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docker/**` · Src: [3]
- **[PLAT-17] No Docker socket exposure** — No compose file, deploy script or workflow bind-mounts `/var/run/docker.sock` into a container.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: critical · Look: `docker/**`, `.github/**` · Src: [3]

## 4. Environment and configuration

- **[PLAT-18] Environment schema covers every variable** — The boot schema declares every environment variable the application reads, with a type, validation and either a documented default or a documented no-default rule that fails at boot; the variable inventory is in `.env.example`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/infrastructure/api/config/schemas/env.schema.ts`, `src/infrastructure/api/config/**` · Src: [19], project: docs/architecture.md
- **[PLAT-19] Invalid configuration fails fast at boot** — The configuration module validates the parsed environment through the schema and throws when it fails, so a missing or invalid required variable exits non-zero at boot and the log names the offending variable.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/infrastructure/api/config/**` · Src: [10], [19]
- **[PLAT-20] .env.example parity** — `.env.example` lists every schema key with a placeholder and documents its meaning, and lists no stale variable.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `env/.env.example`, `env/.env.test`, `src/infrastructure/api/config/schemas/env.schema.ts` · Src: [10]
- **[PLAT-21] Environment file selected by NODE_ENV** — The environment file path derives from `NODE_ENV` (test loads the test file, production loads none), so an operator error cannot load a test or local file in production.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/config/helpers/env.helpers.ts` · Src: [10], [19]
- **[PLAT-22] Secure configuration defaults** — The schema defaults ship no credential, keep proxy trust off and enforce minimal lengths on the API keys; no file sets `NODE_TLS_REJECT_UNAUTHORIZED=0`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/infrastructure/api/config/schemas/env.schema.ts`, `env/.env.example` · Src: [10]
- **[PLAT-23] Test environment isolated from production values** — The test env file uses a dedicated database name and placeholder test credentials only, never production values.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `env/.env.test` · Src: [10], [13]

## 5. Node and engine

- **[PLAT-24] One Node version source** — The Node version file, `package.json` `engines.node`, every Dockerfile `FROM node:` tag and the CI `setup-node` file resolve to the same exact version.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/node/.node-version`, `package.json`, `Dockerfile`, `.github/actions/install-project/action.yml` · Src: [1], [5], [21]
- **[PLAT-25] One pnpm version source** — The pnpm version installed in the Dockerfile (resolved from the `packageManager` field through Corepack) equals the version the CI action-setup installs and the `packageManager` field in `package.json`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `package.json`, `Dockerfile`, `.github/actions/install-project/action.yml` · Src: [21]
- **[PLAT-26] Runtime base supported and refreshed** — `trivy image --exit-on-eol 1 <image>` passes: the Node major and the Alpine release of the runtime base are still supported, and the image is rebuilt from a freshly pulled base at least monthly.
  Evidence: `command` · Diff: ✗ · Severity: high · Look: `Dockerfile` · Src: [1], [15]

## 6. Build pipeline

- **[PLAT-27] SWC builder configured with the shared alias map** — `nest build` uses the SWC builder with decorator metadata enabled, type-checking on and the repository path aliases resolved from the shared configuration, so the compiled output matches development resolution.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/nest/nest-cli.config.json`, `configs/swc/swc.config.json` · Src: [20]
- **[PLAT-28] ESM build output verified** — The build produces the ESM entrypoint through the SWC build and the `tsc-alias` extension pass, and the CI build job fails when that entrypoint is missing.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `package.json`, `configs/typescript/tsconfig.app.json`, `.github/actions/build/action.yml` · Src: [22]
- **[PLAT-29] Built-output secret scan wired into every build path** — The secret scan over the built output runs after the CI build and inside the Docker build stage before the prune, fails closed when the scan itself errors, and never prints the secret value.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `scripts/check-secrets-in-built-output.sh`, `.github/actions/build/action.yml`, `Dockerfile` · Src: [2], project: docs/ci-cd.md
- **[PLAT-30] Generated dist never committed** — The build output directory is git-ignored and no workflow or hook reads a committed build artefact, so every environment rebuilds from source.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.gitignore`, `.github/workflows/*.yml` · Src: [12]
- **[PLAT-31] Dev and prod entrypoints consistent** — The dev server and the production start run the same ESM entrypoint through the Nest CLI loader (`node --import tsx/esm`) and the plain Node runtime, with no divergent transpilation step between them.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `configs/nest/nest-cli.config.json`, `package.json`, `Dockerfile` · Src: [20], [22]

## 7. Server bootstrap and runtime configuration

- **[PLAT-32] Buffered logs and explicit logger wiring** — The bootstrap creates the application with `bufferLogs: true` and wires the structured logger before `listen`, so no log line is lost during startup.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/infrastructure/api/server/server.ts` · Src: [18]
- **[PLAT-33] CORS configured from validated environment** — The CORS policy is built from the validated configuration (origin validator) and applied once at bootstrap, not assembled per request from raw `process.env` access.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/server/**`, `src/infrastructure/api/config/validators/cors.validator.ts` · Src: [10], [19]
- **[PLAT-34] Shutdown hooks enabled and documented** — The bootstrap calls `app.enableShutdownHooks()`, the MongoDB connection closes through the Nest lifecycle on `SIGTERM`/`SIGINT`, and the stop grace period contract is documented.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/infrastructure/api/server/server.ts`, `docs/operations.md` · Src: [9], [18], project: docs/operations.md
- **[PLAT-35] Server listens on validated host and port** — The listen call uses the host and port from the validated server configuration; the container environment and the container health check use that same port; the current defaults live in the validated server configuration.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/server/server.ts`, `src/infrastructure/api/config/**`, `Dockerfile` · Src: [14], [19]
- **[PLAT-36] Production start command sets NODE_ENV** — The production start script sets `NODE_ENV=production` before starting Node, and the image `ENV` provides the same value.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `package.json`, `Dockerfile` · Src: [12]

## 8. Deployment runtime

- **[PLAT-37] Immutable release tags** — Each production release pushes the `vX.Y.Z` release tag next to the moving `latest` tag, and no environment overwrites an existing release tag with a new image.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/deploy-*.yml`, `.github/workflows/docker-build-and-push.yml` · Src: [12], [16]
- **[PLAT-38] Multi-arch manifest matches the hosts** — `docker buildx imagetools inspect <image>:<tag>` lists `linux/amd64` and `linux/arm64` manifests for every pushed tag, including the architecture of each deployment host.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [16]
- **[PLAT-39] Staging and production build parity** — Staging and production images are built from the same Dockerfile with the same build-arg names and platform matrix; only image tags and environment values differ.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/deploy-*.yml` · Src: [13], [16]
- **[PLAT-40] Hosts run a pinned image** — The staging and production update scripts pull and run a version tag or digest, never only `latest` or `develop`, so the running image is identifiable and can be redeployed.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [12]

## Sources

[1] Docker — Building best practices — https://docs.docker.com/build/building/best-practices/ — fetched 2026-11-04 (undated)
[2] Docker — Build secrets — https://docs.docker.com/build/building/secrets/ — fetched 2026-11-04 (undated)
[3] OWASP — Docker Security Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html — fetched 2026-11-04 (rolling content)
[4] Docker — Dockerfile reference — https://docs.docker.com/reference/dockerfile/ — fetched 2026-11-04 (current)
[5] nodejs/docker-node — Docker and Node.js Best Practices — https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md — fetched 2026-11-04 (main branch)
[6] Hadolint — Rules — https://github.com/hadolint/hadolint#rules — fetched 2026-11-04 (master, DL3000–DL4006)
[7] Snyk — 10 best practices to containerize Node.js web applications with Docker — https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/ — fetched 2026-11-04 (2022-09-14)
[8] Kubernetes — Liveness, Readiness, and Startup Probes — https://kubernetes.io/docs/concepts/workloads/pods/probes/ — fetched 2026-11-04 (Kubernetes docs)
[9] The Twelve-Factor App — IX. Disposability — https://12factor.net/disposability — fetched 2026-11-04 (last updated 2017)
[10] The Twelve-Factor App — III. Config — https://12factor.net/config — fetched 2026-11-04 (last updated 2017)
[11] The Twelve-Factor App — VI. Processes — https://12factor.net/processes — fetched 2026-11-04 (last updated 2017)
[12] The Twelve-Factor App — V. Build, release, run — https://12factor.net/build-release-run — fetched 2026-11-04 (last updated 2017)
[13] The Twelve-Factor App — X. Dev/prod parity — https://12factor.net/dev-prod-parity — fetched 2026-11-04 (last updated 2017)
[14] The Twelve-Factor App — VII. Port binding — https://12factor.net/port-binding — fetched 2026-11-04 (last updated 2017)
[15] Trivy — trivy image CLI reference — https://trivy.dev/latest/docs/references/configuration/cli/trivy_image/ — fetched 2026-11-04 (v0.67.x docs)
[16] Docker — Multi-platform builds — https://docs.docker.com/build/building/multi-platform/ — fetched 2026-11-04 (undated)
[17] Docker Compose — Services top-level element (healthcheck) — https://docs.docker.com/reference/compose-file/services/ — fetched 2026-11-04 (Compose Specification)
[18] NestJS — Lifecycle events — https://docs.nestjs.com/fundamentals/lifecycle-events — fetched 2026-11-04 (NestJS 12.3.x installed)
[19] NestJS — Configuration — https://docs.nestjs.com/techniques/configuration — fetched 2026-11-04 (@nestjs/config 12.0.x installed)
[20] NestJS — SWC (blazing fast builds) — https://docs.nestjs.com/recipes/swc — fetched 2026-11-04 (Nest CLI 12.x installed)
[21] pnpm — Installation — https://pnpm.io/installation — fetched 2026-11-04 (pnpm 12.16.1 installed)
[22] Node.js — Command-line API (`--import`) — https://nodejs.org/api/cli.html — fetched 2026-11-04 (Node 26.13.0 installed)
