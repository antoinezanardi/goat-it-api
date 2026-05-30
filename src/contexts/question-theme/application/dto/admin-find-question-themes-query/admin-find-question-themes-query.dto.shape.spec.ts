import { ZodError } from "zod";

import { ADMIN_FIND_QUESTION_THEMES_QUERY_DTO } from "@question-theme/application/dto/admin-find-question-themes-query/admin-find-question-themes-query.dto.shape";
import { ADMIN_QUESTION_THEME_SORTABLE_FIELDS, QUESTION_THEME_STATUSES } from "@question-theme/domain/constants/question-theme.constants";
import { QUESTION_THEME_SORT_BY_DEFAULT, QUESTION_THEME_SORT_BY_DESCRIPTION, QUESTION_THEME_SORT_ORDER_DEFAULT, QUESTION_THEME_SORT_ORDER_DESCRIPTION } from "@question-theme/application/dto/zod/validators/constants/question-theme-sort.dto.zod.validators.constants";

import { SORT_ORDERS } from "@shared/domain/constants/sort/sort.constants";

import { createFakeAdminFindQuestionThemesQueryDto } from "@faketories/contexts/question-theme/dto/admin-find-question-themes-query/admin-find-question-themes-query.dto.faketory";

import type { AdminFindQuestionThemesQueryDto } from "@question-theme/application/dto/admin-find-question-themes-query/admin-find-question-themes-query.dto.shape";

describe("Admin Find Question-Themes Sort Query DTO Shape", () => {
  let validDto: AdminFindQuestionThemesQueryDto;

  beforeEach(() => {
    validDto = createFakeAdminFindQuestionThemesQueryDto();
  });

  it("should pass validation when a valid dto is provided.", () => {
    expect(() => ADMIN_FIND_QUESTION_THEMES_QUERY_DTO.parse(validDto)).not.toThrow();
  });

  describe("sort-by", () => {
    it.each(ADMIN_QUESTION_THEME_SORTABLE_FIELDS)("should pass validation when sort-by is '%s'.", sortBy => {
      const dto = createFakeAdminFindQuestionThemesQueryDto({ "sort-by": sortBy });

      expect(() => ADMIN_FIND_QUESTION_THEMES_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when sort-by is invalid.", () => {
      const dtoWithInvalidSortBy = { ...validDto, "sort-by": "invalid" };

      expect(() => ADMIN_FIND_QUESTION_THEMES_QUERY_DTO.parse(dtoWithInvalidSortBy)).toThrow(ZodError);
    });

    it("should throw zod error when sort-by is 'cognitiveDifficulty' which is not a question-theme field.", () => {
      const dtoWithInvalidField = { ...validDto, "sort-by": "cognitiveDifficulty" };

      expect(() => ADMIN_FIND_QUESTION_THEMES_QUERY_DTO.parse(dtoWithInvalidField)).toThrow(ZodError);
    });

    it("should use default value 'slug' when sort-by is not provided.", () => {
      const dtoWithoutSortBy = { "sort-order": "asc" };

      const result = ADMIN_FIND_QUESTION_THEMES_QUERY_DTO.parse(dtoWithoutSortBy);

      expect(result["sort-by"]).toBe("slug");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_FIND_QUESTION_THEMES_QUERY_DTO.shape["sort-by"].meta();
      const expectedMetadata = { description: QUESTION_THEME_SORT_BY_DESCRIPTION, example: QUESTION_THEME_SORT_BY_DEFAULT };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("sort-order", () => {
    it.each(SORT_ORDERS)("should pass validation when sort-order is '%s'.", sortOrder => {
      const dto = createFakeAdminFindQuestionThemesQueryDto({ "sort-order": sortOrder });

      expect(() => ADMIN_FIND_QUESTION_THEMES_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when sort-order is invalid.", () => {
      const dtoWithInvalidSortOrder = { ...validDto, "sort-order": "invalid" };

      expect(() => ADMIN_FIND_QUESTION_THEMES_QUERY_DTO.parse(dtoWithInvalidSortOrder)).toThrow(ZodError);
    });

    it("should use default value 'asc' when sort-order is not provided.", () => {
      const dtoWithoutSortOrder = { "sort-by": "slug" };

      const result = ADMIN_FIND_QUESTION_THEMES_QUERY_DTO.parse(dtoWithoutSortOrder);

      expect(result["sort-order"]).toBe("asc");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_FIND_QUESTION_THEMES_QUERY_DTO.shape["sort-order"].meta();
      const expectedMetadata = { description: QUESTION_THEME_SORT_ORDER_DESCRIPTION, example: QUESTION_THEME_SORT_ORDER_DEFAULT };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("status", () => {
    it.each(QUESTION_THEME_STATUSES)("should pass validation when status is '%s'.", status => {
      const dto = createFakeAdminFindQuestionThemesQueryDto({ status });

      expect(() => ADMIN_FIND_QUESTION_THEMES_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when status is invalid.", () => {
      const dtoWithInvalidStatus = { ...validDto, status: "invalid" };

      expect(() => ADMIN_FIND_QUESTION_THEMES_QUERY_DTO.parse(dtoWithInvalidStatus)).toThrow(ZodError);
    });

    it("should pass validation when status is not provided.", () => {
      const { status: _status, ...dtoWithoutStatus } = validDto;

      expect(() => ADMIN_FIND_QUESTION_THEMES_QUERY_DTO.parse(dtoWithoutStatus)).not.toThrow();
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_FIND_QUESTION_THEMES_QUERY_DTO.shape.status.meta();
      const expectedMetadata = { description: "Question theme's status" };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  it("should use both defaults when no fields are provided.", () => {
    const result = ADMIN_FIND_QUESTION_THEMES_QUERY_DTO.parse({});

    expect(result).toStrictEqual<AdminFindQuestionThemesQueryDto>({ "sort-by": "slug", "sort-order": "asc" });
  });
});