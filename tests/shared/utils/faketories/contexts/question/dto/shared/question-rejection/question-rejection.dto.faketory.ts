import { faker } from "@faker-js/faker";

import type { QuestionRejectionDto } from "@question/application/dto/shared/question-rejection/question-rejection.dto";
import { QUESTION_REJECTION_TYPES } from "@question/domain/value-objects/question-rejection/question-rejection.constants";

function createFakeQuestionRejectionDto(questionRejectionDto: Partial<QuestionRejectionDto> = {}): QuestionRejectionDto {
  return {
    type: faker.helpers.arrayElement(QUESTION_REJECTION_TYPES),
    comment: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
    ...questionRejectionDto,
  };
}

export {
  createFakeQuestionRejectionDto,
};