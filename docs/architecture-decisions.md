# Architecture Decision Log

This log records the durable architecture decisions behind [`architecture.md`](architecture.md). The guide owns the rules; this log owns the rationale, the rejected alternatives and the migration phase.

- **Issue:** #1264 — decide and enforce the final clean hexagonal architecture
- **Design spec:** [2026-11-02-clean-hexagonal-architecture-design.md](superpowers/specs/2026-11-02-clean-hexagonal-architecture-design.md)
- **Status legend:** Accepted (design), Implemented, Deferred, Superseded.

## Summary

| # | Decision | Choice | Phase | Status |
|---|---|---|---|---|
| D1 | Application framework independence | Strict plain TypeScript | 3 | Implemented (Phase 3) |
| D2 | Domain purity | I/O and randomness move to infrastructure | 2 | Implemented (Phase 2) |
| D3 | Shared semantics | Layered shared kernel | 0 | Implemented (Phases 1–3) |
| D4 | Composition root | `main.ts` owns `AppModule` | 2 | Implemented (Phase 2) |
| D5 | Error mapping | Conditional mapping; write failures 500 | 0 | Implemented (existing behavior, locked by tests) |
| D6 | DTO ownership | Shapes application/contracts, wrappers infrastructure | 3 | Implemented (Phase 3) |
| D7 | Validator homes | `shared/application/dto/zod` | 1 | Implemented (Phase 1) |
| D8 | Value-object modeling | Hybrid with promotion criteria | 0 | Implemented (existing behavior) |
| D9 | Commands and contracts | Commands application, contracts domain | 1 | Implemented (Phase 1) |
| D10 | Cross-context collaboration | B-lite published API + contracts | 4 | Implemented (Phase 4) |
| D11 | Module wiring | Persistence modules (both contexts) + usage module | 1 | Implemented (Phase 1) |
| D12 | Naming consistency | All four naming rules | 1 | Implemented (Phase 1) |
| D13 | Testing architecture | Port-level mocks | 3 | Implemented (Phase 3) |
| D14 | Package boundary | Keep facade, document public API | 0 | Implemented (Phase 5) |
| D15 | Enforcement | Aliases + lint zones and package bans | 0–5 | Implemented (Phases 0–5) |

## D1 — Application framework independence

**Decision:** The application layer is framework-free. Use cases are plain classes. DTO wrappers move to infrastructure. Modules wire use cases with `useFactory`. Unit tests instantiate them with `new`.

**Rationale:** The application layer orchestrates domain ports; it should not depend on a delivery framework. The docs-fetcher verification confirmed that `useFactory` custom providers are documented and supported, that the factory path does not read `@Injectable()` metadata, and that `overrideProvider` works for factory tokens.

**Rejected:** Accepting NestJS in application (keeps HTTP and DI coupling); hybrid wrappers-only (leaves a permanent framework exception in the guide).

**Revisit trigger:** A request-scoped or lifecycle-hook use case. Test factory-provider scope behavior before adopting it.

## D2 — Domain purity

**Decision:** `package-json` moves to `shared/infrastructure`; `shuffleArray` moves to the question persistence helpers.

**Rationale:** Domain code must be pure and deterministic. `package-json` cannot live in `src/app` because `src/infrastructure` consumes it. `shuffleArray` has one consumer, so an owner-private persistence helper avoids ceremony.

**Rejected:** Keeping I/O in domain with a documented exception; moving `package-json` to `src/app` (breaks the infrastructure→app rule).

**Revisit trigger:** A second context needs shuffling; promote the pure algorithm with an injected random source.

## D3 — Shared semantics

**Decision:** A layered shared kernel: `shared/domain` ← `shared/application` ← `shared/infrastructure`, plus type-only `shared/types`.

**Rationale:** It mirrors the context layers, keeps `shared/infrastructure` legitimate and makes the dependency direction enforceable. The two-context promotion rule prevents shared from becoming a `misc` bucket.

**Rejected:** Utility library (any layer imports anything; weakens domain purity).

## D4 — Composition root

**Decision:** `src/main.ts` imports `AppModule` and calls `bootstrap(AppModule)`. `server.ts` receives the application module as a parameter.

**Rationale:** The composition root is the only place allowed to know every module. The server adapter must not depend on the application shell.

