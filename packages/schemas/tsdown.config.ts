import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "./src/shared/locale/index.ts",
    "./src/question/index.ts",
    "./src/question-theme/index.ts",
  ],
  alias: {
    "@shared": new URL("../../src/shared", import.meta.url).pathname,
    "@question": new URL("../../src/contexts/question", import.meta.url).pathname,
  },
  format: ["esm"],
  deps: {
    skipNodeModulesBundle: true,
  },
  attw: {
    enabled: true,
    profile: "esm-only",
  },
  clean: true,
  dts: true,
  unbundle: true,
  outDir: "dist",
  failOnWarn: true,
  sourcemap: true,
});