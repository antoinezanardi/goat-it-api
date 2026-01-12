import type { FIXTURE_REGISTRY } from "@acceptance-support/fixtures/constants/fixture.constants";
import { loadFixture } from "@acceptance-support/fixtures/helpers/fixture.helpers";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

async function insertQuestionThemeFixtureSet(world: GoatItWorld, setName: keyof typeof FIXTURE_REGISTRY["question-theme"]): Promise<void> {
  await loadFixture(world, "question-theme", setName);
}

export {
  insertQuestionThemeFixtureSet,
};