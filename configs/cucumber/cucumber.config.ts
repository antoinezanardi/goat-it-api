import type { IConfiguration } from "@cucumber/cucumber";

const CUCUMBER_COMMON_CONFIGURATION = {
  paths: ["tests/acceptance/features/**/*.feature"],
  requireModule: ["tsx/esm"],
  require: [
    "tests/acceptance/support/**/*.ts",
    "tests/acceptance/features/**/*.ts",
  ],
  publish: false,
} satisfies Partial<IConfiguration>;

const CUCUMBER_STANDARD_PROFILE = {
  ...CUCUMBER_COMMON_CONFIGURATION,
  format: [
    "summary",
    "progress-bar",
    "junit:tests/acceptance/reports/junit.xml",
    "json:tests/acceptance/reports/report.json",
    "message:tests/acceptance/reports/message.json",
  ],
  parallel: 4,
  tags: "not @rate-limit-429",
} satisfies Partial<IConfiguration>;

const CUCUMBER_LOW_LIMIT_PROFILE = {
  ...CUCUMBER_COMMON_CONFIGURATION,
  format: [
    "summary",
    "progress-bar",
    "junit:tests/acceptance/reports/rate-limit/junit.xml",
    "json:tests/acceptance/reports/rate-limit/report.json",
    "message:tests/acceptance/reports/rate-limit/message.json",
  ],
  parallel: 1,
  tags: "@rate-limit-429",
} satisfies Partial<IConfiguration>;

export { CUCUMBER_LOW_LIMIT_PROFILE as lowLimit };

export default CUCUMBER_STANDARD_PROFILE;