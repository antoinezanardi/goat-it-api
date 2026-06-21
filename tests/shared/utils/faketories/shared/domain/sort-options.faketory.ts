import { faker } from "@faker-js/faker";

import { SORT_ORDERS } from "@shared/domain/constants/sort/sort.constants";

import type { SortOptions } from "@shared/domain/types/sort/sort.types";

function createFakeSortOptions<T extends string>(sortableFields: readonly T[], overrides: Partial<SortOptions<T>> = {}): SortOptions<T> {
  return {
    sortBy: faker.helpers.arrayElement(sortableFields),
    sortOrder: faker.helpers.arrayElement(SORT_ORDERS),
    ...overrides,
  };
}

export { createFakeSortOptions };