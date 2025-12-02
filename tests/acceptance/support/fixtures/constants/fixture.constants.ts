import { FIVE_QUESTION_THEMES_FIXTURE_SET } from "@acceptance-support/fixtures/question-theme/sets/five-question-themes.fixture-set";
import { TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_SET } from "@acceptance-support/fixtures/question-theme/sets/two-english-only-question-themes.fixture-set";

import type { FixtureScope } from "@acceptance-support/fixtures/types/fixture.types";

const FIXTURE_SETS = {
  "question-theme": {
    "five-question-themes": FIVE_QUESTION_THEMES_FIXTURE_SET,
    "two-english-only-question-themes": TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_SET,
  },
} as const satisfies Record<FixtureScope, Record<string, readonly unknown[]>>;

export {
  FIXTURE_SETS,
};