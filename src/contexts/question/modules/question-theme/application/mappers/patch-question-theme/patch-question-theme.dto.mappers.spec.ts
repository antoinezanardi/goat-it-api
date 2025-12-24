import { createQuestionThemeModificationCommandFromPatchQuestionThemeDto } from "@question/modules/question-theme/application/mappers/patch-question-theme/patch-question-theme.dto.mappers";
import type { QuestionThemeModificationCommand } from "@question/modules/question-theme/domain/commands/question-theme.commands";

import { createFakeQuestionThemeUpdateCommand } from "@faketories/contexts/question/question-theme/commands/question-theme.commands.faketory";
import { createFakePatchQuestionThemeDto } from "@faketories/contexts/question/question-theme/question-theme.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";

describe("Patch Question Theme Dto Mappers", () => {
  describe(createQuestionThemeModificationCommandFromPatchQuestionThemeDto, () => {
    it("should return mapped UpdateQuestionThemeCommand when called.", () => {
      const questionThemeId = createFakeObjectId().toString();
      const patchQuestionThemeDto = createFakePatchQuestionThemeDto({
        slug: "new-slug",
      });
      const expectedUpdateCommand = createFakeQuestionThemeUpdateCommand({
        questionThemeId,
        payload: {
          slug: patchQuestionThemeDto.slug,
          label: patchQuestionThemeDto.label,
          aliases: patchQuestionThemeDto.aliases,
          description: patchQuestionThemeDto.description,
        },
      });
      const result = createQuestionThemeModificationCommandFromPatchQuestionThemeDto(questionThemeId, patchQuestionThemeDto);

      expect(result).toStrictEqual<QuestionThemeModificationCommand>(expectedUpdateCommand);
    });
  });
});