import { faker } from "@faker-js/faker";

import { QUESTION_AUTHOR_ROLES } from "@question/domain/value-objects/question-author/question-author.constants";
import { QUESTION_COGNITIVE_DIFFICULTIES } from "@question/domain/value-objects/question-cognitive-difficulty/question-cognitive-difficulty.constants";
import { QUESTION_REJECTION_TYPES } from "@question/domain/value-objects/question-rejection/question-rejection.constants";
import { QUESTION_STATUSES } from "@question/domain/value-objects/question-status/question-status.constants";

import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

import type { Question } from "@question/domain/entities/question.types";
import type { QuestionAuthor } from "@question/domain/value-objects/question-author/question-author.types";
import type { QuestionContent } from "@question/domain/value-objects/question-content/question-content.types";
import type { QuestionRejection } from "@question/domain/value-objects/question-rejection/question-rejection.types";
import type { QuestionThemeAssignment } from "@question/domain/value-objects/question-theme-assignment/question-theme-assignment.types";

function createFakeQuestionThemeAssignment(questionThemeAssignment: Partial<QuestionThemeAssignment> = {}): QuestionThemeAssignment {
  return {
    questionTheme: createFakeQuestionTheme(),
    isPrimary: faker.datatype.boolean(),
    isHint: faker.datatype.boolean(),
    ...questionThemeAssignment,
  };
}

function createFakeQuestionContent(questionContent: Partial<QuestionContent> = {}): QuestionContent {
  return {
    statement: createFakeLocalizedText(),
    answer: createFakeLocalizedText(),
    context: createFakeLocalizedText(),
    trivia: createFakeLocalizedTexts(),
    ...questionContent,
  };
}

function createFakeQuestionAuthor(questionAuthor: Partial<QuestionAuthor> = {}): QuestionAuthor {
  const role = questionAuthor.role ?? faker.helpers.arrayElement(QUESTION_AUTHOR_ROLES);
  const providedName = questionAuthor.name;
  const providedGameId = (questionAuthor as Partial<QuestionAuthor> & { gameId?: string }).gameId;
  const fakeName = faker.datatype.boolean() ? faker.person.fullName() : undefined;

  if (role === "game") {
    return {
      role,
      gameId: providedGameId ?? faker.string.uuid(),
      name: providedName ?? fakeName,
    };
  }
  return {
    role,
    name: providedName ?? fakeName,
  };
}

function createFakeQuestionRejection(questionRejection: Partial<QuestionRejection> = {}): QuestionRejection {
  return {
    type: faker.helpers.arrayElement(QUESTION_REJECTION_TYPES),
    comment: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
    ...questionRejection,
  };
}

function createFakeQuestion(question: Partial<Question> = {}): Question {
  return {
    id: faker.string.uuid(),
    themes: [createFakeQuestionThemeAssignment(), createFakeQuestionThemeAssignment()],
    content: createFakeQuestionContent(),
    cognitiveDifficulty: faker.helpers.arrayElement(QUESTION_COGNITIVE_DIFFICULTIES),
    author: createFakeQuestionAuthor(),
    status: faker.helpers.arrayElement(QUESTION_STATUSES),
    rejection: faker.datatype.boolean() ? createFakeQuestionRejection() : undefined,
    sourceUrls: [faker.internet.url(), faker.internet.url()],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...question,
  };
}

export {
  createFakeQuestionThemeAssignment,
  createFakeQuestionContent,
  createFakeQuestionAuthor,
  createFakeQuestionRejection,
  createFakeQuestion,
};