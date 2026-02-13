import { ZodError } from "zod";

import type { AdminQuestionThemeDto } from "@question/modules/question-theme/application/dto/admin-question-theme/admin-question-theme.dto.shape";
import { ADMIN_QUESTION_THEME_DTO } from "@question/modules/question-theme/application/dto/admin-question-theme/admin-question-theme.dto.shape";

import { createFakeAdminQuestionThemeDto } from "@faketories/contexts/question/question-theme/dto/question-theme.dto.faketory";

describe("Admin Question Theme DTO Shape", () => {
  let validAdminQuestionThemeDto: AdminQuestionThemeDto;

  beforeEach(() => {
    validAdminQuestionThemeDto = createFakeAdminQuestionThemeDto();
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => ADMIN_QUESTION_THEME_DTO.parse(validAdminQuestionThemeDto)).not.toThrowError();
  });

  describe("id", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validAdminQuestionThemeDto, { id: 123 });

      expect(() => ADMIN_QUESTION_THEME_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(ADMIN_QUESTION_THEME_DTO.shape.id.description).toBe("Question Theme's unique identifier");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const expectedMetadata = {
        description: "Question Theme's unique identifier",
        example: "60af924f4f1a2563f8e8b456",
      };

      expect(ADMIN_QUESTION_THEME_DTO.shape.id.meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("slug", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validAdminQuestionThemeDto, { slug: 123 });

      expect(() => ADMIN_QUESTION_THEME_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(ADMIN_QUESTION_THEME_DTO.shape.slug.description).toBe("Question Theme's unique slug in kebab-case");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const expectedMetadata = {
        description: "Question Theme's unique slug in kebab-case",
        example: "general-knowledge",
      };

      expect(ADMIN_QUESTION_THEME_DTO.shape.slug.meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("label", () => {
    it("should throw a zod error when assigned a non localized text value.", () => {
      const invalidDto = Object.assign(validAdminQuestionThemeDto, { label: { en: 123 } });

      expect(() => ADMIN_QUESTION_THEME_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(ADMIN_QUESTION_THEME_DTO.shape.label.description).toBe("Question Theme's label in supported locales");
    });
  });

  describe("aliases", () => {
    it("should throw a zod error when assigned a non localized texts value.", () => {
      const invalidDto = Object.assign(validAdminQuestionThemeDto, { aliases: { en: "invalid-value" } });

      expect(() => ADMIN_QUESTION_THEME_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(ADMIN_QUESTION_THEME_DTO.shape.aliases.description).toBe("Question Theme's aliases in supported locales. Help to find the theme with different keywords");
    });
  });

  describe("description", () => {
    it("should throw a zod error when assigned a non localized text value.", () => {
      const invalidDto = Object.assign(validAdminQuestionThemeDto, { description: { en: 123 } });

      expect(() => ADMIN_QUESTION_THEME_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(ADMIN_QUESTION_THEME_DTO.shape.description.description).toBe("Question Theme's description in supported locales");
    });
  });

  describe("status", () => {
    it("should throw a zod error when assigned an invalid enum value.", () => {
      const invalidDto = Object.assign(validAdminQuestionThemeDto, { status: "unknown" });

      expect(() => ADMIN_QUESTION_THEME_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(ADMIN_QUESTION_THEME_DTO.shape.status.description).toBe("Question Theme's status");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const expectedMetadata = {
        description: "Question Theme's status",
        example: "active",
      };

      expect(ADMIN_QUESTION_THEME_DTO.shape.status.meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("createdAt", () => {
    it("should throw a zod error when assigned a non-iso datetime string.", () => {
      const invalidDto = Object.assign(validAdminQuestionThemeDto, { createdAt: "not-a-date" });

      expect(() => ADMIN_QUESTION_THEME_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(ADMIN_QUESTION_THEME_DTO.shape.createdAt.description).toBe("Question Theme's creation date");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const expectedMetadata = {
        description: "Question Theme's creation date",
        example: "2026-04-14T00:00:00.000Z",
      };

      expect(ADMIN_QUESTION_THEME_DTO.shape.createdAt.meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("updatedAt", () => {
    it("should throw a zod error when assigned a non-iso datetime string.", () => {
      const invalidDto = Object.assign(validAdminQuestionThemeDto, { updatedAt: 123 });

      expect(() => ADMIN_QUESTION_THEME_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(ADMIN_QUESTION_THEME_DTO.shape.updatedAt.description).toBe("Question Theme's last update date");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const expectedMetadata = {
        description: "Question Theme's last update date",
        example: "2026-04-14T00:00:00.000Z",
      };

      expect(ADMIN_QUESTION_THEME_DTO.shape.updatedAt.meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });
});