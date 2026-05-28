import type { SORT_ORDERS } from "@shared/infrastructure/http/zod/constants/sort-order.constants";

import type { TupleToUnion } from "type-fest";

type SortOrder = TupleToUnion<typeof SORT_ORDERS>;

type SortOptions<T extends string> = {
  sortBy: T;
  sortOrder: SortOrder;
};

export type { SortOrder, SortOptions };