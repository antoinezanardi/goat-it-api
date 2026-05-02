import type { QuestionModificationDto } from "@question/application/dto/question-modification/question-modification.dto.shape";
import type { QuestionModificationCommand } from "@question/domain/commands/question-modification.commands";

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
  createQuestionModificationCommandFromDto,
};