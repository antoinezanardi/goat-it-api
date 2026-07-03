import { z } from "zod";

import { zCoerceOptionalString, zCoerceOptionalStringArray } from "@acceptance-support/helpers/datatable.helpers";

const QUESTION_THEME_DATATABLE_ROW_SCHEMA = z.strictObject({
  slug: z.string(),
  label: z.string(),
  aliases: zCoerceOptionalStringArray(),
  description: z.string(),
  color: zCoerceOptionalString(),
  status: z.string(),
});

const PUBLIC_QUESTION_THEME_QUERY_PARAMS_SCHEMA = z.strictObject({
  "sort-by": zCoerceOptionalString(),
  "sort-order": zCoerceOptionalString(),
  "limit": zCoerceOptionalString(),
});

export {
  QUESTION_THEME_DATATABLE_ROW_SCHEMA,
  PUBLIC_QUESTION_THEME_QUERY_PARAMS_SCHEMA,
};