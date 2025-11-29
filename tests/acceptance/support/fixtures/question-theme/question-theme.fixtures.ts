import { FIXTURE_SETS } from "@acceptance-support/fixtures/constants/fixture.constants";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

async function insertQuestionThemeFixtureSet(world: GoatItWorld, setName: keyof typeof FIXTURE_SETS["question-theme"]): Promise<void> {
  const fixtureSet = FIXTURE_SETS["question-theme"][setName];
  await world.models.questionThemes.insertMany(fixtureSet);
}

export {
  insertQuestionThemeFixtureSet,
};