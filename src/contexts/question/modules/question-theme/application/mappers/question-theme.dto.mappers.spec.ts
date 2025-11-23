import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme.dto";
import { createQuestionThemeDtoFromEntity } from "@question/modules/question-theme/application/mappers/question-theme.dto.mappers";

import { createFakeQuestionTheme, createFakeQuestionThemeDto } from "@factories/contexts/question/question-theme/question-theme.factory";

describe("Question Theme Dto Mappers", () => {
  describe(createQuestionThemeDtoFromEntity, () => {
    it("should map a QuestionTheme entity to a QuestionThemeDto when called.", () => {
      const questionTheme = createFakeQuestionTheme();
      const questionThemeDto = createQuestionThemeDtoFromEntity(questionTheme);
      const expectedQuestionThemeDto = createFakeQuestionThemeDto({
        id: questionTheme.id,
        label: questionTheme.label,
        aliases: questionTheme.aliases,
        description: questionTheme.description,
        parentId: questionTheme.parentId,
        status: questionTheme.status,
        createdAt: questionTheme.createdAt.toISOString(),
        updatedAt: questionTheme.updatedAt.toISOString(),
      });

      expect(questionThemeDto).toStrictEqual<QuestionThemeDto>(expectedQuestionThemeDto);
    });
  });
});