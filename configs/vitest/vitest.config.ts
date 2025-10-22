import { resolve } from "path";

import type { JscConfig } from "@swc/core";
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

import SwcConfig from "../swc/swc.config.json";

const rootDir = resolve(__dirname, "../..");

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const swcJsc = SwcConfig.jsc as unknown as JscConfig;

export default defineConfig({
  test: {
    watch: false,
    globals: true,
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    root: rootDir,
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
      all: true,
      thresholds: {
        100: true,
      },
    },
  },
  plugins: [
    swc.vite({
      jsc: {
        ...swcJsc,
        baseUrl: rootDir,
      },
      module: { type: "es6" },
    }),
  ],
  resolve: {
    alias: {
      "@src": resolve(rootDir, "src"),
      "@app": resolve(rootDir, "src/app"),
      "@server": resolve(rootDir, "src/server"),
      "@modules": resolve(rootDir, "src/modules"),
      "@shared": resolve(rootDir, "src/shared"),
      "@configs": resolve(rootDir, "configs"),
    },
  },
});