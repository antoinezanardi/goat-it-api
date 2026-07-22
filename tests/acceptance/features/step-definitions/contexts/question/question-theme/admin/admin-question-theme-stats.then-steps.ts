import { Then } from "@cucumber/cucumber";
import { expect } from "expect";
import { z } from "zod";

import { QUESTION_THEME_STATS_DTO } from "@question-theme/application/dto/question-theme-stats/question-theme-stats.dto.shape";

import { validateDataTableAndGetRows } from "@acceptance-support/helpers/datatable.helpers";

import type { QuestionThemeStatsDto } from "@question-theme/application/dto/question-theme-stats/question-theme-stats.dto.shape";
import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

const QUESTION_THEME_STATS_FIELD_VALUE_ROW_SCHEMA = z.strictObject({
  field: z.string(),
  value: z.coerce.number(),
});

const QUESTION_THEME_STATS_BY_QUESTION_COUNT_ROW_SCHEMA = z.strictObject({
  themeSlug: z.string(),
  activeQuestionCount: z.coerce.number(),
});

Then(/^the response should contain a Question Theme Stats DTO with:$/u, function(this: GoatItWorld, statsDataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionThemeStatsDto>(QUESTION_THEME_STATS_DTO);
  const dataTableRows = validateDataTableAndGetRows(statsDataTable, QUESTION_THEME_STATS_FIELD_VALUE_ROW_SCHEMA);

  for (const { field, value } of dataTableRows) {
    const parts = field.split(".");
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    let actual: Record<string, unknown> | number = stats;

    for (const part of parts) {
      if (typeof actual !== "object") {
        throw new TypeError(`Cannot navigate path "${field}": "${part}" is not an object.`);
      }
      // Acceptable as we navigate a known nested structure
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      actual = actual[part] as number;
    }

    expect(actual).toBe(value);
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