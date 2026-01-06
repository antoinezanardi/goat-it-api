import { faker } from "@faker-js/faker";

import type { QuestionAuthorDto } from "@question/application/dto/shared/question-author/question-author.dto";
import { QUESTION_AUTHOR_ROLES } from "@question/domain/value-objects/question-author/question-author.constants";

function createFakeQuestionAuthorDto(questionAuthorDto: Partial<QuestionAuthorDto> = {}): QuestionAuthorDto {
  return {
    type: faker.helpers.arrayElement(QUESTION_AUTHOR_ROLES),
    gameId: faker.datatype.boolean() ? faker.database.mongodbObjectId() : undefined,
    name: faker.datatype.boolean() ? faker.internet.username() : undefined,
    ...questionAuthorDto,
  };
}

export {
  createFakeQuestionAuthorDto,
};