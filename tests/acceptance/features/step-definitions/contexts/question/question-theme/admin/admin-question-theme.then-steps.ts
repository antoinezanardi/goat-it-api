import { Then } from "@cucumber/cucumber";
import { expect } from "expect";
import { z } from "zod";

import type { AdminQuestionThemeDto } from "@question/modules/question-theme/application/dto/admin-question-theme/admin-question-theme.dto";
import { ADMIN_QUESTION_THEME_DTO } from "@question/modules/question-theme/application/dto/admin-question-theme/admin-question-theme.schema";

import { findQuestionThemeBySlugOrThrow } from "@acceptance-features/step-definitions/contexts/question/question-theme/public/helpers/question-theme.steps.helpers";
import { expectAdminQuestionThemeDtoToMatch } from "@acceptance-features/step-definitions/contexts/question/question-theme/admin/helpers/admin-question-theme.steps.helpers";
import { ADMIN_QUESTION_THEME_DATATABLE_ROW_SCHEMA, ADMIN_QUESTION_THEME_LOCALIZED_ALIASES_DATATABLE_ROW_SCHEMA, ADMIN_QUESTION_THEME_LOCALIZED_DESCRIPTION_DATATABLE_ROW_SCHEMA, ADMIN_QUESTION_THEME_LOCALIZED_LABEL_DATATABLE_ROW_SCHEMA } from "@acceptance-features/step-definitions/contexts/question/question-theme/admin/datatables/admin-question-theme.datatables.schemas";
import { expectLocalizedTextFieldToBe, expectLocalizedTextsFieldToBe } from "@acceptance-features/step-definitions/shared/locale/helpers/locale.steps.helpers";

import { validateDataTableAndGetFirstRow, validateDataTableAndGetRows } from "@acceptance-support/helpers/datatable.helpers";

import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Then(/^the response should contain (?<questionThemesCount>\d+) admin question themes$/u, function(this: GoatItWorld, countAsString: string): void {
  const questionThemes = this.expectLastResponseJson<AdminQuestionThemeDto[]>(z.array(ADMIN_QUESTION_THEME_DTO));
  const questionThemesCount = Number.parseInt(countAsString);

  expect(questionThemes).toHaveLength(questionThemesCount);
});

Then(/^the response should contain the following admin question themes:$/u, function(this: GoatItWorld, questionThemesDataTable: DataTable): void {
  const questionThemes = this.expectLastResponseJson<AdminQuestionThemeDto[]>(z.array(ADMIN_QUESTION_THEME_DTO));
  const dataTableRows = validateDataTableAndGetRows(questionThemesDataTable, ADMIN_QUESTION_THEME_DATATABLE_ROW_SCHEMA);

  for (const [index, expectedAdminQuestionTheme] of dataTableRows.entries()) {
    const adminQuestionTheme = questionThemes[index];

    expectAdminQuestionThemeDtoToMatch(adminQuestionTheme, expectedAdminQuestionTheme);
  }
});

Then(/^the response should contain an admin question theme among them with slug "(?<slug>[^"]+)" and the following localized labels:$/u, function(this: GoatItWorld, slug: string, localizedLabelsDataTable: DataTable): void {
  const adminQuestionThemes = this.expectLastResponseJson<AdminQuestionThemeDto[]>(z.array(ADMIN_QUESTION_THEME_DTO));
  const localizedLabelsRows = validateDataTableAndGetRows(localizedLabelsDataTable, ADMIN_QUESTION_THEME_LOCALIZED_LABEL_DATATABLE_ROW_SCHEMA);
  const adminQuestionTheme = findQuestionThemeBySlugOrThrow(adminQuestionThemes, slug);

  expectLocalizedTextFieldToBe(adminQuestionTheme.label, localizedLabelsRows, "label");
});

