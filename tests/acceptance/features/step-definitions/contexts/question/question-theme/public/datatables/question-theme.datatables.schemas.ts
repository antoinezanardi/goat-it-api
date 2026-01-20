import { z } from "zod";

import { zCoerceOptionalStringArray } from "@acceptance-support/helpers/datatable.helpers";

const QUESTION_THEME_DATATABLE_ROW_SCHEMA = z.strictObject({
  slug: z.string(),
  label: z.string(),
  aliases: zCoerceOptionalStringArray(),
  description: z.string(),
  status: z.string(),
});

export {
  QUESTION_THEME_DATATABLE_ROW_SCHEMA,
};