import { faker } from "@faker-js/faker";

import { QUESTION_THEME_STATUSES } from "@question/modules/question-theme/domain/value-objects/question-theme-status.constants";

import type { QuestionThemeMongooseDocumentStub } from "@mocks/contexts/question/modules/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.types.mock";

import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

function createFakeQuestionThemeDocument(questionThemeDocument: Partial<QuestionThemeMongooseDocumentStub> = {}): QuestionThemeMongooseDocumentStub {
  const documentId = questionThemeDocument._id?.toString() ?? faker.database.mongodbObjectId();

  return {
    _id: createFakeObjectId(documentId),
    id: documentId,
    slug: faker.lorem.slug(),
    label: createFakeLocalizedText(),
    aliases: createFakeLocalizedTexts(),
    description: createFakeLocalizedText(),
    status: faker.helpers.arrayElement(QUESTION_THEME_STATUSES),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    ...questionThemeDocument,
  };
}

export { createFakeQuestionThemeDocument };