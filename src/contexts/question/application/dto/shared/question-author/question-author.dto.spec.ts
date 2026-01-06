import { ZodError } from "zod";

import type { QuestionAuthorDto } from "@question/application/dto/shared/question-author/question-author.dto";
import { QUESTION_AUTHOR_DTO } from "@question/application/dto/shared/question-author/question-author.dto";

import { createFakeQuestionAuthorDto } from "@faketories/contexts/question/dto/shared/question-author/question-author.dto.faketory";

describe("Question Author DTO Specs", () => {
  let validQuestionAuthorDto: QuestionAuthorDto;

  beforeEach(() => {
    validQuestionAuthorDto = createFakeQuestionAuthorDto();
  });

  it("should pass validation when a valid QuestionAuthorDto is provided.", () => {
    expect(() => QUESTION_AUTHOR_DTO.parse(validQuestionAuthorDto)).not.toThrowError();
  });

  describe("type", () => {
    it.each<{
      test: string;
      value: string;
      expected: boolean;
    }>([
      {
        test: "should return true when author type is 'admin'.",
        value: "admin",
        expected: true,
      },
      {
        test: "should return true when author type is 'game'.",
        value: "game",
        expected: true,
      },
      {
        test: "should return true when author type is 'ai'.",
        value: "ai",
        expected: true,
      },
      {
        test: "should return false when author type is 'bot'.",
        value: "bot",
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = QUESTION_AUTHOR_DTO.shape.type.safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct meta when accessed.", () => {
      const metadata = QUESTION_AUTHOR_DTO.shape.type.meta();
      const expectedMetadata = {
        description: "Question's author role",
        example: "admin",
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });

  describe("gameId", () => {
    it("should throw a zod error when assigned an invalid mongo id.", () => {
      const invalidDto = Object.assign(validQuestionAuthorDto, { gameId: "invalid-id" });

      expect(() => QUESTION_AUTHOR_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should pass validation when gameId is omitted.", () => {
      const dtoWithoutGameId = createFakeQuestionAuthorDto({ gameId: undefined });

      expect(() => QUESTION_AUTHOR_DTO.parse(dtoWithoutGameId)).not.toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_AUTHOR_DTO.shape.gameId.meta();
      const expectedMetadata = {
        description: "Game's unique identifier, if the author is a game.",
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });

  describe("name", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validQuestionAuthorDto, { name: 123 });

      expect(() => QUESTION_AUTHOR_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should pass validation when name is omitted.", () => {
      const dtoWithoutName = createFakeQuestionAuthorDto({ name: undefined });

      expect(() => QUESTION_AUTHOR_DTO.parse(dtoWithoutName)).not.toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const expectedMetadata = {
        description: "Question author's name, if applicable.",
        example: "TriviaMaster3000",
      };

      expect(QUESTION_AUTHOR_DTO.shape.name.meta()).toStrictEqual(expectedMetadata);
    });
  });
});