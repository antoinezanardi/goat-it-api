import { ZodError } from "zod";

import { QUESTION_THEME_ASSIGNMENT_MODIFICATION_DTO } from "@question/application/dto/question-theme-assignment-modification/question-theme-assignment-modification.dto.shape";

describe("Question Theme Assignment Modification DTO Shape", () => {
  it("should pass validation when a valid QuestionThemeAssignmentModificationDto is provided.", () => {
    const validDto = { isPrimary: true as const, isHint: true };

    expect(() => QUESTION_THEME_ASSIGNMENT_MODIFICATION_DTO.parse(validDto)).not.toThrow();
  });

  it("should pass validation when only isPrimary is provided.", () => {
    const dto = { isPrimary: true as const };

    expect(() => QUESTION_THEME_ASSIGNMENT_MODIFICATION_DTO.parse(dto)).not.toThrow();
  });

  it("should pass validation when only isHint is provided.", () => {
    const dto = { isHint: false };

    expect(() => QUESTION_THEME_ASSIGNMENT_MODIFICATION_DTO.parse(dto)).not.toThrow();
  });

  it("should pass validation when an empty object is provided.", () => {
    expect(() => QUESTION_THEME_ASSIGNMENT_MODIFICATION_DTO.parse({})).not.toThrow();
  });

  describe("isPrimary", () => {
    it("should throw zod error when isPrimary is false.", () => {
      const invalid = { isPrimary: false };

      expect(() => QUESTION_THEME_ASSIGNMENT_MODIFICATION_DTO.parse(invalid)).toThrow(ZodError);
    });

    it("should throw zod error when isPrimary is not a boolean.", () => {
      const invalid = { isPrimary: "not-boolean" };

      expect(() => QUESTION_THEME_ASSIGNMENT_MODIFICATION_DTO.parse(invalid)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_THEME_ASSIGNMENT_MODIFICATION_DTO.shape.isPrimary.unwrap().meta();
      const expectedMetadata = {
        description: "Set this theme as the primary theme for the question. Only true is accepted. The current primary will be automatically demoted",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("isHint", () => {
    it("should throw zod error when isHint is not a boolean.", () => {
      const invalid = { isHint: "not-boolean" };

      expect(() => QUESTION_THEME_ASSIGNMENT_MODIFICATION_DTO.parse(invalid)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_THEME_ASSIGNMENT_MODIFICATION_DTO.shape.isHint.unwrap().meta();
      const expectedMetadata = {
        description: "Indicates if the assigned theme is a hint for the question's answer",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });
});