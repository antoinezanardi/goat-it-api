import { Then } from "@cucumber/cucumber";
import { expect } from "expect";
import { z } from "zod";

import type { QuestionDto } from "@question/application/dto/question/question.dto";
import { QUESTION_DTO } from "@question/application/dto/question/question.dto";

import { QUESTION_AUTHOR_DATATABLE_ROW_SCHEMA, QUESTION_CONTENT_DATATABLE_ROW_SCHEMA, QUESTION_CONTENT_TRIVIA_DATATABLE_ROW_SCHEMA, QUESTION_DATATABLE_ROW_SCHEMA, QUESTION_REJECTION_DATATABLE_ROW_SCHEMA, QUESTION_THEME_ASSIGNMENT_DATATABLE_ROW_SCHEMA } from "@acceptance-features/step-definitions/contexts/question/datatables/question.datatables.schemas";
import { expectQuestionDtoToMatch, findQuestionByIdOrThrow } from "@acceptance-features/step-definitions/contexts/question/helpers/question.steps.helpers";

import { validateDataTableAndGetFirstRow, validateDataTableAndGetRows } from "@acceptance-support/helpers/datatable.helpers";

import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Then(/^the response should contain (?<questionsCount>\d+) questions$/u, function(this: GoatItWorld, countAsString: string): void {
  const questions = this.expectLastResponseJson<QuestionDto[]>(z.array(QUESTION_DTO));
  const questionsCount = Number.parseInt(countAsString);

  expect(questions).toHaveLength(questionsCount);
});

Then(/^the response should contain the following questions:$/u, function(this: GoatItWorld, questionsDataTable: DataTable): void {
  const questions = this.expectLastResponseJson<QuestionDto[]>(z.array(QUESTION_DTO));
  const dataTableRows = validateDataTableAndGetRows(questionsDataTable, QUESTION_DATATABLE_ROW_SCHEMA);

  for (const [index, expectedQuestion] of dataTableRows.entries()) {
    const question = questions[index];

    expectQuestionDtoToMatch(question, expectedQuestion);
  }
});

Then(/^the response should contain a question among them with id "(?<id>[^"]+)" and the following content:$/u, function(this: GoatItWorld, id: string, questionContentDataTable: DataTable): void {
  const questions = this.expectLastResponseJson<QuestionDto[]>(z.array(QUESTION_DTO));
  const dataTableRows = validateDataTableAndGetFirstRow(questionContentDataTable, QUESTION_CONTENT_DATATABLE_ROW_SCHEMA);
  const question = findQuestionByIdOrThrow(questions, id);

  expect(question.content.statement).toBe(dataTableRows.statement);
  expect(question.content.answer).toBe(dataTableRows.answer);
  expect(question.content.context).toBe(dataTableRows.context);
});

Then(/^the response should contain a question among them with id "(?<id>[^"]+)" and the following trivia:$/u, function(this: GoatItWorld, id: string, questionTriviaDataTable: DataTable): void {
  const questions = this.expectLastResponseJson<QuestionDto[]>(z.array(QUESTION_DTO));
  const dataTableRows = validateDataTableAndGetRows(questionTriviaDataTable, QUESTION_CONTENT_TRIVIA_DATATABLE_ROW_SCHEMA);
  const expectedTrivia = dataTableRows.map(row => row.trivia);
  const question = findQuestionByIdOrThrow(questions, id);

  expect(question.content.trivia).toStrictEqual(expectedTrivia);
});

Then(/^the response should contain a question among them with id "(?<id>[^"]+)" but without trivia$/u, function(this: GoatItWorld, id: string): void {
  const questions = this.expectLastResponseJson<QuestionDto[]>(z.array(QUESTION_DTO));
  const question = findQuestionByIdOrThrow(questions, id);

  expect(question.content.trivia).toBeUndefined();
});

Then(/^the response should contain a question among them with id "(?<id>[^"]+)" and the following themes:$/u, function(this: GoatItWorld, id: string, questionThemeAssignmentsDataTable: DataTable): void {
  const questions = this.expectLastResponseJson<QuestionDto[]>(z.array(QUESTION_DTO));
  const dataTableRows = validateDataTableAndGetRows(questionThemeAssignmentsDataTable, QUESTION_THEME_ASSIGNMENT_DATATABLE_ROW_SCHEMA);
  const question = findQuestionByIdOrThrow(questions, id);

  expect(question.themes).toHaveLength(dataTableRows.length);

  for (const [index, expectedTheme] of dataTableRows.entries()) {
    const questionThemeAssignment = question.themes[index];

    expect(questionThemeAssignment.isPrimary).toBe(expectedTheme.isPrimary);
    expect(questionThemeAssignment.isHint).toBe(expectedTheme.isHint);
    expect(questionThemeAssignment.theme.slug).toBe(expectedTheme.slug);
    expect(questionThemeAssignment.theme.label).toBe(expectedTheme.label);
    expect(questionThemeAssignment.theme.description).toBe(expectedTheme.description);
  }
});

Then(/^the response should contain a question among them with id "(?<id>[^"]+)" and the following author:$/u, function(this: GoatItWorld, id: string, questionAuthorDataTable: DataTable): void {
  const questions = this.expectLastResponseJson<QuestionDto[]>(z.array(QUESTION_DTO));
  const dataTableRows = validateDataTableAndGetFirstRow(questionAuthorDataTable, QUESTION_AUTHOR_DATATABLE_ROW_SCHEMA);
  const question = findQuestionByIdOrThrow(questions, id);

  expect(question.author.role).toBe(dataTableRows.role);
  expect(question.author.name).toBe(dataTableRows.name);
  expect(question.author.gameId).toBe(dataTableRows.gameId);
});

Then(/^the response should contain a question among them with id "(?<id>[^"]+)" and the following rejection:$/u, function(this: GoatItWorld, id: string, questionRejectionDataTable: DataTable): void {
  const questions = this.expectLastResponseJson<QuestionDto[]>(z.array(QUESTION_DTO));
  const dataTableRows = validateDataTableAndGetFirstRow(questionRejectionDataTable, QUESTION_REJECTION_DATATABLE_ROW_SCHEMA);
  const question = findQuestionByIdOrThrow(questions, id);

  expect(question.rejection?.type).toBe(dataTableRows.type);
  expect(question.rejection?.comment).toBe(dataTableRows.comment);
});

Then(/^the response should contain a question among them with id "(?<id>[^"]+)" but without rejection$/u, function(this: GoatItWorld, id: string): void {
  const questions = this.expectLastResponseJson<QuestionDto[]>(z.array(QUESTION_DTO));
  const question = findQuestionByIdOrThrow(questions, id);

  expect(question.rejection).toBeUndefined();
});