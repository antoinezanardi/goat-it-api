import { FIVE_QUESTION_THEMES_FIXTURE_SET } from "@acceptance-support/fixtures/question-theme/sets/five-question-themes.fixture-set";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

async function createDefaultQuestionThemes(world: GoatItWorld): Promise<void> {
  await world.models.questionThemes.insertMany(FIVE_QUESTION_THEMES_FIXTURE_SET);
}

export {
  createDefaultQuestionThemes,
};