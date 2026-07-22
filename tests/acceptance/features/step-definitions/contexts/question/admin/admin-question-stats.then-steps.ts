import { Then } from "@cucumber/cucumber";

import type { QuestionStatsDto } from "@question/application/dto/question-stats/question-stats.dto.shape";
import { QUESTION_STATS_DTO } from "@question/application/dto/question-stats/question-stats.dto.shape";

import {
  ADMIN_QUESTION_STATS_FIELD_VALUE_DATATABLE_ROW_SCHEMA,
  ADMIN_QUESTION_STATS_TOTAL_DATATABLE_ROW_SCHEMA,
} from "@acceptance-features/step-definitions/contexts/question/admin/datatables/admin-question-stats.datatables.schemas";

import { expectRecordFieldValues, validateDataTableAndGetRows } from "@acceptance-support/helpers/datatable.helpers";

import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Then(/^the response should contain questions stats with:$/u, function(this: GoatItWorld, dataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionStatsDto>(QUESTION_STATS_DTO);
  const rows = validateDataTableAndGetRows(dataTable, ADMIN_QUESTION_STATS_TOTAL_DATATABLE_ROW_SCHEMA);

  expectRecordFieldValues(stats, rows);
});

Then(/^the response should contain questions status stats with:$/u, function(this: GoatItWorld, dataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionStatsDto>(QUESTION_STATS_DTO);
  const rows = validateDataTableAndGetRows(dataTable, ADMIN_QUESTION_STATS_FIELD_VALUE_DATATABLE_ROW_SCHEMA);

  expectRecordFieldValues(stats.byStatus, rows);
});

Then(/^the response should contain questions category stats with:$/u, function(this: GoatItWorld, dataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionStatsDto>(QUESTION_STATS_DTO);
  const rows = validateDataTableAndGetRows(dataTable, ADMIN_QUESTION_STATS_FIELD_VALUE_DATATABLE_ROW_SCHEMA);

  expectRecordFieldValues(stats.byCategory, rows);
});

Then(/^the response should contain questions cognitive difficulty stats with:$/u, function(this: GoatItWorld, dataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionStatsDto>(QUESTION_STATS_DTO);
  const rows = validateDataTableAndGetRows(dataTable, ADMIN_QUESTION_STATS_FIELD_VALUE_DATATABLE_ROW_SCHEMA);

  expectRecordFieldValues(stats.byCognitiveDifficulty, rows);
});

Then(/^the response should contain questions author role stats with:$/u, function(this: GoatItWorld, dataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionStatsDto>(QUESTION_STATS_DTO);
  const rows = validateDataTableAndGetRows(dataTable, ADMIN_QUESTION_STATS_FIELD_VALUE_DATATABLE_ROW_SCHEMA);

  expectRecordFieldValues(stats.byAuthorRole, rows);
});

Then(/^the response should contain questions rejection type stats with:$/u, function(this: GoatItWorld, dataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionStatsDto>(QUESTION_STATS_DTO);
  const rows = validateDataTableAndGetRows(dataTable, ADMIN_QUESTION_STATS_FIELD_VALUE_DATATABLE_ROW_SCHEMA);

  expectRecordFieldValues(stats.byRejectionType, rows);
});