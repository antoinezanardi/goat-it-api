import type { QuestionThemeAssignmentCreationDto } from "@question/application/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto";
import { createQuestionThemeAssignmentCreationContractFromDto } from "@question/application/mappers/question-creation/question-creation.dto.mappers";
import type { QuestionThemeAssignmentCreationCommand } from "@question/domain/commands/question-theme-assignment/question-theme-assignment.commands";

function createQuestionThemeAssignmentCreationCommandFromDto(questionId: string, dto: QuestionThemeAssignmentCreationDto): QuestionThemeAssignmentCreationCommand {
  return {
    questionId,
    payload: createQuestionThemeAssignmentCreationContractFromDto(dto),
  };
}

export { createQuestionThemeAssignmentCreationCommandFromDto };