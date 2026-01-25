import { faker } from "@faker-js/faker";

import { QUESTION_COGNITIVE_DIFFICULTIES } from "@question/domain/value-objects/question-cognitive-difficulty/question-cognitive-difficulty.constants";
import { QUESTION_STATUSES } from "@question/domain/value-objects/question-status/question-status.constants";

import { createFakeQuestionAuthorAggregate, createFakeQuestionContentAggregate } from "@faketories/contexts/question/aggregate/question.aggregate.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";

import type { QuestionMongooseInsertPayload, QuestionThemeAssignmentMongooseInsertPayload } from "@question/infrastructure/persistence/mongoose/types/question.mongoose.types";

function createFakeQuestionThemeAssignmentMongooseInsertPayload(override: Partial<QuestionThemeAssignmentMongooseInsertPayload> = {}):
QuestionThemeAssignmentMongooseInsertPayload {
  return {
    themeId: override.themeId ?? createFakeObjectId(),
    isPrimary: override.isPrimary ?? faker.datatype.boolean(),
    isHint: override.isHint ?? faker.datatype.boolean(),
    ...override,
  };
}

function createFakeQuestionMongooseInsertPayload(override: Partial<QuestionMongooseInsertPayload> = {}): QuestionMongooseInsertPayload {
  return {
    themes: [createFakeQuestionThemeAssignmentMongooseInsertPayload()],
    content: createFakeQuestionContentAggregate(),
    cognitiveDifficulty: faker.helpers.arrayElement(QUESTION_COGNITIVE_DIFFICULTIES),
    author: createFakeQuestionAuthorAggregate(),
    status: faker.helpers.arrayElement(QUESTION_STATUSES),
    sourceUrls: faker.helpers.uniqueArray(() => faker.internet.url(), 2),
    ...override,
  };
}

export {
  createFakeQuestionThemeAssignmentMongooseInsertPayload,
  createFakeQuestionMongooseInsertPayload,
};