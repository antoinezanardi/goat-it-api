import { Types } from "mongoose";
import { ZodError } from "zod";

import { SORT_ORDERS } from "@shared/domain/constants/sort/sort.constants";
import { LIMIT_DESCRIPTION, LIMIT_DEFAULT, LIMIT_MINIMUM } from "@shared/infrastructure/http/zod/validators/limit/constants/limit.zod.validators.constants";
import { SORT_ORDER_DEFAULT, SORT_ORDER_DESCRIPTION } from "@shared/infrastructure/http/zod/validators/sort/constants/sort.zod.validators.constants";

import { ADMIN_FIND_QUESTIONS_QUERY_DTO } from "@question/application/dto/admin-find-questions-query/admin-find-questions-query.dto.shape";
import { ADMIN_QUESTION_SORTABLE_FIELDS, QUESTION_AUTHOR_ROLES, QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES, QUESTION_STATUSES } from "@question/domain/constants/question.constants";
import { QUESTION_SORT_BY_DEFAULT, QUESTION_SORT_BY_DESCRIPTION } from "@question/application/dto/shared/zod/validators/constants/question-sort.dto.zod.validators.constants";
import type { AdminFindQuestionsQueryDto } from "@question/application/dto/admin-find-questions-query/admin-find-questions-query.dto.shape";
import type { QuestionAuthorRole, QuestionCategory, QuestionCognitiveDifficulty, QuestionStatus } from "@question/domain/types/question.value-objects";

import { createFakeAdminFindQuestionsQueryDto } from "@faketories/contexts/question/dto/admin-find-questions-query/admin-find-questions-query.dto.faketory";

import type { z } from "zod";

import type { QuestionSortableField } from "@question/domain/types/question.types";
import type { SortOrder } from "@shared/domain/types/sort/sort.types";

