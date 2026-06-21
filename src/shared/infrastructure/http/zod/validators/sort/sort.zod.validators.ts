import { z } from "zod";

import { SORT_ORDERS } from "@shared/domain/constants/sort/sort.constants";
import { SORT_ORDER_DEFAULT, SORT_ORDER_DESCRIPTION } from "@shared/infrastructure/http/zod/validators/sort/constants/sort.zod.validators.constants";

import type { ZodDefault, ZodEnum } from "zod";

import type { TupleToEnum } from "@shared/types/enum.types";

function zSortOrder(): ZodDefault<ZodEnum<TupleToEnum<typeof SORT_ORDERS>>> {
  return z.enum(SORT_ORDERS)
    .default(SORT_ORDER_DEFAULT)
    .describe(SORT_ORDER_DESCRIPTION)
    .meta({ example: SORT_ORDER_DEFAULT });
}

export { zSortOrder };