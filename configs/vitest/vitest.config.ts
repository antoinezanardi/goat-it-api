import path from "node:path";

import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

import SwcConfig from "../swc/swc.config.json";

import type { JscConfig } from "@swc/core";

const rootDirectory = path.resolve(import.meta.dirname, "../..");

const swcJsc = SwcConfig.jsc as unknown as JscConfig;

export default defineConfig({
  test: {
    pool: "threads",
    isolate: false,
    watch: false,
    globals: true,
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    root: rootDirectory,
    include: ["src/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.module.ts",
        "src/**/mongoose/**/*.schema.ts",
        "src/**/*.constants.ts",
        "src/**/*.pipeline.ts",
        "src/**/*.types.ts",
        "src/**/*.commands.ts",
        "src/**/*.contracts.ts",
        "src/**/*.dto.ts",
        "src/**/*.entities.ts",
        "src/**/*.value-objects.ts",
      ],
      reportsDirectory: "tests/unit/coverage",
      reporter: [
        "clover",
        "json",
        "lcov",
        "text",
        "text-summary",
        "html",
      ],
      thresholds: {
        100: true,
      },
    },
    setupFiles: ["tests/unit/setup/mocks.setup.ts"],
  },
  plugins: [
    swc.vite({
      jsc: {
        ...swcJsc,
        baseUrl: rootDirectory,
      },
      module: { type: "es6" },
    }),
  ],
  resolve: {
    alias: {
      "@package-json": path.resolve(rootDirectory, "package.json"),
      "@src": path.resolve(rootDirectory, "src"),
      "@app": path.resolve(rootDirectory, "src/app"),
      "@shared": path.resolve(rootDirectory, "src/shared"),
      "@configs": path.resolve(rootDirectory, "configs"),
      "@question": path.resolve(rootDirectory, "src/contexts/question"),
      "@question-theme": path.resolve(rootDirectory, "src/contexts/question-theme"),
      "@unit-tests": path.resolve(rootDirectory, "tests/unit"),
      "@faketories": path.resolve(rootDirectory, "tests/shared/utils/faketories"),
      "@test-helpers": path.resolve(rootDirectory, "tests/shared/utils/helpers"),
      "@mocks": path.resolve(rootDirectory, "tests/unit/utils/mocks"),
    },
  },
});