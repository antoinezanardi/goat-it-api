import { ZodError } from "zod";

import type { QuestionContentCreationDto } from "@question/application/dto/question-creation/question-content-creation/question-content-creation.dto.shape";
import { QUESTION_CONTENT_CREATION_DTO } from "@question/application/dto/question-creation/question-content-creation/question-content-creation.dto.shape";

import { createFakeQuestionContentCreationDto } from "@faketories/contexts/question/dto/question-creation/question-content-creation/question-content-creation.dto.faketory";

describe("Question Content Creation DTO Shape", () => {
  let validDto: QuestionContentCreationDto;

  beforeEach(() => {
    validDto = createFakeQuestionContentCreationDto();
  });

  it("should pass validation when a valid QuestionContentCreationDto is provided.", () => {
    expect(() => QUESTION_CONTENT_CREATION_DTO.parse(validDto)).not.toThrowError();
  });

  describe("statement", () => {
    it("should throw zod error when statement is invalid.", () => {
      const invalid = Object.assign(validDto, { statement: "invalid" });

      expect(() => QUESTION_CONTENT_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CONTENT_CREATION_DTO.shape.statement.meta();
      const expectedMetadata = {
        description: "Question statement",
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });

  describe("answer", () => {
    it("should throw zod error when answer is invalid.", () => {
      const invalid = Object.assign(validDto, { answer: "invalid" });

      expect(() => QUESTION_CONTENT_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CONTENT_CREATION_DTO.shape.answer.meta();
      const expectedMetadata = {
        description: "Question answer",
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });

  describe("context", () => {
    it("should pass validation when context is omitted.", () => {
      const dtoWithoutContext = createFakeQuestionContentCreationDto({ context: undefined });

      expect(() => QUESTION_CONTENT_CREATION_DTO.parse(dtoWithoutContext)).not.toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CONTENT_CREATION_DTO.shape.context.meta();
      const expectedMetadata = {
        description: "Additional context for the question",
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });

  describe("trivia", () => {
    it("should pass validation when trivia is omitted.", () => {
      const dtoWithoutTrivia = createFakeQuestionContentCreationDto({ trivia: undefined });

      expect(() => QUESTION_CONTENT_CREATION_DTO.parse(dtoWithoutTrivia)).not.toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CONTENT_CREATION_DTO.shape.trivia.meta();
      const expectedMetadata = {
        description: "Interesting trivia related to the question",
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });
});