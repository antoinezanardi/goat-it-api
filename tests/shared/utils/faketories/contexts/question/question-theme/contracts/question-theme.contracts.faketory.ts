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
    slug: faker.datatype.boolean() ? faker.lorem.slug() : undefined,
    label: faker.datatype.boolean() ? createFakeLocalizedText() : undefined,
    aliases: faker.datatype.boolean() ? createFakeLocalizedTexts() : undefined,
    description: faker.datatype.boolean() ? createFakeLocalizedText() : undefined,
    ...questionThemeModificationContract,
  };
}

export {
  createFakeQuestionThemeCreationContract,
  createFakeQuestionThemeModificationContract,
};