import { faker } from "@faker-js/faker";

import type { AdminQuestionThemeDto } from "@question/modules/question-theme/application/dto/admin-question-theme/admin-question-theme.dto";
import type { CreateQuestionThemeDto } from "@question/modules/question-theme/application/dto/create-question-theme/create-question-theme.dto";
import type { PatchQuestionThemeDto } from "@question/modules/question-theme/application/dto/patch-question-theme/patch-question-theme.dto";
import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme/question-theme.dto";
import { QUESTION_THEME_STATUSES } from "@question/modules/question-theme/domain/value-objects/question-theme-status.constants";

import type { QuestionThemeMongooseDocumentStub } from "@mocks/contexts/question/modules/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.types.mock";

import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

import type { QuestionTheme, QuestionThemeDraft } from "@question/modules/question-theme/domain/entities/question-theme.types";

function createFakeQuestionTheme(questionTheme: Partial<QuestionTheme> = {}): QuestionTheme {
  return {
    id: faker.database.mongodbObjectId(),
    slug: faker.lorem.slug(),
    label: createFakeLocalizedText(),
    aliases: createFakeLocalizedTexts(),
    description: createFakeLocalizedText(),
    status: faker.helpers.arrayElement(QUESTION_THEME_STATUSES),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    ...questionTheme,
  };
}

function createFakeQuestionThemeDraft(questionThemeDraft: Partial<QuestionThemeDraft> = {}): QuestionThemeDraft {
  return {
    slug: faker.lorem.slug(),
    label: createFakeLocalizedText(),
    aliases: createFakeLocalizedTexts(),
    description: createFakeLocalizedText(),
    status: "active",
    ...questionThemeDraft,
  };
}

function createFakeQuestionThemeDto(questionThemeDto: Partial<QuestionThemeDto> = {}): QuestionThemeDto {
  return {
    id: faker.database.mongodbObjectId(),
    slug: faker.lorem.slug(),
    label: faker.word.sample(),
    aliases: [faker.word.sample(), faker.word.sample(), faker.word.sample()],
    description: faker.word.sample(),
    status: faker.helpers.arrayElement(QUESTION_THEME_STATUSES),
    updatedAt: faker.date.anytime().toISOString(),
    createdAt: faker.date.anytime().toISOString(),
    ...questionThemeDto,
  };
}

function createFakeAdminQuestionThemeDto(adminQuestionThemeDto: Partial<AdminQuestionThemeDto> = {}): AdminQuestionThemeDto {
  return {
    id: faker.database.mongodbObjectId(),
    slug: faker.lorem.slug(),
    label: createFakeLocalizedText(),
    aliases: createFakeLocalizedTexts(),
    description: createFakeLocalizedText(),
    status: faker.helpers.arrayElement(QUESTION_THEME_STATUSES),
    updatedAt: faker.date.anytime().toISOString(),
    createdAt: faker.date.anytime().toISOString(),
    ...adminQuestionThemeDto,
  };
}

function createFakeCreateQuestionThemeDto(createDto: Partial<CreateQuestionThemeDto> = {}): CreateQuestionThemeDto {
  return {
    slug: faker.lorem.slug(),
    label: createFakeLocalizedText(),
    aliases: createFakeLocalizedTexts(),
    description: createFakeLocalizedText(),
    ...createDto,
  };
}

function createFakePatchQuestionThemeDto(patchDto: Partial<PatchQuestionThemeDto> = {}): PatchQuestionThemeDto {
  return {
    slug: faker.datatype.boolean() ? faker.lorem.slug() : undefined,
    label: faker.datatype.boolean() ? createFakeLocalizedText() : undefined,
    aliases: faker.datatype.boolean() ? createFakeLocalizedTexts() : undefined,
    description: faker.datatype.boolean() ? createFakeLocalizedText() : undefined,
    ...patchDto,
  };
}

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

export {
  createFakeQuestionTheme,
  createFakeQuestionThemeDraft,
  createFakeQuestionThemeDto,
  createFakeAdminQuestionThemeDto,
  createFakeCreateQuestionThemeDto,
  createFakePatchQuestionThemeDto,
  createFakeQuestionThemeDocument,
};