import { ZodError } from "zod";

import type { QuestionContentDto } from "@question/application/dto/question/question-content/question-content.dto.shape";
import { QUESTION_CONTENT_DTO } from "@question/application/dto/question/question-content/question-content.dto.shape";

import { createFakeQuestionContentDto } from "@faketories/contexts/question/dto/question/question-content/question-content.dto.faketory";

describe("Question Content DTO Shape", () => {
  let validQuestionContentDto: QuestionContentDto;

  beforeEach(() => {
    validQuestionContentDto = createFakeQuestionContentDto();
  });

  it("should pass validation when a valid QuestionContentDto is provided.", () => {
    expect(() => QUESTION_CONTENT_DTO.parse(validQuestionContentDto)).not.toThrowError();
  });

  describe("statement", () => {
    it("should throw zod error when statement is missing.", () => {
      const dtoWithoutStatement = Object.assign(validQuestionContentDto, { statement: undefined });

      expect(() => QUESTION_CONTENT_DTO.parse(dtoWithoutStatement)).toThrowError(ZodError);
    });

    it("should throw zod error when statement is invalid.", () => {
      const dtoWithInvalidStatement = Object.assign(validQuestionContentDto, { statement: 123 });

      expect(() => QUESTION_CONTENT_DTO.parse(dtoWithInvalidStatement)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CONTENT_DTO.shape.statement.meta();
      const expectedMetadata = {
        description: "Question translated statement",
        example: "What is the capital of France?",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("answer", () => {
    it("should throw zod error when answer is missing.", () => {
      const dtoWithoutAnswer = Object.assign(validQuestionContentDto, { answer: undefined });

      expect(() => QUESTION_CONTENT_DTO.parse(dtoWithoutAnswer)).toThrowError(ZodError);
    });

    it("should throw zod error when answer is invalid.", () => {
      const dtoWithInvalidAnswer = Object.assign(validQuestionContentDto, { answer: 456 });

      expect(() => QUESTION_CONTENT_DTO.parse(dtoWithInvalidAnswer)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CONTENT_DTO.shape.answer.meta();
      const expectedMetadata = {
        description: "Question translated answer",
        example: "The capital of France is Paris.",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("context", () => {
    it("should throw zod error when context is invalid.", () => {
      const dtoWithInvalidContext = Object.assign(validQuestionContentDto, { context: 123 });

      expect(() => QUESTION_CONTENT_DTO.parse(dtoWithInvalidContext)).toThrowError(ZodError);
    });

    it("should pass validation when context is omitted.", () => {
      const dtoWithoutContext = createFakeQuestionContentDto({ context: undefined });

      expect(() => QUESTION_CONTENT_DTO.parse(dtoWithoutContext)).not.toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CONTENT_DTO.shape.context.meta();
      const expectedMetadata = {
        description: "Additional translated context for the question",
        example: "France is a country in Western Europe.",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("trivia", () => {
    it("should throw zod error when trivia is invalid.", () => {
      const dtoWithInvalidTrivia = Object.assign(validQuestionContentDto, { trivia: 789 });

      expect(() => QUESTION_CONTENT_DTO.parse(dtoWithInvalidTrivia)).toThrowError(ZodError);
    });

    it("should pass validation when trivia is omitted.", () => {
      const dtoWithoutTrivia = createFakeQuestionContentDto({ trivia: undefined });

      expect(() => QUESTION_CONTENT_DTO.parse(dtoWithoutTrivia)).not.toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CONTENT_DTO.shape.trivia.meta();
      const expectedMetadata = {
        description: "Interesting translated trivia related to the question",
        example: ["Paris is known as the 'City of Light'.", "The Eiffel Tower is located in Paris."],
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });
});