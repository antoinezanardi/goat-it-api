import { Then } from "@cucumber/cucumber";
import { expect } from "expect";
import { z } from "zod";

import type { AdminQuestionThemeDto } from "@question/modules/question-theme/application/dto/admin-question-theme/admin-question-theme.dto";
import { ADMIN_QUESTION_THEME_DTO } from "@question/modules/question-theme/application/dto/admin-question-theme/admin-question-theme.dto";
import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme/question-theme.dto";
import { QUESTION_THEME_DTO } from "@question/modules/question-theme/application/dto/question-theme/question-theme.dto";

import { ADMIN_QUESTION_THEME_DATATABLE_ROW_SCHEMA, QUESTION_THEME_DATATABLE_ROW_SCHEMA, QUESTION_THEME_LOCALIZED_ALIASES_DATATABLE_ROW_SCHEMA, QUESTION_THEME_LOCALIZED_DESCRIPTION_DATATABLE_ROW_SCHEMA, QUESTION_THEME_LOCALIZED_LABEL_DATATABLE_ROW_SCHEMA } from "@acceptance-features/step-definitions/contexts/question/question-theme/datatables/question-theme.datatables.schemas";
import { expectQuestionThemeDtoToMatch, findQuestionThemeBySlugOrThrow } from "@acceptance-features/step-definitions/contexts/question/question-theme/helpers/question-theme.steps.helpers";

import { validateDataTableAndGetFirstRow, validateDataTableAndGetRows } from "@acceptance-support/helpers/datatable.helpers";

import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Then(/^the response should contain (?<questionThemesCount>\d+) question themes$/u, function(this: GoatItWorld, countAsString: string): void {
  const questionThemes = this.expectLastResponseJson<QuestionThemeDto[]>(z.array(QUESTION_THEME_DTO));
  const questionThemesCount = Number.parseInt(countAsString);

  expect(questionThemes).toHaveLength(questionThemesCount);
});

Then(/^the response should contain (?<questionThemesCount>\d+) admin question themes$/u, function(this: GoatItWorld, countAsString: string): void {
  const questionThemes = this.expectLastResponseJson<AdminQuestionThemeDto[]>(z.array(ADMIN_QUESTION_THEME_DTO));
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

Then(/^the response should contain the following admin question themes:$/u, function(this: GoatItWorld, questionThemesDataTable: DataTable): void {
  const questionThemes = this.expectLastResponseJson<AdminQuestionThemeDto[]>(z.array(ADMIN_QUESTION_THEME_DTO));
  const dataTableRows = validateDataTableAndGetRows(questionThemesDataTable, ADMIN_QUESTION_THEME_DATATABLE_ROW_SCHEMA);

  for (const [index, expectedAdminQuestionTheme] of dataTableRows.entries()) {
    const adminQuestionTheme = questionThemes[index];

    expect(adminQuestionTheme.slug).toBe(expectedAdminQuestionTheme.slug);
    expect(adminQuestionTheme.status).toBe(expectedAdminQuestionTheme.status);
  }
});

Then(/^the response should contain an admin question theme among them with slug "(?<slug>[^"]+)" and the following localized labels:$/u, function(this: GoatItWorld, slug: string, localizedLabelsDataTable: DataTable): void {
  const adminQuestionThemes = this.expectLastResponseJson<AdminQuestionThemeDto[]>(z.array(ADMIN_QUESTION_THEME_DTO));
  const localizedLabelsRows = validateDataTableAndGetRows(localizedLabelsDataTable, QUESTION_THEME_LOCALIZED_LABEL_DATATABLE_ROW_SCHEMA);
  const adminQuestionTheme = findQuestionThemeBySlugOrThrow(adminQuestionThemes, slug);

  for (const { locale: expectedLocale, label } of localizedLabelsRows) {
    const expectedLabel = label.trim() || undefined;

    expect(adminQuestionTheme.label[expectedLocale]).toBe(expectedLabel);
  }
});

Then(/^the response should contain an admin question theme among them with slug "(?<slug>[^"]+)" and the following localized aliases:$/u, function(this: GoatItWorld, slug: string, localizedAliasesDataTable: DataTable): void {
  const adminQuestionThemes = this.expectLastResponseJson<AdminQuestionThemeDto[]>(z.array(ADMIN_QUESTION_THEME_DTO));
  const localizedAliasesRows = validateDataTableAndGetRows(localizedAliasesDataTable, QUESTION_THEME_LOCALIZED_ALIASES_DATATABLE_ROW_SCHEMA);
  const adminQuestionTheme = findQuestionThemeBySlugOrThrow(adminQuestionThemes, slug);

  for (const { locale: expectedLocale, aliases: expectedAliasesAsString } of localizedAliasesRows) {
    const expectedAliases = expectedAliasesAsString.trim() ? expectedAliasesAsString.split(",").map(alias => alias.trim()) : undefined;

    expect(adminQuestionTheme.aliases[expectedLocale]).toStrictEqual(expectedAliases);
  }
});

Then(/^the response should contain an admin question theme among them with slug "(?<slug>[^"]+)" and the following localized descriptions:$/u, function(this: GoatItWorld, slug: string, localizedDescriptionsDataTable: DataTable): void {
  const adminQuestionThemes = this.expectLastResponseJson<AdminQuestionThemeDto[]>(z.array(ADMIN_QUESTION_THEME_DTO));
  const localizedDescriptionsRows = validateDataTableAndGetRows(localizedDescriptionsDataTable, QUESTION_THEME_LOCALIZED_DESCRIPTION_DATATABLE_ROW_SCHEMA);
  const adminQuestionTheme = findQuestionThemeBySlugOrThrow(adminQuestionThemes, slug);

  for (const { locale: expectedLocale, description } of localizedDescriptionsRows) {
    const expectedDescription = description.trim() || undefined;

    expect(adminQuestionTheme.description[expectedLocale]).toBe(expectedDescription);
  }
});

Then(/^the response should contain the following question theme:$/u, function(this: GoatItWorld, questionThemeDataTable: DataTable): void {
  const questionTheme = this.expectLastResponseJson<QuestionThemeDto>(QUESTION_THEME_DTO);
  const expectedQuestionTheme = validateDataTableAndGetFirstRow(questionThemeDataTable, QUESTION_THEME_DATATABLE_ROW_SCHEMA);

  expectQuestionThemeDtoToMatch(questionTheme, expectedQuestionTheme);
});