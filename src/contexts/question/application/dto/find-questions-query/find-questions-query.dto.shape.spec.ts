import { faker } from "@faker-js/faker";
import { ZodError } from "zod";

import { SORT_ORDERS } from "@shared/domain/constants/sort/sort.constants";
import { LIMIT_DESCRIPTION, LIMIT_DEFAULT } from "@shared/infrastructure/http/zod/validators/limit/constants/limit.zod.validators.constants";
import { SORT_ORDER_DEFAULT, SORT_ORDER_DESCRIPTION } from "@shared/infrastructure/http/zod/validators/sort/constants/sort.zod.validators.constants";

import { FIND_QUESTIONS_QUERY_DTO } from "@question/application/dto/find-questions-query/find-questions-query.dto.shape";
import { QUESTION_AUTHOR_ROLES, QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES, QUESTION_SORTABLE_FIELDS } from "@question/domain/constants/question.constants";
import { QUESTION_SORT_BY_DEFAULT, QUESTION_SORT_BY_DESCRIPTION } from "@question/application/dto/shared/zod/validators/constants/question-sort.dto.zod.validators.constants";
import type { FindQuestionsQueryDto } from "@question/application/dto/find-questions-query/find-questions-query.dto.shape";

import { createFakeFindQuestionsQueryDto } from "@faketories/contexts/question/dto/find-questions-query/find-questions-query.dto.faketory";

import type { z } from "zod";