**Rejected:** Moving server bootstrap into `app/`; keeping the documented bootstrap exception.

## D5 — Error mapping policy

**Decision:** Map a domain error to a specific HTTP status only when the client can act on it. Unexpected, invariant-violation and persistence-write failures fall through to 500. The four write/read-back errors are intentionally 500.

**Rationale:** The four errors mean the repository write or read-back failed. The use cases already pre-check client-actionable conditions with mapped 4xx errors. Mapping these four to 4xx would turn server-side failures into client errors.

**Rejected:** Mandatory mapping for every domain error; 409 for the four without concurrency detection.

## D6 — DTO ownership

**Decision:** Pure Zod shapes live in `application/dto` or `contracts/dto`; NestJS wrappers live in `infrastructure/http/dto`. The shared API exception shape moves to `shared/application/dto`; its wrapper stays in `shared/infrastructure/http/dto`. App metadata and health keep shape+wrapper together in their own areas.

**Rationale:** Application mappers return response shapes. If shapes lived in infrastructure, application would import infrastructure. Wrappers are HTTP delivery code and import `nestjs-zod`. Moving the shared API exception shape keeps `@goat-it/schemas` pure.

**Rejected:** Keeping the four families as-is; transitional colocated shapes+wrappers (keeps `nestjs-zod` in application).

## D7 — Shared validator homes

**Decision:** Consolidate pure Zod preprocessors, refinements and validators under `shared/application/dto/zod`.

**Rationale:** They are application-boundary contracts, not HTTP runtime. Consolidation removes the only legitimate reason for application to import `shared/infrastructure`.

**Rejected:** `shared/domain/validation` (domain would depend on Zod); keeping the two trees.

## D8 — Value-object modeling

**Decision:** Simple unions stay in `domain/types/*.value-objects.ts`. Dedicated `domain/value-objects/<vo>/` folders are reserved for behavior-bearing concepts. Entities remain type aliases with `ensure*` policies.

**Rationale:** A union is a type, not a value object. A behavior-bearing concept deserves a folder; a union does not. The functional domain model stays consistent.

**Rejected:** Dedicated folders everywhere; type files everywhere; class entities with constructors.

## D9 — Entities, commands and contracts

**Decision:** Commands move to `application/commands`; contracts stay in `domain/types`; entities stay in `domain/types`.

**Rationale:** Commands are use-case messages, not domain rules. Contracts are repository-port inputs, so they are domain concepts. Entities remain type aliases with `ensure*` policies.

**Rejected:** Keeping commands in domain; class entities with constructors.

## D10 — Cross-context collaboration

**Decision:** B-lite — published application use cases plus a `contracts/` folder. No ports, tokens, adapters, full public modules or ACL while the models are identical.

**Published surface (per consumer layer):**

- `question/domain` uses published theme domain types/constants/rules/errors (read-only).
- `question/application` uses the two theme lookup use cases, published theme domain, and `question-theme/contracts/**`.
- `question/infrastructure` uses theme `contracts/**` and published domain types, not theme use cases.
- `question-theme/application` uses `CountLiveQuestionsByThemeIdUseCase`; `question-theme/infrastructure` uses `question/contracts/persistence/**`.
- Theme DTO shapes/mappers/validators move to `question-theme/contracts/dto/`; both persistence contracts are published under `contracts/persistence/`.
- `QuestionThemePersistenceShape`, `QUESTION_STATUS_ACTIVE` and `QUESTION_THEME_USAGE_PERSISTENCE_FIELDS` guard the `$lookup` and stats joins.
- `ReferencedQuestionThemeArchivedError` moves to `question/domain/errors/`; `QuestionThemeNotFoundError` remains published by `question-theme/domain/errors/`.
- Cross-context calls are read-only; write invariants are writer-owned; check-then-write is not atomic. Strict consistency requires a transaction or conditional update. The current invariants are best-effort and must be tested for the race where it matters.

**Rationale:** The real problems are internal-layer leakage and the module cycle, not the application-to-application dependency. Ports/adapters/public modules would add ceremony without a driver (separate deployment, replaceable provider, multiple teams). The published use cases and contracts make the boundary explicit and enforceable.

**Rejected:** Status quo direct imports; full public ports/adapters/ACL; merging the contexts.

