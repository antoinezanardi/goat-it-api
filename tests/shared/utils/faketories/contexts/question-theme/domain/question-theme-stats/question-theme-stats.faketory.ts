import { faker } from "@faker-js/faker";

import { DEFAULT_QUESTION_THEME_STATUS, QUESTION_THEME_STATUS_ARCHIVED } from "@question-theme/domain/constants/question-theme.constants";

import type { ThemeActiveQuestionCount, QuestionThemeStats } from "@question-theme/domain/types/question-theme.types";

function createFakeThemeActiveQuestionCount(overrides: Partial<ThemeActiveQuestionCount> = {}): ThemeActiveQuestionCount {
  return {
    themeId: faker.database.mongodbObjectId(),
    themeSlug: faker.lorem.slug(),
    activeQuestionCount: faker.number.int({ min: 0, max: 50 }),
    ...overrides,
  };
}

function createFakeQuestionThemeStats(overrides: Partial<QuestionThemeStats> = {}): QuestionThemeStats {
  return {
    total: faker.number.int({ min: 0, max: 50 }),
    byStatus: {
      [DEFAULT_QUESTION_THEME_STATUS]: faker.number.int({ min: 0, max: 30 }),
      [QUESTION_THEME_STATUS_ARCHIVED]: faker.number.int({ min: 0, max: 30 }),
    },
    byQuestionCount: faker.helpers.multiple(() => createFakeThemeActiveQuestionCount(), { count: { min: 0, max: 5 } }),
    ...overrides,
  };
}

export { createFakeThemeActiveQuestionCount, createFakeQuestionThemeStats };