describe("Admin Find Questions Sort Query DTO Shape", () => {
  let validDto: AdminFindQuestionsQueryDto;

  beforeEach(() => {
    validDto = createFakeAdminFindQuestionsQueryDto({ "is-fully-translated": undefined });
  });

  it("should pass validation when a valid dto is provided.", () => {
    expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(validDto)).not.toThrow();
  });

  describe("sort-by", () => {
    it.each<QuestionSortableField>(ADMIN_QUESTION_SORTABLE_FIELDS)("should pass validation when sort-by is '%s'.", sortBy => {
      const dto = createFakeAdminFindQuestionsQueryDto({ "sort-by": sortBy, "is-fully-translated": undefined });

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when sort-by is invalid.", () => {
      const dtoWithInvalidSortBy = { ...validDto, "sort-by": "invalid" };

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidSortBy)).toThrow(ZodError);
    });

    it("should use default value 'createdAt' when sort-by is not provided.", () => {
      const dtoWithoutSortBy = { "sort-order": "asc" };

      const result = ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dtoWithoutSortBy);

      expect(result["sort-by"]).toBe("createdAt");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_FIND_QUESTIONS_QUERY_DTO.shape["sort-by"].meta();
      const expectedMetadata = { description: QUESTION_SORT_BY_DESCRIPTION, example: QUESTION_SORT_BY_DEFAULT };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });

    it("should have sort-by as optional when checking the input type.", () => {
      expectTypeOf<z.input<typeof ADMIN_FIND_QUESTIONS_QUERY_DTO>["sort-by"]>().toEqualTypeOf<AdminFindQuestionsQueryDto["sort-by"] | undefined>();
    });
  });

  describe("sort-order", () => {
    it.each<SortOrder>(SORT_ORDERS)("should pass validation when sort-order is '%s'.", sortOrder => {
      const dto = createFakeAdminFindQuestionsQueryDto({ "sort-order": sortOrder, "is-fully-translated": undefined });

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when sort-order is invalid.", () => {
      const dtoWithInvalidSortOrder = { ...validDto, "sort-order": "invalid" };

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidSortOrder)).toThrow(ZodError);
    });

    it("should use default value 'desc' when sort-order is not provided.", () => {
      const dtoWithoutSortOrder = { "sort-by": "createdAt" };

      const result = ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dtoWithoutSortOrder);

      expect(result["sort-order"]).toBe("desc");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_FIND_QUESTIONS_QUERY_DTO.shape["sort-order"].meta();
      const expectedMetadata = { description: SORT_ORDER_DESCRIPTION, example: SORT_ORDER_DEFAULT };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });

    it("should have sort-order as optional when checking the input type.", () => {
      expectTypeOf<z.input<typeof ADMIN_FIND_QUESTIONS_QUERY_DTO>["sort-order"]>().toEqualTypeOf<AdminFindQuestionsQueryDto["sort-order"] | undefined>();
    });
  });

  describe("limit", () => {
    it.each<number>([LIMIT_MINIMUM, LIMIT_DEFAULT, 100])("should pass validation when limit is %d.", limit => {
      const dto = createFakeAdminFindQuestionsQueryDto({ limit, "is-fully-translated": undefined });

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it.each<unknown>([-1, 1.5, "string"])("should throw zod error when limit is '%s'.", limit => {
      const dtoWithInvalidLimit = { ...validDto, limit };

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidLimit)).toThrow(ZodError);
    });

    it("should use default value 50 when limit is not provided.", () => {
      const dtoWithoutLimit = { "sort-by": "createdAt" };

      const result = ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dtoWithoutLimit);

      expect(result.limit).toBe(LIMIT_DEFAULT);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_FIND_QUESTIONS_QUERY_DTO.shape.limit.meta();
      const expectedMetadata = { description: LIMIT_DESCRIPTION, example: LIMIT_DEFAULT };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });

    it("should accept any coercible value when checking the input type.", () => {
      expectTypeOf<z.input<typeof ADMIN_FIND_QUESTIONS_QUERY_DTO>["limit"]>().toEqualTypeOf<unknown>();
    });
  });

  describe("status", () => {
    it.each<QuestionStatus>(QUESTION_STATUSES)("should pass validation when status is '%s'.", status => {
      const dto = createFakeAdminFindQuestionsQueryDto({ status, "is-fully-translated": undefined });

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when status is invalid.", () => {
      const dtoWithInvalidStatus = { ...validDto, status: "invalid" };

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidStatus)).toThrow(ZodError);
    });

    it("should pass validation when status is not provided.", () => {
      const { status: _status, ...dtoWithoutStatus } = validDto;

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dtoWithoutStatus)).not.toThrow();
    });
  });

  describe("category", () => {
    it.each<QuestionCategory>(QUESTION_CATEGORIES)("should pass validation when category is '%s'.", category => {
      const dto = createFakeAdminFindQuestionsQueryDto({ category, "is-fully-translated": undefined });

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when category is invalid.", () => {
      const dtoWithInvalidCategory = { ...validDto, category: "invalid" };

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidCategory)).toThrow(ZodError);
    });

    it("should pass validation when category is not provided.", () => {
      const { category: _category, ...dtoWithoutCategory } = validDto;

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dtoWithoutCategory)).not.toThrow();
    });
  });

  describe("cognitive-difficulty", () => {
    it.each<QuestionCognitiveDifficulty>(QUESTION_COGNITIVE_DIFFICULTIES)("should pass validation when cognitive-difficulty is '%s'.", cognitiveDifficulty => {
      const dto = createFakeAdminFindQuestionsQueryDto({ "cognitive-difficulty": cognitiveDifficulty, "is-fully-translated": undefined });

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when cognitive-difficulty is invalid.", () => {
      const dtoWithInvalidDifficulty = { ...validDto, "cognitive-difficulty": "invalid" };

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidDifficulty)).toThrow(ZodError);
    });

    it("should pass validation when cognitive-difficulty is not provided.", () => {
      const { "cognitive-difficulty": _difficulty, ...dtoWithoutDifficulty } = validDto;

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dtoWithoutDifficulty)).not.toThrow();
    });
  });

  describe("author-role", () => {
    it.each<QuestionAuthorRole>(QUESTION_AUTHOR_ROLES)("should pass validation when author-role is '%s'.", authorRole => {
      const dto = createFakeAdminFindQuestionsQueryDto({ "author-role": authorRole, "is-fully-translated": undefined });

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when author-role is invalid.", () => {
      const dtoWithInvalidAuthorRole = { ...validDto, "author-role": "invalid" };

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidAuthorRole)).toThrow(ZodError);
    });

    it("should pass validation when author-role is not provided.", () => {
      const { "author-role": _authorRole, ...dtoWithoutAuthorRole } = validDto;

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dtoWithoutAuthorRole)).not.toThrow();
    });
  });

  describe("theme-ids", () => {
    it("should pass validation when theme-ids is a valid array of mongo IDs.", () => {
      const dto = createFakeAdminFindQuestionsQueryDto({ "theme-ids": [new Types.ObjectId().toString(), new Types.ObjectId().toString()], "is-fully-translated": undefined });

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when theme-ids contains invalid values.", () => {
      const dtoWithInvalidThemeIds = { ...validDto, "theme-ids": ["not-a-valid-id"] };

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidThemeIds)).toThrow(ZodError);
    });

    it("should pass validation when theme-ids is not provided.", () => {
      const { "theme-ids": _themeIds, ...dtoWithoutThemeIds } = validDto;

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dtoWithoutThemeIds)).not.toThrow();
    });

    it("should pass validation when theme-ids is a single string value.", () => {
      const dtoWithSingleThemeId = { ...validDto, "theme-ids": new Types.ObjectId().toString() };

      const result = ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dtoWithSingleThemeId);

      expect(result["theme-ids"]).toStrictEqual([dtoWithSingleThemeId["theme-ids"]]);
    });

    it("should throw zod error when theme-ids is an empty array.", () => {
      const dtoWithEmptyThemeIds = { ...validDto, "theme-ids": [] };

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dtoWithEmptyThemeIds)).toThrow(ZodError);
    });
  });

  describe("is-fully-translated", () => {
    it.each<string>(["true", "false"])("should pass validation when is-fully-translated is '%s'.", isFullyTranslated => {
      const dto = { ...createFakeAdminFindQuestionsQueryDto(), "is-fully-translated": isFullyTranslated } as unknown as AdminFindQuestionsQueryDto;

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should parse is-fully-translated to a boolean when value is a valid boolean string.", () => {
      const dto = { ...createFakeAdminFindQuestionsQueryDto(), "is-fully-translated": "true" } as unknown as AdminFindQuestionsQueryDto;

      const result = ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dto);

      expect(result["is-fully-translated"]).toBeTruthy();
    });

    it("should throw zod error when is-fully-translated is invalid.", () => {
      const dtoWithInvalidValue = { ...validDto, "is-fully-translated": "maybe" };

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidValue)).toThrow(ZodError);
    });

    it("should pass validation when is-fully-translated is not provided.", () => {
      const dtoWithoutIsFullyTranslated: Record<string, unknown> = { ...validDto };
      delete dtoWithoutIsFullyTranslated["is-fully-translated"];

      expect(() => ADMIN_FIND_QUESTIONS_QUERY_DTO.parse(dtoWithoutIsFullyTranslated)).not.toThrow();
    });

    it("should have is-fully-translated as optional when checking the input type.", () => {
      expectTypeOf<z.input<typeof ADMIN_FIND_QUESTIONS_QUERY_DTO>["is-fully-translated"]>().toEqualTypeOf<string | undefined>();
    });
  });

  it("should use both defaults when no fields are provided.", () => {
    const result = ADMIN_FIND_QUESTIONS_QUERY_DTO.parse({});

    expect(result).toStrictEqual<AdminFindQuestionsQueryDto>({ "sort-by": "createdAt", "sort-order": "desc", "limit": LIMIT_DEFAULT });
  });
});