import type { QuestionThemeCreationDto } from "@question/modules/question-theme/application/dto/question-theme-creation/question-theme-creation.dto";
import type { QuestionThemeCreationCommand } from "@question/modules/question-theme/domain/commands/question-theme.commands";

function createQuestionThemeCreationCommandFromDto(questionThemeCreationDto: QuestionThemeCreationDto): QuestionThemeCreationCommand {
  return {
    payload: {
      slug: questionThemeCreationDto.slug,
      label: questionThemeCreationDto.label,
      aliases: questionThemeCreationDto.aliases,
      description: questionThemeCreationDto.description,
      status: "active",
    },
  };
}

export {
  createQuestionThemeCreationCommandFromDto,
};