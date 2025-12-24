import type { PatchQuestionThemeDto } from "@question/modules/question-theme/application/dto/patch-question-theme/patch-question-theme.dto";
import type { QuestionThemeModificationCommand } from "@question/modules/question-theme/domain/commands/question-theme.commands";

function createQuestionThemeModificationCommandFromPatchQuestionThemeDto(questionThemeId: string, patchQuestionThemeDto: PatchQuestionThemeDto): QuestionThemeModificationCommand {
  return {
    questionThemeId,
    payload: {
      slug: patchQuestionThemeDto.slug,
      label: patchQuestionThemeDto.label,
      aliases: patchQuestionThemeDto.aliases,
      description: patchQuestionThemeDto.description,
    },
  };
}

export {
  createQuestionThemeModificationCommandFromPatchQuestionThemeDto,
};