import { FIXTURE_REGISTRY } from "@acceptance-support/fixtures/constants/fixture.constants";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

async function insertQuestionThemeFixtureSet(world: GoatItWorld, setName: keyof typeof FIXTURE_REGISTRY["question-theme"]): Promise<void> {
  const fixtureSet = FIXTURE_REGISTRY["question-theme"][setName];
  await world.models.questionThemes.insertMany(fixtureSet);
}

export {
  insertQuestionThemeFixtureSet,
};