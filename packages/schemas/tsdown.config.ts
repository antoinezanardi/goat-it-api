import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "./src/shared/locale/index.ts",
    "./src/shared/error/index.ts",
    "./src/shared/constants/index.ts",
    "./src/question/index.ts",
    "./src/question-theme/index.ts",
    "./src/testing/question/index.ts",
    "./src/testing/question-theme/index.ts",
    "./src/testing/shared/index.ts",
  ],
  alias: {
    "@shared": new URL("../../src/shared", import.meta.url).pathname,
    "@question": new URL("../../src/contexts/question", import.meta.url).pathname,
    "@question-theme": new URL("../../src/contexts/question-theme", import.meta.url).pathname,
    "@faketories": new URL("../../tests/shared/utils/faketories", import.meta.url).pathname,
  },
  format: ["esm"],
  unbundle: true,
  deps: {
    neverBundle: ["zod", "type-fest", "@faker-js/faker"],
  },
  attw: {
    enabled: true,
    profile: "esm-only",
  },
  clean: true,
  dts: true,

  outDir: "dist",
  failOnWarn: true,
  sourcemap: true,
});