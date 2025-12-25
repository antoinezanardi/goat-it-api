import { createQuestionThemeCreationCommandFromCreateDto } from "@question/modules/question-theme/application/mappers/create-question-theme/create-question-theme.dto.mappers";
import type { QuestionThemeCreationCommand } from "@question/modules/question-theme/domain/commands/question-theme.commands";

import { createFakeQuestionThemeCreationCommand } from "@faketories/contexts/question/question-theme/commands/question-theme.commands.faketory";
import { createFakeCreateQuestionThemeDto } from "@faketories/contexts/question/question-theme/question-theme.faketory";

describe("Create Question Theme Dto Mappers", () => {
  describe(createQuestionThemeCreationCommandFromCreateDto, () => {
    it("should map a CreateQuestionThemeDto to a QuestionThemeCreationCommand when called.", () => {
      const createQuestionThemeDto = createFakeCreateQuestionThemeDto();
      const questionThemeCreationCommand = createQuestionThemeCreationCommandFromCreateDto(createQuestionThemeDto);
      const expectedQuestionThemeCreationCommand = createFakeQuestionThemeCreationCommand({
        payload: {
          slug: createQuestionThemeDto.slug,
          label: createQuestionThemeDto.label,
          aliases: createQuestionThemeDto.aliases,
          description: createQuestionThemeDto.description,
          status: "active",
        },
      });

      expect(questionThemeCreationCommand).toStrictEqual<QuestionThemeCreationCommand>(expectedQuestionThemeCreationCommand);
    });
  });
});