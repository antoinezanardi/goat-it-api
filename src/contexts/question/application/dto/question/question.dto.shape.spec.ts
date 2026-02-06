import { ZodError } from "zod";

import { ISO_DATE_TIME_EXAMPLE } from "@shared/infrastructure/http/zod/validators/string/constants/string.zod.validators.constants";

import type { QuestionDto } from "@question/application/dto/question/question.dto.shape";
import { QUESTION_DTO } from "@question/application/dto/question/question.dto.shape";

import { createFakeQuestionThemeAssignmentDto } from "@faketories/contexts/question/dto/question/question-theme-assignment/question-theme-assignment.dto.faketory";
import { createFakeQuestionDto } from "@faketories/contexts/question/dto/question/question.dto.faketory";

describe("Question DTO Shape", () => {
  let validQuestionDto: QuestionDto;

  beforeEach(() => {
    validQuestionDto = createFakeQuestionDto();
  });

  it("should pass validation when a valid QuestionDto is provided.", () => {
    expect(() => QUESTION_DTO.parse(validQuestionDto)).not.toThrowError();
  });

  describe("id", () => {
    it("should throw zod error when id is invalid.", () => {
      const dtoWithInvalidId = Object.assign(validQuestionDto, { id: "invalid" });

      expect(() => QUESTION_DTO.parse(dtoWithInvalidId)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_DTO.shape.id.meta();
      const expectedMetadata = {
        description: "Question's unique identifier",
        example: "60af924f4f1a2563f8e8b456",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("themes", () => {
    it("should throw zod error when themes is empty.", () => {
      const dtoWithEmptyThemes = Object.assign(validQuestionDto, { themes: [] });

      expect(() => QUESTION_DTO.parse(dtoWithEmptyThemes)).toThrowError(ZodError);
    });

    it("should throw zod error when themes is invalid.", () => {
      const dtoWithInvalidThemes = Object.assign(validQuestionDto, { themes: "invalid" });

      expect(() => QUESTION_DTO.parse(dtoWithInvalidThemes)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_DTO.shape.themes.meta();
      const expectedMetadata = {
        description: "Question's themes",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });

    it("should throw zod error when themes exceed maximum items.", () => {
      const themes = [
        createFakeQuestionThemeAssignmentDto(),
        createFakeQuestionThemeAssignmentDto(),
        createFakeQuestionThemeAssignmentDto(),
        createFakeQuestionThemeAssignmentDto(),
      ];
      const dtoWithTooManyThemes = Object.assign(validQuestionDto, { themes });

      expect(() => QUESTION_DTO.parse(dtoWithTooManyThemes)).toThrowError(ZodError);
    });
  });

  describe("content", () => {
    it("should throw zod error when content is invalid.", () => {
      const dtoWithInvalidContent = Object.assign(validQuestionDto, { content: "invalid" });

      expect(() => QUESTION_DTO.parse(dtoWithInvalidContent)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_DTO.shape.content.meta();
      const expectedMetadata = {
        description: "Question's content",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("cognitiveDifficulty", () => {
    it("should throw zod error when cognitiveDifficulty is invalid.", () => {
      const dtoWithInvalidCognitiveDifficulty = Object.assign(validQuestionDto, { cognitiveDifficulty: "invalid" });

      expect(() => QUESTION_DTO.parse(dtoWithInvalidCognitiveDifficulty)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_DTO.shape.cognitiveDifficulty.meta();
      const expectedMetadata = {
        description: "Question's cognitive difficulty level",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("author", () => {
    it("should throw zod error when author is invalid.", () => {
      const dtoWithInvalidAuthor = Object.assign(validQuestionDto, { author: "invalid" });

      expect(() => QUESTION_DTO.parse(dtoWithInvalidAuthor)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_DTO.shape.author.meta();
      const expectedMetadata = {
        description: "Question's author",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("status", () => {
    it("should throw zod error when status is invalid.", () => {
      const dtoWithInvalidStatus = Object.assign(validQuestionDto, { status: "invalid" });

      expect(() => QUESTION_DTO.parse(dtoWithInvalidStatus)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_DTO.shape.status.meta();
      const expectedMetadata = {
        description: "Question's status",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("rejection", () => {
    it("should throw zod error when rejection is invalid.", () => {
      const dtoWithInvalidRejection = Object.assign(validQuestionDto, { rejection: "invalid" });

      expect(() => QUESTION_DTO.parse(dtoWithInvalidRejection)).toThrowError(ZodError);
    });

    it("should pass validation when rejection is omitted.", () => {
      const dtoWithoutRejection = createFakeQuestionDto({ rejection: undefined });

      expect(() => QUESTION_DTO.parse(dtoWithoutRejection)).not.toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_DTO.shape.rejection.meta();
      const expectedMetadata = {
        description: "Question's rejection details, if applicable",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("sourceUrls", () => {
    it("should throw zod error when sourceUrls is invalid.", () => {
      const dtoWithInvalidSourceUrls = Object.assign(validQuestionDto, { sourceUrls: "invalid" });

      expect(() => QUESTION_DTO.parse(dtoWithInvalidSourceUrls)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_DTO.shape.sourceUrls.meta();
      const expectedMetadata = {
        description: "List of unique source URLs for the question",
        example: [
          "https://example.com/source1",
          "https://example.com/source2",
        ],
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("createdAt / updatedAt", () => {
    it("should throw zod error when createdAt is invalid.", () => {
      const dtoWithInvalidCreatedAt = Object.assign(validQuestionDto, { createdAt: "not-a-date" });

      expect(() => QUESTION_DTO.parse(dtoWithInvalidCreatedAt)).toThrowError(ZodError);
    });

    it("should throw zod error when updatedAt is invalid.", () => {
      const dtoWithInvalidUpdatedAt = Object.assign(validQuestionDto, { updatedAt: "not-a-date" });

      expect(() => QUESTION_DTO.parse(dtoWithInvalidUpdatedAt)).toThrowError(ZodError);
    });

    it("should have correct metadata for createdAt when accessed.", () => {
      const metadata = QUESTION_DTO.shape.createdAt.meta();
      const expectedMetadata = {
        description: "Question's creation date",
        example: ISO_DATE_TIME_EXAMPLE,
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });

    it("should have correct metadata for updatedAt when accessed.", () => {
      const metadata = QUESTION_DTO.shape.updatedAt.meta();
      const expectedMetadata = {
        description: "Question's last update date",
        example: ISO_DATE_TIME_EXAMPLE,
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });
});