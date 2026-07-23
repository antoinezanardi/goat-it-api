import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

import { QUESTION_THEME_STATS_DTO } from "@question-theme/application/dto/question-theme-stats/question-theme-stats.dto.shape";

import {
  ADMIN_QUESTION_THEME_STATS_BY_QUESTION_COUNT_DATATABLE_ROW_SCHEMA,
  ADMIN_QUESTION_THEME_STATS_FIELD_VALUE_DATATABLE_ROW_SCHEMA,
  ADMIN_QUESTION_THEME_STATS_TOTAL_DATATABLE_ROW_SCHEMA,
} from "@acceptance-features/step-definitions/contexts/question/question-theme/admin/datatables/admin-question-theme-stats.datatables.schemas";

import { expectRecordFieldValues, validateDataTableAndGetRows } from "@acceptance-support/helpers/datatable.helpers";

import type { QuestionThemeStatsDto } from "@question-theme/application/dto/question-theme-stats/question-theme-stats.dto.shape";
import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Then(/^the response should contain question themes stats with:$/u, function(this: GoatItWorld, dataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionThemeStatsDto>(QUESTION_THEME_STATS_DTO);
  const rows = validateDataTableAndGetRows(dataTable, ADMIN_QUESTION_THEME_STATS_TOTAL_DATATABLE_ROW_SCHEMA);

  expectRecordFieldValues(stats, rows);
});

Then(/^the response should contain question themes status stats with:$/u, function(this: GoatItWorld, dataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionThemeStatsDto>(QUESTION_THEME_STATS_DTO);
  const rows = validateDataTableAndGetRows(dataTable, ADMIN_QUESTION_THEME_STATS_FIELD_VALUE_DATATABLE_ROW_SCHEMA);

  expectRecordFieldValues(stats.byStatus, rows);
});

Then(/^the response should contain question themes question count stats with an empty list$/u, function(this: GoatItWorld): void {
  const stats = this.expectLastResponseJson<QuestionThemeStatsDto>(QUESTION_THEME_STATS_DTO);

  expect(stats.byQuestionCount).toStrictEqual([]);
});

Then(/^the response should contain question themes question count stats with:$/u, function(this: GoatItWorld, byQuestionCountDataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionThemeStatsDto>(QUESTION_THEME_STATS_DTO);
  const dataTableRows = validateDataTableAndGetRows(byQuestionCountDataTable, ADMIN_QUESTION_THEME_STATS_BY_QUESTION_COUNT_DATATABLE_ROW_SCHEMA);

  for (const expectedRow of dataTableRows) {
    const matchingEntry = stats.byQuestionCount.find(entry => entry.themeSlug === expectedRow.themeSlug);

    if (matchingEntry === undefined) {
      throw new Error(`No entry found in byQuestionCount with themeSlug "${expectedRow.themeSlug}".`);
    }

    expect(matchingEntry.activeQuestionCount).toBe(expectedRow.activeQuestionCount);
  }
});