import { faker } from "@faker-js/faker";

import {
  QUESTION_AUTHOR_ROLES,
  QUESTION_CATEGORIES,
  QUESTION_COGNITIVE_DIFFICULTIES,
  QUESTION_REJECTION_TYPES,
  QUESTION_STATUSES,
} from "@question/domain/constants/question.constants";

import type { QuestionStats } from "@question/domain/types/question.types";

function createFakeCountsRecord<TKey extends string>(keys: readonly TKey[]): Record<TKey, number> {
  // Acceptable as builder pattern for typed records from const tuple arrays
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const counts = Object.fromEntries(keys.map(key => [key, faker.number.int({ min: 0, max: 20 })])) as Record<TKey, number>;

  return counts;
}

function createFakeQuestionStatsByStatus(): QuestionStats["byStatus"] {
  return createFakeCountsRecord(QUESTION_STATUSES);
}

function createFakeQuestionStatsByCategory(): QuestionStats["byCategory"] {
  return createFakeCountsRecord(QUESTION_CATEGORIES);
}

function createFakeQuestionStatsByCognitiveDifficulty(): QuestionStats["byCognitiveDifficulty"] {
  return createFakeCountsRecord(QUESTION_COGNITIVE_DIFFICULTIES);
}

function createFakeQuestionStatsByAuthorRole(): QuestionStats["byAuthorRole"] {
  return createFakeCountsRecord(QUESTION_AUTHOR_ROLES);
}

function createFakeQuestionStatsByRejectionType(): QuestionStats["byRejectionType"] {
  return createFakeCountsRecord(QUESTION_REJECTION_TYPES);
}

function createFakeQuestionStats(overrides: Partial<QuestionStats> = {}): QuestionStats {
  return {
    total: faker.number.int({ min: 0, max: 100 }),
    byStatus: createFakeQuestionStatsByStatus(),
    byCategory: createFakeQuestionStatsByCategory(),
    byCognitiveDifficulty: createFakeQuestionStatsByCognitiveDifficulty(),
    byAuthorRole: createFakeQuestionStatsByAuthorRole(),
    byRejectionType: createFakeQuestionStatsByRejectionType(),
    byTranslationCompleteness: {
      fullyTranslated: faker.number.int({ min: 0, max: 20 }),
      incomplete: faker.number.int({ min: 0, max: 20 }),
    },
    ...overrides,
  };
}

export {
  createFakeQuestionStats,
  createFakeQuestionStatsByStatus,
  createFakeQuestionStatsByCategory,
  createFakeQuestionStatsByCognitiveDifficulty,
  createFakeQuestionStatsByAuthorRole,
  createFakeQuestionStatsByRejectionType,
};