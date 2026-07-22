import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

import { QUESTION_THEME_STATS_DTO } from "@question-theme/application/dto/question-theme-stats/question-theme-stats.dto.shape";

import {
  QUESTION_THEME_STATS_BY_QUESTION_COUNT_ROW_SCHEMA,
  QUESTION_THEME_STATS_KEY_VALUE_SCHEMA,
  QUESTION_THEME_STATS_TOTAL_SCHEMA,
} from "@acceptance-features/step-definitions/contexts/question/question-theme/admin/datatables/admin-question-theme-stats.datatables.schemas";

import { validateDataTableAndGetRows } from "@acceptance-support/helpers/datatable.helpers";

import type { QuestionThemeStatsDto } from "@question-theme/application/dto/question-theme-stats/question-theme-stats.dto.shape";
import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Then(/^the response should contain question themes stats with:$/u, function(this: GoatItWorld, dataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionThemeStatsDto>(QUESTION_THEME_STATS_DTO);
  const rows = validateDataTableAndGetRows(dataTable, QUESTION_THEME_STATS_TOTAL_SCHEMA);

  for (const { field, value } of rows) {
    expect(stats[field]).toBe(value);
  }
});

Then(/^the response should contain question themes status stats with:$/u, function(this: GoatItWorld, dataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionThemeStatsDto>(QUESTION_THEME_STATS_DTO);
  const rows = validateDataTableAndGetRows(dataTable, QUESTION_THEME_STATS_KEY_VALUE_SCHEMA);

  for (const { field, value } of rows) {
    // Acceptable as we index a known Record with a runtime-validated key
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const typedField = field as keyof typeof stats.byStatus;
    expect(stats.byStatus[typedField]).toBe(value);
  }
});

Then(/^the response should contain question themes question count stats with an empty list$/u, function(this: GoatItWorld): void {
  const stats = this.expectLastResponseJson<QuestionThemeStatsDto>(QUESTION_THEME_STATS_DTO);

  expect(stats.byQuestionCount).toStrictEqual([]);
});

Then(/^the response should contain question themes question count stats with:$/u, function(this: GoatItWorld, byQuestionCountDataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionThemeStatsDto>(QUESTION_THEME_STATS_DTO);
  const dataTableRows = validateDataTableAndGetRows(byQuestionCountDataTable, QUESTION_THEME_STATS_BY_QUESTION_COUNT_ROW_SCHEMA);

  for (const expectedRow of dataTableRows) {
    const matchingEntry = stats.byQuestionCount.find(entry => entry.themeSlug === expectedRow.themeSlug);

    if (matchingEntry === undefined) {
      throw new Error(`No entry found in byQuestionCount with themeSlug "${expectedRow.themeSlug}".`);
    }

    expect(matchingEntry.activeQuestionCount).toBe(expectedRow.activeQuestionCount);
  }
});