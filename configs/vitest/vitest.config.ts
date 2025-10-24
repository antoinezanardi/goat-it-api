import path from "node:path";

import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

import SwcConfig from "../swc/swc.config.json";

import type { JscConfig } from "@swc/core";

const rootDirectory = path.resolve(import.meta.dirname, "../..");

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const swcJsc = SwcConfig.jsc as unknown as JscConfig;

export default defineConfig({
  test: {
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
        "src/**/*.constants.ts",
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
      "@server": path.resolve(rootDirectory, "src/server"),
      "@modules": path.resolve(rootDirectory, "src/modules"),
      "@shared": path.resolve(rootDirectory, "src/shared"),
      "@configs": path.resolve(rootDirectory, "configs"),
    },
  },
});