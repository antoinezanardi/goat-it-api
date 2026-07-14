import { ZodError } from "zod";

import { RANDOM_QUESTIONS_LIMIT_DEFAULT, RANDOM_QUESTIONS_LIMIT_DESCRIPTION, RANDOM_QUESTIONS_LIMIT_MAXIMUM, RANDOM_QUESTIONS_LIMIT_MINIMUM } from "@question/application/dto/find-random-questions-query/constants/find-random-questions-query.dto.constants";
import { FIND_RANDOM_QUESTIONS_QUERY_DTO } from "@question/application/dto/find-random-questions-query/find-random-questions-query.dto.shape";
import type { FindRandomQuestionsQueryDto } from "@question/application/dto/find-random-questions-query/find-random-questions-query.dto.shape";

import { createFakeFindRandomQuestionsQueryDto } from "@faketories/contexts/question/dto/find-random-questions-query/find-random-questions-query.dto.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";

import type { z } from "zod";

describe("Find Random Questions Query DTO Shape", () => {
  let validDto: FindRandomQuestionsQueryDto;

  beforeEach(() => {
    validDto = createFakeFindRandomQuestionsQueryDto();
  });

  it("should pass validation when a valid dto is provided.", () => {
    expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(validDto)).not.toThrow();
  });

  describe("limit", () => {
    it("should pass validation when limit is a valid integer at or above the minimum.", () => {
      const dto = createFakeFindRandomQuestionsQueryDto({ limit: RANDOM_QUESTIONS_LIMIT_MINIMUM });

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when limit is a valid integer above the minimum.", () => {
      const dto = createFakeFindRandomQuestionsQueryDto({ limit: RANDOM_QUESTIONS_LIMIT_DEFAULT });

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when limit is a larger valid integer.", () => {
      const dto = createFakeFindRandomQuestionsQueryDto({ limit: RANDOM_QUESTIONS_LIMIT_MAXIMUM });

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when limit is exactly at the maximum.", () => {
      const dto = createFakeFindRandomQuestionsQueryDto({ limit: RANDOM_QUESTIONS_LIMIT_MAXIMUM });

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when limit is above maximum.", () => {
      const dtoWithInvalidLimit = { ...validDto, limit: RANDOM_QUESTIONS_LIMIT_MAXIMUM + 1 };

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidLimit)).toThrow(ZodError);
    });

    it("should throw zod error when limit is 0 (below minimum).", () => {
      const dtoWithInvalidLimit = { ...validDto, limit: 0 };

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidLimit)).toThrow(ZodError);
    });

    it("should throw zod error when limit is -1 (negative).", () => {
      const dtoWithInvalidLimit = { ...validDto, limit: -1 };

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidLimit)).toThrow(ZodError);
    });

    it.each([1.5, "string"])("should throw zod error when limit is '%s' (non-integer or non-number).", limit => {
      const dtoWithInvalidLimit = { ...validDto, limit };

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidLimit)).toThrow(ZodError);
    });

    it("should use default value 20 when limit is not provided.", () => {
      const result = FIND_RANDOM_QUESTIONS_QUERY_DTO.parse({});

      expect(result.limit).toBe(RANDOM_QUESTIONS_LIMIT_DEFAULT);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = FIND_RANDOM_QUESTIONS_QUERY_DTO.shape.limit.meta();
      const expectedMetadata = { description: RANDOM_QUESTIONS_LIMIT_DESCRIPTION, example: RANDOM_QUESTIONS_LIMIT_DEFAULT };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });

    it("should accept any coercible value when checking the input type.", () => {
      expectTypeOf<z.input<typeof FIND_RANDOM_QUESTIONS_QUERY_DTO>["limit"]>().toEqualTypeOf<unknown>();
    });
  });

  describe("excluded-ids", () => {
    it("should pass validation when a single valid ObjectId is provided.", () => {
      const dto = createFakeFindRandomQuestionsQueryDto({ "excluded-ids": [createFakeObjectId("60af924f4f1a2563f8e8b456").toString()] });

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when multiple valid ObjectIds are provided.", () => {
      const excludedIds = [
        createFakeObjectId("60af924f4f1a2563f8e8b456").toString(),
        createFakeObjectId("507f1f77bcf86cd799439011").toString(),
      ];
      const dto = createFakeFindRandomQuestionsQueryDto({ "excluded-ids": excludedIds });

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when excluded-ids is omitted.", () => {
      const { "excluded-ids": _, ...dtoWithoutExcludedIds } = validDto;

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dtoWithoutExcludedIds)).not.toThrow();
    });

    it("should throw zod error when an invalid ObjectId is provided.", () => {
      const dto = { ...validDto, "excluded-ids": ["not-valid"] };

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).toThrow(ZodError);
    });

    it("should throw zod error when more than 200 excluded ids are provided.", () => {
      const dto = { ...validDto, "excluded-ids": Array.from({ length: 201 }, () => createFakeObjectId().toString()) };

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).toThrow(ZodError);
    });

    it("should throw zod error when duplicate excluded ids are provided.", () => {
      const duplicateId = createFakeObjectId().toString();
      const dto = { ...validDto, "excluded-ids": [duplicateId, duplicateId] };

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).toThrow(ZodError);
    });

    it("should have the correct description when accessing the metadata.", () => {
      const schema = FIND_RANDOM_QUESTIONS_QUERY_DTO.shape["excluded-ids"];

      expect(schema.description).toBe("List of question IDs to exclude from the random pool");
    });
  });

  describe("categories", () => {
    it("should pass validation when a single valid category is provided.", () => {
      const dto = createFakeFindRandomQuestionsQueryDto({ categories: ["trivia"] });

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when multiple valid categories are provided.", () => {
      const dto = createFakeFindRandomQuestionsQueryDto({ categories: ["trivia", "riddle"] });

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when categories is omitted.", () => {
      const { categories: _, ...dtoWithoutCategories } = validDto;

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dtoWithoutCategories)).not.toThrow();
    });

    it("should throw zod error when an invalid category is provided.", () => {
      const dto = { ...validDto, categories: ["unknown"] };

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).toThrow(ZodError);
    });

    it("should throw zod error when duplicate categories are provided.", () => {
      const dto = { ...validDto, categories: ["trivia", "trivia"] };

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).toThrow(ZodError);
    });

    it("should have the correct description when accessing the metadata.", () => {
      const schema = FIND_RANDOM_QUESTIONS_QUERY_DTO.shape.categories;

      expect(schema.description).toBe("List of categories to include (OR logic)");
    });
  });

  describe("cognitive-difficulties", () => {
    it("should pass validation when a single valid cognitive difficulty is provided.", () => {
      const dto = createFakeFindRandomQuestionsQueryDto({ "cognitive-difficulties": ["easy"] });

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when multiple valid cognitive difficulties are provided.", () => {
      const dto = createFakeFindRandomQuestionsQueryDto({ "cognitive-difficulties": ["easy", "hard"] });

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when cognitive-difficulties is omitted.", () => {
      const { "cognitive-difficulties": _, ...dtoWithoutCognitiveDifficulties } = validDto;

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dtoWithoutCognitiveDifficulties)).not.toThrow();
    });

    it("should throw zod error when an invalid cognitive difficulty is provided.", () => {
      const dto = { ...validDto, "cognitive-difficulties": ["extreme"] };

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).toThrow(ZodError);
    });

    it("should throw zod error when duplicate cognitive difficulties are provided.", () => {
      const dto = { ...validDto, "cognitive-difficulties": ["easy", "easy"] };

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).toThrow(ZodError);
    });

    it("should have the correct description when accessing the metadata.", () => {
      const schema = FIND_RANDOM_QUESTIONS_QUERY_DTO.shape["cognitive-difficulties"];

      expect(schema.description).toBe("List of cognitive difficulties to include (OR logic)");
    });
  });

  describe("theme-ids", () => {
    it("should pass validation when a single valid theme id is provided.", () => {
      const dto = createFakeFindRandomQuestionsQueryDto({ "theme-ids": [createFakeObjectId("60af924f4f1a2563f8e8b456").toString()] });

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when multiple valid theme ids are provided.", () => {
      const themeIds = [
        createFakeObjectId("60af924f4f1a2563f8e8b456").toString(),
        createFakeObjectId("507f1f77bcf86cd799439011").toString(),
      ];
      const dto = createFakeFindRandomQuestionsQueryDto({ "theme-ids": themeIds });

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when theme-ids is omitted.", () => {
      const { "theme-ids": _, ...dtoWithoutThemeIds } = validDto;

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dtoWithoutThemeIds)).not.toThrow();
    });

    it("should throw zod error when an invalid theme id is provided.", () => {
      const dto = { ...validDto, "theme-ids": ["not-valid"] };

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).toThrow(ZodError);
    });

    it("should have the correct description when accessing the metadata.", () => {
      const schema = FIND_RANDOM_QUESTIONS_QUERY_DTO.shape["theme-ids"];

      expect(schema.description).toBe("List of theme IDs to filter questions by (OR logic)");
    });
  });
});