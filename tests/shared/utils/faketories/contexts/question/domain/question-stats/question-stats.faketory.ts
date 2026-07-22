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

import type { QuestionStats } from "@question/domain/types/question.types";

function createFakeByStatus(): QuestionStats["byStatus"] {
  return {
    [QUESTION_STATUS_PENDING]: faker.number.int({ min: 0, max: 20 }),
    [QUESTION_STATUS_ACTIVE]: faker.number.int({ min: 0, max: 20 }),
    [QUESTION_STATUS_ARCHIVED]: faker.number.int({ min: 0, max: 20 }),
    [QUESTION_STATUS_REJECTED]: faker.number.int({ min: 0, max: 20 }),
  };
}

function createFakeByCategory(): QuestionStats["byCategory"] {
  return {
    trivia: faker.number.int({ min: 0, max: 20 }),
    lexicon: faker.number.int({ min: 0, max: 20 }),
    riddle: faker.number.int({ min: 0, max: 20 }),
    explanation: faker.number.int({ min: 0, max: 20 }),
  };
}

function createFakeByCognitiveDifficulty(): QuestionStats["byCognitiveDifficulty"] {
  return {
    easy: faker.number.int({ min: 0, max: 20 }),
    medium: faker.number.int({ min: 0, max: 20 }),
    hard: faker.number.int({ min: 0, max: 20 }),
  };
}

function createFakeByAuthorRole(): QuestionStats["byAuthorRole"] {
  return {
    [QUESTION_AUTHOR_ROLE_ADMIN]: faker.number.int({ min: 0, max: 20 }),
    [QUESTION_AUTHOR_ROLE_GAME]: faker.number.int({ min: 0, max: 20 }),
    [QUESTION_AUTHOR_ROLE_AI]: faker.number.int({ min: 0, max: 20 }),
  };
}

function createFakeByRejectionType(): QuestionStats["byRejectionType"] {
  return {
    "inappropriate-content": faker.number.int({ min: 0, max: 20 }),
    "incorrect-information": faker.number.int({ min: 0, max: 20 }),
    "poor-quality": faker.number.int({ min: 0, max: 20 }),
    "duplicate-question": faker.number.int({ min: 0, max: 20 }),
    "other": faker.number.int({ min: 0, max: 20 }),
  };
}

function createFakeQuestionStats(overrides: Partial<QuestionStats> = {}): QuestionStats {
  return {
    total: faker.number.int({ min: 0, max: 100 }),
    byStatus: createFakeByStatus(),
    byCategory: createFakeByCategory(),
    byCognitiveDifficulty: createFakeByCognitiveDifficulty(),
    byAuthorRole: createFakeByAuthorRole(),
    byRejectionType: createFakeByRejectionType(),
    ...overrides,
  };
}

export {
  createFakeQuestionStats,
  createFakeByStatus,
  createFakeByCategory,
  createFakeByCognitiveDifficulty,
  createFakeByAuthorRole,
  createFakeByRejectionType,
};