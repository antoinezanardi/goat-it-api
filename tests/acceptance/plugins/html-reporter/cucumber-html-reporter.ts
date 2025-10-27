import { generate as reporterGenerate } from "cucumber-html-reporter";

import { ACCEPTANCE_TESTS_REPORTS_PATH, ACCEPTANCE_TESTS_REPORTS_SCREENSHOTS_PATH } from "@acceptance-support/constants/acceptance.constants";

reporterGenerate({
  theme: "bootstrap",
  jsonFile: `${ACCEPTANCE_TESTS_REPORTS_PATH}/report.json`,
  output: `${ACCEPTANCE_TESTS_REPORTS_PATH}/index.html`,
  reportSuiteAsScenarios: true,
  launchReport: false,
  name: "Goat It API",
  brandTitle: "Acceptance Test Report",
  columnLayout: 1,
  scenarioTimestamp: true,
  screenshotsDirectory: ACCEPTANCE_TESTS_REPORTS_SCREENSHOTS_PATH,
  storeScreenshots: true,
});