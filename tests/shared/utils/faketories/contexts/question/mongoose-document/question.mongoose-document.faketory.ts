import { faker } from "@faker-js/faker";

import { QUESTION_COGNITIVE_DIFFICULTIES } from "@question/domain/value-objects/question-cognitive-difficulty/question-cognitive-difficulty.constants";
import { QUESTION_STATUSES } from "@question/domain/value-objects/question-status/question-status.constants";

import type { QuestionMongooseDocumentStub, QuestionThemeAssignmentMongooseDocumentStub } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.types.mock";

import { createFakeQuestionAuthorAggregate, createFakeQuestionContentAggregate } from "@faketories/contexts/question/aggregate/question.aggregate.faketory";
import { createFakeQuestionAuthor, createFakeQuestionRejection } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";

function createFakeQuestionThemeAssignmentDocument(questionThemeAssignmentDocument: Partial<QuestionThemeAssignmentMongooseDocumentStub> = {}):
QuestionThemeAssignmentMongooseDocumentStub {
  return {
    themeId: createFakeObjectId(),
    isPrimary: faker.datatype.boolean(),
    isHint: faker.datatype.boolean(),
    ...questionThemeAssignmentDocument,
  };
}

function createFakeQuestionDocument(questionDocument: Partial<QuestionMongooseDocumentStub> = {}): QuestionMongooseDocumentStub {
  const documentId = questionDocument._id?.toString() ?? faker.database.mongodbObjectId();

  return {
    _id: createFakeObjectId(documentId),
    id: documentId,
    themes: [createFakeQuestionThemeAssignmentDocument()],
    content: createFakeQuestionContentAggregate(),
    cognitiveDifficulty: faker.helpers.arrayElement(QUESTION_COGNITIVE_DIFFICULTIES),
    author: createFakeQuestionAuthorAggregate(),
    status: faker.helpers.arrayElement(QUESTION_STATUSES),
    rejection: faker.datatype.boolean() ? createFakeQuestionRejection() : undefined,
    sourceUrls: faker.helpers.uniqueArray(() => faker.internet.url(), 2),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    ...questionDocument,
  };
}

export {
  createFakeQuestionThemeAssignmentDocument,
  createFakeQuestionDocument,
};