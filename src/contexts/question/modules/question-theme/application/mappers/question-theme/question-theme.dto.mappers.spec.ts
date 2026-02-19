import type { AdminQuestionThemeDto } from "@question/modules/question-theme/application/dto/admin-question-theme/admin-question-theme.dto.shape";
import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme/question-theme.dto.shape";
import { createAdminQuestionThemeDtoFromEntity, createQuestionThemeDtoFromEntity } from "@question/modules/question-theme/application/mappers/question-theme/question-theme.dto.mappers";

import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";
import { createFakeAdminQuestionThemeDto, createFakeQuestionThemeDto } from "@faketories/contexts/question/question-theme/dto/question-theme.dto.faketory";
import { createFakeLocalizationOptions } from "@faketories/shared/locale/locale.faketory";

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
        slug: questionTheme.slug,
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

  describe(createAdminQuestionThemeDtoFromEntity, () => {
    it("should map a QuestionTheme entity to a AdminQuestionThemeDto when called.", () => {
      const questionTheme = createFakeQuestionTheme();
      const adminQuestionThemeDto = createAdminQuestionThemeDtoFromEntity(questionTheme);
      const expectedAdminQuestionThemeDto = createFakeAdminQuestionThemeDto({
        id: questionTheme.id,
        slug: questionTheme.slug,
        label: questionTheme.label,
        aliases: questionTheme.aliases,
        description: questionTheme.description,
        status: questionTheme.status,
        createdAt: questionTheme.createdAt.toISOString(),
        updatedAt: questionTheme.updatedAt.toISOString(),
      });

      expect(adminQuestionThemeDto).toStrictEqual<AdminQuestionThemeDto>(expectedAdminQuestionThemeDto);
    });
  });
});