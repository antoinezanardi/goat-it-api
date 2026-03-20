import { ZodError } from "zod";

import { HEX_COLOR_EXAMPLE } from "@shared/infrastructure/http/zod/validators/string/constants/string.zod.validators.constants";

import type { QuestionThemeModificationDto } from "@question/modules/question-theme/application/dto/question-theme-modification/question-theme-modification.dto.shape";
import { QUESTION_THEME_MODIFICATION_DTO } from "@question/modules/question-theme/application/dto/question-theme-modification/question-theme-modification.dto.shape";

import { createFakeQuestionThemeModificationDto } from "@faketories/contexts/question/question-theme/dto/question-theme.dto.faketory";

describe("Question Theme Modification DTO Shape", () => {
  let validQuestionThemeModificationDto: QuestionThemeModificationDto;

  beforeEach(() => {
    validQuestionThemeModificationDto = createFakeQuestionThemeModificationDto();
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => QUESTION_THEME_MODIFICATION_DTO.parse(validQuestionThemeModificationDto)).not.toThrow();
  });

  it("should pass validation when assigned empty object.", () => {
    const validEmptyDto = {} as QuestionThemeModificationDto;

    expect(() => QUESTION_THEME_MODIFICATION_DTO.parse(validEmptyDto)).not.toThrow();
  });

  describe("slug", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validQuestionThemeModificationDto, { slug: 123 });

      expect(() => QUESTION_THEME_MODIFICATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_MODIFICATION_DTO.shape.slug.description).toBe("Question Theme's unique slug in kebab-case");
    });

    it("should have correct metadata when accessing the meta.", () => {
      const expectedMetadata = {
        description: "Question Theme's unique slug in kebab-case",
        example: "general-knowledge",
      };

      expect(QUESTION_THEME_MODIFICATION_DTO.shape.slug.meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("label", () => {
    it("should throw a zod error when assigned a non-object localized text.", () => {
      const invalidDto = Object.assign(validQuestionThemeModificationDto, { label: "not-localized" });

      expect(() => QUESTION_THEME_MODIFICATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_MODIFICATION_DTO.shape.label.description).toBe("Question Theme's translated label");
    });
  });

  describe("aliases", () => {
    it("should throw a zod error when assigned a non-object localized texts.", () => {
      const invalidDto = Object.assign(validQuestionThemeModificationDto, { aliases: "not-localized" });

      expect(() => QUESTION_THEME_MODIFICATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_MODIFICATION_DTO.shape.aliases.description).toBe("Question Theme's translated aliases. Help to find the theme with different keywords");
    });
  });

  describe("description", () => {
    it("should throw a zod error when assigned a non-object localized text.", () => {
      const invalidDto = Object.assign(validQuestionThemeModificationDto, { description: 456 });

      expect(() => QUESTION_THEME_MODIFICATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_MODIFICATION_DTO.shape.description.description).toBe("Question Theme's translated description");
    });
  });

  describe("color", () => {
    it("should pass validation when assigned valid hex color.", () => {
      const dtoWithColor = { ...validQuestionThemeModificationDto, color: "#00AA00" };

      expect(() => QUESTION_THEME_MODIFICATION_DTO.parse(dtoWithColor)).not.toThrow();
    });

    it("should pass validation when color is omitted (optional).", () => {
      const dtoWithoutColor = { color: undefined };

      expect(() => QUESTION_THEME_MODIFICATION_DTO.parse(dtoWithoutColor)).not.toThrow();
    });

    it("should throw a zod error when assigned invalid hex color format.", () => {
      const invalidDto = { color: "FF5733" };

      expect(() => QUESTION_THEME_MODIFICATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_MODIFICATION_DTO.shape.color.description).toBe("Question Theme's hex color (6-digit with # prefix)");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const expectedMetadata = {
        description: "Question Theme's hex color (6-digit with # prefix)",
        example: HEX_COLOR_EXAMPLE,
      };

      expect(QUESTION_THEME_MODIFICATION_DTO.shape.color.meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });
});