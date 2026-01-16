import type { z } from "zod";

import type { LocaleEnum } from "@shared/domain/value-objects/locale/locale.types";

type ZLocalizedDataTableRowSchema<TField extends string> = z.ZodObject<{ locale: z.ZodEnum<LocaleEnum> } & {
  [K in TField]: z.ZodString;
}>;

export type {
  ZLocalizedDataTableRowSchema,
};