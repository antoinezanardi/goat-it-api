import { faker } from "@faker-js/faker";

import {
  QUESTION_AUTHOR_ROLES,
  QUESTION_CATEGORIES,
  QUESTION_COGNITIVE_DIFFICULTIES,
  QUESTION_REJECTION_TYPES,
  QUESTION_STATUSES,
} from "@question/domain/constants/question.constants";

import type { QuestionStatsDto } from "@question/application/dto/question-stats/question-stats.dto.shape";

function createFakeCountsRecord<TKey extends string>(keys: readonly TKey[]): Record<TKey, number> {
  // Acceptable as builder pattern for typed records from const tuple arrays
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const counts = Object.fromEntries(keys.map(key => [key, faker.number.int({ min: 0, max: 20 })])) as Record<TKey, number>;

  return counts;
}

function createFakeQuestionStatsDto(overrides: Partial<QuestionStatsDto> = {}): QuestionStatsDto {
  return {
    total: faker.number.int({ min: 0, max: 100 }),
    byStatus: createFakeCountsRecord(QUESTION_STATUSES),
    byCategory: createFakeCountsRecord(QUESTION_CATEGORIES),
    byCognitiveDifficulty: createFakeCountsRecord(QUESTION_COGNITIVE_DIFFICULTIES),
    byAuthorRole: createFakeCountsRecord(QUESTION_AUTHOR_ROLES),
    byRejectionType: createFakeCountsRecord(QUESTION_REJECTION_TYPES),
    byTranslationCompleteness: {
      fullyTranslated: faker.number.int({ min: 0, max: 20 }),
      incomplete: faker.number.int({ min: 0, max: 20 }),
    },
    ...overrides,
  };
}

export { createFakeQuestionStatsDto };