import { FIVE_QUESTION_THEMES_FIXTURE_SET } from "@acceptance-support/fixtures/question-theme/sets/five-question-themes.fixture-set";
import { TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_SET } from "@acceptance-support/fixtures/question-theme/sets/two-english-only-question-themes.fixture-set";
import { FIVE_QUESTIONS_FIXTURE_SET } from "@acceptance-support/fixtures/question/sets/five-questions.fixture-set";
import { TWO_ENGLISH_ONLY_QUESTIONS_FIXTURE_SET } from "@acceptance-support/fixtures/question/sets/two-english-only-questions.fixture-set";

import type { FixtureInserterRegistry, FixtureRegistry } from "@acceptance-support/fixtures/types/fixture.types";

/**
 * Constant registry mapping fixture domains and their sets to data and dependencies.
 * When adding a new fixture set, ensure you add its definition in the FixtureRegistry type.
 * This registry is used by fixture loading helpers to resolve and insert fixture data.
 */
const FIXTURE_REGISTRY: FixtureRegistry = {
  "question": {
    "five-questions": {
      data: FIVE_QUESTIONS_FIXTURE_SET,
      dependencies: [["question-theme", "five-question-themes"]],
    },
    "two-english-only-questions": {
      data: TWO_ENGLISH_ONLY_QUESTIONS_FIXTURE_SET,
      dependencies: [["question-theme", "two-english-only-question-themes"]],
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