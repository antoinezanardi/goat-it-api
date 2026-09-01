import { ZodError } from "zod";

import {
  FIND_RANDOM_QUESTIONS_BODY_LIMIT_DEFAULT,
  FIND_RANDOM_QUESTIONS_BODY_LIMIT_DESCRIPTION,
  FIND_RANDOM_QUESTIONS_BODY_LIMIT_MAXIMUM,
  FIND_RANDOM_QUESTIONS_BODY_LIMIT_MINIMUM,
} from "@question/application/dto/find-random-questions-body/constants/find-random-questions-body.dto.constants";
import { FIND_RANDOM_QUESTIONS_BODY_DTO } from "@question/application/dto/find-random-questions-body/find-random-questions-body.dto.shape";

describe("Find Random Questions Body DTO Shape", () => {
  let validDto: { limit?: number; excludedIds?: string[]; categories?: string[]; cognitiveDifficulties?: string[]; themeIds?: string[] };

  beforeEach(() => {
    validDto = {
      limit: FIND_RANDOM_QUESTIONS_BODY_LIMIT_DEFAULT,
      excludedIds: ["60af924f4f1a2563f8e8b456"],
      categories: ["trivia"],
      cognitiveDifficulties: ["easy"],
      themeIds: ["60af924f4f1a2563f8e8b457"],
    };
  });

  it("should pass validation when a valid dto is provided.", () => {
    expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(validDto)).not.toThrow();
  });

  describe("limit", () => {
    it("should pass validation when limit is a valid integer at the minimum.", () => {
      const dto = { ...validDto, limit: FIND_RANDOM_QUESTIONS_BODY_LIMIT_MINIMUM };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when limit is a valid integer above the minimum.", () => {
      const dto = { ...validDto, limit: FIND_RANDOM_QUESTIONS_BODY_LIMIT_DEFAULT };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when limit is at the maximum.", () => {
      const dto = { ...validDto, limit: FIND_RANDOM_QUESTIONS_BODY_LIMIT_MAXIMUM };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when limit is above maximum.", () => {
      const dtoWithInvalidLimit = { ...validDto, limit: FIND_RANDOM_QUESTIONS_BODY_LIMIT_MAXIMUM + 1 };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dtoWithInvalidLimit)).toThrow(ZodError);
    });

    it("should throw zod error when limit is 0 (below minimum).", () => {
      const dtoWithInvalidLimit = { ...validDto, limit: 0 };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dtoWithInvalidLimit)).toThrow(ZodError);
    });

    it("should throw zod error when limit is -1 (negative).", () => {
      const dtoWithInvalidLimit = { ...validDto, limit: -1 };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dtoWithInvalidLimit)).toThrow(ZodError);
    });

    it.each<unknown>([1.5, "string"])("should throw zod error when limit is '%s' (non-integer).", limit => {
      const dtoWithInvalidLimit = { ...validDto, limit };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dtoWithInvalidLimit)).toThrow(ZodError);
    });

    it("should use default value 20 when limit is not provided.", () => {
      const { limit: _, ...dtoWithoutLimit } = validDto;

      const result = FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dtoWithoutLimit);

      expect(result.limit).toBe(FIND_RANDOM_QUESTIONS_BODY_LIMIT_DEFAULT);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = FIND_RANDOM_QUESTIONS_BODY_DTO.shape.limit.meta();
      const expectedMetadata = {
        description: FIND_RANDOM_QUESTIONS_BODY_LIMIT_DESCRIPTION,
        example: FIND_RANDOM_QUESTIONS_BODY_LIMIT_DEFAULT,
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("excludedIds", () => {
    it("should pass validation when a single valid ObjectId is provided.", () => {
      const dto = { ...validDto, excludedIds: ["60af924f4f1a2563f8e8b456"] };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when multiple valid ObjectIds are provided.", () => {
      const excludedIds = ["60af924f4f1a2563f8e8b456", "507f1f77bcf86cd799439011"];
      const dto = { ...validDto, excludedIds };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when excludedIds is omitted.", () => {
      const { excludedIds: _, ...dtoWithoutExcludedIds } = validDto;

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dtoWithoutExcludedIds)).not.toThrow();
    });

    it("should throw zod error when an invalid ObjectId is provided.", () => {
      const dto = { ...validDto, excludedIds: ["not-valid"] };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dto)).toThrow(ZodError);
    });

    it("should throw zod error when more than 5000 excluded ids are provided.", () => {
      const dto = { ...validDto, excludedIds: Array.from({ length: 5001 }, (_, index) => `60af924f4f1a2563f8e8b4${index.toString().padStart(2, "0")}`) };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dto)).toThrow(ZodError);
    });

    it("should throw zod error when duplicate excluded ids are provided.", () => {
      const duplicateId = "60af924f4f1a2563f8e8b456";
      const dto = { ...validDto, excludedIds: [duplicateId, duplicateId] };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dto)).toThrow(ZodError);
    });

    it("should have the correct description when accessing the metadata.", () => {
      const schema = FIND_RANDOM_QUESTIONS_BODY_DTO.shape.excludedIds;

      expect(schema.description).toBe("List of question IDs to exclude from the random pool");
    });
  });

  describe("categories", () => {
    it("should pass validation when a single valid category is provided.", () => {
      const dto = { ...validDto, categories: ["trivia"] };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when multiple valid categories are provided.", () => {
      const dto = { ...validDto, categories: ["trivia", "riddle"] };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when categories is omitted.", () => {
      const { categories: _, ...dtoWithoutCategories } = validDto;

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dtoWithoutCategories)).not.toThrow();
    });

    it("should throw zod error when an invalid category is provided.", () => {
      const dto = { ...validDto, categories: ["unknown"] };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dto)).toThrow(ZodError);
    });

    it("should throw zod error when duplicate categories are provided.", () => {
      const dto = { ...validDto, categories: ["trivia", "trivia"] };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dto)).toThrow(ZodError);
    });

    it("should have the correct description when accessing the metadata.", () => {
      const schema = FIND_RANDOM_QUESTIONS_BODY_DTO.shape.categories;

      expect(schema.description).toBe("List of categories to include (OR logic)");
    });
  });

  describe("cognitiveDifficulties", () => {
    it("should pass validation when a single valid cognitive difficulty is provided.", () => {
      const dto = { ...validDto, cognitiveDifficulties: ["easy"] };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when multiple valid cognitive difficulties are provided.", () => {
      const dto = { ...validDto, cognitiveDifficulties: ["easy", "hard"] };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when cognitiveDifficulties is omitted.", () => {
      const { cognitiveDifficulties: _, ...dtoWithoutCognitiveDifficulties } = validDto;

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dtoWithoutCognitiveDifficulties)).not.toThrow();
    });

    it("should throw zod error when an invalid cognitive difficulty is provided.", () => {
      const dto = { ...validDto, cognitiveDifficulties: ["extreme"] };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dto)).toThrow(ZodError);
    });

    it("should throw zod error when duplicate cognitive difficulties are provided.", () => {
      const dto = { ...validDto, cognitiveDifficulties: ["easy", "easy"] };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dto)).toThrow(ZodError);
    });

    it("should have the correct description when accessing the metadata.", () => {
      const schema = FIND_RANDOM_QUESTIONS_BODY_DTO.shape.cognitiveDifficulties;

      expect(schema.description).toBe("List of cognitive difficulties to include (OR logic)");
    });
  });

  describe("themeIds", () => {
    it("should pass validation when a single valid theme id is provided.", () => {
      const dto = { ...validDto, themeIds: ["60af924f4f1a2563f8e8b456"] };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when multiple valid theme ids are provided.", () => {
      const themeIds = ["60af924f4f1a2563f8e8b456", "507f1f77bcf86cd799439011"];
      const dto = { ...validDto, themeIds };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when themeIds is omitted.", () => {
      const { themeIds: _, ...dtoWithoutThemeIds } = validDto;

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dtoWithoutThemeIds)).not.toThrow();
    });

    it("should throw zod error when an invalid theme id is provided.", () => {
      const dto = { ...validDto, themeIds: ["not-valid"] };

      expect(() => FIND_RANDOM_QUESTIONS_BODY_DTO.parse(dto)).toThrow(ZodError);
    });

    it("should have the correct description when accessing the metadata.", () => {
      const schema = FIND_RANDOM_QUESTIONS_BODY_DTO.shape.themeIds;

      expect(schema.description).toBe("List of theme IDs to filter questions by (OR logic)");
    });
  });
});