import {
  buildDependencyTable,
  deduplicateDependencies,
  extractDependencyInfo,
  isDepsLine,
  removeDepsLinesAndCleanSections,
  transformReleaseNotes,
} from "./transform-release-notes.mjs";

describe("Transform Release Notes", () => {
  describe("isDepsLine", () => {
    it.each([
      {
        test: "should return true when the line is a deps line with colon inside bold.",
        input: "* **deps:** update dependency fastify to ^5.8.4",
        expected: true,
      },
      {
        test: "should return true when the line is a deps line with colon outside bold.",
        input: "* **deps**: update dependency fastify to ^5.8.4",
        expected: true,
      },
      {
        test: "should return true when the line is a deps line with references.",
        input: "* **deps:** update dependency fastify to ^5.8.4 ([#589](https://example.com)) ([6ce3a80](https://example.com))",
        expected: true,
      },
      {
        test: "should return false when the line is a regular feature line.",
        input: "* **question:** add new feature",
        expected: false,
      },
      {
        test: "should return false when the line is a section header.",
        input: "### 🐛 Bug Fixes",
        expected: false,
      },
      {
        test: "should return false when the line is empty.",
        input: "",
        expected: false,
      },
    ])("$test", ({ input, expected }) => {
      expect(isDepsLine(input)).toBe(expected);
    });
  });

  describe("extractDependencyInfo", () => {
    it.each([
      {
        test: "should extract package name and caret version from a standard dependency line.",
        input: "* **deps:** update dependency fastify to ^5.8.4",
        expected: { name: "fastify", version: "^5.8.4" },
      },
      {
        test: "should extract scoped package name and version.",
        input: "* **deps:** update dependency @fastify/static to ^9.1.0",
        expected: { name: "@fastify/static", version: "^9.1.0" },
      },
      {
        test: "should extract monorepo name and version.",
        input: "* **deps:** update nest monorepo to ^11.1.17",
        expected: { name: "nest monorepo", version: "^11.1.17" },
      },
      {
        test: "should extract monorepo name without version.",
        input: "* **deps:** update nest monorepo",
        expected: { name: "nest monorepo", version: "" },
      },
      {
        test: "should extract package name with v-prefixed version.",
        input: "* **deps:** update node.js to v25.9.0",
        expected: { name: "node.js", version: "v25.9.0" },
      },
      {
        test: "should extract action name and version.",
        input: "* **deps:** update pnpm/action-setup action to v5",
        expected: { name: "pnpm/action-setup action", version: "v5" },
      },
      {
        test: "should extract docker tag name and version.",
        input: "* **deps:** update mongo docker tag to v8.2.6",
        expected: { name: "mongo docker tag", version: "v8.2.6" },
      },
      {
        test: "should strip trailing references before extracting.",
        input: "* **deps:** update dependency mongoose to ^9.3.0 ([#549](https://example.com)) ([8a63f87](https://example.com))",
        expected: { name: "mongoose", version: "^9.3.0" },
      },
      {
        test: "should handle colon-outside-bold format.",
        input: "* **deps**: update dependency eslint to ^10.2.0",
        expected: { name: "eslint", version: "^10.2.0" },
      },
      {
        test: "should extract pre-release version.",
        input: "* **deps:** update dependency @typescript/native-preview to v7.0.0-dev.20260313.1",
        expected: { name: "@typescript/native-preview", version: "v7.0.0-dev.20260313.1" },
      },
    ])("$test", ({ input, expected }) => {
      expect(extractDependencyInfo(input)).toStrictEqual(expected);
    });
  });

  describe("deduplicateDependencies", () => {
    it("should keep a single entry when there are no duplicates.", () => {
      const deps = [
        { name: "fastify", version: "^5.8.4" },
        { name: "mongoose", version: "^9.3.0" },
      ];

      expect(deduplicateDependencies(deps)).toStrictEqual([
        { name: "fastify", version: "^5.8.4" },
        { name: "mongoose", version: "^9.3.0" },
      ]);
    });

    it("should keep the latest version when a package appears multiple times.", () => {
      const deps = [
        { name: "dotenv", version: "^17.4.0" },
        { name: "fastify", version: "^5.8.4" },
        { name: "dotenv", version: "^17.4.1" },
      ];

      expect(deduplicateDependencies(deps)).toStrictEqual([
        { name: "dotenv", version: "^17.4.1" },
        { name: "fastify", version: "^5.8.4" },
      ]);
    });

    it("should return an empty array when given an empty array.", () => {
      expect(deduplicateDependencies([])).toStrictEqual([]);
    });

    it("should keep the latest version when a package appears three times.", () => {
      const deps = [
        { name: "oxlint", version: "^1.53.0" },
        { name: "oxlint", version: "^1.55.0" },
        { name: "oxlint", version: "^1.59.0" },
      ];

      expect(deduplicateDependencies(deps)).toStrictEqual([{ name: "oxlint", version: "^1.59.0" }]);
    });
  });

  describe("buildDependencyTable", () => {
    it("should return an empty string when there are no dependencies.", () => {
      expect(buildDependencyTable([])).toBe("");
    });

    it("should build a markdown table with one dependency.", () => {
      const deps = [{ name: "fastify", version: "^5.8.4" }];

      const expected = [
        "",
        "### 📦 Upgraded Dependencies",
        "",
        "| Package | Version |",
        "| --- | --- |",
        "| fastify | ^5.8.4 |",
      ].join("\n");

      expect(buildDependencyTable(deps)).toBe(expected);
    });

    it("should build a markdown table with multiple dependencies.", () => {
      const deps = [
        { name: "fastify", version: "^5.8.4" },
        { name: "mongoose", version: "^9.3.0" },
      ];

      const expected = [
        "",
        "### 📦 Upgraded Dependencies",
        "",
        "| Package | Version |",
        "| --- | --- |",
        "| fastify | ^5.8.4 |",
        "| mongoose | ^9.3.0 |",
      ].join("\n");

      expect(buildDependencyTable(deps)).toBe(expected);
    });

    it("should show an empty version cell when version is empty.", () => {
      const deps = [{ name: "nest monorepo", version: "" }];

      const expected = [
        "",
        "### 📦 Upgraded Dependencies",
        "",
        "| Package | Version |",
        "| --- | --- |",
        "| nest monorepo |  |",
      ].join("\n");

      expect(buildDependencyTable(deps)).toBe(expected);
    });
  });

  describe("removeDepsLinesAndCleanSections", () => {
    it("should remove deps lines from sections.", () => {
      const lines = [
        "### 🐛 Bug Fixes",
        "",
        "* **deps:** update dependency fastify to ^5.8.4",
        "* **question:** add new feature",
        "",
      ];

      const result = removeDepsLinesAndCleanSections(lines);

      expect(result).toStrictEqual([
        "### 🐛 Bug Fixes",
        "",
        "* **question:** add new feature",
        "",
      ]);
    });

    it("should remove empty sections when all lines are deps.", () => {
      const lines = [
        "### 🐛 Bug Fixes",
        "",
        "* **deps:** update dependency fastify to ^5.8.4",
        "* **deps:** update dependency mongoose to ^9.3.0",
        "",
        "### 🚀 Features",
        "",
        "* **question:** add new feature",
        "",
      ];

      const result = removeDepsLinesAndCleanSections(lines);

      expect(result).toStrictEqual([
        "### 🚀 Features",
        "",
        "* **question:** add new feature",
        "",
      ]);
    });

    it("should remove the last empty section.", () => {
      const lines = [
        "### 🚀 Features",
        "",
        "* **question:** add new feature",
        "",
        "### 🧹 Chore",
        "",
        "* **deps:** update dependency @swc/core to ^1.15.21",
      ];

      const result = removeDepsLinesAndCleanSections(lines);

      expect(result).toStrictEqual([
        "### 🚀 Features",
        "",
        "* **question:** add new feature",
        "",
      ]);
    });

    it("should preserve sections with mixed content.", () => {
      const lines = [
        "### 🧹 Chore",
        "",
        "* **deps:** update dependency @swc/core to ^1.15.21",
        "* **package:** bump schema version to 0.0.6",
      ];

      const result = removeDepsLinesAndCleanSections(lines);

      expect(result).toStrictEqual([
        "### 🧹 Chore",
        "",
        "* **package:** bump schema version to 0.0.6",
      ]);
    });
  });

  describe("transformReleaseNotes", () => {
    it("should return empty string when notes is null.", () => {
      expect(transformReleaseNotes(null)).toBe("");
    });

    it("should return empty string when notes is undefined.", () => {
      expect(transformReleaseNotes(undefined)).toBe("");
    });

    it("should return empty string when notes is empty string.", () => {
      expect(transformReleaseNotes("")).toBe("");
    });

    it("should return notes unchanged when there are no dependency lines.", () => {
      const notes = [
        "## 1.16.0 (2026-04-01)",
        "",
        "### 🚀 Features",
        "",
        "* **question:** add new feature",
        "",
      ].join("\n");

      expect(transformReleaseNotes(notes)).toBe(notes);
    });

    it("should transform the PR #624 changelog correctly.", () => {
      const input = [
        "## 1.16.1 (2026-04-07)",
        "",
        "### 🐛 Bug Fixes",
        "",
        "* **deps:** update dependency @fastify/static to ^9.1.0",
        "* **deps:** update dependency nestjs-zod to ^5.3.0",
        "* **deps:** update nest monorepo",
        "",
        "### 🧹 Chore",
        "",
        "* **deps:** update dependency @swc/cli to ^0.8.1",
        "* **deps:** update dependency @swc/core to ^1.15.24",
        "* **deps:** update dependency @types/node to ^24.12.2",
        "* **deps:** update dependency dotenv to ^17.4.0",
        "* **deps:** update dependency dotenv to ^17.4.1",
        "* **deps:** update dependency eslint to ^10.2.0",
        "* **deps:** update dependency eslint-plugin-oxlint to v1.59.0",
        "* **deps:** update dependency oxlint to ^1.59.0",
        "* **deps:** update dependency oxlint-tsgolint to ^0.19.0",
        "* **deps:** update dependency oxlint-tsgolint to ^0.20.0",
        "* **deps:** update node.js to v25.9.0",
        "* **deps:** update node.js to v25.9.0",
        "* **deps:** update sonarsource/sonarqube-scan-action action to v7.1.0",
        "* **deps:** update vitest monorepo to ^4.1.3",
        "",
      ].join("\n");

      const expected = [
        "## 1.16.1 (2026-04-07)",
        "",
        "### 📦 Upgraded Dependencies",
        "",
        "| Package | Version |",
        "| --- | --- |",
        "| @fastify/static | ^9.1.0 |",
        "| nestjs-zod | ^5.3.0 |",
        "| nest monorepo |  |",
        "| @swc/cli | ^0.8.1 |",
        "| @swc/core | ^1.15.24 |",
        "| @types/node | ^24.12.2 |",
        "| dotenv | ^17.4.1 |",
        "| eslint | ^10.2.0 |",
        "| eslint-plugin-oxlint | v1.59.0 |",
        "| oxlint | ^1.59.0 |",
        "| oxlint-tsgolint | ^0.20.0 |",
        "| node.js | v25.9.0 |",
        "| sonarsource/sonarqube-scan-action action | v7.1.0 |",
        "| vitest monorepo | ^4.1.3 |",
        "",
      ].join("\n");

      expect(transformReleaseNotes(input)).toBe(expected);
    });

    it("should transform a changelog with mixed deps and non-deps lines.", () => {
      const input = [
        "## 1.15.0 (2026-03-23)",
        "",
        "### 🚀 Features",
        "",
        "* **question-theme:** add color property to question theme models",
        "",
        "### 🐛 Bug Fixes",
        "",
        "* **deps:** update dependency fastify to ^5.8.4 ([#589](https://example.com)) ([6ce3a80](https://example.com))",
        "* **deps:** update dependency mongoose to ^9.3.0 ([#549](https://example.com)) ([8a63f87](https://example.com))",
        "",
        "### 🧹 Chore",
        "",
        "* **deps:** update dependency @swc/core to ^1.15.21 ([#586](https://example.com)) ([f0ce5b1](https://example.com))",
        "* **package:** bump schema version to 0.0.6 ([#582](https://example.com)) ([29ab140](https://example.com))",
        "",
      ].join("\n");

      const expected = [
        "## 1.15.0 (2026-03-23)",
        "",
        "### 🚀 Features",
        "",
        "* **question-theme:** add color property to question theme models",
        "",
        "### 🧹 Chore",
        "",
        "* **package:** bump schema version to 0.0.6 ([#582](https://example.com)) ([29ab140](https://example.com))",
        "",
        "### 📦 Upgraded Dependencies",
        "",
        "| Package | Version |",
        "| --- | --- |",
        "| fastify | ^5.8.4 |",
        "| mongoose | ^9.3.0 |",
        "| @swc/core | ^1.15.21 |",
        "",
      ].join("\n");

      expect(transformReleaseNotes(input)).toBe(expected);
    });

    it("should handle changelog format with references (CHANGELOG.md style).", () => {
      const input = [
        "## [1.15.0](https://github.com/antoinezanardi/goat-it-api/compare/v1.14.0...v1.15.0) (2026-03-23)",
        "",
        "### 🐛 Bug Fixes",
        "",
        "* **deps:** update dependency fastify to ^5.8.4 ([#589](https://example.com)) ([6ce3a80](https://example.com))",
        "",
      ].join("\n");

      const expected = [
        "## [1.15.0](https://github.com/antoinezanardi/goat-it-api/compare/v1.14.0...v1.15.0) (2026-03-23)",
        "",
        "### 📦 Upgraded Dependencies",
        "",
        "| Package | Version |",
        "| --- | --- |",
        "| fastify | ^5.8.4 |",
        "",
      ].join("\n");

      expect(transformReleaseNotes(input)).toBe(expected);
    });

    it("should deduplicate packages keeping the latest version.", () => {
      const input = [
        "## 1.15.0 (2026-03-23)",
        "",
        "### 🐛 Bug Fixes",
        "",
        "* **deps:** update dependency mongoose to ^9.3.0",
        "* **deps:** update dependency mongoose to ^9.3.1",
        "",
      ].join("\n");

      const expected = [
        "## 1.15.0 (2026-03-23)",
        "",
        "### 📦 Upgraded Dependencies",
        "",
        "| Package | Version |",
        "| --- | --- |",
        "| mongoose | ^9.3.1 |",
        "",
      ].join("\n");

      expect(transformReleaseNotes(input)).toBe(expected);
    });
  });
});