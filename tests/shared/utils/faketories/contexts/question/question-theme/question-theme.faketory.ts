import { faker } from "@faker-js/faker";

import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme.dto";
import { QUESTION_THEME_STATUSES } from "@question/modules/question-theme/domain/value-objects/question-theme-status.constants";

import type { QuestionThemeMongooseDocumentStub } from "@mocks/contexts/question/modules/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.types.mock";

import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

function createFakeQuestionTheme(questionTheme: Partial<QuestionTheme> = {}): QuestionTheme {
  return {
    id: faker.database.mongodbObjectId(),
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
    label: faker.word.sample(),
    aliases: [faker.word.sample(), faker.word.sample(), faker.word.sample()],
    description: faker.word.sample(),
    status: faker.helpers.arrayElement(QUESTION_THEME_STATUSES),
    updatedAt: faker.date.anytime().toISOString(),
    createdAt: faker.date.anytime().toISOString(),
    ...questionThemeDto,
  };
}

function createFakeQuestionThemeDocument(questionThemeDocument: Partial<QuestionThemeMongooseDocumentStub> = {}): QuestionThemeMongooseDocumentStub {
  const documentId = questionThemeDocument._id?.toString() ?? faker.database.mongodbObjectId();

  return {
    _id: createFakeObjectId(documentId),
    id: documentId,
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