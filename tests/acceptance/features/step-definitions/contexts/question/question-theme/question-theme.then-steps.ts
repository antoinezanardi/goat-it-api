import { Then } from "@cucumber/cucumber";
import { expect } from "expect";
import { z } from "zod";

import type { AdminQuestionThemeDto } from "@question/modules/question-theme/application/dto/admin-question-theme/admin-question-theme.dto";
import { ADMIN_QUESTION_THEME_DTO } from "@question/modules/question-theme/application/dto/admin-question-theme/admin-question-theme.dto";
import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme/question-theme.dto";
import { QUESTION_THEME_DTO } from "@question/modules/question-theme/application/dto/question-theme/question-theme.dto";

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

Then(/^the response should contain an admin question theme from others with slug "(?<slug>[^"]+)" and the following localized labels:$/u, function(this: GoatItWorld, slug: string, localizedLabelsDataTable: DataTable): void {
  const adminQuestionThemes = this.expectLastResponseJson<AdminQuestionThemeDto[]>(z.array(ADMIN_QUESTION_THEME_DTO));
  const localizedLabelsRows = localizedLabelsDataTable.hashes() as Record<"locale" | "label", string>[];
  const adminQuestionTheme = adminQuestionThemes.find(theme => theme.slug === slug);

  expect(adminQuestionTheme).toBeDefined();
  if (!adminQuestionTheme) {
    return;
  }

  for (const [_, expectedLocalizedLabel] of localizedLabelsRows.entries()) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const expectedLocale = expectedLocalizedLabel.locale as Locale;

    expect(adminQuestionTheme.label[expectedLocale]).toBe(expectedLocalizedLabel.label);
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