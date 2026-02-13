import { ZodError } from "zod";

import type { QuestionThemeAssignmentCreationDto } from "@question/application/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto.shape";
import { QUESTION_THEME_ASSIGNMENT_CREATION_DTO } from "@question/application/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto.shape";

import { createFakeQuestionThemeAssignmentCreationDto } from "@faketories/contexts/question/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto.faketory";

describe("Question Theme Assignment Creation DTO Shape", () => {
  let validDto: QuestionThemeAssignmentCreationDto;

  beforeEach(() => {
    validDto = createFakeQuestionThemeAssignmentCreationDto();
  });

  it("should pass validation when a valid QuestionThemeAssignmentCreationDto is provided.", () => {
    expect(() => QUESTION_THEME_ASSIGNMENT_CREATION_DTO.parse(validDto)).not.toThrowError();
  });

  describe("themeId", () => {
    it("should throw zod error when themeId is invalid.", () => {
      const invalid = Object.assign(validDto, { themeId: "not-an-id" });

      expect(() => QUESTION_THEME_ASSIGNMENT_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_THEME_ASSIGNMENT_CREATION_DTO.shape.themeId.meta();
      const expectedMetadata = {
        description: "The ID of the theme to assign to the question",
        example: "60af924f4f1a2563f8e8b456",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("isPrimary", () => {
    it("should throw zod error when isPrimary is invalid.", () => {
      const invalid = Object.assign(validDto, { isPrimary: "not-boolean" });

      expect(() => QUESTION_THEME_ASSIGNMENT_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_THEME_ASSIGNMENT_CREATION_DTO.shape.isPrimary.meta();
      const expectedMetadata = {
        description: "Indicates if the assigned theme is the primary theme for the question. Only one primary theme is allowed per question",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("isHint", () => {
    it("should throw zod error when isHint is invalid.", () => {
      const invalid = Object.assign(validDto, { isHint: "not-boolean" });

      expect(() => QUESTION_THEME_ASSIGNMENT_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_THEME_ASSIGNMENT_CREATION_DTO.shape.isHint.meta();
      const expectedMetadata = {
        description: "Indicates if the assigned theme is a hint for the question's answer",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });
});