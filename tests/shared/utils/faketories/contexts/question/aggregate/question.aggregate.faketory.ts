import { faker } from "@faker-js/faker";

import { QUESTION_COGNITIVE_DIFFICULTIES } from "@question/domain/value-objects/question-cognitive-difficulty/question-cognitive-difficulty.constants";
import { QUESTION_STATUSES } from "@question/domain/value-objects/question-status/question-status.constants";

import { createFakeQuestionThemeDocument } from "@faketories/contexts/question/question-theme/mongoose-document/question-theme.mongoose-document.faketory";
import { createFakeQuestionAuthor, createFakeQuestionRejection } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

import type { QuestionAggregate, QuestionThemeAssignmentAggregate } from "@question/infrastructure/persistence/mongoose/types/question.mongoose.types";

function createFakeQuestionContentAggregate(questionContentAggregate: Partial<QuestionAggregate["content"]> = {}): QuestionAggregate["content"] {
  return {
    statement: createFakeLocalizedText(),
    answer: createFakeLocalizedText(),
    context: faker.datatype.boolean() ? createFakeLocalizedText() : undefined,
    trivia: faker.datatype.boolean() ? createFakeLocalizedTexts() : undefined,
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
    content: createFakeQuestionContentAggregate(),
    themes: [createFakeQuestionThemeAssignmentAggregate()],
    cognitiveDifficulty: faker.helpers.arrayElement(QUESTION_COGNITIVE_DIFFICULTIES),
    author: createFakeQuestionAuthor(),
    status: faker.helpers.arrayElement(QUESTION_STATUSES),
    sourceUrls: ["https://first-example.fr", "https://second-example.com"],
    rejection: faker.datatype.boolean() ? createFakeQuestionRejection() : undefined,
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    ...questionAggregate,
  };
}

export {
  createFakeQuestionContentAggregate,
  createFakeQuestionThemeAssignmentAggregate,
  createFakeQuestionAggregate,
};