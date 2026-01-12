import { Given } from "@cucumber/cucumber";

import { insertQuestionFixtureSet } from "@acceptance-support/fixtures/question/question.fixtures";
import type { FIXTURE_REGISTRY } from "@acceptance-support/fixtures/constants/fixture.constants";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Given(/^the database is populated with question fixture set with name "(?<fixtureName>[^"]+)"$/u, async function(this: GoatItWorld, fixtureName: keyof typeof FIXTURE_REGISTRY["question"]): Promise<void> {
  await insertQuestionFixtureSet(this, fixtureName);
});