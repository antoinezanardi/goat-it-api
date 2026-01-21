import { faker } from "@faker-js/faker";

import type { QuestionAuthorCreationDto } from "@question/application/dto/question-creation/question-author-creation/question-author-creation.dto";
import { QUESTION_AUTHOR_CREATION_ROLES } from "@question/domain/value-objects/question-author/question-author.constants";

function createFakeQuestionAuthorCreationDto(creationDto: Partial<QuestionAuthorCreationDto> = {}): QuestionAuthorCreationDto {
  return {
    role: faker.helpers.arrayElement(QUESTION_AUTHOR_CREATION_ROLES),
    name: faker.internet.username(),
    ...creationDto,
  };
}

export { createFakeQuestionAuthorCreationDto };