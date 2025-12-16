import { createTranslationFromLocalizedText, createTranslationsFromLocalizedTexts } from "@shared/application/mappers/localization/localization.mappers";

import type { AdminQuestionThemeDto } from "@question/modules/question-theme/application/dto/admin-question-theme/admin-question-theme.dto";
import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme/question-theme.dto";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";
import type { LocalizationOptions } from "@shared/domain/value-objects/locale/locale.types";

function createQuestionThemeDtoFromEntity(questionTheme: QuestionTheme, localizationOptions: LocalizationOptions): QuestionThemeDto {
  return {
    id: questionTheme.id,
    slug: questionTheme.slug,
    label: createTranslationFromLocalizedText(questionTheme.label, localizationOptions),
    aliases: createTranslationsFromLocalizedTexts(questionTheme.aliases, localizationOptions),
    description: createTranslationFromLocalizedText(questionTheme.description, localizationOptions),
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
    status: questionTheme.status,
    createdAt: questionTheme.createdAt.toISOString(),
    updatedAt: questionTheme.updatedAt.toISOString(),
  };
}

export {
  createQuestionThemeDtoFromEntity,
  createAdminQuestionThemeDtoFromEntity,
};