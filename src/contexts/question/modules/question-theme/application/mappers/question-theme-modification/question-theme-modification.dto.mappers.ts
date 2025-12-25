import type { QuestionThemeModificationDto } from "@question/modules/question-theme/application/dto/question-theme-modification/question-theme-modification.dto";
import type { QuestionThemeModificationCommand } from "@question/modules/question-theme/domain/commands/question-theme.commands";

function createQuestionThemeModificationCommandFromDto(questionThemeId: string, questionThemeModificationDto: QuestionThemeModificationDto): QuestionThemeModificationCommand {
  return {
    questionThemeId,
    payload: {
      slug: questionThemeModificationDto.slug,
      label: questionThemeModificationDto.label,
      aliases: questionThemeModificationDto.aliases,
      description: questionThemeModificationDto.description,
    },
  };
}

export {
  createQuestionThemeModificationCommandFromDto,
};