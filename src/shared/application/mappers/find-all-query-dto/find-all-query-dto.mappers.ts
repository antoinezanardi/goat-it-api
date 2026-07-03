import { LIMIT_QUERY_KEY } from "@shared/application/dto/constants/limit-query.dto.constants";
import type { SORT_BY_QUERY_KEY, SORT_ORDER_QUERY_KEY } from "@shared/application/dto/constants/sort-query.dto.constants";
import { createSortOptionsFromSortQueryDto } from "@shared/application/mappers/sort-query-dto/sort-query-dto.mappers";

import type { FindAllOptions } from "@shared/domain/types/find/find.types";
import type { SortOrder } from "@shared/domain/types/sort/sort.types";

function createFindAllOptionsFromQueryDto<SortField extends string, Filters extends Record<string, unknown>, Dto extends Record<string, unknown>>(
  dto: Dto & { [SORT_BY_QUERY_KEY]: SortField; [SORT_ORDER_QUERY_KEY]: SortOrder; [LIMIT_QUERY_KEY]: number },
  filterMapper: (dto: Dto) => Partial<Filters> | undefined,
): FindAllOptions<SortField, Filters> {
  const sort = createSortOptionsFromSortQueryDto(dto);
  const filters = filterMapper(dto);
  const limit = dto[LIMIT_QUERY_KEY];

  return { sort, filters, limit };
}

export { createFindAllOptionsFromQueryDto };