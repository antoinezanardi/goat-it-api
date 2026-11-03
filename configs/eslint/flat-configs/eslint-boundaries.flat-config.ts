import type { Linter } from "eslint";

const DOMAIN_FRAMEWORK_BAN_MESSAGE = "Architecture boundary: domain is framework-free and must not import NestJS, Mongoose, Fastify or nestjs-zod. See docs/architecture.md §12.2.";

const DOMAIN_NODE_BAN_MESSAGE = "Architecture boundary: domain must not perform Node I/O; use a shared or infrastructure helper instead. See docs/architecture.md §12.2.";

const APPLICATION_FRAMEWORK_BAN_MESSAGE = "Architecture boundary: application is framework-free; no NestJS, Mongoose, Fastify or nestjs-zod. See docs/architecture.md §12.2.";

const CONTRACTS_FRAMEWORK_BAN_MESSAGE = "Architecture boundary: a published contract must stay pure; no NestJS, Mongoose, Fastify or nestjs-zod. See docs/architecture.md §12.2.";

const ESLINT_BOUNDARIES_FLAT_CONFIG: Linter.Config = {
  name: "boundaries",
  rules: {
    "import-x/no-restricted-paths": [
      "error",
      {
        zones: [
          {
            target: "src/contexts/*/domain/**/!(*.spec).ts",
            from: [
              "src/contexts/*/application/**",
              "src/contexts/*/infrastructure/**",
            ],
            message: "Architecture boundary: a context domain must not import application or infrastructure.",
          },
          {
            target: "src/contexts/*/application/**/!(*.spec).ts",
            from: ["src/contexts/*/infrastructure/**"],
            message: "Architecture boundary: an application layer must not import infrastructure.",
          },
          {
            target: "src/contexts/**/!(*.spec).ts",
            from: ["src/app/**"],
            message: "Architecture boundary: a bounded context must not import the application shell.",
          },
          {
            target: "src/shared/domain/**/!(*.spec).ts",
            from: [
              "src/shared/application/**",
              "src/shared/infrastructure/**",
            ],
            message: "Architecture boundary: the shared domain must not import shared application or infrastructure.",
          },
          {
            target: "src/shared/application/**/!(*.spec).ts",
            from: ["src/shared/infrastructure/**"],
            message: "Architecture boundary: the shared application layer must not import shared infrastructure.",
          },
          {
            target: [
              "src/shared/domain/**/!(*.spec).ts",
              "src/shared/application/**/!(*.spec).ts",
            ],
            from: [
              "src/contexts/**",
              "src/app/**",
            ],
            message: "Architecture boundary: the shared kernel must not import a bounded context or the application shell.",
          },
          {
            target: "src/**/!(*.spec).ts",
            from: ["tests/**"],
            message: "Architecture boundary: production source must not import test code.",
          },
          {
            target: "src/infrastructure/**/!(*.spec).ts",
            from: [
              "src/contexts/**",
              "src/app/**",
            ],
            message: "Architecture boundary: cross-cutting infrastructure must not import a bounded context or the application shell.",
          },
          {
            target: "src/contexts/*/domain/**/!(*.spec).ts",
            from: [
              "src/shared/application/**",
              "src/shared/infrastructure/**",
              "src/contexts/*/contracts/**",
            ],
            message: "Architecture boundary: a context domain may only import the shared domain and its own domain.",
          },
          {
            target: "src/contexts/*/application/**/!(*.spec).ts",
            from: ["src/shared/infrastructure/**"],
            message: "Architecture boundary: a context application layer must not import shared infrastructure.",
          },
          {
            target: "src/contexts/*/contracts/**/!(*.spec).ts",
            from: [
              "src/contexts/*/application/**",
              "src/contexts/*/infrastructure/**",
              "src/shared/infrastructure/**",
            ],
            message: "Architecture boundary: a published contract must not import application or infrastructure code.",
          },
          {
            target: "src/contexts/question/domain/**/!(*.spec).ts",
            from: ["src/contexts/question-theme"],
            except: [
              "domain/types/question-theme.entities.ts",
              "domain/types/question-theme.value-objects.ts",
              "domain/constants/question-theme.constants.ts",
              "domain/rules/question-theme.rules.ts",
              "domain/errors/question-theme-not-found",
            ],
            message: "Architecture boundary: the question domain may only import the published question-theme domain surface.",
          },
          {
            target: "src/contexts/question/application/**/!(*.spec).ts",
            from: "src/contexts/question-theme/application",
            except: [
              "use-cases/find-question-theme-by-id",
              "use-cases/get-question-themes-by-ids-or-throw",
            ],
            message: "Architecture boundary: the question application may only import the published question-theme use cases.",
          },
          {
            target: "src/contexts/question/application/**/!(*.spec).ts",
            from: "src/contexts/question-theme/infrastructure",
            message: "Architecture boundary: the question application must not import question-theme infrastructure.",
          },
          {
            target: "src/contexts/question/application/**/!(*.spec).ts",
            from: "src/contexts/question-theme/domain",
            except: [
              "types/question-theme.entities.ts",
              "types/question-theme.value-objects.ts",
              "constants/question-theme.constants.ts",
              "rules/question-theme.rules.ts",
              "errors/question-theme-not-found",
            ],
            message: "Architecture boundary: the question application may only import the published question-theme domain surface.",
          },
          {
            target: "src/contexts/question/infrastructure/**/!(*.spec).ts",
            from: "src/contexts/question-theme/application",
            message: "Architecture boundary: the question infrastructure must not import question-theme application code.",
          },
          {
            target: "src/contexts/question/infrastructure/**/!(*.spec).ts",
            from: "src/contexts/question-theme/infrastructure",
            message: "Architecture boundary: the question infrastructure must not import question-theme infrastructure.",
          },
          {
            target: "src/contexts/question/infrastructure/**/!(*.spec).ts",
            from: "src/contexts/question-theme/domain",
            except: [
              "types/question-theme.entities.ts",
              "types/question-theme.value-objects.ts",
              "constants/question-theme.constants.ts",
              "rules/question-theme.rules.ts",
              "errors/question-theme-not-found",
            ],
            message: "Architecture boundary: the question infrastructure may only import the published question-theme domain surface.",
          },
          {
            target: "src/contexts/question/question.module.ts",
            from: ["src/contexts/question-theme"],
            except: [
              "question-theme.module.ts",
              "application/use-cases/find-question-theme-by-id",
              "application/use-cases/get-question-themes-by-ids-or-throw",
            ],
            message: "Architecture boundary: the question module may only import question-theme.module.ts and the published question-theme use cases.",
          },
          {
            target: "src/contexts/question-theme/application/**/!(*.spec).ts",
            from: ["src/contexts/question"],
            except: ["application/use-cases/count-live-questions-by-theme-id"],
            message: "Architecture boundary: the question-theme application may only import the count-live-questions-by-theme-id use case from the question context.",
          },
          {
            target: "src/contexts/question-theme/infrastructure/**/!(*.spec).ts",
            from: "src/contexts/question/application",
            message: "Architecture boundary: the question-theme infrastructure must not import question application code.",
          },
          {
            target: "src/contexts/question-theme/infrastructure/**/!(*.spec).ts",
            from: "src/contexts/question/domain",
            message: "Architecture boundary: the question-theme infrastructure must not import question domain code.",
          },
          {
            target: "src/contexts/question-theme/infrastructure/**/!(*.spec).ts",
            from: "src/contexts/question/infrastructure",
            message: "Architecture boundary: the question-theme infrastructure must not import question infrastructure.",
          },
          {
            target: "src/contexts/question-theme/infrastructure/**/!(*.spec).ts",
            from: "src/contexts/question/contracts",
            except: ["persistence"],
            message: "Architecture boundary: the question-theme infrastructure may only import the published question persistence contract.",
          },
          {
            target: "src/contexts/question-theme/question-theme.module.ts",
            from: ["src/contexts/question"],
            except: [
              "question-usage.module.ts",
              "application/use-cases/count-live-questions-by-theme-id",
            ],
            message: "Architecture boundary: the question-theme module may only import question-usage.module.ts and the published count use case.",
          },
        ],
      },
    ],
  },
} as const;

