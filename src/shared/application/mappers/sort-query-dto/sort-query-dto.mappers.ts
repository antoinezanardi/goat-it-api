import { SORT_BY_QUERY_KEY, SORT_ORDER_QUERY_KEY } from "@shared/application/dto/constants/sort-query.dto.constants";

import type { SortOptions, SortOrder } from "@shared/domain/types/sort/sort.types";

function createSortOptionsFromSortQueryDto<T extends string>(dto: { [SORT_BY_QUERY_KEY]: T; [SORT_ORDER_QUERY_KEY]: SortOrder }): SortOptions<T> {
  return {
    sortBy: dto[SORT_BY_QUERY_KEY],
    sortOrder: dto[SORT_ORDER_QUERY_KEY],
  };
}

export { createSortOptionsFromSortQueryDto };