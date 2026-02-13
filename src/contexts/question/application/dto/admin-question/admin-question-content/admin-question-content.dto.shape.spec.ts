import { ZodError } from "zod";

import type { AdminQuestionContentDto } from "@question/application/dto/admin-question/admin-question-content/admin-question-content.dto.shape";
import { ADMIN_QUESTION_CONTENT_DTO } from "@question/application/dto/admin-question/admin-question-content/admin-question-content.dto.shape";

import { createFakeAdminQuestionContentDto } from "@faketories/contexts/question/dto/admin-question/admin-question-content/admin-question-content.dto.faketory";

describe("Admin Question Content DTO Shape", () => {
  let validAdminQuestionContentDto: AdminQuestionContentDto;

  beforeEach(() => {
    validAdminQuestionContentDto = createFakeAdminQuestionContentDto();
  });

  it("should pass validation when a valid AdminQuestionContentDto is provided.", () => {
    expect(() => ADMIN_QUESTION_CONTENT_DTO.parse(validAdminQuestionContentDto)).not.toThrowError();
  });

  describe("statement", () => {
    it("should throw zod error when statement is missing.", () => {
      const dtoWithoutStatement = Object.assign(validAdminQuestionContentDto, { statement: undefined });

      expect(() => ADMIN_QUESTION_CONTENT_DTO.parse(dtoWithoutStatement)).toThrowError(ZodError);
    });

    it("should throw zod error when statement is invalid.", () => {
      const dtoWithInvalidStatement = Object.assign(validAdminQuestionContentDto, { statement: "invalid" });

      expect(() => ADMIN_QUESTION_CONTENT_DTO.parse(dtoWithInvalidStatement)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_CONTENT_DTO.shape.statement.meta();
      const expectedMetadata = {
        description: "Question statement in supported locales",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("answer", () => {
    it("should throw zod error when answer is missing.", () => {
      const dtoWithoutAnswer = Object.assign(validAdminQuestionContentDto, { answer: undefined });

      expect(() => ADMIN_QUESTION_CONTENT_DTO.parse(dtoWithoutAnswer)).toThrowError(ZodError);
    });

    it("should throw zod error when answer is invalid.", () => {
      const dtoWithInvalidAnswer = Object.assign(validAdminQuestionContentDto, { answer: 456 });

      expect(() => ADMIN_QUESTION_CONTENT_DTO.parse(dtoWithInvalidAnswer)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_CONTENT_DTO.shape.answer.meta();
      const expectedMetadata = {
        description: "Question answer in supported locales",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("context", () => {
    it("should throw zod error when context is invalid.", () => {
      const dtoWithInvalidContext = Object.assign(validAdminQuestionContentDto, { context: 123 });

      expect(() => ADMIN_QUESTION_CONTENT_DTO.parse(dtoWithInvalidContext)).toThrowError(ZodError);
    });

    it("should pass validation when context is omitted.", () => {
      const dtoWithoutContext = createFakeAdminQuestionContentDto({ context: undefined });

      expect(() => ADMIN_QUESTION_CONTENT_DTO.parse(dtoWithoutContext)).not.toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_CONTENT_DTO.shape.context.meta();
      const expectedMetadata = {
        description: "Additional context for the question in supported locales",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("trivia", () => {
    it("should throw zod error when trivia is invalid.", () => {
      const dtoWithInvalidTrivia = Object.assign(validAdminQuestionContentDto, { trivia: 789 });

      expect(() => ADMIN_QUESTION_CONTENT_DTO.parse(dtoWithInvalidTrivia)).toThrowError(ZodError);
    });

    it("should pass validation when trivia is omitted.", () => {
      const dtoWithoutTrivia = createFakeAdminQuestionContentDto({ trivia: undefined });

      expect(() => ADMIN_QUESTION_CONTENT_DTO.parse(dtoWithoutTrivia)).not.toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_CONTENT_DTO.shape.trivia.meta();
      const expectedMetadata = {
        description: "Interesting trivia related to the question in supported locales",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });
});