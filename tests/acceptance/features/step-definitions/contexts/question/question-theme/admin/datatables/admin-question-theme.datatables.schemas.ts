import { z } from "zod";

import { createZLocalizedDataTableRowSchema } from "@acceptance-features/step-definitions/shared/locale/datatables/locale.datatables.helpers";

const ADMIN_QUESTION_THEME_DATATABLE_ROW_SCHEMA = z.strictObject({
  slug: z.string(),
  status: z.string(),
});

const ADMIN_QUESTION_THEME_LOCALIZED_LABEL_DATATABLE_ROW_SCHEMA = createZLocalizedDataTableRowSchema("label");

const ADMIN_QUESTION_THEME_LOCALIZED_DESCRIPTION_DATATABLE_ROW_SCHEMA = createZLocalizedDataTableRowSchema("description");

const ADMIN_QUESTION_THEME_LOCALIZED_ALIASES_DATATABLE_ROW_SCHEMA = createZLocalizedDataTableRowSchema("aliases");

export {
  ADMIN_QUESTION_THEME_DATATABLE_ROW_SCHEMA,
  ADMIN_QUESTION_THEME_LOCALIZED_LABEL_DATATABLE_ROW_SCHEMA,
  ADMIN_QUESTION_THEME_LOCALIZED_DESCRIPTION_DATATABLE_ROW_SCHEMA,
  ADMIN_QUESTION_THEME_LOCALIZED_ALIASES_DATATABLE_ROW_SCHEMA,
};