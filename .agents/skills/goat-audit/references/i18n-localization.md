# I18N — Internationalization & localization

Internationalization of the Goat It API across its six supported locales (`en`, `fr`, `es`, `de`, `it`, `pt`): the `Accept-Language` handling pipeline (first-locale rule, wildcard and missing-header fallback, 400 on unknown locales, global middleware application), the shared locale value object, per-locale content storage and retrieval (partial locale records, locale-then-fallback resolution, game vs admin localization), translation-completeness rules (mandatory/optional field specs, dynamic vs static evaluation, filters and stats, no write-time enforcement), the applicable-locales policy (all-6 default, creation/modification bounds, public locale filtering) and the `/translate-questions` maintenance workflow. Checks verify the code implements what `docs/i18n.md` documents, and that the documented Known limitations are the only divergences.

**Decision doc:** `docs/i18n.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** HTTP contract/error shape → API · response payload shape → PERF · domain rules on localized content → LOGIC

## Contents

- [1. Accept-Language detection and fallback](#1-accept-language-detection-and-fallback)
- [2. Locale domain](#2-locale-domain)
- [3. Per-locale content storage and retrieval](#3-per-locale-content-storage-and-retrieval)
- [4. Translation completeness](#4-translation-completeness)
- [5. Applicable-locales policy](#5-applicable-locales-policy)
- [6. Translation maintenance](#6-translation-maintenance)
- [Sources](#sources)

## 1. Accept-Language detection and fallback

- **[I18N-01] Middleware applied to every route** — The localization middleware is applied to all routes (`forRoutes("*")`) and the localization parameter decorator throws a 500 when it reads a request the middleware never ran on, so no localized endpoint can silently serve unlocalized content.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/app/app.module.ts`, `src/shared/infrastructure/http/middlewares/localization/**`, `src/shared/infrastructure/http/decorators/localization/**` · Src: [5], [6], project: docs/i18n.md
- **[I18N-02] Only the first locale is considered** — The `Accept-Language` header is trimmed, the first 2 characters are lowercased, and everything else (region subtags, q-values, further locales) is ignored by design.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/infrastructure/http/middlewares/localization/**` · Src: [1], [2], [3], project: docs/i18n.md
- **[I18N-03] Wildcard and missing header resolve to the fallback** — A `*` value and a missing header both resolve to the configured fallback locale; a missing header sets both `locale` and `fallbackLocale` to it, and `*` uses the fallback as the request locale.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/infrastructure/http/middlewares/localization/**` · Src: [2], project: docs/i18n.md
- **[I18N-04] Unknown locale is a 400, never a silent fallback** — An unrecognized locale value throws `400 Bad Request` listing the supported locales; it never falls back silently.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/infrastructure/http/middlewares/localization/**` · Src: [2], project: docs/i18n.md
- **[I18N-05] Resolved options ride the request** — The resolved `{ locale, fallbackLocale }` is attached per request and consumed through the localization decorator; the game-facing question (list, random, by-id) and theme (list, by-id) endpoints use it.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/infrastructure/http/types/fastify/**`, `src/contexts/question/infrastructure/http/controllers/**`, `src/contexts/question-theme/infrastructure/http/controllers/**` · Src: [5], [6], project: docs/i18n.md
- **[I18N-06] Fallback locale configured and validated** — `FALLBACK_LOCALE` is validated with `z.enum(LOCALES)`, defaults to `DEFAULT_ENV_FALLBACK_LOCALE = "en"`, and both tracked env files set `FALLBACK_LOCALE=en`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/config/schemas/**`, `src/infrastructure/api/config/constants/**`, `env/**` · Src: [7], project: docs/i18n.md
- **[I18N-07] Parsing table holds end to end** — Game endpoints behave per the documented parsing table: `fr-FR, fr;q=0.9` serves `fr` content, `En` serves `en`, `de-DE` serves `de`, `*` and a missing header serve the configured fallback locale, and `xyz` returns 400 listing the supported locales.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [2], [3], project: docs/i18n.md

## 2. Locale domain

- **[I18N-08] The locale set has one source** — The supported locale list is declared once, the `Locale` type derives from it, and every other locale definition references that constant; the current set is recorded in `docs/i18n.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/domain/value-objects/locale/**` · Src: [4], project: docs/i18n.md
- **[I18N-09] One locale membership rule** — The `isValidLocale` guard performs the same membership check against `LOCALES` as the middleware; no second locale list or divergent check exists anywhere.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/domain/value-objects/locale/**` · Src: [4], project: docs/i18n.md
- **[I18N-10] Locale labels and examples complete** — `LOCALE_LABELS` maps every locale to its label and `LOCALE_EXAMPLES` provides a sample string per locale for the Swagger documentation.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/shared/domain/value-objects/locale/**`, `src/shared/application/dto/zod/validators/localization/**` · Src: [4], project: docs/i18n.md

## 3. Per-locale content storage and retrieval

- **[I18N-11] Localized values are partial per-locale records** — Localized values persist as partial per-locale objects: one optional field per locale in the documented set, `undefined` (absent) when untranslated, in both text and text-array schemas.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/infrastructure/persistence/mongoose/schemas/localization/**`, `src/shared/domain/value-objects/locale/**` · Src: [4], project: docs/i18n.md
- **[I18N-12] Question content localization is complete** — Every question content field the domain marks localized is a localized subdocument with the documented required/optional status; the current fields are recorded in `docs/i18n.md` and `docs/data-model.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/persistence/mongoose/schemas/question-content/**` · Src: [4], project: docs/i18n.md
- **[I18N-13] Theme content localization is complete** — Every theme content field the domain marks localized is a mandatory localized subdocument; the current fields are recorded in `docs/i18n.md` and `docs/data-model.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question-theme/infrastructure/persistence/mongoose/schemas/**` · Src: [4], project: docs/i18n.md
- **[I18N-14] Locale then fallback resolution** — `pickLocalizedValue` returns `localizedValue[locale] ?? localizedValue[fallbackLocale]`, and the warning string `⚠️ No Translation found for desired locale (…) and fallback locale (…)` is emitted only when both are missing.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/shared/application/mappers/localization/**` · Src: [4], project: docs/i18n.md
- **[I18N-15] Game vs admin localization** — Game responses resolve text to the request locale through the localization helpers, while admin responses return the full partial per-locale objects and `applicableLocales` as stored so content can be edited.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/mappers/**`, `src/contexts/question-theme/contracts/dto/**` · Src: [4], project: docs/i18n.md

## 4. Translation completeness

- **[I18N-16] One definition of fully translated** — Fully translated means every mandatory localized field has a value in every applicable locale and every optional field is either absent or has a value in every applicable locale; the definition lives in the `zIsFullyTranslated` OpenAPI description and matches what the filters implement.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/shared/application/dto/zod/validators/translation-completeness/**`, `src/shared/infrastructure/persistence/mongoose/helpers/**` · Src: [7], project: docs/i18n.md
- **[I18N-17] Field specs live in persistence constants** — Every completeness spec is declared in the persistence constants the pipelines consume, and each entity's spec matches the documented mandatory/optional fields; the current specs are recorded in `docs/i18n.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/persistence/mongoose/constants/**`, `src/contexts/question-theme/infrastructure/persistence/mongoose/constants/**` · Src: [4], project: docs/i18n.md
- **[I18N-18] Dynamic vs static evaluation** — The dynamic mode evaluates against the document's own applicable set (the full locale set when absent or empty); the static mode evaluates against the full locale set; the current modes are recorded in `docs/i18n.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/infrastructure/persistence/mongoose/helpers/**`, `src/contexts/question/infrastructure/persistence/mongoose/repository/helpers/**`, `src/contexts/question-theme/infrastructure/persistence/mongoose/repository/helpers/**` · Src: [4], project: docs/i18n.md
- **[I18N-19] is-fully-translated filter semantics** — The admin list endpoints accept `is-fully-translated` (`FULLY_TRANSLATED_QUERY_KEY`): `true` returns only complete resources and `false` only incomplete ones.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/application/dto/constants/**`, `src/contexts/question/infrastructure/persistence/mongoose/repository/helpers/**`, `src/contexts/question-theme/infrastructure/persistence/mongoose/repository/helpers/**` · Src: [7], project: docs/i18n.md
- **[I18N-20] Completeness stats** — Question and theme stats report `byTranslationCompleteness { fullyTranslated, incomplete }`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/pipelines/**`, `src/contexts/question-theme/infrastructure/persistence/mongoose/repository/pipelines/**`, `src/shared/application/dto/zod/validators/translation-completeness/**` · Src: [7], project: docs/i18n.md
- **[I18N-21] Random questions require requested-locale translation** — The public random endpoint additionally requires whatever fields exist to be translated in the requested locale through the single-locale condition, so untranslated text is never served to the game.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/**` · Src: [4], project: docs/i18n.md
- **[I18N-22] No write-time completeness enforcement** — Completeness conditions are database-level expressions only; untranslated content stays storable by design and the filter surfaces it, and adding write-time enforcement requires a decision recorded in `docs/i18n.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/infrastructure/persistence/mongoose/helpers/**`, `src/contexts/question/application/dto/**` · Src: [4], project: docs/i18n.md

## 5. Applicable-locales policy

- **[I18N-23] Absent or empty means all locales** — The applied set absent or empty applies the full locale set, baked identically into the completeness expression and the public locale filter; the two implementations can never diverge.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/helpers/**`, `src/shared/infrastructure/persistence/mongoose/helpers/**` · Src: [4], project: docs/i18n.md
- **[I18N-24] Creation and modification bounds** — Creation accepts the locale restriction as optional with the documented minimum and maximum and unique values; modification accepts an empty array to clear the restriction. The current bounds are recorded in `docs/i18n.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/dto/zod/validators/**`, `src/contexts/question/application/dto/question-modification/**` · Src: [7], project: docs/i18n.md
- **[I18N-25] Public endpoints filter by requested locale** — The public list and random endpoints match a question only when `applicableLocales` is absent, empty, or contains the requested locale, so French-only questions never surface to other locales.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/helpers/**`, `src/contexts/question/application/mappers/**` · Src: [4], project: docs/i18n.md
- **[I18N-26] Locale restriction is entity-specific** — Only the entities the domain documents as restrictable carry a per-locale restriction; every other entity is localized in all locales. The current scope is recorded in `docs/i18n.md`.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/contexts/question/domain/types/**`, `src/contexts/question-theme/infrastructure/persistence/mongoose/schemas/**` · Src: [4], project: docs/i18n.md

## 6. Translation maintenance

- **[I18N-27] Command fetches incomplete questions** — The `/translate-questions` command fetches not-fully-translated questions with `GET /admin/questions?is-fully-translated=false&limit=100&sort-by=createdAt&sort-order=asc`, which already accounts for `applicableLocales`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.opencode/commands/translate-questions.md` · Src: [4], project: docs/i18n.md, project: .opencode/commands/translate-questions.md
- **[I18N-28] The source locale is never patched** — The translation command never includes the source locale in PATCH payloads; the target set and required fields are the documented ones, and optional fields are filled only when the source value is non-null. The current policy is recorded in `docs/i18n.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.opencode/commands/translate-questions.md` · Src: [4], project: docs/i18n.md, project: .opencode/commands/translate-questions.md
- **[I18N-29] All-or-nothing translation** — Translation is all-or-nothing: every target locale is filled in one pass, or the resource is restricted to the source locale; there is no per-locale exclusion. The current target set is recorded in `docs/i18n.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.opencode/commands/translate-questions.md` · Src: [4], project: docs/i18n.md, project: .opencode/commands/translate-questions.md
- **[I18N-30] Every PATCH is verified** — Each PATCH is verified by re-fetching the resource and diffing the source values against the pre-PATCH snapshot, and the command ends with a summary and a lessons-learned retrospective without modifying itself unless explicitly approved.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.opencode/commands/translate-questions.md` · Src: [4], project: docs/i18n.md, project: .opencode/commands/translate-questions.md

## Sources

[1] Internationalization Quick Tips for the Web (W3C): https://www.w3.org/International/quicktips/ (fetched 2026-11-04)
[2] Accept-Language used for locale setting (W3C i18n Q&A): https://www.w3.org/International/questions/qa-accept-lang-locales (fetched 2026-11-04)
[3] Accept-Language (MDN): https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language (fetched 2026-11-04)
[4] Localization best practices for developers (Mozilla l10n): https://mozilla-l10n.github.io/documentation/localization/dev_best_practices.html (fetched 2026-11-04)
[5] NestJS — Middleware: https://docs.nestjs.com/middleware (fetched 2026-11-04)
[6] NestJS — Custom route decorators: https://docs.nestjs.com/custom-decorators (fetched 2026-11-04)
[7] Zod — API reference: https://zod.dev/api (fetched 2026-11-04)
