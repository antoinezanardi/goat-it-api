import { ZodError } from "zod";

import type { QuestionThemeModificationDto } from "@question/modules/question-theme/application/dto/question-theme-modification/question-theme-modification.dto";
import { QUESTION_THEME_MODIFICATION_DTO } from "@question/modules/question-theme/application/dto/question-theme-modification/question-theme-modification.dto";

import { createFakeQuestionThemeModificationDto } from "@faketories/contexts/question/question-theme/dto/question-theme.dto.faketory";

describe("Question Theme Modification Dto", () => {
  let validQuestionThemeModificationDto: QuestionThemeModificationDto;

  beforeEach(() => {
    validQuestionThemeModificationDto = createFakeQuestionThemeModificationDto();
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => QUESTION_THEME_MODIFICATION_DTO.parse(validQuestionThemeModificationDto)).not.toThrowError();
  });

  it("should pass validation when assigned empty object.", () => {
    const validEmptyDto = {} as QuestionThemeModificationDto;

    expect(() => QUESTION_THEME_MODIFICATION_DTO.parse(validEmptyDto)).not.toThrowError();
  });

  describe("slug", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validQuestionThemeModificationDto, { slug: 123 });

      expect(() => QUESTION_THEME_MODIFICATION_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_MODIFICATION_DTO.shape.slug.description).toBe("Question Theme's unique slug in kebab-case.");
    });

    it("should have correct metadata when accessing the meta.", () => {
      const expectedMetadata = {
        description: "Question Theme's unique slug in kebab-case.",
        example: "general-knowledge",
      };

      expect(QUESTION_THEME_MODIFICATION_DTO.shape.slug.meta()).toStrictEqual(expectedMetadata);
    });
  });

  describe("label", () => {
    it("should throw a zod error when assigned a non-object localized text.", () => {
      const invalidDto = Object.assign(validQuestionThemeModificationDto, { label: "not-localized" });

      expect(() => QUESTION_THEME_MODIFICATION_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_MODIFICATION_DTO.shape.label.description).toBe("Question Theme's translated label.");
    });
  });

  describe("aliases", () => {
    it("should throw a zod error when assigned a non-object localized texts.", () => {
      const invalidDto = Object.assign(validQuestionThemeModificationDto, { aliases: "not-localized" });

      expect(() => QUESTION_THEME_MODIFICATION_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_MODIFICATION_DTO.shape.aliases.description).toBe("Question Theme's translated aliases. Help to find the theme with different keywords.");
    });
  });

  describe("description", () => {
    it("should throw a zod error when assigned a non-object localized text.", () => {
      const invalidDto = Object.assign(validQuestionThemeModificationDto, { description: 456 });

      expect(() => QUESTION_THEME_MODIFICATION_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_MODIFICATION_DTO.shape.description.description).toBe("Question Theme's translated description.");
    });
  });
});