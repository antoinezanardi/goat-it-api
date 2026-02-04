import { ZodError } from "zod";

import type { QuestionThemeAssignmentDto } from "@question/application/dto/question/question-theme-assignment/question-theme-assignment.dto";
import { QUESTION_THEME_ASSIGNMENT_DTO } from "@question/application/dto/question/question-theme-assignment/question-theme-assignment.schema";

import { createFakeQuestionThemeAssignmentDto } from "@faketories/contexts/question/dto/question/question-theme-assignment/question-theme-assignment.dto.faketory";

describe("Question Theme Assignment DTO Specs", () => {
  let validQuestionThemeAssignmentDto: QuestionThemeAssignmentDto;

  beforeEach(() => {
    validQuestionThemeAssignmentDto = createFakeQuestionThemeAssignmentDto();
  });

  it("should pass validation when a valid QuestionThemeAssignmentDto is provided.", () => {
    expect(() => QUESTION_THEME_ASSIGNMENT_DTO.parse(validQuestionThemeAssignmentDto)).not.toThrowError();
  });

  it("should have correct metadata when accessing the metadata.", () => {
    const expectedMetadata = {
      description: "Question's theme assignment",
    };

    expect(QUESTION_THEME_ASSIGNMENT_DTO.meta()).toStrictEqual(expectedMetadata);
  });

  describe("theme", () => {
    it("should throw zod error when theme is invalid.", () => {
      const dtoWithInvalidTheme = Object.assign(validQuestionThemeAssignmentDto, { theme: "invalid" });

      expect(() => QUESTION_THEME_ASSIGNMENT_DTO.parse(dtoWithInvalidTheme)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_THEME_ASSIGNMENT_DTO.shape.theme.meta();
      const expectedMetadata = {
        description: "Question assigned theme",
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });

  describe("isPrimary", () => {
    it("should throw a zod error when assigned a non-boolean value.", () => {
      const dtoWithInvalidIsPrimary = Object.assign(validQuestionThemeAssignmentDto, { isPrimary: "invalid" });

      expect(() => QUESTION_THEME_ASSIGNMENT_DTO.parse(dtoWithInvalidIsPrimary)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_THEME_ASSIGNMENT_DTO.shape.isPrimary.meta();
      const expectedMetadata = {
        description: "Indicates if the assigned theme is the primary theme for the question",
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });

  describe("isHint", () => {
    it("should throw a zod error when assigned a non-boolean value.", () => {
      const dtoWithInvalidIsHint = Object.assign(validQuestionThemeAssignmentDto, { isHint: "invalid" });

      expect(() => QUESTION_THEME_ASSIGNMENT_DTO.parse(dtoWithInvalidIsHint)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_THEME_ASSIGNMENT_DTO.shape.isHint.meta();
      const expectedMetadata = {
        description: "Indicates if the assigned theme is a hint for the question's answer",
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });
});