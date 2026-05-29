import { faker } from "@faker-js/faker";

import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

import type { QuestionThemeCreationContract, QuestionThemeModificationContract } from "@question-theme/domain/types/question-theme.contracts";

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