Then(/^the response should contain an admin question theme among them with slug "(?<slug>[^"]+)" and the following localized aliases:$/u, function(this: GoatItWorld, slug: string, localizedAliasesDataTable: DataTable): void {
  const adminQuestionThemes = this.expectLastResponseJson<AdminQuestionThemeDto[]>(z.array(ADMIN_QUESTION_THEME_DTO));
  const localizedAliasesRows = validateDataTableAndGetRows(localizedAliasesDataTable, ADMIN_QUESTION_THEME_LOCALIZED_ALIASES_DATATABLE_ROW_SCHEMA);
  const adminQuestionTheme = findQuestionThemeBySlugOrThrow(adminQuestionThemes, slug);

  expectLocalizedTextsFieldToBe(adminQuestionTheme.aliases, localizedAliasesRows, "aliases");
});

Then(/^the response should contain an admin question theme among them with slug "(?<slug>[^"]+)" and the following localized descriptions:$/u, function(this: GoatItWorld, slug: string, localizedDescriptionsDataTable: DataTable): void {
  const adminQuestionThemes = this.expectLastResponseJson<AdminQuestionThemeDto[]>(z.array(ADMIN_QUESTION_THEME_DTO));
  const localizedDescriptionsRows = validateDataTableAndGetRows(localizedDescriptionsDataTable, ADMIN_QUESTION_THEME_LOCALIZED_DESCRIPTION_DATATABLE_ROW_SCHEMA);
  const adminQuestionTheme = findQuestionThemeBySlugOrThrow(adminQuestionThemes, slug);

  expectLocalizedTextFieldToBe(adminQuestionTheme.description, localizedDescriptionsRows, "description");
});

Then(/^the response should contain the following admin question theme:$/u, function(this: GoatItWorld, questionThemeDataTable: DataTable): void {
  const adminQuestionTheme = this.expectLastResponseJson<AdminQuestionThemeDto>(ADMIN_QUESTION_THEME_DTO);
  const expectedAdminQuestionTheme = validateDataTableAndGetFirstRow(questionThemeDataTable, ADMIN_QUESTION_THEME_DATATABLE_ROW_SCHEMA);

  expectAdminQuestionThemeDtoToMatch(adminQuestionTheme, expectedAdminQuestionTheme);
});

Then(/^the response should contain the following localized labels for the admin question theme:$/u, function(this: GoatItWorld, localizedLabelsDataTable: DataTable): void {
  const adminQuestionTheme = this.expectLastResponseJson<AdminQuestionThemeDto>(ADMIN_QUESTION_THEME_DTO);
  const localizedLabelsRows = validateDataTableAndGetRows(localizedLabelsDataTable, ADMIN_QUESTION_THEME_LOCALIZED_LABEL_DATATABLE_ROW_SCHEMA);

  expectLocalizedTextFieldToBe(adminQuestionTheme.label, localizedLabelsRows, "label");
});

Then(/^the response should contain the following localized aliases for the admin question theme:$/u, function(this: GoatItWorld, localizedAliasesDataTable: DataTable): void {
  const adminQuestionTheme = this.expectLastResponseJson<AdminQuestionThemeDto>(ADMIN_QUESTION_THEME_DTO);
  const localizedAliasesRows = validateDataTableAndGetRows(localizedAliasesDataTable, ADMIN_QUESTION_THEME_LOCALIZED_ALIASES_DATATABLE_ROW_SCHEMA);

  expectLocalizedTextsFieldToBe(adminQuestionTheme.aliases, localizedAliasesRows, "aliases");
});

Then(/^the response should contain the following localized descriptions for the admin question theme:$/u, function(this: GoatItWorld, localizedDescriptionsDataTable: DataTable): void {
  const adminQuestionTheme = this.expectLastResponseJson<AdminQuestionThemeDto>(ADMIN_QUESTION_THEME_DTO);
  const localizedDescriptionsRows = validateDataTableAndGetRows(localizedDescriptionsDataTable, ADMIN_QUESTION_THEME_LOCALIZED_DESCRIPTION_DATATABLE_ROW_SCHEMA);

  expectLocalizedTextFieldToBe(adminQuestionTheme.description, localizedDescriptionsRows, "description");
});