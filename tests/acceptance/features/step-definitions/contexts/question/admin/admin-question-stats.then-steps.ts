import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

import type { QuestionStatsDto } from "@question/application/dto/question-stats/question-stats.dto.shape";
import { QUESTION_STATS_DTO } from "@question/application/dto/question-stats/question-stats.dto.shape";

import {
  STATS_KEY_VALUE_SCHEMA,
  STATS_TOTAL_SCHEMA,
} from "@acceptance-features/step-definitions/contexts/question/admin/datatables/admin-question-stats.datatables.schemas";

import { validateDataTableAndGetRows } from "@acceptance-support/helpers/datatable.helpers";

import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

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

  for (const { field, value } of rows) {
    // Acceptable as we index a known Record with a runtime-validated key
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const typedField = field as keyof typeof stats.byStatus;
    expect(stats.byStatus[typedField]).toBe(value);
  }
});

Then(/^the response should contain questions category stats with:$/u, function(this: GoatItWorld, dataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionStatsDto>(QUESTION_STATS_DTO);
  const rows = validateDataTableAndGetRows(dataTable, STATS_KEY_VALUE_SCHEMA);

  for (const { field, value } of rows) {
    // Acceptable as we index a known Record with a runtime-validated key
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const typedField = field as keyof typeof stats.byCategory;
    expect(stats.byCategory[typedField]).toBe(value);
  }
});

Then(/^the response should contain questions cognitive difficulty stats with:$/u, function(this: GoatItWorld, dataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionStatsDto>(QUESTION_STATS_DTO);
  const rows = validateDataTableAndGetRows(dataTable, STATS_KEY_VALUE_SCHEMA);

  for (const { field, value } of rows) {
    // Acceptable as we index a known Record with a runtime-validated key
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const typedField = field as keyof typeof stats.byCognitiveDifficulty;
    expect(stats.byCognitiveDifficulty[typedField]).toBe(value);
  }
});

Then(/^the response should contain questions author role stats with:$/u, function(this: GoatItWorld, dataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionStatsDto>(QUESTION_STATS_DTO);
  const rows = validateDataTableAndGetRows(dataTable, STATS_KEY_VALUE_SCHEMA);

  for (const { field, value } of rows) {
    // Acceptable as we index a known Record with a runtime-validated key
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const typedField = field as keyof typeof stats.byAuthorRole;
    expect(stats.byAuthorRole[typedField]).toBe(value);
  }
});

Then(/^the response should contain questions rejection type stats with:$/u, function(this: GoatItWorld, dataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionStatsDto>(QUESTION_STATS_DTO);
  const rows = validateDataTableAndGetRows(dataTable, STATS_KEY_VALUE_SCHEMA);

  for (const { field, value } of rows) {
    // Acceptable as we index a known Record with a runtime-validated key
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const typedField = field as keyof typeof stats.byRejectionType;
    expect(stats.byRejectionType[typedField]).toBe(value);
  }
});