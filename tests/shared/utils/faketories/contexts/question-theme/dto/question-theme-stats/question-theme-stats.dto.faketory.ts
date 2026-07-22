import { faker } from "@faker-js/faker";

import { DEFAULT_QUESTION_THEME_STATUS, QUESTION_THEME_STATUS_ARCHIVED } from "@question-theme/domain/constants/question-theme.constants";

import type { QuestionThemeStatsDto } from "@question-theme/application/dto/question-theme-stats/question-theme-stats.dto.shape";

function createFakeQuestionThemeStatsDto(overrides: Partial<QuestionThemeStatsDto> = {}): QuestionThemeStatsDto {
  return {
    total: faker.number.int({ min: 0, max: 50 }),
    byStatus: {
      [DEFAULT_QUESTION_THEME_STATUS]: faker.number.int({ min: 0, max: 30 }),
      [QUESTION_THEME_STATUS_ARCHIVED]: faker.number.int({ min: 0, max: 30 }),
    },
    byQuestionCount: faker.helpers.multiple(
      () => ({
        themeId: faker.database.mongodbObjectId(),
        themeSlug: faker.lorem.slug(),
        activeQuestionCount: faker.number.int({ min: 0, max: 50 }),
      }),
      { count: { min: 0, max: 5 } },
    ),
    ...overrides,
  };
}

export { createFakeQuestionThemeStatsDto };