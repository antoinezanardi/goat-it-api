import { DEFAULT_QUESTION_THEME_STATUS } from "@question-theme/domain/constants/question-theme.constants";

import type { QuestionThemeCreationDto } from "@question-theme/application/dto/question-theme-creation/question-theme-creation.dto.shape";
import type { QuestionThemeModificationDto } from "@question-theme/application/dto/question-theme-modification/question-theme-modification.dto.shape";
import type { QuestionThemeCreationCommand, QuestionThemeModificationCommand } from "@question-theme/application/commands/question-theme.commands";

function createQuestionThemeCreationCommandFromDto(questionThemeCreationDto: QuestionThemeCreationDto): QuestionThemeCreationCommand {
  return {
    payload: {
      slug: questionThemeCreationDto.slug,
      label: questionThemeCreationDto.label,
      aliases: questionThemeCreationDto.aliases,
      description: questionThemeCreationDto.description,
      color: questionThemeCreationDto.color,
      status: DEFAULT_QUESTION_THEME_STATUS,
    },
  };
}

function createQuestionThemeModificationCommandFromDto(questionThemeId: string, questionThemeModificationDto: QuestionThemeModificationDto): QuestionThemeModificationCommand {
  return {
    questionThemeId,
    payload: {
      slug: questionThemeModificationDto.slug,
      label: questionThemeModificationDto.label,
      aliases: questionThemeModificationDto.aliases,
      description: questionThemeModificationDto.description,
      color: questionThemeModificationDto.color,
    },
  };
}

export {
  createQuestionThemeCreationCommandFromDto,
  createQuestionThemeModificationCommandFromDto,
};