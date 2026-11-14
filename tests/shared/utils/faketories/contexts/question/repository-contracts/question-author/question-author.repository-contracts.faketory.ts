import { faker } from "@faker-js/faker";

import { QUESTION_CREATION_AUTHOR_ROLES } from "@question/domain/constants/question.constants";

import type { QuestionAuthorCreationContract } from "@question/domain/repositories/question.repository-contracts.types";

function createFakeQuestionAuthorCreationContract(author: Partial<QuestionAuthorCreationContract> = {}): QuestionAuthorCreationContract {
  return {
    role: faker.helpers.arrayElement(QUESTION_CREATION_AUTHOR_ROLES),
    name: faker.internet.username(),
    ...author,
  };
}

export { createFakeQuestionAuthorCreationContract };