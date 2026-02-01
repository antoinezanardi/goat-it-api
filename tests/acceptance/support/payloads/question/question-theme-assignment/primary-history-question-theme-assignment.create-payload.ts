import { createFakeQuestionThemeAssignmentCreationDto } from "@faketories/contexts/question/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto.faketory";

import { FIVE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY } from "@acceptance-support/fixtures/question-theme/sets/five-question-themes.fixture-set";

const PRIMARY_HISTORY_QUESTION_THEME_ASSIGNMENT_CREATE_PAYLOAD = Object.freeze(createFakeQuestionThemeAssignmentCreationDto({
  themeId: FIVE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY.id,
  isPrimary: true,
  isHint: false,
}));

export { PRIMARY_HISTORY_QUESTION_THEME_ASSIGNMENT_CREATE_PAYLOAD };