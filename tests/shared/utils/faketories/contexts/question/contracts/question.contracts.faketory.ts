import { faker } from "@faker-js/faker";

import type { QuestionCreationContract } from "@question/domain/types/question.contracts";
import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES, QUESTION_CREATION_STATUSES } from "@question/domain/constants/question.constants";

import { createFakeQuestionContentCreationContract } from "@faketories/contexts/question/contracts/question-content/question-content.contracts.faketory";
import { createFakeQuestionAuthorCreationContract } from "@faketories/contexts/question/contracts/question-author/question-author.contracts.faketory";
import { createFakeQuestionThemeAssignmentCreationContract } from "@faketories/contexts/question/contracts/question-theme-assignment/question-theme-assignment.contracts.faketory";

function createFakeQuestionCreationContract(contract: Partial<QuestionCreationContract> = {}): QuestionCreationContract {
  return {
    category: faker.helpers.arrayElement(QUESTION_CATEGORIES),
    themes: [createFakeQuestionThemeAssignmentCreationContract()],
    content: createFakeQuestionContentCreationContract(),
    cognitiveDifficulty: faker.helpers.arrayElement(QUESTION_COGNITIVE_DIFFICULTIES),
    author: createFakeQuestionAuthorCreationContract(),
    status: faker.helpers.arrayElement(QUESTION_CREATION_STATUSES),
    sourceUrls: new Set(faker.helpers.uniqueArray(() => faker.internet.url(), 2)),
    ...contract,
  };
}

export { createFakeQuestionCreationContract };