import { faker } from "@faker-js/faker";

import { QUESTION_THEME_STATUSES } from "@question/modules/question-theme/domain/value-objects/question-theme-status/question-theme-status.constants";

import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

const HEX_COLORS = ["#FF5733", "#33FF57", "#3357FF", "#FF33F5", "#33FFF5", "#F5FF33"];

function createFakeQuestionTheme(questionTheme: Partial<QuestionTheme> = {}): QuestionTheme {
  return {
    id: faker.database.mongodbObjectId(),
    slug: faker.lorem.slug(),
    label: createFakeLocalizedText(),
    aliases: createFakeLocalizedTexts(),
    description: createFakeLocalizedText(),
    color: faker.helpers.maybe(() => faker.helpers.arrayElement(HEX_COLORS), { probability: 0.7 }),
    status: faker.helpers.arrayElement(QUESTION_THEME_STATUSES),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    ...questionTheme,
  };
}

export { createFakeQuestionTheme };