import { createFindAllOptionsFromQueryDto } from "@shared/application/mappers/find-all-query-dto/find-all-query-dto.mappers";
import { LIMIT_DEFAULT } from "@shared/infrastructure/http/zod/validators/limit/constants/limit.zod.validators.constants";

import { createFakeFindAllOptions } from "@faketories/shared/domain/find-all-options.faketory";

describe("Find All Query DTO Mapper", () => {
  describe(createFindAllOptionsFromQueryDto, () => {
    it("should map sort fields, filters and limit when filter mapper returns defined filters.", () => {
      const dto = { "sort-by": "createdAt" as const, "sort-order": "desc" as const, "status": "active", "limit": LIMIT_DEFAULT };
      const filterMapper = (queryDto: typeof dto): { status: string } | undefined => ({ status: queryDto.status });

      const result = createFindAllOptionsFromQueryDto(dto, filterMapper);

      const expected = createFakeFindAllOptions(["createdAt" as const], {
        sort: { sortBy: "createdAt", sortOrder: "desc" },
        filters: { status: "active" },
        limit: LIMIT_DEFAULT,
      });

      expect(result).toStrictEqual(expected);
    });

    it("should set filters to undefined and include limit when filter mapper returns undefined.", () => {
      const dto = { "sort-by": "name" as const, "sort-order": "asc" as const, "limit": LIMIT_DEFAULT };
      const filterMapper = (): undefined => undefined;

      const result = createFindAllOptionsFromQueryDto(dto, filterMapper);

      const expected = createFakeFindAllOptions(["name" as const], {
        sort: { sortBy: "name", sortOrder: "asc" },
        filters: undefined,
        limit: LIMIT_DEFAULT,
      });

      expect(result).toStrictEqual(expected);
    });

    it("should include limit in the result when it is provided.", () => {
      const dto = { "sort-by": "createdAt" as const, "sort-order": "desc" as const, "limit": 5 };
      const filterMapper = (): undefined => undefined;

      const result = createFindAllOptionsFromQueryDto(dto, filterMapper);

      expect(result.limit).toBe(5);
    });
  });
});