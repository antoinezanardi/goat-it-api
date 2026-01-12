import { FIXTURE_REGISTRY } from "@acceptance-support/fixtures/constants/fixture.constants";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

async function insertQuestionFixtureSet(world: GoatItWorld, setName: keyof typeof FIXTURE_REGISTRY["question"]): Promise<void> {
  const fixtureSet = FIXTURE_REGISTRY.question[setName];
  await world.models.questions.insertMany(fixtureSet);
}

export {
  insertQuestionFixtureSet,
};