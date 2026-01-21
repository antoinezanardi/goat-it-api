import { ZodError } from "zod";

import type { QuestionCreationDto } from "@question/application/dto/question-creation/question-creation.dto";
import { QUESTION_CREATION_DTO } from "@question/application/dto/question-creation/question-creation.dto";

import { createFakeQuestionCreationDto } from "@faketories/contexts/question/dto/question-creation/question-creation.dto.faketory";

describe("Question Creation DTO Specs", () => {
  let validDto: QuestionCreationDto;

  beforeEach(() => {
    validDto = createFakeQuestionCreationDto();
  });

  it("should pass validation when a valid QuestionCreationDto is provided.", () => {
    expect(() => QUESTION_CREATION_DTO.parse(validDto)).not.toThrowError();
  });

  describe("themes", () => {
    it("should throw zod error when themes is empty.", () => {
      const invalid = Object.assign(validDto, { themes: [] });

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CREATION_DTO.shape.themes.meta();
      const expectedMetadata = {
        description: "Question's themes",
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });

  describe("content", () => {
    it("should throw zod error when content is invalid.", () => {
      const invalid = Object.assign(validDto, { content: "invalid" });

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CREATION_DTO.shape.content.meta();
      const expectedMetadata = {
        description: "Question's content",
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });

  describe("cognitiveDifficulty", () => {
    it("should throw zod error when cognitiveDifficulty is invalid.", () => {
      const invalid = Object.assign(validDto, { cognitiveDifficulty: "invalid" });

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CREATION_DTO.shape.cognitiveDifficulty.meta();
      const expectedMetadata = {
        description: "Question's cognitive difficulty level",
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });

  describe("author", () => {
    it("should throw zod error when author is invalid.", () => {
      const invalid = Object.assign(validDto, { author: "invalid" });

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CREATION_DTO.shape.author.meta();
      const expectedMetadata = {
        description: "Question's author",
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });

  describe("status", () => {
    it("should throw zod error when status is invalid.", () => {
      const invalid = Object.assign(validDto, { status: "invalid" });

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CREATION_DTO.shape.status.meta();
      const expectedMetadata = {
        description: "Question's status",
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });

  describe("sourceUrls", () => {
    it("should throw zod error when sourceUrls is invalid.", () => {
      const invalid = Object.assign(validDto, { sourceUrls: "invalid" });

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CREATION_DTO.shape.sourceUrls.meta();
      const expectedMetadata = {
        description: "List of unique source URLs for the question",
        example: ["https://example.com/source1", "https://example.com/source2"],
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });
});