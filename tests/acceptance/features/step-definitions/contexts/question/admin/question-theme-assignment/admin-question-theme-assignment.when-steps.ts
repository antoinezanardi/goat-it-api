import { When } from "@cucumber/cucumber";

import { sendDeleteThemeAssignment, sendPatchThemeAssignment, sendPostThemeAssignment } from "@acceptance-features/step-definitions/contexts/question/admin/question-theme-assignment/helpers/admin-question-theme-assignment.steps.helpers";

import { APP_ADMIN_API_KEY } from "@acceptance-support/constants/app.constants";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

When(/^the admin assigns the theme with the request payload to the question with id "(?<questionId>[^"]+)"$/u, async function(this: GoatItWorld, questionId: string) {
  await sendPostThemeAssignment(this, questionId, { apiKey: APP_ADMIN_API_KEY, body: this.payload });
});

When(/^the admin assigns the theme with an empty request payload to the question with id "(?<questionId>[^"]+)"$/u, async function(this: GoatItWorld, questionId: string) {
  await sendPostThemeAssignment(this, questionId, { apiKey: APP_ADMIN_API_KEY, body: {} });
});

When(/^the admin assigns the theme with the request payload to the question with id "(?<questionId>[^"]+)" without an API key$/u, async function(this: GoatItWorld, questionId: string) {
  await sendPostThemeAssignment(this, questionId, { body: this.payload });
});

When(/^the admin assigns the theme with the request payload to the question with id "(?<questionId>[^"]+)" with an invalid API key$/u, async function(this: GoatItWorld, questionId: string) {
  await sendPostThemeAssignment(this, questionId, { apiKey: "invalid-api-key", body: this.payload });
});

When(/^the admin removes the theme with id "(?<themeId>[^"]+)" from the question with id "(?<questionId>[^"]+)"$/u, async function(this: GoatItWorld, themeId: string, questionId: string) {
  await sendDeleteThemeAssignment(this, themeId, questionId, { apiKey: APP_ADMIN_API_KEY });
});

When(/^the admin removes the theme with id "(?<themeId>[^"]+)" from the question with id "(?<questionId>[^"]+)" without an API key$/u, async function(this: GoatItWorld, themeId: string, questionId: string) {
  await sendDeleteThemeAssignment(this, themeId, questionId);
});

When(/^the admin removes the theme with id "(?<themeId>[^"]+)" from the question with id "(?<questionId>[^"]+)" with an invalid API key$/u, async function(this: GoatItWorld, themeId: string, questionId: string) {
  await sendDeleteThemeAssignment(this, themeId, questionId, { apiKey: "invalid-api-key" });
});

When(/^the admin modifies the theme assignment with id "(?<themeId>[^"]+)" with the request payload on the question with id "(?<questionId>[^"]+)"$/u, async function(this: GoatItWorld, themeId: string, questionId: string) {
  await sendPatchThemeAssignment(this, themeId, questionId, { apiKey: APP_ADMIN_API_KEY, body: this.payload });
});

When(/^the admin modifies the theme assignment with id "(?<themeId>[^"]+)" with an empty request payload on the question with id "(?<questionId>[^"]+)"$/u, async function(this: GoatItWorld, themeId: string, questionId: string) {
  await sendPatchThemeAssignment(this, themeId, questionId, { apiKey: APP_ADMIN_API_KEY, body: {} });
});

When(/^the admin modifies the theme assignment with id "(?<themeId>[^"]+)" with the request payload on the question with id "(?<questionId>[^"]+)" without an API key$/u, async function(this: GoatItWorld, themeId: string, questionId: string) {
  await sendPatchThemeAssignment(this, themeId, questionId, { body: this.payload });
});

When(/^the admin modifies the theme assignment with id "(?<themeId>[^"]+)" with the request payload on the question with id "(?<questionId>[^"]+)" with an invalid API key$/u, async function(this: GoatItWorld, themeId: string, questionId: string) {
  await sendPatchThemeAssignment(this, themeId, questionId, { apiKey: "invalid-api-key", body: this.payload });
});