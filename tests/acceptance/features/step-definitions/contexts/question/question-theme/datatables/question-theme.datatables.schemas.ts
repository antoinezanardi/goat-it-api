import { z } from "zod";

import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

const QUESTION_THEME_DATATABLE_ROW_SCHEMA = z.strictObject({
  slug: z.string(),
  label: z.string(),
  aliases: z.string(),
  description: z.string(),
  status: z.string(),
});

const ADMIN_QUESTION_THEME_DATATABLE_ROW_SCHEMA = z.strictObject({
  slug: z.string(),
  status: z.string(),
});

const QUESTION_THEME_LOCALIZED_LABEL_DATATABLE_ROW_SCHEMA = z.strictObject({
  locale: z.enum(LOCALES),
  label: z.string(),
});

const QUESTION_THEME_LOCALIZED_DESCRIPTION_DATATABLE_ROW_SCHEMA = z.strictObject({
  locale: z.enum(LOCALES),
  description: z.string(),
});

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