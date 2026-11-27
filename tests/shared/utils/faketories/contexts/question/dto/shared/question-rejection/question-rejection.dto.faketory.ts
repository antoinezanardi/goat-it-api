import { faker } from "@faker-js/faker";

import { QUESTION_REJECTION_TYPES } from "@question/domain/constants/question.constants";

import type { QuestionRejectionDto } from "@question/application/dto/shared/question-rejection/question-rejection.dto.shape";

function createFakeQuestionRejectionDto(questionRejectionDto: Partial<QuestionRejectionDto> = {}): QuestionRejectionDto {
  return {
    type: faker.helpers.arrayElement(QUESTION_REJECTION_TYPES),
    comment: faker.helpers.maybe(faker.lorem.sentence),
    ...questionRejectionDto,
  };
}

export {
  createFakeQuestionRejectionDto,
};