import { ZodError } from "zod";

import type { QuestionRejectionDto } from "@question/application/dto/shared/question-rejection/question-rejection.dto.shape";
import { QUESTION_REJECTION_DTO } from "@question/application/dto/shared/question-rejection/question-rejection.dto.shape";

import { createFakeQuestionRejectionDto } from "@faketories/contexts/question/dto/shared/question-rejection/question-rejection.dto.faketory";

describe("Question Rejection DTO Shape", () => {
  let validQuestionRejectionDto: QuestionRejectionDto;

  beforeEach(() => {
    validQuestionRejectionDto = createFakeQuestionRejectionDto();
  });

  it("should pass validation when a valid QuestionRejectionDto is provided.", () => {
    expect(() => QUESTION_REJECTION_DTO.parse(validQuestionRejectionDto)).not.toThrowError();
  });

  it("should have correct metadata when accessing the metadata.", () => {
    const expectedMetadata = {
      description: "Question rejection details",
    };

    expect(QUESTION_REJECTION_DTO.meta()).toStrictEqual(expectedMetadata);
  });

  describe("type", () => {
    it.each<{
      test: string;
      value: string;
      expected: boolean;
    }>([
      {
        test: "should return true when rejection type is 'inappropriate-content'.",
        value: "inappropriate-content",
        expected: true,
      },
      {
        test: "should return true when rejection type is 'incorrect-information'.",
        value: "incorrect-information",
        expected: true,
      },
      {
        test: "should return true when rejection type is 'poor-quality'.",
        value: "poor-quality",
        expected: true,
      },
      {
        test: "should return true when rejection type is 'duplicate-question'.",
        value: "duplicate-question",
        expected: true,
      },
      {
        test: "should return true when rejection type is 'other'.",
        value: "other",
        expected: true,
      },
      {
        test: "should return false when rejection type is 'spam'.",
        value: "spam",
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = QUESTION_REJECTION_DTO.shape.type.safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct meta when accessed.", () => {
      const metadata = QUESTION_REJECTION_DTO.shape.type.meta();
      const expectedMetadata = {
        description: "Question rejection's type",
        example: "inappropriate-content",
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });

  describe("comment", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validQuestionRejectionDto, { comment: 123 });

      expect(() => QUESTION_REJECTION_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should pass validation when comment is omitted.", () => {
      const dtoWithoutComment = createFakeQuestionRejectionDto({
        comment: undefined,
      });

      expect(() => QUESTION_REJECTION_DTO.parse(dtoWithoutComment)).not.toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const expectedMetadata = {
        description: "Comment explaining the reason for rejection",
        example: "The question is too ambiguous.",
      };

      expect(QUESTION_REJECTION_DTO.shape.comment.meta()).toStrictEqual(expectedMetadata);
    });
  });
});