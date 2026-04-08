const commitGroupsOrder = {
  features: 1,
  bugfixes: 2,
  docs: 3,
  styles: 4,
  refactor: 5,
  performance: 6,
  tests: 7,
  ci: 8,
  chore: 9,
};

export default {
  branches: ["main", "develop"],
  repositoryUrl: "git@github.com:antoinezanardi/goat-it-api.git",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          {
            type: "feat",
            release: "minor",
          },
          {
            type: "fix",
            release: "patch",
          },
          {
            type: "docs",
            release: "patch",
          },
          {
            type: "style",
            release: "patch",
          },
          {
            type: "refactor",
            release: "patch",
          },
          {
            type: "perf",
            release: "patch",
          },
          {
            type: "test",
            release: "patch",
          },
          {
            type: "ci",
            release: "patch",
          },
          {
            type: "chore",
            release: "patch",
          },
        ],
      },
    ],
    [
      "./configs/semantic-release/plugins/release-notes-with-deps-table.plugin.mjs",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: [
            {
              type: "feat",
              section: "🚀 Features",
              hidden: false,
            },
            {
              type: "fix",
              section: "🐛 Bug Fixes",
              hidden: false,
            },
            {
              type: "docs",
              section: "📖 Docs",
              hidden: false,
            },
            {
              type: "style",
              section: "🎨 Styles",
              hidden: false,
            },
            {
              type: "refactor",
              section: "🔩 Refactor",
              hidden: false,
            },
            {
              type: "perf",
              section: "⚡️ Performance",
              hidden: false,
            },
            {
              type: "test",
              section: "✅ Tests",
              hidden: false,
            },
            {
              type: "ci",
              section: "🔁 CI",
              hidden: false,
            },
            {
              type: "chore",
              section: "🧹 Chore",
              hidden: false,
            },
          ],
        },
        writerOpts: {
          groupBy: "type",
          commitGroupsSort: (commitGroupA, commitGroupB) => {
            const commitGroupTitleA = commitGroupA.title.replaceAll(/[^a-zA-Z]/gu, "").toLowerCase();
            const commitGroupTitleB = commitGroupB.title.replaceAll(/[^a-zA-Z]/gu, "").toLowerCase();
            const commitGroupOrderA = commitGroupsOrder[commitGroupTitleA] ?? Number.MAX_SAFE_INTEGER;
            const commitGroupOrderB = commitGroupsOrder[commitGroupTitleB] ?? Number.MAX_SAFE_INTEGER;

            return commitGroupOrderA - commitGroupOrderB;
          },
        },
      },
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
        changelogTitle: "# 🐐 Goat It API Versioning Changelog",
      },
    ],
    [
      "@semantic-release/npm",
      { npmPublish: false },
    ],
    [
      "@semantic-release/git",
      {
        assets: [
          "CHANGELOG.md",
          "package.json",
          "pnpm-lock.yaml",
        ],
      },
    ],
    "@semantic-release/github",
    "semantic-release-export-data",
  ],
};