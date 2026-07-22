import { Then } from "@cucumber/cucumber";
import { expect } from "expect";
import { z } from "zod";

import { QUESTION_STATS_DTO } from "@question/application/dto/question-stats/question-stats.dto.shape";
import type { QuestionStatsDto } from "@question/application/dto/question-stats/question-stats.dto.shape";

import { validateDataTableAndGetRows } from "@acceptance-support/helpers/datatable.helpers";

import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

const STATS_KEY_VALUE_SCHEMA = z.strictObject({
  field: z.string(),
  value: z.coerce.number(),
});

const STATS_TOTAL_SCHEMA = z.strictObject({
  field: z.literal("total"),
  value: z.coerce.number(),
});

Then(/^the response should contain questions stats with:$/u, function(this: GoatItWorld, dataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionStatsDto>(QUESTION_STATS_DTO);
  const rows = validateDataTableAndGetRows(dataTable, STATS_TOTAL_SCHEMA);

  for (const { field, value } of rows) {
    expect(stats[field]).toBe(value);
  }
});

Then(/^the response should contain questions status stats with:$/u, function(this: GoatItWorld, dataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionStatsDto>(QUESTION_STATS_DTO);
  const rows = validateDataTableAndGetRows(dataTable, STATS_KEY_VALUE_SCHEMA);
  // Acceptable as we index a known Record with a runtime-validated key
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const byStatus = stats.byStatus as Record<string, number>;

  for (const { field, value } of rows) {
    expect(byStatus[field]).toBe(value);
  }
});

Then(/^the response should contain questions category stats with:$/u, function(this: GoatItWorld, dataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionStatsDto>(QUESTION_STATS_DTO);
  const rows = validateDataTableAndGetRows(dataTable, STATS_KEY_VALUE_SCHEMA);
  // Acceptable as we index a known Record with a runtime-validated key
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const byCategory = stats.byCategory as Record<string, number>;

  for (const { field, value } of rows) {
    expect(byCategory[field]).toBe(value);
  }
});

Then(/^the response should contain questions cognitive difficulty stats with:$/u, function(this: GoatItWorld, dataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionStatsDto>(QUESTION_STATS_DTO);
  const rows = validateDataTableAndGetRows(dataTable, STATS_KEY_VALUE_SCHEMA);
  // Acceptable as we index a known Record with a runtime-validated key
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const byCognitiveDifficulty = stats.byCognitiveDifficulty as Record<string, number>;

  for (const { field, value } of rows) {
    expect(byCognitiveDifficulty[field]).toBe(value);
  }
});

Then(/^the response should contain questions author role stats with:$/u, function(this: GoatItWorld, dataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionStatsDto>(QUESTION_STATS_DTO);
  const rows = validateDataTableAndGetRows(dataTable, STATS_KEY_VALUE_SCHEMA);
  // Acceptable as we index a known Record with a runtime-validated key
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const byAuthorRole = stats.byAuthorRole as Record<string, number>;

  for (const { field, value } of rows) {
    expect(byAuthorRole[field]).toBe(value);
  }
});

Then(/^the response should contain questions rejection type stats with:$/u, function(this: GoatItWorld, dataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionStatsDto>(QUESTION_STATS_DTO);
  const rows = validateDataTableAndGetRows(dataTable, STATS_KEY_VALUE_SCHEMA);
  // Acceptable as we index a known Record with a runtime-validated key
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const byRejectionType = stats.byRejectionType as Record<string, number>;

  for (const { field, value } of rows) {
    expect(byRejectionType[field]).toBe(value);
  }
});