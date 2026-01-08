import { createTranslationFromLocalizedText, createTranslationsFromLocalizedTexts } from "@shared/application/mappers/localization/localization.mappers";

import type { QuestionRejectionDto } from "@question/application/dto/shared/question-rejection/question-rejection.dto";
import type { QuestionAuthorDto } from "@question/application/dto/shared/question-author/question-author.dto";
import { createQuestionThemeDtoFromEntity } from "@question/modules/question-theme/application/mappers/question-theme/question-theme.dto.mappers";
import type { QuestionThemeAssignmentDto } from "@question/application/dto/question/question-theme-assignment/question-theme-assignment.dto";
import type { QuestionContentDto } from "@question/application/dto/question/question-content/question-content.dto";
import type { QuestionDto } from "@question/application/dto/question/question.dto";

import type { QuestionRejection } from "@question/domain/value-objects/question-rejection/question-rejection.types";
import type { QuestionAuthor } from "@question/domain/value-objects/question-author/question-author.types";
import type { QuestionThemeAssignment } from "@question/domain/value-objects/question-theme-assignment/question-theme-assignment.types";
import type { Question } from "@question/domain/entities/question.types";
import type { QuestionContent } from "@question/domain/value-objects/question-content/question-content.types";
import type { LocalizationOptions } from "@shared/domain/value-objects/locale/locale.types";

function createQuestionRejectionDtoFromEntity(questionRejection: QuestionRejection): QuestionRejectionDto {
  return {
    type: questionRejection.type,
    comment: questionRejection.comment,
  };
}

function createQuestionAuthorDtoFromEntity(questionAuthor: QuestionAuthor): QuestionAuthorDto {
  return {
    name: questionAuthor.name,
    role: questionAuthor.role,
    gameId: questionAuthor.role === "game" ? questionAuthor.gameId : undefined,
  };
}

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
    author: createQuestionAuthorDtoFromEntity(question.author),
    status: question.status,
    rejection: question.rejection ? createQuestionRejectionDtoFromEntity(question.rejection) : undefined,
    sourceUrls: question.sourceUrls,
    createdAt: question.createdAt.toISOString(),
    updatedAt: question.updatedAt.toISOString(),
  };
}

export {
  createQuestionRejectionDtoFromEntity,
  createQuestionAuthorDtoFromEntity,
  createQuestionThemeAssignmentDtoFromEntity,
  createQuestionContentDtoFromEntity,
  createQuestionDtoFromEntity,
};