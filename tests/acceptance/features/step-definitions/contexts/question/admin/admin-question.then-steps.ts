import { Then } from "@cucumber/cucumber";
import { expect } from "expect";
import { z } from "zod";

import { isValidLocale } from "@shared/domain/value-objects/locale/helpers/locale.helpers";

import type { AdminQuestionDto } from "@question/application/dto/admin-question/admin-question.dto";
import { ADMIN_QUESTION_DTO } from "@question/application/dto/admin-question/admin-question.schema";

import { expectQuestionAuthorDtoToMatch, expectQuestionRejectionDtoToMatch } from "@acceptance-features/step-definitions/contexts/question/public/helpers/question.steps.helpers";
import { QUESTION_AUTHOR_DATATABLE_ROW_SCHEMA, QUESTION_CONTENT_TRIVIA_DATATABLE_ROW_SCHEMA, QUESTION_DATATABLE_ROW_SCHEMA, QUESTION_REJECTION_DATATABLE_ROW_SCHEMA } from "@acceptance-features/step-definitions/contexts/question/public/datatables/question.datatables.schemas";
import { ADMIN_QUESTION_CONTENT_ANSWER_DATATABLE_ROW_SCHEMA, ADMIN_QUESTION_CONTENT_CONTEXT_DATATABLE_ROW_SCHEMA, ADMIN_QUESTION_CONTENT_STATEMENT_DATATABLE_ROW_SCHEMA, ADMIN_QUESTION_THEME_ASSIGNMENT_DATATABLE_ROW_SCHEMA, ADMIN_QUESTION_THEME_ASSIGNMENT_LABEL_DATATABLE_ROW_SCHEMA } from "@acceptance-features/step-definitions/contexts/question/admin/datatables/admin-question.datatables.schemas";
import { expectLocalizedTextFieldToBe } from "@acceptance-features/step-definitions/shared/locale/helpers/locale.steps.helpers";
import { expectAdminQuestionDtoToHaveThemeWithLabel, expectAdminQuestionDtoToHaveTriviaForLocale, expectAdminQuestionDtoToMatch, expectAdminQuestionThemeAssignmentsDtoToMatch, findQuestionByIdOrThrow } from "@acceptance-features/step-definitions/contexts/question/admin/helpers/admin-question.steps.helpers";

import { validateDataTableAndGetFirstRow, validateDataTableAndGetRows } from "@acceptance-support/helpers/datatable.helpers";

import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Then(/^the response should contain (?<questionsCount>\d+) admin questions$/u, function(this: GoatItWorld, countAsString: string): void {
  const questions = this.expectLastResponseJson<AdminQuestionDto[]>(z.array(ADMIN_QUESTION_DTO));
  const questionsCount = Number.parseInt(countAsString);

  expect(questions).toHaveLength(questionsCount);
});

Then(/^the response should contain the following admin questions:$/u, function(this: GoatItWorld, questionsDataTable: DataTable): void {
  const questions = this.expectLastResponseJson<AdminQuestionDto[]>(z.array(ADMIN_QUESTION_DTO));
  const dataTableRows = validateDataTableAndGetRows(questionsDataTable, QUESTION_DATATABLE_ROW_SCHEMA);

  for (const [index, expectedQuestion] of dataTableRows.entries()) {
    const question = questions[index];

    expectAdminQuestionDtoToMatch(question, expectedQuestion);
  }
});

Then(/^the response should contain an admin question among them with id "(?<id>[^"]+)" and the following question statement:$/u, function(this: GoatItWorld, id: string, questionStatementDataTable: DataTable): void {
  const questions = this.expectLastResponseJson<AdminQuestionDto[]>(z.array(ADMIN_QUESTION_DTO));
  const dataTableRows = validateDataTableAndGetRows(questionStatementDataTable, ADMIN_QUESTION_CONTENT_STATEMENT_DATATABLE_ROW_SCHEMA);
  const question = findQuestionByIdOrThrow(questions, id);

  expectLocalizedTextFieldToBe(question.content.statement, dataTableRows, "statement");
});

