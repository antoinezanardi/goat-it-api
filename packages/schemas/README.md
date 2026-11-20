# ♑ @goat-it/schemas

Shared TypeScript types, Zod schemas and constants used across the Goat It projects.

This package is a small, framework‑agnostic collection of DTO shapes, value‑object constants and Zod validators. It is published as an ES module with bundled type definitions.

## 🌟 Quick facts

- Package: `@goat-it/schemas`
- Built output: `dist/`
- Entry points exported:
  - `./question`
  - `./question-theme`
  - `./shared/locale`
  - `./shared/error`
  - `./shared/constants`
  - `./testing/question`
  - `./testing/question-theme`
  - `./testing/shared`
- Peer dependencies: `zod` and `@faker-js/faker` (match workspace versions; faker is required by `./testing/*`)

## 🔧 Usage

Import the package (example):

```ts
// Importing types
import type { QuestionDto } from "@goat-it/schemas/question";

// Importing Zod schemas
import { QUESTION_THEME_CREATION_DTO } from "@goat-it/schemas/question-theme";

// Importing locale constants
import { LOCALES } from "@goat-it/schemas/shared/locale";

// Importing error DTOs and types
import { API_RESPONSE_EXCEPTION_DTO } from "@goat-it/schemas/shared/error";
import type { ApiResponseExceptionDto } from "@goat-it/schemas/shared/error";

// Importing shared constants
import { LOCALIZED_TEXT_ENTRY_MAX_LENGTH, SLUG_MIN_LENGTH } from "@goat-it/schemas/shared/constants";

// Importing question-specific constants
import { QUESTION_AUTHOR_NAME_MIN_LENGTH, QUESTION_STATUS_PENDING } from "@goat-it/schemas/question";
```

## 📝 Notes

- The package ships compiled ES modules under `dist/` and `.d.mts` type definitions.
- The package uses `tsdown` to generate the `dist/` layout — the `build` script runs `tsdown`.
- Ensure the caller project has `zod` and `@faker-js/faker` installed as peer dependencies, matching the versions used in this package. `@faker-js/faker` is only needed when importing a `./testing/*` entrypoint.

## ©️ License

MIT — See [LICENSE](LICENSE) for details.
