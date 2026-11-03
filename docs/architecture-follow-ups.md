# Architecture Follow-ups and Known Limitations

This is the living register of residual risks and follow-ups after issue #1264. Each item names an owner or a removal condition. Remove an item when it is resolved; do not leave an untracked exception in `architecture.md`.

## Open follow-ups

### 1. `GlobalExceptionFilter` decoupling (#1265)

The shared filter still imports context domain errors and maps them to HTTP exceptions. Zone 9 (`shared/infrastructure` must not import `contexts/**`) remains deferred until #1265 lands.

**Removal condition:** #1265 moves the mapping to the owning contexts or a published error contract, then zone 9 is enabled and the §13 exception is removed.

### 2. Cross-context `$lookup`

Question persistence joins the question-theme collection, and the theme stats pipeline joins the question collection. Both now use published persistence contracts, but the database coupling remains.

**Follow-up:** denormalize the theme snapshot into questions or introduce a provider-owned read model. Contract tests guard field drift until then.

### 3. Cross-context consistency is best-effort

Theme archive vs live questions and question creation/assignment vs archived themes are check-then-write operations. They are not atomic across contexts.

**Follow-up:** if strict consistency becomes a product requirement, use a MongoDB transaction or a conditional update and add a concurrency test. Do not claim atomicity in the API contract before that change.

### 4. question / question-theme partnership

The two contexts publish use cases and contracts to each other. This is deliberate for a co-deployed, two-context monolith.

**Merge trigger:** a third context needs the same data, the published surface grows beyond a handful of use cases/contracts, the contexts need separate deployments, or independent teams start evolving them. At that point, merge the contexts or introduce full public ports/adapters.

### 5. Theme DTO faketory mixes boundaries

`tests/shared/utils/faketories/contexts/question-theme/dto/question-theme.dto.faketory.ts` creates both published contract DTOs and internal creation/modification DTOs.

**Follow-up:** split it into `contracts/dto/` and `dto/` faketories if it grows or if the boundary becomes confusing. It is test-only and does not affect production imports today.

### 6. `@goat-it/schemas` built-dist testing

The package facade is typechecked and built in CI, but consumers are not yet tested against the built `dist/`. Peer dependency documentation is also minimal.

**Follow-up:** add a built-dist smoke test and document the `@faker-js/faker` peer dependency for `./testing/*`.

### 7. Shared API exception wrappers are unused

The two NestJS wrappers under `shared/infrastructure/http/dto/api-response-exception/` are not bound to a controller; the filter builds the response directly.

**Follow-up:** keep them if they document the future Swagger error contract; delete them if the project decides the filter is the only error-response surface.

### 8. No concurrency tests for cross-context races

There are no tests that run theme archive and question creation/assignment concurrently. The current invariants are best-effort (see item 3).

**Follow-up:** add concurrency tests with the transaction/conditional-update change, not before.

### 9. Mutation incremental cache after moves

Moves and renames leave stale keys in `tests/mutation/incremental/incremental.json`. The final #1264 validation uses `pnpm run test:mutation:force`.

**Follow-up:** make the CI mutation job clean incremental state or key it by commit so file moves cannot silently skip mutants.

### 10. Persistence contract tests are type-level plus pipeline-level

The contract tests prove schema/shape assignability and pipeline constants. The real database behavior is covered by acceptance, not by a dedicated contract integration test.

**Follow-up:** if the `$lookup` grows more complex, add an integration test against a real MongoDB collection.

## Resolved during #1264

- Application and domain are framework-free; `useFactory` wiring and plain use-case specs are enforced by lint.
- DTO wrappers live in infrastructure; published shapes live in application or `contracts/`.
- The shared API exception shape is pure and lives in `shared/application/dto`.
- Repository mocks live at the port path (`domain/repositories`).
- Persistence contracts replace bare cross-context collection names and hardcoded field paths.
- Eight unused nested DTO wrappers were deleted.
- The question/theme module graph is acyclic with dedicated persistence and usage modules.

## Non-goals

- No cross-context ports, tokens, adapters or ACL while the models are identical.
- No dependency-cruiser, custom architecture script or separate CI job; enforcement stays in the existing lint run.
- No speculative publishing: add a contract or use case only when a consumer exists.