describe("Find Questions Sort Query DTO Shape", () => {
  let validDto: FindQuestionsQueryDto;

  beforeEach(() => {
    validDto = createFakeFindQuestionsQueryDto();
  });

  it("should pass validation when a valid dto is provided.", () => {
    expect(() => FIND_QUESTIONS_QUERY_DTO.parse(validDto)).not.toThrow();
  });

  describe("sort-by", () => {
    it.each(QUESTION_SORTABLE_FIELDS)("should pass validation when sort-by is '%s'.", sortBy => {
      const dto = createFakeFindQuestionsQueryDto({ "sort-by": sortBy });

      expect(() => FIND_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when sort-by is invalid.", () => {
      const dtoWithInvalidSortBy = { ...validDto, "sort-by": "invalid" };

      expect(() => FIND_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidSortBy)).toThrow(ZodError);
    });

    it("should throw zod error when sort-by is 'status' which is admin-only.", () => {
      const dtoWithStatusSortBy = { ...validDto, "sort-by": "status" };

      expect(() => FIND_QUESTIONS_QUERY_DTO.parse(dtoWithStatusSortBy)).toThrow(ZodError);
    });

    it("should use default value 'createdAt' when sort-by is not provided.", () => {
      const dtoWithoutSortBy = { "sort-order": "asc" };

      const result = FIND_QUESTIONS_QUERY_DTO.parse(dtoWithoutSortBy);

      expect(result["sort-by"]).toBe("createdAt");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = FIND_QUESTIONS_QUERY_DTO.shape["sort-by"].meta();
      const expectedMetadata = { description: QUESTION_SORT_BY_DESCRIPTION, example: QUESTION_SORT_BY_DEFAULT };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });

    it("should have sort-by as optional when checking the input type.", () => {
      expectTypeOf<z.input<typeof FIND_QUESTIONS_QUERY_DTO>["sort-by"]>().toEqualTypeOf<FindQuestionsQueryDto["sort-by"] | undefined>();
    });
  });

  describe("sort-order", () => {
    it.each(SORT_ORDERS)("should pass validation when sort-order is '%s'.", sortOrder => {
      const dto = createFakeFindQuestionsQueryDto({ "sort-order": sortOrder });

      expect(() => FIND_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when sort-order is invalid.", () => {
      const dtoWithInvalidSortOrder = { ...validDto, "sort-order": "invalid" };

      expect(() => FIND_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidSortOrder)).toThrow(ZodError);
    });

    it("should use default value 'desc' when sort-order is not provided.", () => {
      const dtoWithoutSortOrder = { "sort-by": "createdAt" };

      const result = FIND_QUESTIONS_QUERY_DTO.parse(dtoWithoutSortOrder);

      expect(result["sort-order"]).toBe("desc");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = FIND_QUESTIONS_QUERY_DTO.shape["sort-order"].meta();
      const expectedMetadata = { description: SORT_ORDER_DESCRIPTION, example: SORT_ORDER_DEFAULT };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });

    it("should have sort-order as optional when checking the input type.", () => {
      expectTypeOf<z.input<typeof FIND_QUESTIONS_QUERY_DTO>["sort-order"]>().toEqualTypeOf<FindQuestionsQueryDto["sort-order"] | undefined>();
    });
  });

  describe("limit", () => {
    it.each([1, 20, 100])("should pass validation when limit is '%s'.", limit => {
      const dto = createFakeFindQuestionsQueryDto({ limit });

      expect(() => FIND_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it.each([0, -1, 1.5, "string"])("should throw zod error when limit is '%s'.", limit => {
      const dtoWithInvalidLimit = { ...validDto, limit };

      expect(() => FIND_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidLimit)).toThrow(ZodError);
    });

    it("should use default value 20 when limit is not provided.", () => {
      const dtoWithoutLimit = { "sort-by": "createdAt" };

      const result = FIND_QUESTIONS_QUERY_DTO.parse(dtoWithoutLimit);

      expect(result.limit).toBe(LIMIT_DEFAULT);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = FIND_QUESTIONS_QUERY_DTO.shape.limit.meta();
      const expectedMetadata = { description: LIMIT_DESCRIPTION, example: LIMIT_DEFAULT };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });

    it("should have limit as optional when checking the input type.", () => {
      expectTypeOf<z.input<typeof FIND_QUESTIONS_QUERY_DTO>["limit"]>().toEqualTypeOf<FindQuestionsQueryDto["limit"] | undefined>();
    });
  });

  describe("category", () => {
    it.each(QUESTION_CATEGORIES)("should pass validation when category is '%s'.", category => {
      const dto = createFakeFindQuestionsQueryDto({ category });

      expect(() => FIND_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when category is invalid.", () => {
      const dtoWithInvalidCategory = { ...validDto, category: "invalid" };

      expect(() => FIND_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidCategory)).toThrow(ZodError);
    });

    it("should pass validation when category is not provided.", () => {
      const { category: _, ...dtoWithoutCategory } = validDto;

      expect(() => FIND_QUESTIONS_QUERY_DTO.parse(dtoWithoutCategory)).not.toThrow();
    });
  });

  describe("cognitive-difficulty", () => {
    it.each(QUESTION_COGNITIVE_DIFFICULTIES)("should pass validation when cognitive-difficulty is '%s'.", cognitiveDifficulty => {
      const dto = createFakeFindQuestionsQueryDto({ "cognitive-difficulty": cognitiveDifficulty });

      expect(() => FIND_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when cognitive-difficulty is invalid.", () => {
      const dtoWithInvalidDifficulty = { ...validDto, "cognitive-difficulty": "invalid" };

      expect(() => FIND_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidDifficulty)).toThrow(ZodError);
    });

    it("should pass validation when cognitive-difficulty is not provided.", () => {
      const { "cognitive-difficulty": _, ...dtoWithoutDifficulty } = validDto;

      expect(() => FIND_QUESTIONS_QUERY_DTO.parse(dtoWithoutDifficulty)).not.toThrow();
    });
  });

  describe("author-role", () => {
    it.each(QUESTION_AUTHOR_ROLES)("should pass validation when author-role is '%s'.", authorRole => {
      const dto = createFakeFindQuestionsQueryDto({ "author-role": authorRole });

      expect(() => FIND_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when author-role is invalid.", () => {
      const dtoWithInvalidAuthorRole = { ...validDto, "author-role": "invalid" };

      expect(() => FIND_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidAuthorRole)).toThrow(ZodError);
    });

    it("should pass validation when author-role is not provided.", () => {
      const { "author-role": _, ...dtoWithoutAuthorRole } = validDto;

      expect(() => FIND_QUESTIONS_QUERY_DTO.parse(dtoWithoutAuthorRole)).not.toThrow();
    });
  });

  describe("theme-ids", () => {
    it("should pass validation when theme-ids is a valid array of mongo IDs.", () => {
      const dto = createFakeFindQuestionsQueryDto({ "theme-ids": [faker.database.mongodbObjectId(), faker.database.mongodbObjectId()] });

      expect(() => FIND_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when theme-ids contains invalid values.", () => {
      const dtoWithInvalidThemeIds = { ...validDto, "theme-ids": ["not-a-mongo-id"] };

      expect(() => FIND_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidThemeIds)).toThrow(ZodError);
    });

    it("should pass validation when theme-ids is not provided.", () => {
      const { "theme-ids": _, ...dtoWithoutThemeIds } = validDto;

      expect(() => FIND_QUESTIONS_QUERY_DTO.parse(dtoWithoutThemeIds)).not.toThrow();
    });

    it("should pass validation when theme-ids is a single string value.", () => {
      const dtoWithSingleThemeId = { ...validDto, "theme-ids": faker.database.mongodbObjectId() };

      const result = FIND_QUESTIONS_QUERY_DTO.parse(dtoWithSingleThemeId);

      expect(result["theme-ids"]).toStrictEqual([dtoWithSingleThemeId["theme-ids"]]);
    });

    it("should throw zod error when theme-ids is an empty array.", () => {
      const dtoWithEmptyThemeIds = { ...validDto, "theme-ids": [] };

      expect(() => FIND_QUESTIONS_QUERY_DTO.parse(dtoWithEmptyThemeIds)).toThrow(ZodError);
    });
  });

  it("should use both defaults when no fields are provided.", () => {
    const result = FIND_QUESTIONS_QUERY_DTO.parse({});

    expect(result).toStrictEqual<FindQuestionsQueryDto>({ "sort-by": "createdAt", "sort-order": "desc", "limit": 20 });
  });
});