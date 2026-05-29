import { createQuestionThemeAssignmentCreationContractFromDto } from "@question/application/mappers/question.mappers";
import type { QuestionThemeAssignmentCreationDto } from "@question/application/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto.shape";
import type { QuestionThemeAssignmentModificationDto } from "@question/application/dto/question-theme-assignment-modification/question-theme-assignment-modification.dto.shape";
import type { QuestionThemeAssignmentCreationCommand, QuestionThemeAssignmentModificationCommand } from "@question/domain/types/question.commands";

function createQuestionThemeAssignmentCreationCommandFromDto(questionId: string, dto: QuestionThemeAssignmentCreationDto): QuestionThemeAssignmentCreationCommand {
  return {
    questionId,
    payload: createQuestionThemeAssignmentCreationContractFromDto(dto),
  };
}

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
  createQuestionThemeAssignmentCreationCommandFromDto,
  createQuestionThemeAssignmentModificationCommandFromDto,
};