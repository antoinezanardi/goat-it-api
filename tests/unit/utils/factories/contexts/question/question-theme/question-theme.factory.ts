import { faker } from "@faker-js/faker";
import { Types } from "mongoose";

import { QUESTION_THEME_STATUSES } from "@question/domain/value-objects/question-theme/question-theme-status.constants";

import { createFakeLocalizedText, createFakeLocalizedTexts } from "@factories/shared/locale/locale.factory";

import type { QuestionTheme } from "@question/domain/entities/question-theme/question-theme.types";
import type { QuestionThemeMongooseDocument } from "@question/infrastructure/persistence/mongoose/question-theme/types/question-theme.mongoose.types";

function createFakeQuestionTheme(questionTheme: Partial<QuestionTheme> = {}): QuestionTheme {
  return {
    id: faker.database.mongodbObjectId(),
    parentId: faker.datatype.boolean() ? faker.database.mongodbObjectId() : undefined,
    label: createFakeLocalizedText(),
    aliases: createFakeLocalizedTexts(),
    description: createFakeLocalizedText(),
    status: faker.helpers.arrayElement(QUESTION_THEME_STATUSES),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    ...questionTheme,
  };
}

function createFakeQuestionThemeDocument(questionThemeDocument: Partial<QuestionThemeMongooseDocument> = {}): QuestionThemeMongooseDocument {
  const documentId = questionThemeDocument._id?.toString() ?? faker.database.mongodbObjectId();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return {
    _id: new Types.ObjectId(documentId),
    id: documentId,
    parentId: faker.datatype.boolean() ? new Types.ObjectId(faker.database.mongodbObjectId()) : undefined,
    label: createFakeLocalizedText(),
    aliases: createFakeLocalizedTexts(),
    description: createFakeLocalizedText(),
    status: faker.helpers.arrayElement(QUESTION_THEME_STATUSES),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    ...questionThemeDocument,
  } as unknown as QuestionThemeMongooseDocument;
}

export {
  createFakeQuestionTheme,
  createFakeQuestionThemeDocument,
};