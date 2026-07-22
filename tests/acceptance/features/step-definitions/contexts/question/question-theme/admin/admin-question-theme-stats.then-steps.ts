import { Then } from "@cucumber/cucumber";
import { expect } from "expect";
import { z } from "zod";

import { QUESTION_THEME_STATS_DTO } from "@question-theme/application/dto/question-theme-stats/question-theme-stats.dto.shape";

import { validateDataTableAndGetRows } from "@acceptance-support/helpers/datatable.helpers";

import type { QuestionThemeStatsDto } from "@question-theme/application/dto/question-theme-stats/question-theme-stats.dto.shape";
import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

const QUESTION_THEME_STATS_TOTAL_SCHEMA = z.strictObject({
  field: z.literal("total"),
  value: z.coerce.number(),
});

const QUESTION_THEME_STATS_KEY_VALUE_SCHEMA = z.strictObject({
  field: z.string(),
  value: z.coerce.number(),
});

const QUESTION_THEME_STATS_BY_QUESTION_COUNT_ROW_SCHEMA = z.strictObject({
  themeSlug: z.string(),
  activeQuestionCount: z.coerce.number(),
});

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
  // Acceptable as we index a known Record with a runtime-validated key
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const byStatus = stats.byStatus as Record<string, number>;

  for (const { field, value } of rows) {
    expect(byStatus[field]).toBe(value);
  }
});

Then(/^the response's byQuestionCount should contain:$/u, function(this: GoatItWorld, byQuestionCountDataTable: DataTable): void {
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