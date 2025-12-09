import { ZodError } from "zod";

import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme.dto";
import { QUESTION_THEME_DTO } from "@question/modules/question-theme/application/dto/question-theme.dto";

import { createFakeQuestionThemeDto } from "@faketories/contexts/question/question-theme/question-theme.faketory";

describe("Question Theme Dto", () => {
  let validQuestionThemeDto: QuestionThemeDto;

  beforeEach(() => {
    validQuestionThemeDto = createFakeQuestionThemeDto();
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => QUESTION_THEME_DTO.parse(validQuestionThemeDto)).not.toThrowError();
  });

  describe("id", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validQuestionThemeDto, { id: 123 });

      expect(() => QUESTION_THEME_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_DTO.shape.id.description).toBe("Question Theme's unique identifier.");
    });
  });

  describe("slug", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validQuestionThemeDto, { slug: 123 });

      expect(() => QUESTION_THEME_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_DTO.shape.slug.description).toBe("Question Theme's unique slug in kebab-case.");
    });
  });

  describe("label", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validQuestionThemeDto, { label: 123 });

      expect(() => QUESTION_THEME_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_DTO.shape.label.description).toBe("Question Theme's translated label.");
    });
  });

  describe("aliases", () => {
    it("should throw a zod error when assigned a non-array value.", () => {
      const invalidDto = Object.assign(validQuestionThemeDto, { aliases: "not-an-array" });

      expect(() => QUESTION_THEME_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should throw a zod error when array items are not strings.", () => {
      const invalidDto = Object.assign(validQuestionThemeDto, { aliases: ["a", 2, "c"] });

      expect(() => QUESTION_THEME_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_DTO.shape.aliases.description).toBe("Question Theme's translated aliases. Help to find the theme with different keywords.");
    });
  });

  describe("description", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validQuestionThemeDto, { description: 123 });

      expect(() => QUESTION_THEME_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_DTO.shape.description.description).toBe("Question Theme's translated description.");
    });
  });

  describe("status", () => {
    it("should throw a zod error when assigned an invalid enum value.", () => {
      const invalidDto = Object.assign(validQuestionThemeDto, { status: "unknown" });

      expect(() => QUESTION_THEME_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_DTO.shape.status.description).toBe("Question Theme's status.");
    });
  });

  describe("createdAt", () => {
    it("should throw a zod error when assigned a non-iso datetime string.", () => {
      const invalidDto = Object.assign(validQuestionThemeDto, { createdAt: "not-a-date" });

      expect(() => QUESTION_THEME_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_DTO.shape.createdAt.description).toBe("Question Theme's creation date.");
    });
  });

  describe("updatedAt", () => {
    it("should throw a zod error when assigned a non-iso datetime string.", () => {
      const invalidDto = Object.assign(validQuestionThemeDto, { updatedAt: 123 });

      expect(() => QUESTION_THEME_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_DTO.shape.updatedAt.description).toBe("Question Theme's last update date.");
    });
  });
});