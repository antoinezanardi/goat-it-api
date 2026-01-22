import { ZodError } from "zod";

import type { QuestionAuthorCreationDto } from "@question/application/dto/question-creation/question-author-creation/question-author-creation.dto";
import { QUESTION_AUTHOR_CREATION_DTO } from "@question/application/dto/question-creation/question-author-creation/question-author-creation.dto";

import { createFakeQuestionAuthorCreationDto } from "@faketories/contexts/question/dto/question-creation/question-author-creation/question-author-creation.dto.faketory";

describe("Question Author Creation DTO Specs", () => {
  let validDto: QuestionAuthorCreationDto;

  beforeEach(() => {
    validDto = createFakeQuestionAuthorCreationDto();
  });

  it("should pass validation when a valid QuestionAuthorCreationDto is provided.", () => {
    expect(() => QUESTION_AUTHOR_CREATION_DTO.parse(validDto)).not.toThrowError();
  });

  describe("role", () => {
    it("should throw zod error when role is invalid.", () => {
      const invalid = Object.assign(validDto, { role: "invalid" });

      expect(() => QUESTION_AUTHOR_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_AUTHOR_CREATION_DTO.shape.role.meta();
      const expectedMetadata = {
        description: "Question's author role",
        example: "admin",
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });

  describe("name", () => {
    it("should throw zod error when name is not a string.", () => {
      const invalid: unknown = Object.assign(validDto, { name: 123 });

      expect(() => QUESTION_AUTHOR_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_AUTHOR_CREATION_DTO.shape.name.meta();
      const expectedMetadata = {
        description: "Question author's name",
        example: "TriviaMaster3000",
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });
});