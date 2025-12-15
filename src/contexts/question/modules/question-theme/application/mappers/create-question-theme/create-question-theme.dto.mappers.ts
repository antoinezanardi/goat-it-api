import type { CreateQuestionThemeDto } from "@question/modules/question-theme/application/dto/create-question-theme/create-question-theme.dto";

import type { QuestionThemeDraft } from "@question/modules/question-theme/domain/entities/question-theme.types";

function createQuestionThemeDraftEntityFromCreateDto(createQuestionThemeDto: CreateQuestionThemeDto): QuestionThemeDraft {
  return {
    slug: createQuestionThemeDto.slug,
    label: createQuestionThemeDto.label,
    aliases: createQuestionThemeDto.aliases,
    description: createQuestionThemeDto.description,
    status: "active",
  };
}

export {
  createQuestionThemeDraftEntityFromCreateDto,
};