Then(/^the response should contain an admin question among them with id "(?<id>[^"]+)" and the following question answer:$/u, function(this: GoatItWorld, id: string, questionAnswerDataTable: DataTable): void {
  const questions = this.expectLastResponseJson<AdminQuestionDto[]>(z.array(ADMIN_QUESTION_DTO));
  const dataTableRows = validateDataTableAndGetRows(questionAnswerDataTable, ADMIN_QUESTION_CONTENT_ANSWER_DATATABLE_ROW_SCHEMA);
  const question = findQuestionByIdOrThrow(questions, id);

  expectLocalizedTextFieldToBe(question.content.answer, dataTableRows, "answer");
});

Then(/^the response should contain an admin question among them with id "(?<id>[^"]+)" and the following question context:$/u, function(this: GoatItWorld, id: string, questionContextDataTable: DataTable): void {
  const questions = this.expectLastResponseJson<AdminQuestionDto[]>(z.array(ADMIN_QUESTION_DTO));
  const dataTableRows = validateDataTableAndGetRows(questionContextDataTable, ADMIN_QUESTION_CONTENT_CONTEXT_DATATABLE_ROW_SCHEMA);
  const question = findQuestionByIdOrThrow(questions, id);

  expectLocalizedTextFieldToBe(question.content.context, dataTableRows, "context");
});

Then(/^the response should contain an admin question among them with id "(?<id>[^"]+)" but without context$/u, function(this: GoatItWorld, id: string): void {
  const questions = this.expectLastResponseJson<AdminQuestionDto[]>(z.array(ADMIN_QUESTION_DTO));
  const question = findQuestionByIdOrThrow(questions, id);

  expect(question.content.context).toBeUndefined();
});

