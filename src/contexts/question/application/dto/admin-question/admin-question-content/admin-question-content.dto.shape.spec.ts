import { ZodError } from "zod";

import { ADMIN_QUESTION_CONTENT_DTO } from "@question/application/dto/admin-question/admin-question-content/admin-question-content.dto.shape";

describe("Admin Question Content DTO Shape", () => {
  let validAdminQuestionContentDto: { statement: { en: string }; answer: { en: string }; context?: { en: string }; trivia?: { en: string[] } };

  beforeEach(() => {
    validAdminQuestionContentDto = { statement: { en: "Test statement" }, answer: { en: "Test answer" } };
  });

  it("should pass validation when a valid AdminQuestionContentDto is provided.", () => {
    expect(() => ADMIN_QUESTION_CONTENT_DTO.parse(validAdminQuestionContentDto)).not.toThrow();
  });

  describe("statement", () => {
    it("should throw zod error when statement is missing.", () => {
      const dtoWithoutStatement = { ...validAdminQuestionContentDto, statement: undefined };

      expect(() => ADMIN_QUESTION_CONTENT_DTO.parse(dtoWithoutStatement)).toThrow(ZodError);
    });

    it("should throw zod error when statement is invalid.", () => {
      const dtoWithInvalidStatement = { ...validAdminQuestionContentDto, statement: "invalid" };

      expect(() => ADMIN_QUESTION_CONTENT_DTO.parse(dtoWithInvalidStatement)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_CONTENT_DTO.shape.statement.meta();
      const expectedMetadata = {
        description: "Question's statement",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("answer", () => {
    it("should throw zod error when answer is missing.", () => {
      const dtoWithoutAnswer = { ...validAdminQuestionContentDto, answer: undefined };

      expect(() => ADMIN_QUESTION_CONTENT_DTO.parse(dtoWithoutAnswer)).toThrow(ZodError);
    });

    it("should throw zod error when answer is invalid.", () => {
      const dtoWithInvalidAnswer = { ...validAdminQuestionContentDto, answer: 456 };

      expect(() => ADMIN_QUESTION_CONTENT_DTO.parse(dtoWithInvalidAnswer)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_CONTENT_DTO.shape.answer.meta();
      const expectedMetadata = {
        description: "Question's answer",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("context", () => {
    it("should pass validation when context is valid.", () => {
      const dtoWithValidContext = { ...validAdminQuestionContentDto, context: { en: "Additional context" } };

      expect(() => ADMIN_QUESTION_CONTENT_DTO.parse(dtoWithValidContext)).not.toThrow();
    });

    it("should throw zod error when context is invalid.", () => {
      const dtoWithInvalidContext = { ...validAdminQuestionContentDto, context: 123 };

      expect(() => ADMIN_QUESTION_CONTENT_DTO.parse(dtoWithInvalidContext)).toThrow(ZodError);
    });

    it("should pass validation when context is absent.", () => {
      const dtoWithoutContext = { ...validAdminQuestionContentDto, context: undefined };

      expect(() => ADMIN_QUESTION_CONTENT_DTO.parse(dtoWithoutContext)).not.toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_CONTENT_DTO.shape.context.unwrap().meta();
      const expectedMetadata = {
        description: "Additional context for the question",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("trivia", () => {
    it("should pass validation when trivia is valid.", () => {
      const dtoWithValidTrivia = { ...validAdminQuestionContentDto, trivia: { en: ["Fun fact 1", "Fun fact 2"] } };

      expect(() => ADMIN_QUESTION_CONTENT_DTO.parse(dtoWithValidTrivia)).not.toThrow();
    });

    it("should throw zod error when trivia is invalid.", () => {
      const dtoWithInvalidTrivia = { ...validAdminQuestionContentDto, trivia: 789 };

      expect(() => ADMIN_QUESTION_CONTENT_DTO.parse(dtoWithInvalidTrivia)).toThrow(ZodError);
    });

    it("should pass validation when trivia is absent.", () => {
      const dtoWithoutTrivia = { ...validAdminQuestionContentDto, trivia: undefined };

      expect(() => ADMIN_QUESTION_CONTENT_DTO.parse(dtoWithoutTrivia)).not.toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_QUESTION_CONTENT_DTO.shape.trivia.unwrap().meta();
      const expectedMetadata = {
        description: "Interesting trivia related to the question",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });
});