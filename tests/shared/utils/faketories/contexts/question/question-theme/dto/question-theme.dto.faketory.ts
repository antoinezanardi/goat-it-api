import { faker } from "@faker-js/faker";

import type { AdminQuestionThemeDto } from "@question/modules/question-theme/application/dto/admin-question-theme/admin-question-theme.dto.shape";
import type { QuestionThemeCreationDto } from "@question/modules/question-theme/application/dto/question-theme-creation/question-theme-creation.dto.shape";
import type { QuestionThemeModificationDto } from "@question/modules/question-theme/application/dto/question-theme-modification/question-theme-modification.dto.shape";
import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme/question-theme.dto.shape";
import { QUESTION_THEME_STATUSES } from "@question/modules/question-theme/domain/value-objects/question-theme-status/question-theme-status.constants";

import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

const HEX_COLORS = ["#FF5733", "#33FF57", "#3357FF", "#FF33F5", "#33FFF5", "#F5FF33"];

function createFakeQuestionThemeDto(questionThemeDto: Partial<QuestionThemeDto> = {}): QuestionThemeDto {
  return {
    id: faker.database.mongodbObjectId(),
    slug: faker.lorem.slug(),
    label: faker.word.sample(),
    aliases: [faker.word.sample(), faker.word.sample(), faker.word.sample()],
    description: faker.word.sample(),
    color: faker.helpers.maybe(() => faker.helpers.arrayElement(HEX_COLORS), { probability: 0.7 }),
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
    color: faker.helpers.maybe(() => faker.helpers.arrayElement(HEX_COLORS), { probability: 0.7 }),
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
    color: faker.helpers.maybe(() => faker.helpers.arrayElement(HEX_COLORS), { probability: 0.7 }),
    ...creationDto,
  };
}

function createFakeQuestionThemeModificationDto(modificationDto: Partial<QuestionThemeModificationDto> = {}): QuestionThemeModificationDto {
  return {
    slug: faker.datatype.boolean() ? faker.lorem.slug() : undefined,
    label: faker.datatype.boolean() ? createFakeLocalizedText() : undefined,
    aliases: faker.datatype.boolean() ? createFakeLocalizedTexts() : undefined,
    description: faker.datatype.boolean() ? createFakeLocalizedText() : undefined,
    color: faker.datatype.boolean() ? faker.helpers.maybe(() => faker.helpers.arrayElement(HEX_COLORS), { probability: 0.7 }) : undefined,
    ...modificationDto,
  };
}

export {
  createFakeQuestionThemeDto,
  createFakeAdminQuestionThemeDto,
  createFakeQuestionThemeCreationDto,
  createFakeQuestionThemeModificationDto,
};