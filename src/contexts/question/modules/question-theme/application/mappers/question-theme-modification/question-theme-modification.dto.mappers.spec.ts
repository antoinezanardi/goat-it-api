import { createQuestionThemeModificationCommandFromDto } from "@question/modules/question-theme/application/mappers/question-theme-modification/question-theme-modification.dto.mappers";
import type { QuestionThemeModificationCommand } from "@question/modules/question-theme/domain/commands/question-theme.commands";

import { createFakeQuestionThemeModificationDto } from "@faketories/contexts/question/question-theme/dto/question-theme.dto.faketory";
import { createFakeQuestionThemeModificationCommand } from "@faketories/contexts/question/question-theme/commands/question-theme.commands.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";

describe("Question Theme Modification Dto Mappers", () => {
  describe(createQuestionThemeModificationCommandFromDto, () => {
    it("should return mapped QuestionThemeModificationCommand when called.", () => {
      const questionThemeId = createFakeObjectId().toString();
      const questionThemeModificationDto = createFakeQuestionThemeModificationDto({
        slug: "new-slug",
      });
      const expectedUpdateCommand = createFakeQuestionThemeModificationCommand({
        questionThemeId,
        payload: {
          slug: questionThemeModificationDto.slug,
          label: questionThemeModificationDto.label,
          aliases: questionThemeModificationDto.aliases,
          description: questionThemeModificationDto.description,
        },
      });
      const result = createQuestionThemeModificationCommandFromDto(questionThemeId, questionThemeModificationDto);

      expect(result).toStrictEqual<QuestionThemeModificationCommand>(expectedUpdateCommand);
    });
  });
});