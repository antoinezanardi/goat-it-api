import { faker } from "@faker-js/faker";

import { LIMIT_MINIMUM } from "@shared/infrastructure/http/zod/validators/limit/constants/limit.zod.validators.constants";

import { createFakeSortOptions } from "@faketories/shared/domain/sort-options.faketory";

import type { FindAllOptions } from "@shared/domain/types/find/find.types";

function createFakeFindAllOptions<SortField extends string, Filters extends Record<string, unknown> = Record<string, never>>(
  sortableFields: readonly SortField[],
  overrides: Partial<FindAllOptions<SortField, Filters>> = {},
): FindAllOptions<SortField, Filters> {
  return {
    sort: createFakeSortOptions(sortableFields),
    limit: faker.helpers.maybe(() => faker.number.int({ min: LIMIT_MINIMUM })),
    ...overrides,
  };
}

export { createFakeFindAllOptions };