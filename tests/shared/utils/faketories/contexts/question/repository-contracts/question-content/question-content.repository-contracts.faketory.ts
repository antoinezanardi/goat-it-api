import { faker } from "@faker-js/faker";

import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

import type { QuestionContentCreationContract } from "@question/domain/repositories/question.repository-contracts.types";

function createFakeQuestionContentCreationContract(content: Partial<QuestionContentCreationContract> = {}): QuestionContentCreationContract {
  return {
    statement: createFakeLocalizedText(),
    answer: createFakeLocalizedText(),
    context: faker.helpers.maybe(createFakeLocalizedText),
    trivia: faker.helpers.maybe(createFakeLocalizedTexts),
    ...content,
  };
}

export { createFakeQuestionContentCreationContract };