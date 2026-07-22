import { faker } from "@faker-js/faker";

import {
  QUESTION_AUTHOR_ROLE_ADMIN,
  QUESTION_AUTHOR_ROLE_AI,
  QUESTION_AUTHOR_ROLE_GAME,
  QUESTION_STATUS_ACTIVE,
  QUESTION_STATUS_ARCHIVED,
  QUESTION_STATUS_PENDING,
  QUESTION_STATUS_REJECTED,
} from "@question/domain/constants/question.constants";
import type { QuestionStatsDto } from "@question/application/dto/question-stats/question-stats.dto.shape";

const fakeCount = (max = 20): number => faker.number.int({ min: 0, max });

function createFakeQuestionStatsDto(overrides: Partial<QuestionStatsDto> = {}): QuestionStatsDto {
  return {
    total: fakeCount(100),
    byStatus: {
      [QUESTION_STATUS_PENDING]: fakeCount(),
      [QUESTION_STATUS_ACTIVE]: fakeCount(),
      [QUESTION_STATUS_ARCHIVED]: fakeCount(),
      [QUESTION_STATUS_REJECTED]: fakeCount(),
    },
    byCategory: {
      trivia: fakeCount(),
      lexicon: fakeCount(),
      riddle: fakeCount(),
      explanation: fakeCount(),
    },
    byCognitiveDifficulty: {
      easy: fakeCount(),
      medium: fakeCount(),
      hard: fakeCount(),
    },
    byAuthorRole: {
      [QUESTION_AUTHOR_ROLE_ADMIN]: fakeCount(),
      [QUESTION_AUTHOR_ROLE_GAME]: fakeCount(),
      [QUESTION_AUTHOR_ROLE_AI]: fakeCount(),
    },
    byRejectionType: {
      "inappropriate-content": fakeCount(),
      "incorrect-information": fakeCount(),
      "poor-quality": fakeCount(),
      "duplicate-question": fakeCount(),
      "other": fakeCount(),
    },
    ...overrides,
  };
}

export { createFakeQuestionStatsDto };