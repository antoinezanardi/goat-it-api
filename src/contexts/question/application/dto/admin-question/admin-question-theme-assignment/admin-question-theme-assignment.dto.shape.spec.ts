import { ZodError } from "zod";

import { ADMIN_QUESTION_THEME_ASSIGNMENT_DTO } from "@question/application/dto/admin-question/admin-question-theme-assignment/admin-question-theme-assignment.dto.shape";

describe("Admin Question Theme Assignment DTO Shape", () => {
  let validAdminQuestionThemeAssignmentDto: {
    theme: {
      id: string;
      slug: string;
      label: { en: string; fr?: string; es?: string; de?: string; it?: string; pt?: string };
      aliases: { en?: string[]; fr?: string[]; es?: string[]; de?: string[]; it?: string[]; pt?: string[] };
      description: { en: string; fr?: string; es?: string; de?: string; it?: string; pt?: string };
      color?: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
    isPrimary: boolean;
    isHint: boolean;
  };

  beforeEach(() => {
    validAdminQuestionThemeAssignmentDto = {
      theme: {
        id: "60af924f4f1a2563f8e8b456",
        slug: "general-knowledge",
        label: { en: "General Knowledge" },
        aliases: { en: ["gk", "general"] },
        description: { en: "A theme for general knowledge questions" },
        color: "#FF5733",
        status: "active",
        createdAt: "2026-04-14T00:00:00.000Z",
        updatedAt: "2026-04-14T00:00:00.000Z",
      },
      isPrimary: true,
      isHint: false,
    };
  });

  it("should pass validation when a valid AdminQuestionThemeAssignmentDto is provided.", () => {
    expect(() => ADMIN_QUESTION_THEME_ASSIGNMENT_DTO.parse(validAdminQuestionThemeAssignmentDto)).not.toThrow();
  });

  it("should have correct metadata when accessing the metadata.", () => {
    const expectedMetadata = {
      description: "Question's theme assignment",
    };

    expect(ADMIN_QUESTION_THEME_ASSIGNMENT_DTO.meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
  });

  describe("theme", () => {
    it("should throw zod error when theme is invalid.", () => {
      const dtoWithInvalidTheme = { ...validAdminQuestionThemeAssignmentDto, theme: "invalid" };

      expect(() => ADMIN_QUESTION_THEME_ASSIGNMENT_DTO.parse(dtoWithInvalidTheme)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_THEME_ASSIGNMENT_DTO.shape.theme.meta();
      const expectedMetadata = {
        description: "Question assigned theme",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("isPrimary", () => {
    it("should throw a zod error when assigned a non-boolean value.", () => {
      const dtoWithInvalidIsPrimary = { ...validAdminQuestionThemeAssignmentDto, isPrimary: "invalid" };

      expect(() => ADMIN_QUESTION_THEME_ASSIGNMENT_DTO.parse(dtoWithInvalidIsPrimary)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_THEME_ASSIGNMENT_DTO.shape.isPrimary.meta();
      const expectedMetadata = {
        description: "Indicates if the assigned theme is the primary theme for the question",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("isHint", () => {
    it("should throw a zod error when assigned a non-boolean value.", () => {
      const dtoWithInvalidIsHint = { ...validAdminQuestionThemeAssignmentDto, isHint: "invalid" };

      expect(() => ADMIN_QUESTION_THEME_ASSIGNMENT_DTO.parse(dtoWithInvalidIsHint)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_THEME_ASSIGNMENT_DTO.shape.isHint.meta();
      const expectedMetadata = {
        description: "Indicates if the assigned theme is a hint for the question's answer",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });
});