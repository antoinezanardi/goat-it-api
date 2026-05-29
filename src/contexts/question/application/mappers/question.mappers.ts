import { createAdminQuestionThemeDtoFromEntity, createQuestionThemeDtoFromEntity } from "@question-theme/application/mappers/question-theme.mappers";

import { createTranslationFromLocalizedText, createTranslationsFromLocalizedTexts } from "@shared/application/mappers/localization/localization.mappers";

import { computeQuestionStatusFromAuthorRole } from "@question/domain/rules/question.rules";
import type { AdminQuestionThemeAssignmentDto } from "@question/application/dto/admin-question/admin-question-theme-assignment/admin-question-theme-assignment.dto.shape";
import type { AdminQuestionDto } from "@question/application/dto/admin-question/admin-question.dto.shape";
import type { QuestionThemeAssignmentDto } from "@question/application/dto/question/question-theme-assignment/question-theme-assignment.dto.shape";
import type { QuestionContentDto } from "@question/application/dto/question/question-content/question-content.dto.shape";
import type { QuestionDto } from "@question/application/dto/question/question.dto.shape";
import type { QuestionAuthorCreationDto } from "@question/application/dto/question-creation/question-author-creation/question-author-creation.dto.shape";
import type { QuestionContentCreationDto } from "@question/application/dto/question-creation/question-content-creation/question-content-creation.dto.shape";
import type { QuestionCreationDto } from "@question/application/dto/question-creation/question-creation.dto.shape";
import type { QuestionThemeAssignmentCreationDto } from "@question/application/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto.shape";
import type { QuestionModificationDto } from "@question/application/dto/question-modification/question-modification.dto.shape";
import type { QuestionContent, QuestionThemeAssignment } from "@question/domain/types/question.value-objects";
import type { Question } from "@question/domain/types/question.entities";
import type { QuestionCreationCommand, QuestionModificationCommand } from "@question/domain/types/question.commands";
import type { QuestionAuthorCreationContract, QuestionContentCreationContract, QuestionThemeAssignmentCreationContract } from "@question/domain/types/question.contracts";

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
    category: question.category,
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
    category: question.category,
    cognitiveDifficulty: question.cognitiveDifficulty,
    author: question.author,
    rejection: question.rejection,
    sourceUrls: [...question.sourceUrls],
    status: question.status,
    createdAt: question.createdAt.toISOString(),
    updatedAt: question.updatedAt.toISOString(),
  };
}

function createQuestionThemeAssignmentCreationContractFromDto(questionThemeAssignmentDto: QuestionThemeAssignmentCreationDto): QuestionThemeAssignmentCreationContract {
  return {
    themeId: questionThemeAssignmentDto.themeId,
    isPrimary: questionThemeAssignmentDto.isPrimary,
    isHint: questionThemeAssignmentDto.isHint,
  };
}

function createQuestionAuthorCreationContractFromDto(questionAuthorDto: QuestionAuthorCreationDto): QuestionAuthorCreationContract {
  return {
    role: questionAuthorDto.role,
    name: questionAuthorDto.name,
  };
}

function createQuestionContentCreationContractFromDto(questionContentDto: QuestionContentCreationDto): QuestionContentCreationContract {
  return {
    statement: questionContentDto.statement,
    answer: questionContentDto.answer,
    context: questionContentDto.context,
    trivia: questionContentDto.trivia,
  };
}

function createQuestionCreationCommandFromDto(dto: QuestionCreationDto): QuestionCreationCommand {
  return {
    payload: {
      category: dto.category,
      themes: dto.themes.map(createQuestionThemeAssignmentCreationContractFromDto),
      content: createQuestionContentCreationContractFromDto(dto.content),
      cognitiveDifficulty: dto.cognitiveDifficulty,
      author: createQuestionAuthorCreationContractFromDto(dto.author),
      status: computeQuestionStatusFromAuthorRole(dto.author.role),
      sourceUrls: new Set(dto.sourceUrls),
    },
  };
}

function createQuestionModificationCommandFromDto(questionId: string, questionModificationDto: QuestionModificationDto): QuestionModificationCommand {
  return {
    questionId,
    payload: {
      category: questionModificationDto.category,
      cognitiveDifficulty: questionModificationDto.cognitiveDifficulty,
      sourceUrls: questionModificationDto.sourceUrls,
      content: questionModificationDto.content,
    },
  };
}

export {
  createQuestionContentDtoFromEntity,
  createQuestionThemeAssignmentDtoFromEntity,
  createQuestionDtoFromEntity,
  createAdminQuestionThemeAssignmentDtoFromEntity,
  createAdminQuestionDtoFromEntity,
  createQuestionThemeAssignmentCreationContractFromDto,
  createQuestionAuthorCreationContractFromDto,
  createQuestionContentCreationContractFromDto,
  createQuestionCreationCommandFromDto,
  createQuestionModificationCommandFromDto,
};