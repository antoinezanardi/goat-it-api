import { createQuestionThemeCreationCommandFromDto } from "@question/modules/question-theme/application/mappers/question-theme-creation/question-theme-creation.dto.mappers";
import type { QuestionThemeCreationCommand } from "@question/modules/question-theme/domain/commands/question-theme.commands";

import { createFakeQuestionThemeCreationCommand } from "@faketories/contexts/question/question-theme/commands/question-theme.commands.faketory";
import { createFakeQuestionThemeCreationDto } from "@faketories/contexts/question/question-theme/dto/question-theme.dto.faketory";

describe("Question Theme Creation Dto Mappers", () => {
  describe(createQuestionThemeCreationCommandFromDto, () => {
    it("should map a QuestionThemeCreationDto to a QuestionThemeCreationCommand when called.", () => {
      const questionThemeCreationDto = createFakeQuestionThemeCreationDto();
      const questionThemeCreationCommand = createQuestionThemeCreationCommandFromDto(questionThemeCreationDto);
      const expectedQuestionThemeCreationCommand = createFakeQuestionThemeCreationCommand({
        payload: {
          slug: questionThemeCreationDto.slug,
          label: questionThemeCreationDto.label,
          aliases: questionThemeCreationDto.aliases,
          description: questionThemeCreationDto.description,
          status: "active",
        },
      });

      expect(questionThemeCreationCommand).toStrictEqual<QuestionThemeCreationCommand>(expectedQuestionThemeCreationCommand);
    });
  });
});