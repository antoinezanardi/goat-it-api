import { Then } from "@cucumber/cucumber";
import { expect } from "expect";
import { z } from "zod";

import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme/question-theme.dto";
import { QUESTION_THEME_DTO } from "@question/modules/question-theme/application/dto/question-theme/question-theme.schema";

import { expectQuestionThemeDtoToMatch } from "@acceptance-features/step-definitions/contexts/question/question-theme/public/helpers/question-theme.steps.helpers";
import { QUESTION_THEME_DATATABLE_ROW_SCHEMA } from "@acceptance-features/step-definitions/contexts/question/question-theme/public/datatables/question-theme.datatables.schemas";

import { validateDataTableAndGetFirstRow, validateDataTableAndGetRows } from "@acceptance-support/helpers/datatable.helpers";

import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Then(/^the response should contain (?<questionThemesCount>\d+) question themes$/u, function(this: GoatItWorld, countAsString: string): void {
  const questionThemes = this.expectLastResponseJson<QuestionThemeDto[]>(z.array(QUESTION_THEME_DTO));
  const questionThemesCount = Number.parseInt(countAsString);

  expect(questionThemes).toHaveLength(questionThemesCount);
});

Then(/^the response should contain the following question themes:$/u, function(this: GoatItWorld, questionThemesDataTable: DataTable): void {
  const questionThemes = this.expectLastResponseJson<QuestionThemeDto[]>(z.array(QUESTION_THEME_DTO));
  const dataTableRows = validateDataTableAndGetRows(questionThemesDataTable, QUESTION_THEME_DATATABLE_ROW_SCHEMA);

  for (const [index, expectedQuestionTheme] of dataTableRows.entries()) {
    const questionTheme = questionThemes[index];

    expectQuestionThemeDtoToMatch(questionTheme, expectedQuestionTheme);
  }
});

Then(/^the response should contain the following question theme:$/u, function(this: GoatItWorld, questionThemeDataTable: DataTable): void {
  const questionTheme = this.expectLastResponseJson<QuestionThemeDto>(QUESTION_THEME_DTO);
  const expectedQuestionTheme = validateDataTableAndGetFirstRow(questionThemeDataTable, QUESTION_THEME_DATATABLE_ROW_SCHEMA);

  expectQuestionThemeDtoToMatch(questionTheme, expectedQuestionTheme);
});