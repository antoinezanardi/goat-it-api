import { faker } from "@faker-js/faker";

import { QUESTION_AUTHOR_ROLES, QUESTION_COGNITIVE_DIFFICULTIES, QUESTION_CATEGORIES, QUESTION_REJECTION_TYPES, QUESTION_STATUSES } from "@question/domain/constants/question.constants";
import type { Question } from "@question/domain/types/question.entities";
import type { QuestionAuthor, QuestionContent, QuestionRejection, QuestionThemeAssignment } from "@question/domain/types/question.value-objects";

import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";
import { createFakeQuestionTheme } from "@faketories/contexts/question-theme/entity/question-theme.entity.faketory";

function createFakeQuestionThemeAssignment(questionThemeAssignment: Partial<QuestionThemeAssignment> = {}): QuestionThemeAssignment {
  return {
    theme: createFakeQuestionTheme(),
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
  const providedGameId = "gameId" in questionAuthor ? questionAuthor.gameId : undefined;
  const fakeName = faker.helpers.maybe(faker.person.fullName);

  if (role === "game") {
    return {
      role,
      gameId: providedGameId ?? faker.database.mongodbObjectId(),
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
    comment: faker.helpers.maybe(faker.lorem.sentence),
    ...questionRejection,
  };
}

function createFakeQuestion(question: Partial<Question> = {}): Question {
  return {
    id: faker.database.mongodbObjectId(),
    category: faker.helpers.arrayElement(QUESTION_CATEGORIES),
    themes: [createFakeQuestionThemeAssignment(), createFakeQuestionThemeAssignment()],
    content: createFakeQuestionContent(),
    cognitiveDifficulty: faker.helpers.arrayElement(QUESTION_COGNITIVE_DIFFICULTIES),
    author: createFakeQuestionAuthor(),
    status: faker.helpers.arrayElement(QUESTION_STATUSES),
    rejection: faker.helpers.maybe(createFakeQuestionRejection),
    sourceUrls: new Set(faker.helpers.uniqueArray(() => faker.internet.url(), 2)),
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