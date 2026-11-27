import { createFakeQuestionThemeAssignmentCreationDto } from "@faketories/contexts/question/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto.faketory";

import { FIVE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY } from "@acceptance-support/fixtures/question-theme/sets/five-question-themes.fixture-set";

import type { QuestionThemeAssignmentCreationDto } from "@question/application/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto.shape";

function buildPrimaryHistoryQuestionThemeAssignmentCreatePayload(): QuestionThemeAssignmentCreationDto {
  return createFakeQuestionThemeAssignmentCreationDto({
    themeId: FIVE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY._id.toString(),
    isPrimary: true,
    isHint: false,
  });
}

const PRIMARY_HISTORY_QUESTION_THEME_ASSIGNMENT_CREATE_PAYLOAD = Object.freeze(buildPrimaryHistoryQuestionThemeAssignmentCreatePayload());

export {
  PRIMARY_HISTORY_QUESTION_THEME_ASSIGNMENT_CREATE_PAYLOAD,
  buildPrimaryHistoryQuestionThemeAssignmentCreatePayload,
};