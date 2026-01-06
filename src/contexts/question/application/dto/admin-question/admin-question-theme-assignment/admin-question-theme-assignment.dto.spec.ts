import { ZodError } from "zod";

import type { AdminQuestionThemeAssignmentDto } from "@question/application/dto/admin-question/admin-question-theme-assignment/admin-question-theme-assignment.dto";
import { ADMIN_QUESTION_THEME_ASSIGNMENT_DTO } from "@question/application/dto/admin-question/admin-question-theme-assignment/admin-question-theme-assignment.dto";

import { createFakeAdminQuestionThemeAssignmentDto } from "@faketories/contexts/question/dto/admin-question/admin-question-theme-assignment/admin-question-theme-assignment.dto.faketory";

describe("Admin Question Theme Assignment DTO Specs", () => {
  let validAdminQuestionThemeAssignmentDto: AdminQuestionThemeAssignmentDto;

  beforeEach(() => {
    validAdminQuestionThemeAssignmentDto = createFakeAdminQuestionThemeAssignmentDto();
  });

  it("should pass validation when a valid AdminQuestionThemeAssignmentDto is provided.", () => {
    expect(() => ADMIN_QUESTION_THEME_ASSIGNMENT_DTO.parse(validAdminQuestionThemeAssignmentDto)).not.toThrowError();
  });

  describe("theme", () => {
    it("should throw zod error when theme is invalid.", () => {
      const dtoWithInvalidTheme = Object.assign(validAdminQuestionThemeAssignmentDto, { theme: "invalid" });

      expect(() => ADMIN_QUESTION_THEME_ASSIGNMENT_DTO.parse(dtoWithInvalidTheme)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_THEME_ASSIGNMENT_DTO.shape.theme.meta();
      const expectedMetadata = {
        description: "Question assigned theme.",
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });

  describe("isPrimary", () => {
    it("should throw a zod error when assigned a non-boolean value.", () => {
      const dtoWithInvalidIsPrimary = Object.assign(validAdminQuestionThemeAssignmentDto, { isPrimary: "invalid" });

      expect(() => ADMIN_QUESTION_THEME_ASSIGNMENT_DTO.parse(dtoWithInvalidIsPrimary)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_THEME_ASSIGNMENT_DTO.shape.isPrimary.meta();
      const expectedMetadata = {
        description: "Indicates if the assigned theme is the primary theme for the question.",
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });

  describe("isHint", () => {
    it("should throw a zod error when assigned a non-boolean value.", () => {
      const dtoWithInvalidIsHint = Object.assign(validAdminQuestionThemeAssignmentDto, { isHint: "invalid" });

      expect(() => ADMIN_QUESTION_THEME_ASSIGNMENT_DTO.parse(dtoWithInvalidIsHint)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_THEME_ASSIGNMENT_DTO.shape.isHint.meta();
      const expectedMetadata = {
        description: "Indicates if the assigned theme is a hint for the question's answer.",
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });
});