import { faker } from "@faker-js/faker";

import { createFakeSortOptions } from "@faketories/shared/domain/sort-options.faketory";

import type { FindAllOptions } from "@shared/domain/types/find/find.types";

function createFakeFindAllOptions<SortField extends string, Filters extends Record<string, unknown> = Record<string, never>>(
  sortableFields: readonly SortField[],
  overrides: Partial<FindAllOptions<SortField, Filters>> = {},
): FindAllOptions<SortField, Filters> {
  return {
    sort: createFakeSortOptions(sortableFields),
    limit: faker.number.int({ min: 1, max: 100 }),
    ...overrides,
  };
}

export { createFakeFindAllOptions };