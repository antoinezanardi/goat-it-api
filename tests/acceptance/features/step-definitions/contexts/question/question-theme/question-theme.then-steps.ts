import { Then } from "@cucumber/cucumber";
import { expect } from "expect";
import { z } from "zod";

import type { AdminQuestionThemeDto } from "@question/modules/question-theme/application/dto/admin-question-theme/admin-question-theme.dto";
import { ADMIN_QUESTION_THEME_DTO } from "@question/modules/question-theme/application/dto/admin-question-theme/admin-question-theme.dto";
import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme/question-theme.dto";
import { QUESTION_THEME_DTO } from "@question/modules/question-theme/application/dto/question-theme/question-theme.dto";

import { findQuestionThemeBySlugOrThrow } from "@acceptance-features/step-definitions/contexts/question/question-theme/question-theme.steps.helpers";

import type { DataTable } from "@cucumber/cucumber";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";
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
  const dataTableRows = questionThemesDataTable.hashes() as Record<keyof QuestionThemeDto, string>[];

  for (const [index, expectedQuestionTheme] of dataTableRows.entries()) {
    const questionTheme = questionThemes[index];
    const expectedQuestionThemeAliases = expectedQuestionTheme.aliases.split(",").map(alias => alias.trim());

    expect(questionTheme.slug).toBe(expectedQuestionTheme.slug);
    expect(questionTheme.label).toBe(expectedQuestionTheme.label);
    expect(questionTheme.aliases).toStrictEqual(expectedQuestionThemeAliases);
    expect(questionTheme.description).toBe(expectedQuestionTheme.description);
    expect(questionTheme.status).toBe(expectedQuestionTheme.status);
  }
});

Then(/^the response should contain the following admin question themes:$/u, function(this: GoatItWorld, questionThemesDataTable: DataTable): void {
  const questionThemes = this.expectLastResponseJson<AdminQuestionThemeDto[]>(z.array(ADMIN_QUESTION_THEME_DTO));
  const dataTableRows = questionThemesDataTable.hashes() as Record<"slug" | "status", string>[];

  for (const [index, expectedAdminQuestionTheme] of dataTableRows.entries()) {
    const adminQuestionTheme = questionThemes[index];

    expect(adminQuestionTheme.slug).toBe(expectedAdminQuestionTheme.slug);
    expect(adminQuestionTheme.status).toBe(expectedAdminQuestionTheme.status);
  }
});

Then(/^the response should contain an admin question theme among them with slug "(?<slug>[^"]+)" and the following localized labels:$/u, function(this: GoatItWorld, slug: string, localizedLabelsDataTable: DataTable): void {
  const adminQuestionThemes = this.expectLastResponseJson<AdminQuestionThemeDto[]>(z.array(ADMIN_QUESTION_THEME_DTO));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const localizedLabelsRows = localizedLabelsDataTable.hashes() as { locale: Locale; label: string }[];
  const adminQuestionTheme = findQuestionThemeBySlugOrThrow(adminQuestionThemes, slug);

  for (const { locale: expectedLocale, label } of localizedLabelsRows) {
    const expectedLabel = label.trim() || undefined;

    expect(adminQuestionTheme.label[expectedLocale]).toBe(expectedLabel);
  }
});

Then(/^the response should contain an admin question theme among them with slug "(?<slug>[^"]+)" and the following localized aliases:$/u, function(this: GoatItWorld, slug: string, localizedAliasesDataTable: DataTable): void {
  const adminQuestionThemes = this.expectLastResponseJson<AdminQuestionThemeDto[]>(z.array(ADMIN_QUESTION_THEME_DTO));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const localizedAliasesRows = localizedAliasesDataTable.hashes() as { locale: Locale; aliases: string }[];
  const adminQuestionTheme = findQuestionThemeBySlugOrThrow(adminQuestionThemes, slug);

  for (const { locale: expectedLocale, aliases: expectedAliasesAsString } of localizedAliasesRows) {
    const expectedAliases = expectedAliasesAsString.trim() ? expectedAliasesAsString.split(",").map(alias => alias.trim()) : undefined;

    expect(adminQuestionTheme.aliases[expectedLocale]).toStrictEqual(expectedAliases);
  }
});

Then(/^the response should contain an admin question theme among them with slug "(?<slug>[^"]+)" and the following localized descriptions:$/u, function(this: GoatItWorld, slug: string, localizedDescriptionsDataTable: DataTable): void {
  const adminQuestionThemes = this.expectLastResponseJson<AdminQuestionThemeDto[]>(z.array(ADMIN_QUESTION_THEME_DTO));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const localizedDescriptionsRows = localizedDescriptionsDataTable.hashes() as { locale: Locale; description: string }[];
  const adminQuestionTheme = findQuestionThemeBySlugOrThrow(adminQuestionThemes, slug);

  for (const { locale: expectedLocale, description } of localizedDescriptionsRows) {
    const expectedDescription = description.trim() || undefined;

    expect(adminQuestionTheme.description[expectedLocale]).toBe(expectedDescription);
  }
});

Then(/^the response should contain the following question theme:$/u, function(this: GoatItWorld, questionThemeDataTable: DataTable): void {
  const questionTheme = this.expectLastResponseJson<QuestionThemeDto>(QUESTION_THEME_DTO);
  const dataTableRow = questionThemeDataTable.hashes()[0] as Record<keyof QuestionThemeDto, string>;
  const expectedQuestionThemeAliases = dataTableRow.aliases.split(",").map(alias => alias.trim());

  expect(questionTheme.slug).toBe(dataTableRow.slug);
  expect(questionTheme.label).toBe(dataTableRow.label);
  expect(questionTheme.aliases).toStrictEqual(expectedQuestionThemeAliases);
  expect(questionTheme.description).toBe(dataTableRow.description);
  expect(questionTheme.status).toBe(dataTableRow.status);
});