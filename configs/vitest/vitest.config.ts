import Path from "path";

import type { JscConfig } from "@swc/core";
import SwcPlugin from "unplugin-swc";
import { defineConfig } from "vitest/config";

import SwcConfig from "../swc/swc.config.json";

const rootDir = Path.resolve(__dirname, "../..");

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
      thresholds: {
        100: true,
      },
    },
  },
  plugins: [
    SwcPlugin.vite({
      jsc: {
        ...swcJsc,
        baseUrl: rootDir,
      },
      module: { type: "es6" },
    }),
  ],
  resolve: {
    alias: {
      "@src": Path.resolve(rootDir, "src"),
      "@app": Path.resolve(rootDir, "src/app"),
      "@server": Path.resolve(rootDir, "src/server"),
      "@modules": Path.resolve(rootDir, "src/modules"),
      "@shared": Path.resolve(rootDir, "src/shared"),
      "@configs": Path.resolve(rootDir, "configs"),
    },
  },
});