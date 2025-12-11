import { ZodError } from "zod";

import type { CreateQuestionThemeDto } from "@question/modules/question-theme/application/dto/create-question-theme.dto";
import { CREATE_QUESTION_THEME_DTO } from "@question/modules/question-theme/application/dto/create-question-theme.dto";

import { createFakeCreateQuestionThemeDto } from "@faketories/contexts/question/question-theme/question-theme.faketory";

describe("Create Question Theme Dto", () => {
  let validCreateQuestionThemeDto: CreateQuestionThemeDto;

  beforeEach(() => {
    validCreateQuestionThemeDto = createFakeCreateQuestionThemeDto();
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => CREATE_QUESTION_THEME_DTO.parse(validCreateQuestionThemeDto)).not.toThrowError();
  });

  describe("slug", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validCreateQuestionThemeDto, { slug: 123 });

      expect(() => CREATE_QUESTION_THEME_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(CREATE_QUESTION_THEME_DTO.shape.slug.description).toBe("Question Theme's unique slug in kebab-case.");
    });

    it("should have correct metadata when accessing the meta.", () => {
      const expectedMetadata = {
        description: "Question Theme's unique slug in kebab-case.",
        example: "general-knowledge",
      };

      expect(CREATE_QUESTION_THEME_DTO.shape.slug.meta()).toStrictEqual(expectedMetadata);
    });
  });

  describe("label", () => {
    it("should throw a zod error when assigned a non-object localized text.", () => {
      const invalidDto = Object.assign(validCreateQuestionThemeDto, { label: "not-localized" });

      expect(() => CREATE_QUESTION_THEME_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(CREATE_QUESTION_THEME_DTO.shape.label.description).toBe("Question Theme's translated label.");
    });
  });

  describe("aliases", () => {
    it("should throw a zod error when assigned a non-object localized texts.", () => {
      const invalidDto = Object.assign(validCreateQuestionThemeDto, { aliases: "not-localized" });

      expect(() => CREATE_QUESTION_THEME_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(CREATE_QUESTION_THEME_DTO.shape.aliases.description).toBe("Question Theme's translated aliases. Help to find the theme with different keywords.");
    });
  });

  describe("description", () => {
    it("should throw a zod error when assigned a non-object localized text.", () => {
      const invalidDto = Object.assign(validCreateQuestionThemeDto, { description: 456 });

      expect(() => CREATE_QUESTION_THEME_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(CREATE_QUESTION_THEME_DTO.shape.description.description).toBe("Question Theme's translated description.");
    });
  });
});