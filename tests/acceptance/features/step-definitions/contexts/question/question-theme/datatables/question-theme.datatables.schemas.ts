import { z } from "zod";

import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

import { createZLocalizedDataTableRowSchema } from "@acceptance-features/step-definitions/shared/locale/datatables/locale.datatables.helpers";

import { zCoerceOptionalStringArray } from "@acceptance-support/helpers/datatable.helpers";

const QUESTION_THEME_DATATABLE_ROW_SCHEMA = z.strictObject({
  slug: z.string(),
  label: z.string(),
  aliases: zCoerceOptionalStringArray(),
  description: z.string(),
  status: z.string(),
});

const ADMIN_QUESTION_THEME_DATATABLE_ROW_SCHEMA = z.strictObject({
  slug: z.string(),
  status: z.string(),
});

const QUESTION_THEME_LOCALIZED_LABEL_DATATABLE_ROW_SCHEMA = createZLocalizedDataTableRowSchema("label");

const QUESTION_THEME_LOCALIZED_DESCRIPTION_DATATABLE_ROW_SCHEMA = createZLocalizedDataTableRowSchema("description");

const QUESTION_THEME_LOCALIZED_ALIASES_DATATABLE_ROW_SCHEMA = z.strictObject({
  locale: z.enum(LOCALES),
  aliases: z.string(),
});

export {
  QUESTION_THEME_DATATABLE_ROW_SCHEMA,
  ADMIN_QUESTION_THEME_DATATABLE_ROW_SCHEMA,
  QUESTION_THEME_LOCALIZED_LABEL_DATATABLE_ROW_SCHEMA,
  QUESTION_THEME_LOCALIZED_DESCRIPTION_DATATABLE_ROW_SCHEMA,
  QUESTION_THEME_LOCALIZED_ALIASES_DATATABLE_ROW_SCHEMA,
};