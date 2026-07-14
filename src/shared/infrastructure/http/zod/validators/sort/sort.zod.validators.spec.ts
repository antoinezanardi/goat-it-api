import { z } from "zod";

import { SORT_ORDERS } from "@shared/domain/constants/sort/sort.constants";
import {
  SORT_ORDER_DEFAULT,
  SORT_ORDER_DESCRIPTION,
} from "@shared/infrastructure/http/zod/validators/sort/constants/sort.zod.validators.constants";
import { zSortOrder } from "@shared/infrastructure/http/zod/validators/sort/sort.zod.validators";

describe("Sort Zod Validators", () => {
  describe(zSortOrder, () => {
    it.each(SORT_ORDERS)("should pass validation when sort-order is '%s'.", (sortOrder: string) => {
      const schema = zSortOrder();
      const result = schema.safeParse(sortOrder);

      expect(result.success).toBeTruthy();
    });

    it("should throw zod error when sort-order is invalid.", () => {
      const schema = zSortOrder();

      expect(() => schema.parse("invalid")).toThrow(z.ZodError);
    });

    it("should use default value 'desc' when sort-order is not provided.", () => {
      const schema = zSortOrder();
      const result = schema.parse(undefined);

      expect(result).toBe(SORT_ORDER_DEFAULT);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const schema = zSortOrder();
      const metadata = schema.meta();

      expect(metadata).toStrictEqual<Record<string, unknown>>({
        description: SORT_ORDER_DESCRIPTION,
        example: SORT_ORDER_DEFAULT,
      });
    });

    it("should have sort-order as optional when checking the input type.", () => {
      expectTypeOf<z.input<ReturnType<typeof zSortOrder>>>().toEqualTypeOf<"asc" | "desc" | undefined>();
    });
  });
});