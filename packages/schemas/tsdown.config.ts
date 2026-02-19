import path from "node:path";

import { defineConfig } from "tsdown";

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  entry: [
    "./src/shared/locale/index.ts",
    "./src/question/index.ts",
    "./src/question-theme/index.ts",
  ],
  alias: {
    "@shared": path.resolve(import.meta.dirname, "../../src/shared"),
    "@question": path.resolve(import.meta.dirname, "../../src/contexts/question"),
  },
  format: ["esm"],
  skipNodeModulesBundle: true,
  clean: true,
  dts: true,
  unbundle: true,
  outDir: "dist",
  failOnWarn: true,
  sourcemap: true,
});