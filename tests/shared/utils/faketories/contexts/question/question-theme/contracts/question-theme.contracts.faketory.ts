import { faker } from "@faker-js/faker";

import type { QuestionThemeCreationContract, QuestionThemeModificationContract } from "@question/modules/question-theme/domain/contracts/question-theme.contracts";

import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

function createFakeQuestionThemeCreationContract(questionThemeCreationContract: Partial<QuestionThemeCreationContract> = {}): QuestionThemeCreationContract {
  return {
    slug: faker.lorem.slug(),
    label: createFakeLocalizedText(),
    aliases: createFakeLocalizedTexts(),
    description: createFakeLocalizedText(),
    status: "active",
    ...questionThemeCreationContract,
  };
}

function createFakeQuestionThemeModificationContract(questionThemeModificationContract: Partial<QuestionThemeModificationContract> = {}): QuestionThemeModificationContract {
  return {
    slug: faker.helpers.maybe(faker.lorem.slug),
    label: faker.helpers.maybe(createFakeLocalizedText),
    aliases: faker.helpers.maybe(createFakeLocalizedTexts),
    description: faker.helpers.maybe(createFakeLocalizedText),
    ...questionThemeModificationContract,
  };
}

export {
  createFakeQuestionThemeCreationContract,
  createFakeQuestionThemeModificationContract,
};