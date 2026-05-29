import { createTranslationFromLocalizedText, createTranslationsFromLocalizedTexts } from "@shared/application/mappers/localization/localization.mappers";

import type { AdminQuestionThemeDto } from "@question-theme/application/dto/admin-question-theme/admin-question-theme.dto.shape";
import type { QuestionThemeDto } from "@question-theme/application/dto/question-theme/question-theme.dto.shape";
import type { QuestionThemeCreationDto } from "@question-theme/application/dto/question-theme-creation/question-theme-creation.dto.shape";
import type { QuestionThemeModificationDto } from "@question-theme/application/dto/question-theme-modification/question-theme-modification.dto.shape";
import type { QuestionThemeCreationCommand, QuestionThemeModificationCommand } from "@question-theme/domain/types/question-theme.commands";
import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

import type { LocalizationOptions } from "@shared/domain/value-objects/locale/locale.types";

function createQuestionThemeDtoFromEntity(questionTheme: QuestionTheme, localizationOptions: LocalizationOptions): QuestionThemeDto {
  return {
    id: questionTheme.id,
    slug: questionTheme.slug,
    label: createTranslationFromLocalizedText(questionTheme.label, localizationOptions),
    aliases: createTranslationsFromLocalizedTexts(questionTheme.aliases, localizationOptions),
    description: createTranslationFromLocalizedText(questionTheme.description, localizationOptions),
    color: questionTheme.color,
    status: questionTheme.status,
    createdAt: questionTheme.createdAt.toISOString(),
    updatedAt: questionTheme.updatedAt.toISOString(),
  };
}

function createAdminQuestionThemeDtoFromEntity(questionTheme: QuestionTheme): AdminQuestionThemeDto {
  return {
    id: questionTheme.id,
    slug: questionTheme.slug,
    label: questionTheme.label,
    aliases: questionTheme.aliases,
    description: questionTheme.description,
    color: questionTheme.color,
    status: questionTheme.status,
    createdAt: questionTheme.createdAt.toISOString(),
    updatedAt: questionTheme.updatedAt.toISOString(),
  };
}

function createQuestionThemeCreationCommandFromDto(questionThemeCreationDto: QuestionThemeCreationDto): QuestionThemeCreationCommand {
  return {
    payload: {
      slug: questionThemeCreationDto.slug,
      label: questionThemeCreationDto.label,
      aliases: questionThemeCreationDto.aliases,
      description: questionThemeCreationDto.description,
      color: questionThemeCreationDto.color,
      status: "active",
    },
  };
}

function createQuestionThemeModificationCommandFromDto(questionThemeId: string, questionThemeModificationDto: QuestionThemeModificationDto): QuestionThemeModificationCommand {
  return {
    questionThemeId,
    payload: {
      slug: questionThemeModificationDto.slug,
      label: questionThemeModificationDto.label,
      aliases: questionThemeModificationDto.aliases,
      description: questionThemeModificationDto.description,
      color: questionThemeModificationDto.color,
    },
  };
}

export {
  createQuestionThemeDtoFromEntity,
  createAdminQuestionThemeDtoFromEntity,
  createQuestionThemeCreationCommandFromDto,
  createQuestionThemeModificationCommandFromDto,
};