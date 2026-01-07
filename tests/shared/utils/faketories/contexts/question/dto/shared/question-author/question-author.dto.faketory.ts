import { faker } from "@faker-js/faker";

import type { QuestionAuthorDto } from "@question/application/dto/shared/question-author/question-author.dto";
import { QUESTION_AUTHOR_ROLES } from "@question/domain/value-objects/question-author/question-author.constants";

function createFakeQuestionAuthorDto(questionAuthorDto: Partial<QuestionAuthorDto> = {}): QuestionAuthorDto {
  const role = questionAuthorDto.role ?? faker.helpers.arrayElement(QUESTION_AUTHOR_ROLES);
  const { gameId } = questionAuthorDto;

  if (role === "game" && gameId === undefined) {
    questionAuthorDto.gameId = faker.database.mongodbObjectId();
  } else if (role !== "game" && gameId !== undefined) {
    delete questionAuthorDto.gameId;
  }
  return {
    role,
    name: faker.datatype.boolean() ? faker.internet.username() : undefined,
    ...questionAuthorDto,
  };
}

export {
  createFakeQuestionAuthorDto,
};