import { ZodError } from "zod";

import { HEX_COLOR_EXAMPLE } from "@shared/infrastructure/http/zod/validators/string/constants/string.zod.validators.constants";

import { QUESTION_THEME_ALIASES_EXAMPLE, QUESTION_THEME_DESCRIPTION_EXAMPLE, QUESTION_THEME_LABEL_EXAMPLE } from "@question/modules/question-theme/application/dto/zod/validators/constants/question-theme.zod.validators.constants";
import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme/question-theme.dto.shape";
import { QUESTION_THEME_DTO } from "@question/modules/question-theme/application/dto/question-theme/question-theme.dto.shape";

import { createFakeQuestionThemeDto } from "@faketories/contexts/question/question-theme/dto/question-theme.dto.faketory";

describe("Question Theme DTO Shape", () => {
  let validQuestionThemeDto: QuestionThemeDto;

  beforeEach(() => {
    validQuestionThemeDto = createFakeQuestionThemeDto();
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => QUESTION_THEME_DTO.parse(validQuestionThemeDto)).not.toThrow();
  });

  describe("id", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validQuestionThemeDto, { id: 123 });

      expect(() => QUESTION_THEME_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_DTO.shape.id.description).toBe("Question Theme's unique identifier");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const expectedMetadata = {
        description: "Question Theme's unique identifier",
        example: "60af924f4f1a2563f8e8b456",
      };

      expect(QUESTION_THEME_DTO.shape.id.meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("slug", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validQuestionThemeDto, { slug: 123 });

      expect(() => QUESTION_THEME_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_DTO.shape.slug.description).toBe("Question Theme's unique slug in kebab-case");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const expectedMetadata = {
        description: "Question Theme's unique slug in kebab-case",
        example: "general-knowledge",
      };

      expect(QUESTION_THEME_DTO.shape.slug.meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("label", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validQuestionThemeDto, { label: 123 });

      expect(() => QUESTION_THEME_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_DTO.shape.label.description).toBe("Question Theme's label");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const expectedMetadata = {
        description: "Question Theme's label",
        example: QUESTION_THEME_LABEL_EXAMPLE,
      };

      expect(QUESTION_THEME_DTO.shape.label.meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("aliases", () => {
    it("should throw a zod error when assigned a non-array value.", () => {
      const invalidDto = Object.assign(validQuestionThemeDto, { aliases: "not-an-array" });

      expect(() => QUESTION_THEME_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when array items are not strings.", () => {
      const invalidDto = Object.assign(validQuestionThemeDto, { aliases: ["a", 2, "c"] });

      expect(() => QUESTION_THEME_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_DTO.shape.aliases.description).toBe("Question Theme's aliases");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const expectedMetadata = {
        description: "Question Theme's aliases",
        example: QUESTION_THEME_ALIASES_EXAMPLE,
      };

      expect(QUESTION_THEME_DTO.shape.aliases.meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("description", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validQuestionThemeDto, { description: 123 });

      expect(() => QUESTION_THEME_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_DTO.shape.description.description).toBe("Question Theme's description");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const expectedMetadata = {
        description: "Question Theme's description",
        example: QUESTION_THEME_DESCRIPTION_EXAMPLE,
      };

      expect(QUESTION_THEME_DTO.shape.description.meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("color", () => {
    it("should pass validation when assigned valid hex color.", () => {
      const dtoWithColor = { ...validQuestionThemeDto, color: "#FF5733" };

      expect(() => QUESTION_THEME_DTO.parse(dtoWithColor)).not.toThrow();
    });

    it("should pass validation when color is omitted (optional).", () => {
      const dtoWithoutColor = { ...validQuestionThemeDto, color: undefined };

      expect(() => QUESTION_THEME_DTO.parse(dtoWithoutColor)).not.toThrow();
    });

    it("should throw a zod error when assigned invalid hex color format.", () => {
      const invalidDto = { ...validQuestionThemeDto, color: "#GGG" };

      expect(() => QUESTION_THEME_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_DTO.shape.color.unwrap().description).toBe("Question Theme's hex color");
    });

    it("should have the correct metadata when accessing the metadata.", () => {
      const expectedMetadata = {
        description: "Question Theme's hex color",
        example: HEX_COLOR_EXAMPLE,
      };

      expect(QUESTION_THEME_DTO.shape.color.unwrap().meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("status", () => {
    it("should throw a zod error when assigned an invalid enum value.", () => {
      const invalidDto = Object.assign(validQuestionThemeDto, { status: "unknown" });

      expect(() => QUESTION_THEME_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_DTO.shape.status.description).toBe("Question Theme's status");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const expectedMetadata = {
        description: "Question Theme's status",
        example: "active",
      };

      expect(QUESTION_THEME_DTO.shape.status.meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("createdAt", () => {
    it("should throw a zod error when assigned a non-iso datetime string.", () => {
      const invalidDto = Object.assign(validQuestionThemeDto, { createdAt: "not-a-date" });

      expect(() => QUESTION_THEME_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_DTO.shape.createdAt.description).toBe("Question Theme's creation date");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const expectedMetadata = {
        description: "Question Theme's creation date",
        example: "2026-04-14T00:00:00.000Z",
      };

      expect(QUESTION_THEME_DTO.shape.createdAt.meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("updatedAt", () => {
    it("should throw a zod error when assigned a non-iso datetime string.", () => {
      const invalidDto = Object.assign(validQuestionThemeDto, { updatedAt: 123 });

      expect(() => QUESTION_THEME_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_DTO.shape.updatedAt.description).toBe("Question Theme's last update date");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const expectedMetadata = {
        description: "Question Theme's last update date",
        example: "2026-04-14T00:00:00.000Z",
      };

      expect(QUESTION_THEME_DTO.shape.updatedAt.meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });
});