import { faker } from "@faker-js/faker";

import type { QuestionDto } from "@question/application/dto/question/question.dto.shape";
import { QUESTION_STATUSES } from "@question/domain/value-objects/question-status/question-status.constants";
import { QUESTION_COGNITIVE_DIFFICULTIES } from "@question/domain/value-objects/question-cognitive-difficulty/question-cognitive-difficulty.constants";

import { createFakeQuestionThemeAssignmentDto } from "@faketories/contexts/question/dto/question/question-theme-assignment/question-theme-assignment.dto.faketory";
import { createFakeQuestionContentDto } from "@faketories/contexts/question/dto/question/question-content/question-content.dto.faketory";
import { createFakeQuestionAuthorDto } from "@faketories/contexts/question/dto/shared/question-author/question-author.dto.faketory";
import { createFakeQuestionRejectionDto } from "@faketories/contexts/question/dto/shared/question-rejection/question-rejection.dto.faketory";

function createFakeQuestionDto(questionDto: Partial<QuestionDto> = {}): QuestionDto {
  return {
    id: faker.database.mongodbObjectId(),
    themes: [createFakeQuestionThemeAssignmentDto()],
    content: createFakeQuestionContentDto(),
    cognitiveDifficulty: faker.helpers.arrayElement(QUESTION_COGNITIVE_DIFFICULTIES),
    author: createFakeQuestionAuthorDto(),
    status: faker.helpers.arrayElement(QUESTION_STATUSES),
    rejection: faker.datatype.boolean() ? createFakeQuestionRejectionDto() : undefined,
    sourceUrls: faker.helpers.uniqueArray(() => faker.internet.url(), 2),
    createdAt: faker.date.anytime().toISOString(),
    updatedAt: faker.date.anytime().toISOString(),
    ...questionDto,
  };
}

export {
  createFakeQuestionDto,
};