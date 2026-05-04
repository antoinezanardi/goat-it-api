import { ZodError } from "zod";

import type { QuestionContentModificationDto } from "@question/application/dto/question-modification/question-content-modification/question-content-modification.dto.shape";
import { QUESTION_CONTENT_MODIFICATION_DTO } from "@question/application/dto/question-modification/question-content-modification/question-content-modification.dto.shape";

import { createFakeQuestionContentModificationDto } from "@faketories/contexts/question/dto/question-modification/question-modification.dto.faketory";

describe("Question Content Modification DTO Shape", () => {
  let validDto: QuestionContentModificationDto;

  beforeEach(() => {
    validDto = createFakeQuestionContentModificationDto();
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => QUESTION_CONTENT_MODIFICATION_DTO.parse(validDto)).not.toThrow();
  });

  it("should pass validation when assigned empty object.", () => {
    expect(() => QUESTION_CONTENT_MODIFICATION_DTO.parse({})).not.toThrow();
  });

  it("should have correct description when accessing the description.", () => {
    expect(QUESTION_CONTENT_MODIFICATION_DTO.description).toBe("Question's content modification payload");
  });

  describe("statement", () => {
    it("should throw a zod error when assigned a non-object value.", () => {
      const invalidDto = { ...validDto, statement: "not-localized" };

      expect(() => QUESTION_CONTENT_MODIFICATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_CONTENT_MODIFICATION_DTO.shape.statement.unwrap().description).toBe("Question's statement");
    });
  });

  describe("answer", () => {
    it("should throw a zod error when assigned a non-object value.", () => {
      const invalidDto = { ...validDto, answer: 123 };

      expect(() => QUESTION_CONTENT_MODIFICATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_CONTENT_MODIFICATION_DTO.shape.answer.unwrap().description).toBe("Question's answer");
    });
  });

  describe("context", () => {
    it("should throw a zod error when assigned a non-object value.", () => {
      const invalidDto = { ...validDto, context: 456 };

      expect(() => QUESTION_CONTENT_MODIFICATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_CONTENT_MODIFICATION_DTO.shape.context.unwrap().description).toBe("Additional context for the question");
    });
  });

  describe("trivia", () => {
    it("should throw a zod error when assigned a non-object value.", () => {
      const invalidDto = { ...validDto, trivia: "not-localized" };

      expect(() => QUESTION_CONTENT_MODIFICATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_CONTENT_MODIFICATION_DTO.shape.trivia.unwrap().description).toBe("Interesting trivia related to the question");
    });
  });
});