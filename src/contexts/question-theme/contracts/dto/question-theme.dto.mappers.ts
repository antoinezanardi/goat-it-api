import { createTranslationFromLocalizedText, createTranslationsFromLocalizedTexts } from "@shared/application/mappers/localization/localization.mappers";

import type { AdminQuestionThemeDto } from "@question-theme/contracts/dto/admin-question-theme/admin-question-theme.dto.shape";
import type { QuestionThemeDto } from "@question-theme/contracts/dto/question-theme/question-theme.dto.shape";
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

export {
  createQuestionThemeDtoFromEntity,
  createAdminQuestionThemeDtoFromEntity,
};