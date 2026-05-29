import { faker } from "@faker-js/faker";

import { QUESTION_THEME_STATUSES } from "@question-theme/domain/constants/question-theme.constants";

import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

import type { AdminQuestionThemeDto } from "@question-theme/application/dto/admin-question-theme/admin-question-theme.dto.shape";
import type { QuestionThemeCreationDto } from "@question-theme/application/dto/question-theme-creation/question-theme-creation.dto.shape";
import type { QuestionThemeModificationDto } from "@question-theme/application/dto/question-theme-modification/question-theme-modification.dto.shape";
import type { QuestionThemeDto } from "@question-theme/application/dto/question-theme/question-theme.dto.shape";

function createFakeQuestionThemeDto(questionThemeDto: Partial<QuestionThemeDto> = {}): QuestionThemeDto {
  return {
    id: faker.database.mongodbObjectId(),
    slug: faker.lorem.slug(),
    label: faker.word.sample(),
    aliases: [faker.word.sample(), faker.word.sample(), faker.word.sample()],
    description: faker.word.sample(),
    color: faker.helpers.maybe(() => faker.color.rgb({ casing: "upper" })),
    status: faker.helpers.arrayElement(["active", "archived"]),
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
    color: faker.helpers.maybe(() => faker.color.rgb({ casing: "upper" })),
    status: faker.helpers.arrayElement(QUESTION_THEME_STATUSES),
    updatedAt: faker.date.anytime().toISOString(),
    createdAt: faker.date.anytime().toISOString(),
    ...adminQuestionThemeDto,
  };
}

function createFakeQuestionThemeCreationDto(creationDto: Partial<QuestionThemeCreationDto> = {}): QuestionThemeCreationDto {
  return {
    slug: faker.lorem.slug(),
    label: createFakeLocalizedText(),
    aliases: createFakeLocalizedTexts(),
    description: createFakeLocalizedText(),
    color: faker.helpers.maybe(() => faker.color.rgb({ casing: "upper" })),
    ...creationDto,
  };
}

function createFakeQuestionThemeModificationDto(modificationDto: Partial<QuestionThemeModificationDto> = {}): QuestionThemeModificationDto {
  return {
    slug: faker.helpers.maybe(faker.lorem.slug),
    label: faker.helpers.maybe(createFakeLocalizedText),
    aliases: faker.helpers.maybe(createFakeLocalizedTexts),
    description: faker.helpers.maybe(createFakeLocalizedText),
    color: faker.helpers.maybe(() => faker.color.rgb({ casing: "upper" })),
    ...modificationDto,
  };
}

export {
  createFakeQuestionThemeDto,
  createFakeAdminQuestionThemeDto,
  createFakeQuestionThemeCreationDto,
  createFakeQuestionThemeModificationDto,
};