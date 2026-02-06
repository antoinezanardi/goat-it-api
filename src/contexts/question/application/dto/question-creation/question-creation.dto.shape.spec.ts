import { faker } from "@faker-js/faker";
import { ZodError } from "zod";

import type { QuestionCreationDto } from "@question/application/dto/question-creation/question-creation.dto.shape";
import { QUESTION_CREATION_DTO } from "@question/application/dto/question-creation/question-creation.dto.shape";

import { createFakeQuestionThemeAssignmentCreationDto } from "@faketories/contexts/question/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto.faketory";
import { createFakeQuestionCreationDto } from "@faketories/contexts/question/dto/question-creation/question-creation.dto.faketory";

describe("Question Creation DTO Shape", () => {
  let validDto: QuestionCreationDto;

  beforeEach(() => {
    validDto = createFakeQuestionCreationDto({
      themes: [createFakeQuestionThemeAssignmentCreationDto({ isPrimary: true })],
    });
  });

  it("should pass validation when a valid QuestionCreationDto is provided.", () => {
    expect(() => QUESTION_CREATION_DTO.parse(validDto)).not.toThrowError();
  });

  describe("themes", () => {
    it("should throw zod error when themes is empty.", () => {
      const invalid = Object.assign(validDto, { themes: [] });

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should throw zod error when themes exceed maximum items.", () => {
      const themes = [
        createFakeQuestionThemeAssignmentCreationDto({
          isPrimary: true,
        }),
        createFakeQuestionThemeAssignmentCreationDto({
          isPrimary: false,
        }),
        createFakeQuestionThemeAssignmentCreationDto({
          isPrimary: false,
        }),
        createFakeQuestionThemeAssignmentCreationDto({
          isPrimary: false,
        }),
      ];
      const invalid = Object.assign(validDto, { themes });

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CREATION_DTO.shape.themes.meta();
      const expectedMetadata = {
        description: "Question's themes",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });

    it("should throw zod error when themes have non-unique themeIds.", () => {
      const sameThemeId = faker.database.mongodbObjectId();
      const invalid = Object.assign(validDto, {
        themes: [
          createFakeQuestionThemeAssignmentCreationDto({
            themeId: sameThemeId,
            isPrimary: true,
          }),
          createFakeQuestionThemeAssignmentCreationDto({
            themeId: sameThemeId,
            isPrimary: false,
          }),
        ],
      });

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should have correct error message when themes have non-unique themeIds.", () => {
      const sameThemeId = faker.database.mongodbObjectId();
      const invalid = Object.assign(validDto, {
        themes: [
          createFakeQuestionThemeAssignmentCreationDto({
            themeId: sameThemeId,
            isPrimary: true,
          }),
          createFakeQuestionThemeAssignmentCreationDto({
            themeId: sameThemeId,
            isPrimary: false,
          }),
        ],
      });
      const expectedErrorMessage = "Theme IDs must be unique";
      const result = QUESTION_CREATION_DTO.safeParse(invalid);

      expect(result.error?.issues[0].message).toBe(expectedErrorMessage);
    });

    it("should throw zod error when themes do not have exactly one primary theme.", () => {
      const invalid = Object.assign(validDto, {
        themes: [
          createFakeQuestionThemeAssignmentCreationDto({
            isPrimary: false,
          }),
          createFakeQuestionThemeAssignmentCreationDto({
            isPrimary: false,
          }),
        ],
      });

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should throw zod error when themes have more than one primary theme.", () => {
      const invalid = Object.assign(validDto, {
        themes: [
          createFakeQuestionThemeAssignmentCreationDto({
            isPrimary: true,
          }),
          createFakeQuestionThemeAssignmentCreationDto({
            isPrimary: true,
          }),
        ],
      });

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should have correct error message when themes do not have exactly one primary theme.", () => {
      const invalid = Object.assign(validDto, {
        themes: [
          createFakeQuestionThemeAssignmentCreationDto({
            isPrimary: false,
          }),
          createFakeQuestionThemeAssignmentCreationDto({
            isPrimary: false,
          }),
        ],
      });
      const expectedErrorMessage = "There must be exactly one primary theme";
      const result = QUESTION_CREATION_DTO.safeParse(invalid);

      expect(result.error?.issues[0].message).toBe(expectedErrorMessage);
    });
  });

  describe("content", () => {
    it("should throw zod error when content is invalid.", () => {
      const invalid = Object.assign(validDto, { content: "invalid" });

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CREATION_DTO.shape.content.meta();
      const expectedMetadata = {
        description: "Question's content",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("cognitiveDifficulty", () => {
    it("should throw zod error when cognitiveDifficulty is invalid.", () => {
      const invalid = Object.assign(validDto, { cognitiveDifficulty: "invalid" });

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CREATION_DTO.shape.cognitiveDifficulty.meta();
      const expectedMetadata = {
        description: "Question's cognitive difficulty level",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("author", () => {
    it("should throw zod error when author is invalid.", () => {
      const invalid = Object.assign(validDto, { author: "invalid" });

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CREATION_DTO.shape.author.meta();
      const expectedMetadata = {
        description: "Question's author",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("sourceUrls", () => {
    it("should throw zod error when sourceUrls is invalid.", () => {
      const invalid = Object.assign(validDto, { sourceUrls: "invalid" });

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should throw zod error when sourceUrls contain duplicates.", () => {
      const duplicateUrl = "https://example.com/source1";
      const invalid = Object.assign(validDto, { sourceUrls: [duplicateUrl, duplicateUrl] });

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CREATION_DTO.shape.sourceUrls.meta();
      const expectedMetadata = {
        description: "List of unique source URLs for the question",
        example: ["https://example.com/source1", "https://example.com/source2"],
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });
});