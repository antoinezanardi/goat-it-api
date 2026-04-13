import type { QuestionThemeAssignmentModificationDto } from "@question/application/dto/question-theme-assignment-modification/question-theme-assignment-modification.dto.shape";
import type { QuestionThemeAssignmentModificationCommand } from "@question/domain/commands/question-theme-assignment/question-theme-assignment-modification.commands";

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

export { createQuestionThemeAssignmentModificationCommandFromDto };