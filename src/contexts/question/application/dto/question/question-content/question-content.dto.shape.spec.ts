import { ZodError } from "zod";

import type { QuestionContentDto } from "@question/application/dto/question/question-content/question-content.dto.shape";
import { QUESTION_CONTENT_DTO } from "@question/application/dto/question/question-content/question-content.dto.shape";
import {
  QUESTION_STATEMENT_EXAMPLE,
  QUESTION_ANSWER_EXAMPLE,
  QUESTION_CONTEXT_EXAMPLE,
  QUESTION_TRIVIA_EXAMPLE,
} from "@question/application/dto/shared/zod/validators/question-content/constants/question-content.zod.validators.constants";

import { createFakeQuestionContentDto } from "@faketories/contexts/question/dto/question/question-content/question-content.dto.faketory";

describe("Question Content DTO Shape", () => {
  let validQuestionContentDto: QuestionContentDto;

  beforeEach(() => {
    validQuestionContentDto = createFakeQuestionContentDto();
  });

  it("should pass validation when a valid QuestionContentDto is provided.", () => {
    expect(() => QUESTION_CONTENT_DTO.parse(validQuestionContentDto)).not.toThrow();
  });

  describe("statement", () => {
    it("should throw zod error when statement is missing.", () => {
      const dtoWithoutStatement = Object.assign(validQuestionContentDto, { statement: undefined });

      expect(() => QUESTION_CONTENT_DTO.parse(dtoWithoutStatement)).toThrow(ZodError);
    });

    it("should throw zod error when statement is invalid.", () => {
      const dtoWithInvalidStatement = Object.assign(validQuestionContentDto, { statement: 123 });

      expect(() => QUESTION_CONTENT_DTO.parse(dtoWithInvalidStatement)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CONTENT_DTO.shape.statement.meta();
      const expectedMetadata = {
        description: "Question's statement",
        example: QUESTION_STATEMENT_EXAMPLE,
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("answer", () => {
    it("should throw zod error when answer is missing.", () => {
      const dtoWithoutAnswer = Object.assign(validQuestionContentDto, { answer: undefined });

      expect(() => QUESTION_CONTENT_DTO.parse(dtoWithoutAnswer)).toThrow(ZodError);
    });

    it("should throw zod error when answer is invalid.", () => {
      const dtoWithInvalidAnswer = Object.assign(validQuestionContentDto, { answer: 456 });

      expect(() => QUESTION_CONTENT_DTO.parse(dtoWithInvalidAnswer)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CONTENT_DTO.shape.answer.meta();
      const expectedMetadata = {
        description: "Question's answer",
        example: QUESTION_ANSWER_EXAMPLE,
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("context", () => {
    it("should throw zod error when context is invalid.", () => {
      const dtoWithInvalidContext = Object.assign(validQuestionContentDto, { context: 123 });

      expect(() => QUESTION_CONTENT_DTO.parse(dtoWithInvalidContext)).toThrow(ZodError);
    });

    it("should pass validation when context is omitted.", () => {
      const dtoWithoutContext = createFakeQuestionContentDto({ context: undefined });

      expect(() => QUESTION_CONTENT_DTO.parse(dtoWithoutContext)).not.toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CONTENT_DTO.shape.context.unwrap().meta();
      const expectedMetadata = {
        description: "Additional context for the question",
        example: QUESTION_CONTEXT_EXAMPLE,
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("trivia", () => {
    it("should throw zod error when trivia is invalid.", () => {
      const dtoWithInvalidTrivia = Object.assign(validQuestionContentDto, { trivia: 789 });

      expect(() => QUESTION_CONTENT_DTO.parse(dtoWithInvalidTrivia)).toThrow(ZodError);
    });

    it("should pass validation when trivia is omitted.", () => {
      const dtoWithoutTrivia = createFakeQuestionContentDto({ trivia: undefined });

      expect(() => QUESTION_CONTENT_DTO.parse(dtoWithoutTrivia)).not.toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CONTENT_DTO.shape.trivia.unwrap().meta();
      const expectedMetadata = {
        description: "Interesting trivia related to the question",
        example: QUESTION_TRIVIA_EXAMPLE,
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });
});