import { createFindAllOptionsFromQueryDto } from "@shared/application/mappers/find-all-query-dto/find-all-query-dto.mappers";

import type { FindAllOptions } from "@shared/domain/types/find/find.types";

describe("Find All Query DTO Mapper", () => {
  describe(createFindAllOptionsFromQueryDto, () => {
    it("should map sort fields and filters when filter mapper returns defined filters.", () => {
      const dto = { "sort-by": "createdAt" as const, "sort-order": "desc" as const, "status": "active" };
      const filterMapper = (queryDto: typeof dto): { status: string } | undefined => ({ status: queryDto.status });

      const result = createFindAllOptionsFromQueryDto(dto, filterMapper);

      const expected: FindAllOptions<"createdAt", { status: string }> = {
        sort: { sortBy: "createdAt", sortOrder: "desc" },
        filters: { status: "active" },
      };

      expect(result).toStrictEqual(expected);
    });

    it("should set filters to undefined when filter mapper returns undefined.", () => {
      const dto = { "sort-by": "name" as const, "sort-order": "asc" as const };
      const filterMapper = (): undefined => undefined;

      const result = createFindAllOptionsFromQueryDto(dto, filterMapper);

      const expected: FindAllOptions<"name"> = {
        sort: { sortBy: "name", sortOrder: "asc" },
        filters: undefined,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});