import { FIXTURE_REGISTRY } from "@acceptance-support/fixtures/constants/fixture.constants";
import { loadFixture } from "@acceptance-support/fixtures/helpers/fixture.helpers";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

function isValidQuestionThemeFixtureSetName(name: string): name is keyof typeof FIXTURE_REGISTRY["question-theme"] {
  return Object.hasOwn(FIXTURE_REGISTRY["question-theme"], name);
}

async function insertQuestionThemeFixtureSet(world: GoatItWorld, fixtureSetName: keyof typeof FIXTURE_REGISTRY["question-theme"]): Promise<void> {
  await loadFixture(world, "question-theme", fixtureSetName);
}

export {
  isValidQuestionThemeFixtureSetName,
  insertQuestionThemeFixtureSet,
};