import { Then } from "@cucumber/cucumber";
import { expect } from "expect";
import { z } from "zod";

import { QUESTION_STATS_DTO } from "@question/application/dto/question-stats/question-stats.dto.shape";
import type { QuestionStatsDto } from "@question/application/dto/question-stats/question-stats.dto.shape";

import { validateDataTableAndGetRows } from "@acceptance-support/helpers/datatable.helpers";

import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

const QUESTION_STATS_FIELD_VALUE_ROW_SCHEMA = z.strictObject({
  field: z.string(),
  value: z.coerce.number(),
});

Then(/^the response should contain a Question Stats DTO with:$/u, function(this: GoatItWorld, statsDataTable: DataTable): void {
  const stats = this.expectLastResponseJson<QuestionStatsDto>(QUESTION_STATS_DTO);
  const dataTableRows = validateDataTableAndGetRows(statsDataTable, QUESTION_STATS_FIELD_VALUE_ROW_SCHEMA);

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