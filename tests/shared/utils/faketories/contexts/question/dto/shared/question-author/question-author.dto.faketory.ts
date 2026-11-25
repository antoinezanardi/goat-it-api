import { faker } from "@faker-js/faker";

import { QUESTION_AUTHOR_ROLES } from "@question/domain/constants/question.constants";

import type { QuestionAuthorDto } from "@question/application/dto/shared/question-author/question-author.dto.shape";

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
    name: faker.helpers.maybe(faker.internet.username),
    ...questionAuthorDto,
  };
}

export {
  createFakeQuestionAuthorDto,
};