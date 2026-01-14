import { Then } from "@cucumber/cucumber";
import { expect } from "expect";
import { z } from "zod";

import type { QuestionDto } from "@question/application/dto/question/question.dto";
import { QUESTION_DTO } from "@question/application/dto/question/question.dto";

import { QUESTION_DATATABLE_ROW_SCHEMA } from "@acceptance-features/step-definitions/contexts/question/datatables/question.datatables.schemas";
import { expectQuestionDtoToMatch } from "@acceptance-features/step-definitions/contexts/question/helpers/question.steps.helpers";

import { validateDataTableAndGetRows } from "@acceptance-support/helpers/datatable.helpers";

import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Then(/^the response should contain (?<questionThemesCount>\d+) questions$/u, function(this: GoatItWorld, countAsString: string): void {
  const questionThemes = this.expectLastResponseJson<QuestionDto[]>(z.array(QUESTION_DTO));
  const questionThemesCount = Number.parseInt(countAsString);

  expect(questionThemes).toHaveLength(questionThemesCount);
});

Then(/^the response should contain the following questions:$/u, function(this: GoatItWorld, questionsDataTable: DataTable): void {
  const questionThemes = this.expectLastResponseJson<QuestionDto[]>(z.array(QUESTION_DTO));
  const dataTableRows = validateDataTableAndGetRows(questionsDataTable, QUESTION_DATATABLE_ROW_SCHEMA);

  for (const [index, expectedQuestion] of dataTableRows.entries()) {
    const question = questionThemes[index];

    expectQuestionDtoToMatch(question, expectedQuestion);
  }
});