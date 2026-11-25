# Dependencies and supply chain

This document owns the repository's dependency-resolution decisions: the scoped `pnpm` overrides that pin vulnerable transitive packages to patched versions, the duplicate-major inventory of the installed graph, and the audit policy that enforces both.

It is written for maintainers who update dependencies or triage an advisory. The CI job wiring is owned by [ci-cd.md](ci-cd.md); the security posture is owned by [security.md](security.md); release versioning is owned by [ci-cd.md § Versioning rules](ci-cd.md#versioning-rules).

## Audit policy

| Surface              | Command                                 | Threshold        |
|----------------------|-----------------------------------------|------------------|
| Production closure   | `pnpm audit --prod --audit-level=low`   | any advisory     |
| Full dependency tree | `pnpm audit --audit-level=high`         | high or critical |
| Weekly report        | `scripts/report-dependency-audit.sh`    | all severities   |

The production closure must stay at zero advisories of any severity. The full tree may carry moderate or low development findings, but no high or critical finding. The stricter production threshold is affordable because the deployed closure is small and its audits are clean; the full tree is larger and its remaining findings are development-only, so blocking on them would keep the pipeline red for tooling that never ships.

The remaining full-tree findings at the last review (2026-11-25) are all development-only and are re-checked on every relevant Renovate update:

| Package     | Advisory                                                                                                                  | Consumer                         | Why accepted                                                                 |
|-------------|---------------------------------------------------------------------------------------------------------------------------|----------------------------------|------------------------------------------------------------------------------|
| `fast-copy` | GHSA-jggr-w7fw-pc2j                                                                                                       | `pino-pretty`                    | dev logger; patched 4.1.0 requires a new range from `pino-pretty`             |
| `minimatch` | GHSA-g3hv-75wg-m249                                                                                                       | Stryker, `@swc/cli`, Nest CLI    | dev tooling; the patched 11.0.1 is a major jump from the pinned 3/9/10 lines  |
| `qs`        | GHSA-4mjr-xmp4-gh2g, GHSA-q8mj-m7cp-5q26, GHSA-x5fp-wj9c-mxmx, GHSA-6pq8-jhm2-2vcw                                        | Stryker (`typed-rest-client`)    | dev test runner; patched 6.16.1 requires a new range from `typed-rest-client` |

## Scoped overrides

`overrides` are declared in `pnpm-workspace.yaml`. The scoped entries are security pins: a `parent>child` selector that stays inside the parent's declared semver range and pins the same major. A pin is kept only while the parent's declared range lower bound is below the patched version; once the parent's own range can no longer select a vulnerable copy, the pin is removed (see the exit condition below). `esbuild` is a global patch pin shared by several build consumers. `conventional-changelog-writer` is the one deliberate exception: it is global and crosses `@semantic-release/release-notes-generator@14`'s `^8` range because the conventionalcommits@10 preset needs writer 9 (recorded in `CHANGELOG.md`); it only affects release tooling.

Renovate updates the values when a newer satisfying version exists (the `npm` manager extracts `pnpm-workspace.overrides`, introduced in Renovate 43.110.0), but it never removes an override and `osvVulnerabilityAlerts` only covers direct dependencies, so an override entry does not receive an OSV pull request. The full-tree audit is the safety net, and the exit condition below is the manual retirement trigger. The pin may be newer than the exit threshold: the exit is about the parent's declared lower bound, not the pin.

| Override                                              | Pin        | Advisory IDs                                                                                                                   | Exit condition (parent lower bound reaches)                                     |
|-------------------------------------------------------|------------|--------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| `@actions/http-client>undici`                         | `^6.29.1`  | GHSA-vxpw-j846-p89q, GHSA-rfgv-xxqx-mfg5, GHSA-xjj6-f33q-929c, GHSA-qrxm-fqhp-jwvm, GHSA-2m5v-pch6-74hx                      | `6.29.1`                                                                       |
| `@devframes/agentic>@modelcontextprotocol/client`     | `^2.4.0`   | GHSA-6qxp-vccf-f47h                                                                                                            | `2.4.0`                                                                        |
| `@devframes/agentic>@modelcontextprotocol/server`     | `^2.4.0`   | GHSA-f897-62hf-6gxq, GHSA-46jr-4wx8-v453, GHSA-jm63-cq47-j5jp                                                                  | `2.4.0`                                                                        |
| `@eslint/css-tree>source-map-js`                      | `^1.2.4`   | GHSA-68fv-2mgg-jv7q                                                                                                            | `1.2.2`                                                                        |
| `@semantic-release/github>undici`                     | `^7.30.2`  | GHSA-4cwx-7wf7-3272, GHSA-4w7w-5xrc-9h26, GHSA-hm92-r4w5-c3mj, GHSA-vmh5-mc38-953g, GHSA-w293-vg96-wgc3, GHSA-vxpw-j846-p89q, GHSA-rfgv-xxqx-mfg5 | `7.30.1`                                                                       |
| `@swc/cli>piscina`                                    | `^4.9.4`   | GHSA-67c8-pqhq-4rmx (critical), GHSA-x9g3-xrwr-cwfg (high)                                                                     | `4.9.4`                                                                        |
| `@xhmikosr/downloader>@xhmikosr/decompress`           | `^11.1.4`  | GHSA-mp2f-45pm-3cg9 (critical), GHSA-hrh2-vp3x-79xf (critical)                                                                 | `11.1.4`                                                                       |
| `conventional-changelog-writer`                       | `^9.3.0`   | n/a                                                                                                                            | direct `@semantic-release/release-notes-generator` reaches 15, which declares `^9` |
| `cosmiconfig@8>js-yaml`                               | `^4.3.2`   | GHSA-5p4m-2wfm-xmqj, GHSA-2883-xcg3-v3hh                                                                                       | `4.3.2`                                                                        |
| `cosmiconfig@9>js-yaml`                               | `^4.3.2`   | GHSA-5p4m-2wfm-xmqj, GHSA-2883-xcg3-v3hh                                                                                       | `4.3.2`                                                                        |
| `esbuild`                                             | `^0.28.2`  | GHSA-g7r4-m6w7-qqqr (low)                                                                                                      | `0.28.2`                                                                       |
| `magicast>source-map-js`                              | `^1.2.4`   | GHSA-68fv-2mgg-jv7q                                                                                                            | `1.2.2`                                                                        |
| `vitest>vite`                                         | `^8.3.8`   | GHSA-587h-7wmj-h5pm                                                                                                            | `8.1.6` (vitest declares `^6.4.0 \|\| ^7.0.0 \|\| ^8.0.0`; the lockfile's `^8.3.8` peer spec is override-rewritten) |

## Duplicate majors

A duplicate major is a package name resolved to more than one major in `pnpm-lock.yaml`. Duplicate copies are only merged when the parents' ranges are semver-compatible; a security override is never used to force a major jump. The production rows were derived with `pnpm list --prod --depth Infinity --json` and exclude optional peer edges (webpack, `debug`'s optional `supports-color`); the development inventory is the remainder of `pnpm-lock.yaml`. The inventory below was checked on 2026-11-25.

### Production closure

| Package               | Majors        | Owning upstream                                                                 | Exit condition                                                                 |
|-----------------------|---------------|---------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| `dotenv`              | 17 / 18       | `@sentry/node` → `@sentry/bundler-plugins` (17); `@nestjs/config` (18)          | Sentry plugins accept `dotenv 18`, or `@nestjs/config` moves to 17              |
| `fast-json-stringify` | 6 / 7         | `@fastify/fast-json-stringify-compiler` (6); `fastify` (7)                       | `@fastify/fast-json-stringify-compiler` declares `fast-json-stringify ^7`       |
| `path-to-regexp`      | 8 / 9         | `@nestjs/core` (8); `@fastify/middie` via `@nestjs/platform-fastify` (9)        | Nest core and `@fastify/middie` converge                                       |
| `real-require`        | 0.2 / 1       | `pino` (0.2); `thread-stream` (1)                                                | `pino` and `thread-stream` converge on one major                                |

These four are not overridden: the parents' ranges are not semver-compatible, and forcing one side would break a production dependency. They are re-checked when `@sentry`, `@nestjs/config`, `fastify`, `pino` or the Nest/Fastify adapters change a major.

### Development tree

The 92 development-only duplicates are grouped by owning toolchain. None of these development copies ships in the production image; each group states the reason and the condition that removes the old major.

#### Nest CLI, SWC and webpack build chain

`@babel/code-frame` (7/8), `@babel/helper-string-parser` (7/8), `@babel/helper-validator-identifier` (7/8), `@babel/parser` (7/8), `@babel/types` (7/8), `ajv` (6/8), `ajv-formats` (2/3), `chokidar` (3/4/5), `glob-parent` (5/6), `js-tokens` (4/10), `json-schema-traverse` (0/1), `readdirp` (3/4/5), `schema-utils` (3/4).

Reason: Babel 8, ajv 8 and their parser utilities are pulled by the newer webpack/fork-ts-checker/Stryker line, while older Nest CLI and webpack plugins still pin Babel 7 and ajv 6. `ajv-formats` 2 is development (`schema-utils`) while 3 is production (`@fastify/ajv-compiler`), so it is a cross-closure duplicate rather than a production-closure duplicate. Exit when `@nestjs/cli`, `fork-ts-checker-webpack-plugin`, `webpack`, `terser-webpack-plugin` and `@stryker-mutator/instrumenter` all accept the newer majors.

#### WASM/native bindings

`@emnapi/core` (1/2.0.0-beta.2), `@emnapi/runtime` (1/2.0.0-beta.2), `@emnapi/wasi-threads` (1/2).

Reason: the optional rolldown/tsdown/napi-rs WASM bindings resolve a 2.0 beta while the napi-rs runtime still pins the 1.x line. Exit when those optional bindings converge on a stable 2.x or the optional binding is dropped.

#### semantic-release and commitlint release chain

`@simple-libs/stream-utils` (1/2), `@sindresorhus/is` (4/7), `cliui` (7/9), `conventional-changelog-angular` (8/9), `conventional-commits-filter` (5/6), `conventional-commits-parser` (6/7), `execa` (8/9/10), `figures` (2/6), `fs-extra` (10/11), `get-stream` (6/8/9), `global-directory` (4/5), `hosted-git-info` (7/9), `human-signals` (5/8), `ini` (1/4/6), `is-plain-obj` (1/4), `is-stream` (3/4), `meow` (13/14), `normalize-package-data` (6/8), `normalize-url` (8/9), `npm` (11/12), `npm-run-path` (5/6), `onetime` (6/7), `parse-json` (4/5/8), `path-key` (3/4), `read-package-up` (11/12), `read-pkg` (9/10), `resolve-from` (4/5), `strip-final-newline` (3/4), `strip-json-comments` (2/5), `yargs` (16/18), `yargs-parser` (20/22).

Reason: semantic-release 26 and its beta plugin line coexist with the stable direct plugins, and commitlint pins its own older major of the shared CLI utilities. Exit when semantic-release 26 leaves beta and the direct `@semantic-release/*` plugins resolve the same majors as its transitive graph.

#### ESLint and TypeScript toolchain

`balanced-match` (1/4), `brace-expansion` (1/2/5), `cjs-module-lexer` (1/2), `eslint-scope` (5/9), `eslint-visitor-keys` (3/4/5), `espree` (10/11), `estraverse` (4/5), `find-up` (2/5), `get-tsconfig` (4/5.0.0-beta.6), `hookified` (1/2), `ignore` (5/7), `js-yaml` (4/5), `locate-path` (2/6), `minimatch` (3/9/10/11), `p-limit` (1/3), `p-locate` (2/5), `parse5` (5/6/8), `path-exists` (3/4), `picomatch` (2/4), `typescript` (5.6.1-rc/6.0.3).

Reason: ESLint 10, typescript-eslint 8, `eslint-plugin-unicorn`, the Nest CLI lint chain and the schemas package tooling (`@arethetypeswrong/core` pins a TypeScript 5.6 RC) each pin a different parser/tooling major. `js-yaml` 5 is the production `@nestjs/swagger` copy and the development `cosmiconfig@10` copy; `js-yaml` 4 is the development `cosmiconfig 8/9` copy. Exit when ESLint, typescript-eslint, `@nestjs/cli`, `@arethetypeswrong/core` and `cosmiconfig` align.

#### CLI formatting utilities

`ansi-regex` (5/6), `ansi-styles` (3/4/5/6), `argparse` (2/3), `chalk` (2/4/5), `color-convert` (1/2), `commander` (2/6/8/9/14/15), `emoji-regex` (8/10), `escape-string-regexp` (1/2/4/5), `has-flag` (3/4), `isexe` (2/4), `string-width` (4/7/8), `strip-ansi` (6/7), `supports-color` (5/7/8/11), `type-fest` (1/2/4/5/6), `wrap-ansi` (7/9).

Reason: a shared layer of formatting and CLI utilities pinned independently by Cucumber, Nest CLI, Stryker, ESLint, semantic-release and commitlint. No single upstream owns them; they are API-incompatible across majors and development-only. Exit when the owning CLIs converge on one major; there is no repository-side override.

#### Runtime adapters

`content-disposition` (1/3), `lru-cache` (10/11), `mime` (3/4), `undici` (6/7).

Reason: Fastify, NestJS, semantic-release and the archive downloader pin different majors of the same adapter. `content-disposition` and `mime` have one production major and one development major; `lru-cache` and `undici` are development-only. Exit when the owning packages align; do not force a major that the production closure does not need.

#### Test toolchain

`es-module-lexer` (2/3), `estree-walker` (2/3), `obug` (2/3), `react-is` (18/19).

Reason: Vitest, Vite, Stryker, webpack and Babel each pin a different parser/instrumentation major. Exit when Vitest/Stryker/tsdown and the Babel instrumentation line converge.

#### Pino logging

`sonic-boom` (4/5), `split2` (1/4).

Reason: `pino` and `pino-pretty` pin different majors of their transport helpers. Exit when `pino-pretty` declares the same majors as `pino`.

## Re-check procedure

Before a dependency-review PR:

1. Run `pnpm audit --prod --audit-level=low` and `pnpm audit --audit-level=high`; both must exit 0.
2. Run `pnpm dedupe --check`; it must exit 0.
3. For an override whose parent lower bound has reached its exit threshold, remove the override, run `pnpm install`, then `pnpm audit`; if the audit stays clean, commit the removal and delete its row above.
4. For a new duplicate major, add it to the matching group or create a group with a reason and exit condition. Do not add a dedupe override unless the parent ranges are semver-compatible.

Related guides: [ci-cd.md](ci-cd.md) for the audit jobs and versioning rules, [security.md](security.md) for the disclosure posture and the production dependency policy, [operations.md](operations.md) for release verification.
