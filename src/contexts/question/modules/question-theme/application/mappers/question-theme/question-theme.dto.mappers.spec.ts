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
        color: questionTheme.color,
        status: questionTheme.status,
        createdAt: questionTheme.createdAt.toISOString(),
        updatedAt: questionTheme.updatedAt.toISOString(),
      });

      expect(questionThemeDto).toStrictEqual(expectedQuestionThemeDto);
    });

    it("should map entity.color to DTO.color when present.", () => {
      const questionTheme = createFakeQuestionTheme({ color: "#FF5733" });
      const localizationOptions = createFakeLocalizationOptions({ locale: "en" });
      const questionThemeDto = createQuestionThemeDtoFromEntity(questionTheme, localizationOptions);

      expect(questionThemeDto.color).toBe("#FF5733");
    });

    it("should handle entity mapping when color is not present.", () => {
      const questionTheme = createFakeQuestionTheme({ color: undefined });
      const localizationOptions = createFakeLocalizationOptions({ locale: "en" });
      const questionThemeDto = createQuestionThemeDtoFromEntity(questionTheme, localizationOptions);

      expect(questionThemeDto.color).toBeUndefined();
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
        color: questionTheme.color,
        status: questionTheme.status,
        createdAt: questionTheme.createdAt.toISOString(),
        updatedAt: questionTheme.updatedAt.toISOString(),
      });

      expect(adminQuestionThemeDto).toStrictEqual(expectedAdminQuestionThemeDto);
    });

    it("should map entity.color to admin DTO.color when present.", () => {
      const questionTheme = createFakeQuestionTheme({ color: "#FF5733" });
      const adminQuestionThemeDto = createAdminQuestionThemeDtoFromEntity(questionTheme);

      expect(adminQuestionThemeDto.color).toBe("#FF5733");
    });

    it("should handle entity mapping when color is not present.", () => {
      const questionTheme = createFakeQuestionTheme({ color: undefined });
      const adminQuestionThemeDto = createAdminQuestionThemeDtoFromEntity(questionTheme);

      expect(adminQuestionThemeDto.color).toBeUndefined();
    });
  });
});