// Compose after the Oxlint bridge: it turns `no-restricted-imports` off for `**/*.ts`.
const ESLINT_BOUNDARIES_PACKAGE_BANS_FLAT_CONFIG: Linter.Config = {
  name: "boundaries-package-bans",
  files: [
    "src/contexts/*/domain/**/*.ts",
    "src/shared/domain/**/*.ts",
  ],
  ignores: [
    "**/*.spec.ts",
    "**/*.d.ts",
  ],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [
              "@nestjs/*",
              "mongoose",
              "mongoose/*",
              "fastify",
              "fastify/*",
              "nestjs-zod",
              "nestjs-zod/*",
            ],
            message: DOMAIN_FRAMEWORK_BAN_MESSAGE,
          },
          {
            group: ["node:*"],
            message: DOMAIN_NODE_BAN_MESSAGE,
          },
        ],
      },
    ],
  },
} as const;

// Compose after the Oxlint bridge: it turns `no-restricted-imports` off for `**/*.ts`.
const ESLINT_BOUNDARIES_APPLICATION_PACKAGE_BANS_FLAT_CONFIG: Linter.Config = {
  name: "boundaries-application-package-bans",
  files: [
    "src/contexts/*/application/**/*.ts",
    "src/shared/application/**/*.ts",
  ],
  ignores: [
    "**/*.spec.ts",
    "**/*.d.ts",
  ],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [
              "@nestjs/*",
              "mongoose",
              "mongoose/*",
              "fastify",
              "fastify/*",
              "nestjs-zod",
              "nestjs-zod/*",
            ],
            message: APPLICATION_FRAMEWORK_BAN_MESSAGE,
          },
        ],
      },
    ],
  },
} as const;

const ESLINT_BOUNDARIES_CONTRACTS_PACKAGE_BANS_FLAT_CONFIG: Linter.Config = {
  name: "boundaries-contracts-package-bans",
  files: ["src/contexts/*/contracts/**/*.ts"],
  ignores: [
    "**/*.spec.ts",
    "**/*.d.ts",
  ],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [
              "@nestjs/*",
              "mongoose",
              "mongoose/*",
              "fastify",
              "fastify/*",
              "nestjs-zod",
              "nestjs-zod/*",
            ],
            message: CONTRACTS_FRAMEWORK_BAN_MESSAGE,
          },
        ],
      },
    ],
  },
} as const;

export {
  ESLINT_BOUNDARIES_FLAT_CONFIG,
  ESLINT_BOUNDARIES_PACKAGE_BANS_FLAT_CONFIG,
  ESLINT_BOUNDARIES_APPLICATION_PACKAGE_BANS_FLAT_CONFIG,
  ESLINT_BOUNDARIES_CONTRACTS_PACKAGE_BANS_FLAT_CONFIG,
};