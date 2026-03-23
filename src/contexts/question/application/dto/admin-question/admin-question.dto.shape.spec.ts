import { ZodError } from "zod";

import { ISO_DATE_TIME_EXAMPLE } from "@shared/infrastructure/http/zod/validators/string/constants/string.zod.validators.constants";

import type { AdminQuestionDto } from "@question/application/dto/admin-question/admin-question.dto.shape";
import { ADMIN_QUESTION_DTO } from "@question/application/dto/admin-question/admin-question.dto.shape";

import { createFakeAdminQuestionThemeAssignmentDto } from "@faketories/contexts/question/dto/admin-question/admin-question-theme-assignment/admin-question-theme-assignment.dto.faketory";
import { createFakeAdminQuestionDto } from "@faketories/contexts/question/dto/admin-question/admin-question.dto.faketory";

describe("Admin Question DTO Shape", () => {
  let validAdminQuestionDto: AdminQuestionDto;

  beforeEach(() => {
    validAdminQuestionDto = createFakeAdminQuestionDto();
  });

  it("should pass validation when a valid AdminQuestionDto is provided.", () => {
    expect(() => ADMIN_QUESTION_DTO.parse(validAdminQuestionDto)).not.toThrow();
  });

  describe("id", () => {
    it("should throw zod error when id is invalid.", () => {
      const dtoWithInvalidId = Object.assign(validAdminQuestionDto, { id: "invalid" });

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithInvalidId)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_DTO.shape.id.meta();
      const expectedMetadata = {
        description: "Question's unique identifier",
        example: "60af924f4f1a2563f8e8b456",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("themes", () => {
    it("should throw zod error when themes is empty.", () => {
      const dtoWithEmptyThemes = Object.assign(validAdminQuestionDto, { themes: [] });

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithEmptyThemes)).toThrow(ZodError);
    });

    it("should throw zod error when themes is invalid.", () => {
      const dtoWithInvalidThemes = Object.assign(validAdminQuestionDto, { themes: "invalid" });

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithInvalidThemes)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_DTO.shape.themes.meta();
      const expectedMetadata = {
        description: "Question's themes",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });

    it("should throw zod error when themes exceed maximum items.", () => {
      const themes = [
        createFakeAdminQuestionThemeAssignmentDto(),
        createFakeAdminQuestionThemeAssignmentDto(),
        createFakeAdminQuestionThemeAssignmentDto(),
        createFakeAdminQuestionThemeAssignmentDto(),
      ];
      const dtoWithTooManyThemes = Object.assign(validAdminQuestionDto, { themes });

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithTooManyThemes)).toThrow(ZodError);
    });
  });

  describe("content", () => {
    it("should throw zod error when content is invalid.", () => {
      const dtoWithInvalidContent = Object.assign(validAdminQuestionDto, { content: "invalid" });

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithInvalidContent)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_DTO.shape.content.meta();
      const expectedMetadata = {
        description: "Question's content",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("cognitiveDifficulty", () => {
    it("should throw zod error when cognitiveDifficulty is invalid.", () => {
      const dtoWithInvalidCognitiveDifficulty = Object.assign(validAdminQuestionDto, { cognitiveDifficulty: "invalid" });

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithInvalidCognitiveDifficulty)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_DTO.shape.cognitiveDifficulty.meta();
      const expectedMetadata = {
        description: "Question's cognitive difficulty level",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("author", () => {
    it("should throw zod error when author is invalid.", () => {
      const dtoWithInvalidAuthor = Object.assign(validAdminQuestionDto, { author: "invalid" });

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithInvalidAuthor)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_DTO.shape.author.meta();
      const expectedMetadata = {
        description: "Question's author",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("status", () => {
    it("should throw zod error when status is invalid.", () => {
      const dtoWithInvalidStatus = Object.assign(validAdminQuestionDto, { status: "invalid" });

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithInvalidStatus)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_DTO.shape.status.meta();
      const expectedMetadata = {
        description: "Question's status",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("rejection", () => {
    it("should throw zod error when rejection is invalid.", () => {
      const dtoWithInvalidRejection = Object.assign(validAdminQuestionDto, { rejection: "invalid" });

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithInvalidRejection)).toThrow(ZodError);
    });

    it("should pass validation when rejection is omitted.", () => {
      const dtoWithoutRejection = createFakeAdminQuestionDto({ rejection: undefined });

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithoutRejection)).not.toThrow();
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_DTO.shape.rejection.meta();
      const expectedMetadata = {
        description: "Question's rejection details, if applicable",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("createdAt / updatedAt", () => {
    it("should throw zod error when createdAt is invalid.", () => {
      const dtoWithInvalidCreatedAt = Object.assign(validAdminQuestionDto, { createdAt: "not-a-date" });

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithInvalidCreatedAt)).toThrow(ZodError);
    });

    it("should throw zod error when updatedAt is invalid.", () => {
      const dtoWithInvalidUpdatedAt = Object.assign(validAdminQuestionDto, { updatedAt: 12_345 });

      expect(() => ADMIN_QUESTION_DTO.parse(dtoWithInvalidUpdatedAt)).toThrow(ZodError);
    });

    it("should have correct metadata for createdAt when accessed.", () => {
      const metadata = ADMIN_QUESTION_DTO.shape.createdAt.meta();
      const expectedMetadata = {
        description: "Question's creation date",
        example: ISO_DATE_TIME_EXAMPLE,
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });

    it("should have correct metadata for updatedAt when accessed.", () => {
      const metadata = ADMIN_QUESTION_DTO.shape.updatedAt.meta();
      const expectedMetadata = {
        description: "Question's last update date",
        example: ISO_DATE_TIME_EXAMPLE,
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });
});