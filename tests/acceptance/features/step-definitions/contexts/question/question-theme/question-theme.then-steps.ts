import { Then } from "@cucumber/cucumber";
import { expect } from "expect";
import { z } from "zod";

import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme.dto";
import { QUESTION_THEME_DTO } from "@question/modules/question-theme/application/dto/question-theme.dto";

import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Then(/^the response should contain (?<questionThemesCount>\d+) question themes$/u, function(this: GoatItWorld, countAsString: string): void {
  const questionThemes = this.expectLastResponseJson<QuestionThemeDto[]>(z.array(QUESTION_THEME_DTO));
  const questionThemesCount = Number.parseInt(countAsString);

  expect(questionThemes).toHaveLength(questionThemesCount);
});

Then(/^the response should contain the following question themes:$/u, function(this: GoatItWorld, questionThemesDataTable: DataTable): void {
  const questionThemes = this.expectLastResponseJson<QuestionThemeDto[]>(z.array(QUESTION_THEME_DTO));
  const dataTableRows = questionThemesDataTable.hashes() as Record<"label" | "aliases" | "description" | "status", string>[];

  for (const [index, expectedQuestionTheme] of dataTableRows.entries()) {
    const questionTheme = questionThemes[index];
    const expectedQuestionThemeAliases = expectedQuestionTheme.aliases.split(",").map(alias => alias.trim());

    expect(questionTheme.label).toBe(expectedQuestionTheme.label);
    expect(questionTheme.aliases).toStrictEqual(expectedQuestionThemeAliases);
    expect(questionTheme.description).toBe(expectedQuestionTheme.description);
    expect(questionTheme.status).toBe(expectedQuestionTheme.status);
  }
});

Then(/^the response should contain the following question theme:$/u, function(this: GoatItWorld, questionThemeDataTable: DataTable): void {
  const questionTheme = this.expectLastResponseJson<QuestionThemeDto>(QUESTION_THEME_DTO);
  const dataTableRow = questionThemeDataTable.hashes()[0];
  const expectedQuestionThemeAliases = dataTableRow.aliases.split(",").map(alias => alias.trim());

  expect(questionTheme.label).toBe(dataTableRow.label);
  expect(questionTheme.aliases).toStrictEqual(expectedQuestionThemeAliases);
  expect(questionTheme.description).toBe(dataTableRow.description);
  expect(questionTheme.status).toBe(dataTableRow.status);
});