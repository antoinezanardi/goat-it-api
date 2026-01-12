import { FIVE_QUESTION_THEMES_FIXTURE_SET } from "@acceptance-support/fixtures/question-theme/sets/five-question-themes.fixture-set";
import { TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_SET } from "@acceptance-support/fixtures/question-theme/sets/two-english-only-question-themes.fixture-set";
import { FIVE_QUESTIONS_FIXTURE_SET } from "@acceptance-support/fixtures/question/sets/five-questions.fixture-set";

import type { FixtureInserterRegistry, FixtureRegistry } from "@acceptance-support/fixtures/types/fixture.types";

const FIXTURE_REGISTRY: FixtureRegistry = {
  "question": {
    "five-questions": {
      data: FIVE_QUESTIONS_FIXTURE_SET,
      dependencies: [["question-theme", "five-question-themes"]],
    },
  },
  "question-theme": {
    "five-question-themes": {
      data: FIVE_QUESTION_THEMES_FIXTURE_SET,
    },
    "two-english-only-question-themes": {
      data: TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_SET,
    },
  },
};

const FIXTURE_INSERTERS: FixtureInserterRegistry = {
  "question": async(world, data): Promise<void> => {
    await world.models.questions.insertMany(data);
  },
  "question-theme": async(world, data): Promise<void> => {
    await world.models.questionThemes.insertMany(data);
  },
};

export {
  FIXTURE_REGISTRY,
  FIXTURE_INSERTERS,
};