**Revisit trigger:** A third context needs question/theme data, or the published surface keeps growing. Upgrade to full ports/adapters or merge the contexts.

## D11 — Module exports and cross-context wiring

**Decision:** Extract `QuestionPersistenceModule`, `QuestionThemePersistenceModule` and `QuestionUsageModule`. The theme module stops re-registering question persistence.

**Rationale:** No `forwardRef`, no duplicate provider instance, one owner per persistence concern, symmetric wiring, acyclic module graph.

**Rejected:** Exporting the token from `QuestionModule` and importing it in `QuestionThemeModule` (cycle/`forwardRef`); keeping re-registration (duplicate providers).

## D12 — Naming consistency

**Decision:** Plural `schemas/`; feature-name pipeline groups without a `-pipeline` suffix; context Zod under `application/dto/zod`; published contract Zod under `contracts/dto/zod`; mapper subfolders; published mappers in `contracts/dto`.

**Rationale:** One predictable scheme removes exceptions and simplifies lint zones.

**Rejected:** Minimal fixes; generic pipeline groups (`stats/`, `assignment/`) that lose the feature name.

## D13 — Testing architecture

**Decision:** Use-case and controller tests mock the boundary the SUT depends on. Repository mocks live under `domain/repositories`; adapter mocks stay under infrastructure. Acceptance tests may import Mongoose schemas for fixtures only.

**Rationale:** Test doubles should name the boundary, not the adapter. The current path says "Mongoose repository" even in use-case tests.

**Rejected:** Keeping adapter-mirrored mock paths; hybrid documented.

## D14 — Package boundary

**Decision:** Keep the `packages/schemas` facade and document it as a published language artifact.

**Rationale:** Only pure, framework-free modules may be exported (DTO shapes, constants, value objects, pure helpers, faketories). The facade avoids duplication and keeps a single source of truth. `./testing/*` and the faker peer dependency are intentional.

**Rejected:** Standalone package sources (duplication/drift); undocumented facade.

## D15 — Aliases and boundary enforcement

**Decision:** Keep `@src/*`; enforce path zones with `import-x/no-restricted-paths`, package bans with scoped `no-restricted-imports`, and relative imports with Oxlint's `typescript/no-restricted-imports`. Split cross-context allowlists per consumer layer.

**Rationale:** Architecture must be executable. Zones are path-based, so aliases are irrelevant to enforcement. Add only zones that pass; ratchet the rest per phase. When `from` is a glob, `except` entries must be glob patterns. The Phase 0 plan validates the zone table with the actual lint run. No new tool or CI job.

**Phase 0 finding:** ESLint core `no-restricted-imports` must be re-enabled in a scoped block composed **after** `oxlint.buildFromOxlintConfigFile(...)`; the bridge emits `"no-restricted-imports": "off"` for `**/*.ts` and a block placed before it is a silent no-op. Ban subpaths (`mongoose/*`, `fastify/*`, `nestjs-zod/*`) and exclude specs/declarations. Prove each new zone with a temporary forbidden import plus a temporary allowed import.

**Final state (Phase 5):** zones 1–12c are active, including the per-subtree cross-context zones 11b/11c/12b and the contracts package ban. Only zone 9 remains deferred behind #1265. The module-token imports required by `useFactory` are explicitly allowed in zones 11d/12c. The residual risks and follow-ups are in [architecture-follow-ups.md](architecture-follow-ups.md).

**Rejected:** Adding `@infrastructure/*` and deprecating `@src/*` (61-file churn, no enforcement by itself); aliases only.

## Final status

All D1–D15 decisions are implemented. The only deferred enforcement item is zone 9, owned by #1265. The architecture is a two-context B-lite modular monolith: published use cases and contracts, no cross-context ports/adapters, acyclic module graph, pure application/domain layers, and lint-enforced boundaries. See [architecture-follow-ups.md](architecture-follow-ups.md) for accepted limitations and the merge/denormalization triggers.

## Adding a decision

1. Write the decision in the design spec with options, recommendation and rationale.
2. Add the summary row and a detailed entry here.
3. Update `architecture.md` if the rule changes.
4. Add or update the enforcement zone in the same phase that makes it pass.
5. Never leave a temporary exception without an owner issue and a removal condition.
