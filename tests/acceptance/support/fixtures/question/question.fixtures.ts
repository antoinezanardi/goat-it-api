import { FIXTURE_REGISTRY } from "@acceptance-support/fixtures/constants/fixture.constants";
import { loadFixture } from "@acceptance-support/fixtures/helpers/fixture.helpers";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

function isValidQuestionFixtureSetName(name: string): name is keyof typeof FIXTURE_REGISTRY["question"] {
  return Object.hasOwn(FIXTURE_REGISTRY.question, name);
}

async function insertQuestionFixtureSet(world: GoatItWorld, fixtureSetName: keyof typeof FIXTURE_REGISTRY["question"]): Promise<void> {
  await loadFixture(world, "question", fixtureSetName);
}

export {
  isValidQuestionFixtureSetName,
  insertQuestionFixtureSet,
};