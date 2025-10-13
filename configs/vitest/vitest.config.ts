import { JscConfig } from "@swc/core";
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";
import { resolve } from "node:path";
import SwcConfig from "../swc/swc.config.json";

export default defineConfig({
  test: {
    watch: false,
    globals: true,
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    root: resolve(__dirname, "../.."),
    include: ["src/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      include: [
        "src/**/*.ts",
      ],
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
      jsc: SwcConfig.jsc as JscConfig,
      module: { type: "es6" },
    }),
  ],
});