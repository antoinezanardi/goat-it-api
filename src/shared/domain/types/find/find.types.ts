import type { SortOptions } from "@shared/domain/types/sort/sort.types";

type FindAllOptions<SortField extends string, Filters extends Record<string, unknown> = Record<string, never>> = {
  sort: SortOptions<SortField>;
  filters?: Partial<Filters>;
  limit?: number;
};

export type { FindAllOptions };