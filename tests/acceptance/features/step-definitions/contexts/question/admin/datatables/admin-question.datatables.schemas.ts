import { z } from "zod";

import { LIMIT_QUERY_KEY } from "@shared/application/dto/constants/limit-query.dto.constants";
import { SORT_BY_QUERY_KEY, SORT_ORDER_QUERY_KEY } from "@shared/application/dto/constants/sort-query.dto.constants";
import { IS_FULLY_TRANSLATED_QUERY_KEY } from "@shared/application/dto/constants/translation-completeness-query.dto.constants";

import { QUESTION_AUTHOR_ROLE_QUERY_KEY, QUESTION_CATEGORY_QUERY_KEY, QUESTION_COGNITIVE_DIFFICULTY_QUERY_KEY, QUESTION_IDS_QUERY_KEY, QUESTION_STATUS_QUERY_KEY, QUESTION_THEME_IDS_QUERY_KEY } from "@question/application/dto/shared/constants/question-filter-query.dto.constants";

import { createZLocalizedDataTableRowSchema } from "@acceptance-features/step-definitions/shared/locale/datatables/locale.datatables.helpers";

import { zCoerceOptionalBoolean, zCoerceOptionalString, zCoerceOptionalStringArray } from "@acceptance-support/helpers/datatable.helpers";

const ADMIN_QUESTION_CONTENT_STATEMENT_DATATABLE_ROW_SCHEMA = createZLocalizedDataTableRowSchema("statement");

const ADMIN_QUESTION_CONTENT_ANSWER_DATATABLE_ROW_SCHEMA = createZLocalizedDataTableRowSchema("answer");

const ADMIN_QUESTION_CONTENT_CONTEXT_DATATABLE_ROW_SCHEMA = createZLocalizedDataTableRowSchema("context");

const ADMIN_QUESTION_THEME_ASSIGNMENT_DATATABLE_ROW_SCHEMA = z.strictObject({
  slug: z.string(),
  isPrimary: zCoerceOptionalBoolean(),
  isHint: zCoerceOptionalBoolean(),
});

const ADMIN_QUESTION_THEME_ASSIGNMENT_LABEL_DATATABLE_ROW_SCHEMA = createZLocalizedDataTableRowSchema("label");

const ADMIN_QUESTION_QUERY_PARAMS_DATATABLE_ROW_SCHEMA = z.strictObject({
  [SORT_BY_QUERY_KEY]: zCoerceOptionalString(),
  [SORT_ORDER_QUERY_KEY]: zCoerceOptionalString(),
  [QUESTION_STATUS_QUERY_KEY]: zCoerceOptionalString(),
  [QUESTION_CATEGORY_QUERY_KEY]: zCoerceOptionalString(),
  [QUESTION_COGNITIVE_DIFFICULTY_QUERY_KEY]: zCoerceOptionalString(),
  [QUESTION_AUTHOR_ROLE_QUERY_KEY]: zCoerceOptionalString(),
  [QUESTION_THEME_IDS_QUERY_KEY]: zCoerceOptionalStringArray(),
  [QUESTION_IDS_QUERY_KEY]: zCoerceOptionalStringArray(),
  [LIMIT_QUERY_KEY]: zCoerceOptionalString(),
  [IS_FULLY_TRANSLATED_QUERY_KEY]: zCoerceOptionalString(),
});

export {
  ADMIN_QUESTION_CONTENT_STATEMENT_DATATABLE_ROW_SCHEMA,
  ADMIN_QUESTION_CONTENT_ANSWER_DATATABLE_ROW_SCHEMA,
  ADMIN_QUESTION_CONTENT_CONTEXT_DATATABLE_ROW_SCHEMA,
  ADMIN_QUESTION_THEME_ASSIGNMENT_DATATABLE_ROW_SCHEMA,
  ADMIN_QUESTION_THEME_ASSIGNMENT_LABEL_DATATABLE_ROW_SCHEMA,
  ADMIN_QUESTION_QUERY_PARAMS_DATATABLE_ROW_SCHEMA,
};