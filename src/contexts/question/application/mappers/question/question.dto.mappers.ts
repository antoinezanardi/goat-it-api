import { createTranslationFromLocalizedText, createTranslationsFromLocalizedTexts } from "@shared/application/mappers/localization/localization.mappers";

import type { AdminQuestionThemeAssignmentDto } from "@question/application/dto/admin-question/admin-question-theme-assignment/admin-question-theme-assignment.dto.shape";
import type { AdminQuestionDto } from "@question/application/dto/admin-question/admin-question.dto.shape";
import { createAdminQuestionThemeDtoFromEntity, createQuestionThemeDtoFromEntity } from "@question/modules/question-theme/application/mappers/question-theme/question-theme.dto.mappers";
import type { QuestionThemeAssignmentDto } from "@question/application/dto/question/question-theme-assignment/question-theme-assignment.dto.shape";
import type { QuestionContentDto } from "@question/application/dto/question/question-content/question-content.dto.shape";
import type { QuestionDto } from "@question/application/dto/question/question.dto.shape";

import type { QuestionThemeAssignment } from "@question/domain/value-objects/question-theme-assignment/question-theme-assignment.types";
import type { Question } from "@question/domain/entities/question.types";
import type { QuestionContent } from "@question/domain/value-objects/question-content/question-content.types";
import type { LocalizationOptions } from "@shared/domain/value-objects/locale/locale.types";

function createQuestionContentDtoFromEntity(questionContent: QuestionContent, localizationOptions: LocalizationOptions): QuestionContentDto {
  const context = questionContent.context ? createTranslationFromLocalizedText(questionContent.context, localizationOptions) : undefined;
  const trivia = questionContent.trivia ? createTranslationsFromLocalizedTexts(questionContent.trivia, localizationOptions) : undefined;

  return {
    statement: createTranslationFromLocalizedText(questionContent.statement, localizationOptions),
    answer: createTranslationFromLocalizedText(questionContent.answer, localizationOptions),
    context,
    trivia,
  };
}

function createQuestionThemeAssignmentDtoFromEntity(questionThemeAssignment: QuestionThemeAssignment, localizationOptions: LocalizationOptions): QuestionThemeAssignmentDto {
  return {
    theme: createQuestionThemeDtoFromEntity(questionThemeAssignment.theme, localizationOptions),
    isPrimary: questionThemeAssignment.isPrimary,
    isHint: questionThemeAssignment.isHint,
  };
}

function createQuestionDtoFromEntity(question: Question, localizationOptions: LocalizationOptions): QuestionDto {
  return {
    id: question.id,
    themes: question.themes.map(themeAssignment => createQuestionThemeAssignmentDtoFromEntity(themeAssignment, localizationOptions)),
    content: createQuestionContentDtoFromEntity(question.content, localizationOptions),
    cognitiveDifficulty: question.cognitiveDifficulty,
    author: question.author,
    status: question.status,
    rejection: question.rejection,
    sourceUrls: [...question.sourceUrls],
    createdAt: question.createdAt.toISOString(),
    updatedAt: question.updatedAt.toISOString(),
  };
}

function createAdminQuestionThemeAssignmentDtoFromEntity(questionThemeAssignment: QuestionThemeAssignment): AdminQuestionThemeAssignmentDto {
  return {
    theme: createAdminQuestionThemeDtoFromEntity(questionThemeAssignment.theme),
    isPrimary: questionThemeAssignment.isPrimary,
    isHint: questionThemeAssignment.isHint,
  };
}

function createAdminQuestionDtoFromEntity(question: Question): AdminQuestionDto {
  return {
    id: question.id,
    themes: question.themes.map(themeAssignment => createAdminQuestionThemeAssignmentDtoFromEntity(themeAssignment)),
    content: question.content,
    cognitiveDifficulty: question.cognitiveDifficulty,
    author: question.author,
    rejection: question.rejection,
    sourceUrls: [...question.sourceUrls],
    status: question.status,
    createdAt: question.createdAt.toISOString(),
    updatedAt: question.updatedAt.toISOString(),
  };
}

export {
  createQuestionThemeAssignmentDtoFromEntity,
  createQuestionContentDtoFromEntity,
  createQuestionDtoFromEntity,
  createAdminQuestionThemeAssignmentDtoFromEntity,
  createAdminQuestionDtoFromEntity,
};