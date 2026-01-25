import { faker } from "@faker-js/faker";

import type { QuestionAuthorCreationContract } from "@question/domain/contracts/question-author/question-author.contracts";
import { QUESTION_CREATION_AUTHOR_ROLES } from "@question/domain/value-objects/question-author/question-author.constants";

function createFakeQuestionAuthorCreationContract(author: Partial<QuestionAuthorCreationContract> = {}): QuestionAuthorCreationContract {
  return {
    role: faker.helpers.arrayElement(QUESTION_CREATION_AUTHOR_ROLES),
    name: faker.internet.username(),
    ...author,
  };
}

export { createFakeQuestionAuthorCreationContract };