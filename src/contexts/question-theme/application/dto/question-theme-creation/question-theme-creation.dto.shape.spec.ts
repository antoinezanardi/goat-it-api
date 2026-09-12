import { ZodError } from "zod";

import { QUESTION_THEME_CREATION_DTO } from "@question-theme/application/dto/question-theme-creation/question-theme-creation.dto.shape";

import { HEX_COLOR_EXAMPLE } from "@shared/infrastructure/http/zod/validators/string/constants/string.zod.validators.constants";

describe("Question Theme Creation Dto Shape", () => {
  let validQuestionThemeCreationDto: { slug: string; label: Record<string, string>; aliases: Record<string, string[]>; description: Record<string, string>; color?: string };

  beforeEach(() => {
    validQuestionThemeCreationDto = {
      slug: "general-knowledge",
      label: { en: "General Knowledge" },
      aliases: { en: ["gk", "general"] },
      description: { en: "A theme for general knowledge questions" },
      color: "#FF5733",
    };
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => QUESTION_THEME_CREATION_DTO.parse(validQuestionThemeCreationDto)).not.toThrow();
  });

  describe("slug", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = { ...validQuestionThemeCreationDto, slug: 123 };

      expect(() => QUESTION_THEME_CREATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_CREATION_DTO.shape.slug.description).toBe("Question Theme's unique slug in kebab-case");
    });

    it("should have correct metadata when accessing the meta.", () => {
      const expectedMetadata = {
        description: "Question Theme's unique slug in kebab-case",
        example: "general-knowledge",
      };

      expect(QUESTION_THEME_CREATION_DTO.shape.slug.meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("label", () => {
    it("should throw a zod error when assigned a non-object localized text.", () => {
      const invalidDto = { ...validQuestionThemeCreationDto, label: "not-localized" };

      expect(() => QUESTION_THEME_CREATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_CREATION_DTO.shape.label.description).toBe("Question Theme's label");
    });
  });

  describe("aliases", () => {
    it("should throw a zod error when assigned a non-object localized texts.", () => {
      const invalidDto = { ...validQuestionThemeCreationDto, aliases: "not-localized" };

      expect(() => QUESTION_THEME_CREATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_CREATION_DTO.shape.aliases.description).toBe("Question Theme's aliases");
    });
  });

  describe("description", () => {
    it("should throw a zod error when assigned a non-object localized text.", () => {
      const invalidDto = { ...validQuestionThemeCreationDto, description: 456 };

      expect(() => QUESTION_THEME_CREATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_CREATION_DTO.shape.description.description).toBe("Question Theme's description");
    });
  });

  describe("color", () => {
    it("should pass validation when assigned valid hex color.", () => {
      const dtoWithColor = { ...validQuestionThemeCreationDto, color: "#FF5733" };

      expect(() => QUESTION_THEME_CREATION_DTO.parse(dtoWithColor)).not.toThrow();
    });

    it("should pass validation when color is omitted (optional).", () => {
      const dtoWithoutColor = { ...validQuestionThemeCreationDto, color: undefined };

      expect(() => QUESTION_THEME_CREATION_DTO.parse(dtoWithoutColor)).not.toThrow();
    });

    it("should throw a zod error when assigned invalid hex color format.", () => {
      const invalidDto = { ...validQuestionThemeCreationDto, color: "#GGGGGG" };

      expect(() => QUESTION_THEME_CREATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_CREATION_DTO.shape.color.unwrap().description).toBe("Question Theme's hex color");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const expectedMetadata = {
        description: "Question Theme's hex color",
        example: HEX_COLOR_EXAMPLE,
      };

      expect(QUESTION_THEME_CREATION_DTO.shape.color.unwrap().meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });
});