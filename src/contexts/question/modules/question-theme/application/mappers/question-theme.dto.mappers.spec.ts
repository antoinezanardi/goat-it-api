import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme.dto";
import { createQuestionThemeDtoFromEntity } from "@question/modules/question-theme/application/mappers/question-theme.dto.mappers";

import { createFakeLocalizationOptions } from "@faketories/shared/locale/locale.faketory";
import { createFakeQuestionTheme, createFakeQuestionThemeDto } from "@faketories/contexts/question/question-theme/question-theme.faketory";

describe("Question Theme Dto Mappers", () => {
  describe(createQuestionThemeDtoFromEntity, () => {
    it("should map a QuestionTheme entity to a QuestionThemeDto when called.", () => {
      const questionTheme = createFakeQuestionTheme();
      const localizationOptions = createFakeLocalizationOptions({
        locale: "en",
      });
      const questionThemeDto = createQuestionThemeDtoFromEntity(questionTheme, localizationOptions);
      const expectedQuestionThemeDto = createFakeQuestionThemeDto({
        id: questionTheme.id,
        label: questionTheme.label.en,
        aliases: questionTheme.aliases.en,
        description: questionTheme.description.en,
        status: questionTheme.status,
        createdAt: questionTheme.createdAt.toISOString(),
        updatedAt: questionTheme.updatedAt.toISOString(),
      });

      expect(questionThemeDto).toStrictEqual<QuestionThemeDto>(expectedQuestionThemeDto);
    });
  });
});