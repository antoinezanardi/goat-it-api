import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme.dto";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

function createQuestionThemeDtoFromEntity(questionTheme: QuestionTheme): QuestionThemeDto {
  return {
    id: questionTheme.id,
    label: questionTheme.label,
    aliases: questionTheme.aliases,
    description: questionTheme.description,
    parentId: questionTheme.parentId,
    status: questionTheme.status,
    createdAt: questionTheme.createdAt.toString(),
    updatedAt: questionTheme.updatedAt.toString(),
  };
}

export {
  createQuestionThemeDtoFromEntity,
};