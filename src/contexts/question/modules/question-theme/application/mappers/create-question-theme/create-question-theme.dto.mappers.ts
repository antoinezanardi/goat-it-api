import type { CreateQuestionThemeDto } from "@question/modules/question-theme/application/dto/create-question-theme/create-question-theme.dto";
import type { QuestionThemeCreationCommand } from "@question/modules/question-theme/domain/commands/question-theme.commands";

function createQuestionThemeCreationCommandFromCreateDto(createQuestionThemeDto: CreateQuestionThemeDto): QuestionThemeCreationCommand {
  return {
    payload: {
      slug: createQuestionThemeDto.slug,
      label: createQuestionThemeDto.label,
      aliases: createQuestionThemeDto.aliases,
      description: createQuestionThemeDto.description,
      status: "active",
    },
  };
}

export {
  createQuestionThemeCreationCommandFromCreateDto,
};