import { Given } from "@cucumber/cucumber";

import { insertQuestionFixtureSet, isValidQuestionFixtureSetName } from "@acceptance-support/fixtures/question/question.fixtures";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Given(/^the database is populated with questions fixture set with name "(?<fixtureName>[^"]+)"$/u, async function(this: GoatItWorld, fixtureName: string): Promise<void> {
  if (!isValidQuestionFixtureSetName(fixtureName)) {
    throw new Error(`Invalid question fixture set name: "${fixtureName}"`);
  }

  await insertQuestionFixtureSet(this, fixtureName);
});