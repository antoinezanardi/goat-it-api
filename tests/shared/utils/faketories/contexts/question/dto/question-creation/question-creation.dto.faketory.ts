import { faker } from "@faker-js/faker";

import type { QuestionCreationDto } from "@question/application/dto/question-creation/question-creation.dto";
import { QUESTION_STATUSES } from "@question/domain/value-objects/question-status/question-status.constants";
import { QUESTION_COGNITIVE_DIFFICULTIES } from "@question/domain/value-objects/question-cognitive-difficulty/question-cognitive-difficulty.constants";

import { createFakeQuestionThemeAssignmentCreationDto } from "@faketories/contexts/question/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto.faketory";
import { createFakeQuestionAuthorCreationDto } from "@faketories/contexts/question/dto/question-creation/question-author-creation/question-author-creation.dto.faketory";
import { createFakeAdminQuestionContentDto } from "@faketories/contexts/question/dto/admin-question/admin-question-content/admin-question-content.dto.faketory";

function createFakeQuestionCreationDto(creationDto: Partial<QuestionCreationDto> = {}): QuestionCreationDto {
  return {
    themes: [createFakeQuestionThemeAssignmentCreationDto()],
    content: createFakeAdminQuestionContentDto(),
    cognitiveDifficulty: faker.helpers.arrayElement(QUESTION_COGNITIVE_DIFFICULTIES),
    author: createFakeQuestionAuthorCreationDto(),
    status: faker.helpers.arrayElement(QUESTION_STATUSES),
    sourceUrls: faker.helpers.uniqueArray(() => faker.internet.url(), 2),
    ...creationDto,
  };
}

export { createFakeQuestionCreationDto };