Then(/^the response should contain an admin question among them with id "(?<id>[^"]+)" and the following trivia for locale "(?<locale>[^"]+)":$/u, function(this: GoatItWorld, id: string, locale: string, questionTriviaDataTable: DataTable): void {
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale provided in step definition: "${locale}"`);
  }
  const questions = this.expectLastResponseJson<AdminQuestionDto[]>(z.array(ADMIN_QUESTION_DTO));
  const question = findQuestionByIdOrThrow(questions, id);
  const dataTableRows = validateDataTableAndGetRows(questionTriviaDataTable, QUESTION_CONTENT_TRIVIA_DATATABLE_ROW_SCHEMA);

  expectAdminQuestionDtoToHaveTriviaForLocale(question, locale, dataTableRows);
});

Then(/^the response should contain an admin question among them with id "(?<id>[^"]+)" but without trivia$/u, function(this: GoatItWorld, id: string): void {
  const questions = this.expectLastResponseJson<AdminQuestionDto[]>(z.array(ADMIN_QUESTION_DTO));
  const question = findQuestionByIdOrThrow(questions, id);

  expect(question.content.trivia).toBeUndefined();
});

Then(/^the response should contain an admin question among them with id "(?<id>[^"]+)" and the following themes:$/u, function(this: GoatItWorld, id: string, questionThemeAssignmentsDataTable: DataTable): void {
  const questions = this.expectLastResponseJson<AdminQuestionDto[]>(z.array(ADMIN_QUESTION_DTO));
  const dataTableRows = validateDataTableAndGetRows(questionThemeAssignmentsDataTable, ADMIN_QUESTION_THEME_ASSIGNMENT_DATATABLE_ROW_SCHEMA);
  const question = findQuestionByIdOrThrow(questions, id);

  expectAdminQuestionThemeAssignmentsDtoToMatch(question, dataTableRows);
});

Then(/^the response should contain an admin question among them with id "(?<id>[^"]+)" and the question theme with slug "(?<slug>[^"]+)" with the following label:$/u, function(this: GoatItWorld, id: string, slug: string, localizedLabelDataTable: DataTable): void {
  const questions = this.expectLastResponseJson<AdminQuestionDto[]>(z.array(ADMIN_QUESTION_DTO));
  const localizedLabelRows = validateDataTableAndGetRows(localizedLabelDataTable, ADMIN_QUESTION_THEME_ASSIGNMENT_LABEL_DATATABLE_ROW_SCHEMA);
  const question = findQuestionByIdOrThrow(questions, id);

  expectAdminQuestionDtoToHaveThemeWithLabel(question, slug, localizedLabelRows);
});

Then(/^the response should contain an admin question among them with id "(?<id>[^"]+)" and the following author:$/u, function(this: GoatItWorld, id: string, questionAuthorDataTable: DataTable): void {
  const questions = this.expectLastResponseJson<AdminQuestionDto[]>(z.array(ADMIN_QUESTION_DTO));
  const dataTableRows = validateDataTableAndGetFirstRow(questionAuthorDataTable, QUESTION_AUTHOR_DATATABLE_ROW_SCHEMA);
  const question = findQuestionByIdOrThrow(questions, id);

  expectQuestionAuthorDtoToMatch(question, dataTableRows);
});

Then(/^the response should contain an admin question among them with id "(?<id>[^"]+)" and the following rejection:$/u, function(this: GoatItWorld, id: string, questionRejectionDataTable: DataTable): void {
  const questions = this.expectLastResponseJson<AdminQuestionDto[]>(z.array(ADMIN_QUESTION_DTO));
  const dataTableRows = validateDataTableAndGetFirstRow(questionRejectionDataTable, QUESTION_REJECTION_DATATABLE_ROW_SCHEMA);
  const question = findQuestionByIdOrThrow(questions, id);

  expectQuestionRejectionDtoToMatch(question, dataTableRows);
});

Then(/^the response should contain an admin question among them with id "(?<id>[^"]+)" but without rejection$/u, function(this: GoatItWorld, id: string): void {
  const questions = this.expectLastResponseJson<AdminQuestionDto[]>(z.array(ADMIN_QUESTION_DTO));
  const question = findQuestionByIdOrThrow(questions, id);

  expect(question.rejection).toBeUndefined();
});

Then(/^the response should contain the following admin question:$/u, function(this: GoatItWorld, questionDataTable: DataTable): void {
  const question = this.expectLastResponseJson<AdminQuestionDto>(ADMIN_QUESTION_DTO);
  const expectedQuestion = validateDataTableAndGetFirstRow(questionDataTable, QUESTION_DATATABLE_ROW_SCHEMA);
  if (expectedQuestion.id === "<SET>") {
    expect(question.id).toBeDefined();
    expectedQuestion.id = question.id;
  }

  expectAdminQuestionDtoToMatch(question, expectedQuestion);
});

Then(/^the response should contain the following question statement for the admin question:$/u, function(this: GoatItWorld, questionContentDataTable: DataTable): void {
  const question = this.expectLastResponseJson<AdminQuestionDto>(ADMIN_QUESTION_DTO);
  const dataTableRows = validateDataTableAndGetRows(questionContentDataTable, ADMIN_QUESTION_CONTENT_STATEMENT_DATATABLE_ROW_SCHEMA);

  expectLocalizedTextFieldToBe(question.content.statement, dataTableRows, "statement");
});

Then(/^the response should contain the following question answer for the admin question:$/u, function(this: GoatItWorld, questionAnswerDataTable: DataTable): void {
  const question = this.expectLastResponseJson<AdminQuestionDto>(ADMIN_QUESTION_DTO);
  const dataTableRows = validateDataTableAndGetRows(questionAnswerDataTable, ADMIN_QUESTION_CONTENT_ANSWER_DATATABLE_ROW_SCHEMA);

  expectLocalizedTextFieldToBe(question.content.answer, dataTableRows, "answer");
});

Then(/^the response should contain the following question context for the admin question:$/u, function(this: GoatItWorld, questionContextDataTable: DataTable): void {
  const question = this.expectLastResponseJson<AdminQuestionDto>(ADMIN_QUESTION_DTO);
  const dataTableRows = validateDataTableAndGetRows(questionContextDataTable, ADMIN_QUESTION_CONTENT_CONTEXT_DATATABLE_ROW_SCHEMA);

  expectLocalizedTextFieldToBe(question.content.context, dataTableRows, "context");
});

Then(/^the response should contain no context for the admin question$/u, function(this: GoatItWorld): void {
  const question = this.expectLastResponseJson<AdminQuestionDto>(ADMIN_QUESTION_DTO);

  expect(question.content.context).toBeUndefined();
});

Then(/^the response should contain the following trivia for locale "(?<locale>[^"]+)" for the admin question:$/u, function(this: GoatItWorld, locale: string, questionTriviaDataTable: DataTable): void {
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale provided in step definition: "${locale}"`);
  }
  const question = this.expectLastResponseJson<AdminQuestionDto>(ADMIN_QUESTION_DTO);
  const dataTableRows = validateDataTableAndGetRows(questionTriviaDataTable, QUESTION_CONTENT_TRIVIA_DATATABLE_ROW_SCHEMA);

  expectAdminQuestionDtoToHaveTriviaForLocale(question, locale, dataTableRows);
});

