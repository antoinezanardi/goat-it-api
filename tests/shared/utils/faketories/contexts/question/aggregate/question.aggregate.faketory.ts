import { faker } from "@faker-js/faker";

import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES, QUESTION_STATUSES } from "@question/domain/constants/question.constants";

import { createFakeQuestionThemeDocument } from "@faketories/contexts/question-theme/mongoose/mongoose-document/question-theme.mongoose-document.faketory";
import { createFakeQuestionAuthor, createFakeQuestionRejection } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

import type { QuestionAggregate, QuestionThemeAssignmentAggregate } from "@question/infrastructure/persistence/mongoose/types/question.mongoose.types";

function createFakeQuestionAuthorAggregate(questionAuthorAggregate: Partial<QuestionAggregate["author"]> = {}): QuestionAggregate["author"] {
  const fakeQuestionAuthor = createFakeQuestionAuthor();

  return {
    ...fakeQuestionAuthor,
    gameId: "gameId" in fakeQuestionAuthor && fakeQuestionAuthor.gameId ? createFakeObjectId(fakeQuestionAuthor.gameId) : undefined,
    ...questionAuthorAggregate,
  };
}

function createFakeQuestionContentAggregate(questionContentAggregate: Partial<QuestionAggregate["content"]> = {}): QuestionAggregate["content"] {
  return {
    statement: createFakeLocalizedText(),
    answer: createFakeLocalizedText(),
    context: faker.helpers.maybe(createFakeLocalizedText),
    trivia: faker.helpers.maybe(createFakeLocalizedTexts),
    ...questionContentAggregate,
  };
}

function createFakeQuestionThemeAssignmentAggregate(questionThemeAssignmentAggregate: Partial<QuestionThemeAssignmentAggregate> = {}): QuestionThemeAssignmentAggregate {
  return {
    theme: createFakeQuestionThemeDocument(),
    isPrimary: faker.datatype.boolean(),
    isHint: faker.datatype.boolean(),
    ...questionThemeAssignmentAggregate,
  };
}

function createFakeQuestionAggregate(questionAggregate: Partial<QuestionAggregate> = {}): QuestionAggregate {
  return {
    _id: createFakeObjectId(),
    category: faker.helpers.arrayElement(QUESTION_CATEGORIES),
    content: createFakeQuestionContentAggregate(),
    themes: [createFakeQuestionThemeAssignmentAggregate()],
    cognitiveDifficulty: faker.helpers.arrayElement(QUESTION_COGNITIVE_DIFFICULTIES),
    author: createFakeQuestionAuthorAggregate(),
    status: faker.helpers.arrayElement(QUESTION_STATUSES),
    sourceUrls: faker.helpers.uniqueArray(() => faker.internet.url(), 2),
    applicableLocales: faker.helpers.maybe(() => faker.helpers.arrayElements(LOCALES, { min: 1, max: LOCALES.length })),
    rejection: faker.helpers.maybe(createFakeQuestionRejection),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    ...questionAggregate,
  };
}

export {
  createFakeQuestionAuthorAggregate,
  createFakeQuestionContentAggregate,
  createFakeQuestionThemeAssignmentAggregate,
  createFakeQuestionAggregate,
};