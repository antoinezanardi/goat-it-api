import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    root: resolve(__dirname, "../.."),
    include: ["./src/**/*.spec.ts"]
  },
  plugins: [
    swc.vite({
      module: { type: "es6" },
    }),
  ],
});