import type { Linter } from "eslint";

const DOMAIN_FRAMEWORK_BAN_MESSAGE = "Architecture boundary: domain is framework-free and must not import NestJS, Mongoose, Fastify or nestjs-zod. See docs/architecture.md §12.2.";

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
            target: "src/contexts/*/domain/**/!(*.spec).ts",
            from: [
              "src/shared/application/**",
              "src/shared/infrastructure/**",
              "src/contexts/*/contracts/**",
            ],
            message: "Architecture boundary: a context domain may only import the shared domain and its own domain.",
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
            target: "src/contexts/question/question.module.ts",
            from: ["src/contexts/question-theme"],
            except: ["question-theme.module.ts"],
            message: "Architecture boundary: the question module may only import question-theme.module.ts from the question-theme context.",
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
        ],
      },
    ],
  },
} as const;

export {
  ESLINT_BOUNDARIES_FLAT_CONFIG,
  ESLINT_BOUNDARIES_PACKAGE_BANS_FLAT_CONFIG,
};