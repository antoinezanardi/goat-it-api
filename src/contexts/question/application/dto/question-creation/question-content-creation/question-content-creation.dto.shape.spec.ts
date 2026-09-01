import { ZodError } from "zod";

import { QUESTION_CONTENT_CREATION_DTO } from "@question/application/dto/question-creation/question-content-creation/question-content-creation.dto.shape";

describe("Question Content Creation DTO Shape", () => {
  let validDto: { statement: { en: string }; answer: { en: string }; context?: { en: string }; trivia?: Record<string, string[]> };

  beforeEach(() => {
    validDto = {
      statement: { en: "What is the capital of France?" },
      answer: { en: "Paris" },
      context: { en: "Geography question" },
      trivia: { en: ["Paris is the capital of France"] },
    };
  });

  it("should pass validation when a valid QuestionContentCreationDto is provided.", () => {
    expect(() => QUESTION_CONTENT_CREATION_DTO.parse(validDto)).not.toThrow();
  });

  describe("statement", () => {
    it("should throw zod error when statement is invalid.", () => {
      const invalid = { ...validDto, statement: "invalid" };

      expect(() => QUESTION_CONTENT_CREATION_DTO.parse(invalid)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CONTENT_CREATION_DTO.shape.statement.meta();
      const expectedMetadata = {
        description: "Question's statement",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("answer", () => {
    it("should throw zod error when answer is invalid.", () => {
      const invalid = { ...validDto, answer: "invalid" };

      expect(() => QUESTION_CONTENT_CREATION_DTO.parse(invalid)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CONTENT_CREATION_DTO.shape.answer.meta();
      const expectedMetadata = {
        description: "Question's answer",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("context", () => {
    it("should throw zod error when context is invalid.", () => {
      const invalid = { ...validDto, context: 123 };

      expect(() => QUESTION_CONTENT_CREATION_DTO.parse(invalid)).toThrow(ZodError);
    });

    it("should pass validation when context is omitted.", () => {
      const dtoWithoutContext = { ...validDto, context: undefined };

      expect(() => QUESTION_CONTENT_CREATION_DTO.parse(dtoWithoutContext)).not.toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CONTENT_CREATION_DTO.shape.context.unwrap().meta();
      const expectedMetadata = {
        description: "Additional context for the question",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("trivia", () => {
    it("should throw zod error when trivia is invalid.", () => {
      const invalid = { ...validDto, trivia: 456 };

      expect(() => QUESTION_CONTENT_CREATION_DTO.parse(invalid)).toThrow(ZodError);
    });

    it("should pass validation when trivia is omitted.", () => {
      const dtoWithoutTrivia = { ...validDto, trivia: undefined };

      expect(() => QUESTION_CONTENT_CREATION_DTO.parse(dtoWithoutTrivia)).not.toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CONTENT_CREATION_DTO.shape.trivia.unwrap().meta();
      const expectedMetadata = {
        description: "Interesting trivia related to the question",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });
});