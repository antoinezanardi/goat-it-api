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
- Peer dependency: `zod` (match workspace version)

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
- Ensure the caller project has `zod` installed as a peer dependency, matching the version used in this package.

## ©️ License

MIT — See [LICENSE](LICENSE) for details.
