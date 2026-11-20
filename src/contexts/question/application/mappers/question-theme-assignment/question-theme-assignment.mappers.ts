import type { QuestionThemeAssignmentCreationDto } from "@question/application/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto.shape";
import type { QuestionThemeAssignmentModificationDto } from "@question/application/dto/question-theme-assignment-modification/question-theme-assignment-modification.dto.shape";
import type { QuestionThemeAssignmentCreationCommand, QuestionThemeAssignmentModificationCommand } from "@question/application/commands/question.commands";

import type { QuestionThemeAssignmentCreationContract } from "@question/domain/repositories/question.repository-contracts.types";

/**
 * Maps a theme-assignment creation DTO to the repository contract, keeping only the fields the repository persists.
 */
function createQuestionThemeAssignmentCreationContractFromDto(questionThemeAssignmentDto: QuestionThemeAssignmentCreationDto): QuestionThemeAssignmentCreationContract {
  return {
    themeId: questionThemeAssignmentDto.themeId,
    isPrimary: questionThemeAssignmentDto.isPrimary,
    isHint: questionThemeAssignmentDto.isHint,
  };
}

/**
 * Wraps a theme-assignment creation DTO and its target question id into a creation command.
 */
function createQuestionThemeAssignmentCreationCommandFromDto(questionId: string, dto: QuestionThemeAssignmentCreationDto): QuestionThemeAssignmentCreationCommand {
  return {
    questionId,
    payload: createQuestionThemeAssignmentCreationContractFromDto(dto),
  };
}

/**
 * Builds a theme-assignment modification command from the question id, the theme id and the modification DTO.
 */
function createQuestionThemeAssignmentModificationCommandFromDto(
  questionId: string,
  themeId: string,
  dto: QuestionThemeAssignmentModificationDto,
): QuestionThemeAssignmentModificationCommand {
  return {
    questionId,
    themeId,
    payload: {
      isPrimary: dto.isPrimary,
      isHint: dto.isHint,
    },
  };
}

export {
  createQuestionThemeAssignmentCreationContractFromDto,
  createQuestionThemeAssignmentCreationCommandFromDto,
  createQuestionThemeAssignmentModificationCommandFromDto,
};