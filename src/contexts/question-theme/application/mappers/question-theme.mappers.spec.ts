import { createAdminQuestionThemeDtoFromEntity, createQuestionThemeCreationCommandFromDto, createQuestionThemeDtoFromEntity, createQuestionThemeModificationCommandFromDto } from "@question-theme/application/mappers/question-theme.mappers";

import { createFakeQuestionTheme } from "@faketories/contexts/question-theme/entity/question-theme.entity.faketory";
import { createFakeAdminQuestionThemeDto, createFakeQuestionThemeCreationDto, createFakeQuestionThemeDto, createFakeQuestionThemeModificationDto } from "@faketories/contexts/question-theme/dto/question-theme.dto.faketory";
import { createFakeLocalizationOptions } from "@faketories/shared/locale/locale.faketory";
import { createFakeQuestionThemeCreationCommand, createFakeQuestionThemeModificationCommand } from "@faketories/contexts/question-theme/commands/question-theme.commands.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";

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
          color: questionThemeCreationDto.color,
          status: "active",
        },
      });

      expect(questionThemeCreationCommand).toStrictEqual(expectedQuestionThemeCreationCommand);
    });
  });

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
          color: questionThemeModificationDto.color,
        },
      });
      const result = createQuestionThemeModificationCommandFromDto(questionThemeId, questionThemeModificationDto);

      expect(result).toStrictEqual(expectedUpdateCommand);
    });
  });
});