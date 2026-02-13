import { faker } from "@faker-js/faker";

import type { QuestionCreationDto } from "@question/application/dto/question-creation/question-creation.dto.shape";
import { QUESTION_COGNITIVE_DIFFICULTIES } from "@question/domain/value-objects/question-cognitive-difficulty/question-cognitive-difficulty.constants";

import { createFakeQuestionContentCreationDto } from "@faketories/contexts/question/dto/question-creation/question-content-creation/question-content-creation.dto.faketory";
import { createFakeQuestionThemeAssignmentCreationDto } from "@faketories/contexts/question/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto.faketory";
import { createFakeQuestionAuthorCreationDto } from "@faketories/contexts/question/dto/question-creation/question-author-creation/question-author-creation.dto.faketory";

function createFakeQuestionCreationDto(creationDto: Partial<QuestionCreationDto> = {}): QuestionCreationDto {
  return {
    themes: [createFakeQuestionThemeAssignmentCreationDto()],
    content: createFakeQuestionContentCreationDto(),
    cognitiveDifficulty: faker.helpers.arrayElement(QUESTION_COGNITIVE_DIFFICULTIES),
    author: createFakeQuestionAuthorCreationDto(),
    sourceUrls: faker.helpers.uniqueArray(() => faker.internet.url(), 2),
    ...creationDto,
  };
}

export { createFakeQuestionCreationDto };