import { faker } from "@faker-js/faker";
import { Types } from "mongoose";

import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme.dto";
import { QUESTION_THEME_STATUSES } from "@question/modules/question-theme/domain/value-objects/question-theme-status.constants";

import type { QuestionThemeMongooseDocumentStub } from "@mocks/contexts/question/modules/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.types.mock";

import { createFakeLocalizedText, createFakeLocalizedTexts } from "@factories/shared/locale/locale.factory";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

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

function createFakeQuestionThemeDto(questionThemeDto: Partial<QuestionThemeDto> = {}): QuestionThemeDto {
  return {
    id: faker.database.mongodbObjectId(),
    parentId: faker.datatype.boolean() ? faker.database.mongodbObjectId() : undefined,
    label: createFakeLocalizedText(),
    aliases: createFakeLocalizedTexts(),
    description: createFakeLocalizedText(),
    status: faker.helpers.arrayElement(QUESTION_THEME_STATUSES),
    updatedAt: faker.date.anytime().toISOString(),
    createdAt: faker.date.anytime().toISOString(),
    ...questionThemeDto,
  };
}

function createFakeQuestionThemeDocument(questionThemeDocument: Partial<QuestionThemeMongooseDocumentStub> = {}): QuestionThemeMongooseDocumentStub {
  const documentId = questionThemeDocument._id?.toString() ?? faker.database.mongodbObjectId();

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
  };
}

export {
  createFakeQuestionTheme,
  createFakeQuestionThemeDto,
  createFakeQuestionThemeDocument,
};