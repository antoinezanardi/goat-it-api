import { faker } from "@faker-js/faker";

import type { QuestionAuthorCreationDto } from "@question/application/dto/question-creation/question-author-creation/question-author-creation.dto.shape";
import { QUESTION_CREATION_AUTHOR_ROLES } from "@question/domain/value-objects/question-author/question-author.constants";

function createFakeQuestionAuthorCreationDto(creationDto: Partial<QuestionAuthorCreationDto> = {}): QuestionAuthorCreationDto {
  return {
    role: faker.helpers.arrayElement(QUESTION_CREATION_AUTHOR_ROLES),
    name: faker.internet.username(),
    ...creationDto,
  };
}

export { createFakeQuestionAuthorCreationDto };