Then(/^the response should contain no trivia for the admin question$/u, function(this: GoatItWorld): void {
  const question = this.expectLastResponseJson<AdminQuestionDto>(ADMIN_QUESTION_DTO);

  expect(question.content.trivia).toBeUndefined();
});

Then(/^the response should contain the following themes for the admin question:$/u, function(this: GoatItWorld, questionThemeAssignmentsDataTable: DataTable): void {
  const question = this.expectLastResponseJson<AdminQuestionDto>(ADMIN_QUESTION_DTO);
  const dataTableRows = validateDataTableAndGetRows(questionThemeAssignmentsDataTable, ADMIN_QUESTION_THEME_ASSIGNMENT_DATATABLE_ROW_SCHEMA);

  expectAdminQuestionThemeAssignmentsDtoToMatch(question, dataTableRows);
});

Then(/^the response should contain the question theme with slug "(?<slug>[^"]+)" for the admin question with the following label:$/u, function(this: GoatItWorld, slug: string, localizedLabelDataTable: DataTable): void {
  const question = this.expectLastResponseJson<AdminQuestionDto>(ADMIN_QUESTION_DTO);
  const localizedLabelRows = validateDataTableAndGetRows(localizedLabelDataTable, ADMIN_QUESTION_THEME_ASSIGNMENT_LABEL_DATATABLE_ROW_SCHEMA);

  expectAdminQuestionDtoToHaveThemeWithLabel(question, slug, localizedLabelRows);
});

Then(/^the response should contain the following author for the admin question:$/u, function(this: GoatItWorld, questionAuthorDataTable: DataTable): void {
  const question = this.expectLastResponseJson<AdminQuestionDto>(ADMIN_QUESTION_DTO);
  const dataTableRows = validateDataTableAndGetFirstRow(questionAuthorDataTable, QUESTION_AUTHOR_DATATABLE_ROW_SCHEMA);

  expectQuestionAuthorDtoToMatch(question, dataTableRows);
});

Then(/^the response should contain the following rejection for the admin question:$/u, function(this: GoatItWorld, questionRejectionDataTable: DataTable): void {
  const question = this.expectLastResponseJson<AdminQuestionDto>(ADMIN_QUESTION_DTO);
  const dataTableRows = validateDataTableAndGetFirstRow(questionRejectionDataTable, QUESTION_REJECTION_DATATABLE_ROW_SCHEMA);

  expectQuestionRejectionDtoToMatch(question, dataTableRows);
});

Then(/^the response should contain no rejection for the admin question$/u, function(this: GoatItWorld): void {
  const question = this.expectLastResponseJson<AdminQuestionDto>(ADMIN_QUESTION_DTO);

  expect(question.rejection).toBeUndefined();
});