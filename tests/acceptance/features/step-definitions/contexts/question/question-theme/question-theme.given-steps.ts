import { Given } from "@cucumber/cucumber";

import type { FIXTURE_SETS } from "@acceptance-support/fixtures/constants/fixture.constants";
import { insertQuestionThemeFixtureSet } from "@acceptance-support/fixtures/question-theme/question-theme.fixtures";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Given(/^the database is populated with question themes fixture set with name "(?<fixtureName>[^"]+)"$/u, async function(this: GoatItWorld, fixtureName: keyof typeof FIXTURE_SETS["question-theme"]): Promise<void> {
  await insertQuestionThemeFixtureSet(this, fixtureName);
});