import { faker } from "@faker-js/faker";

import type { QuestionContentCreationContract } from "@question/domain/contracts/question-content/question-content.contracts";

import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

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