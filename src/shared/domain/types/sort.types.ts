import type { SORT_ORDERS } from "@shared/domain/constants/sort-order.constants";

import type { TupleToUnion } from "type-fest";

type SortOrder = TupleToUnion<typeof SORT_ORDERS>;

type SortDirection = 1 | -1;

type SortOptions<T extends string> = {
  sortBy: T;
  sortOrder: SortOrder;
};

export type { SortOrder, SortDirection, SortOptions };