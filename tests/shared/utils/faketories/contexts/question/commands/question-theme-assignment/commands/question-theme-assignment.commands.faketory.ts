import { faker } from "@faker-js/faker";

import { createFakeQuestionThemeAssignmentCreationContract } from "@faketories/contexts/question/repository-contracts/question-theme-assignment/question-theme-assignment.repository-contracts.faketory";

import type { QuestionThemeAssignmentCreationCommand, QuestionThemeAssignmentRemovalCommand } from "@question/application/commands/question.commands";

function createFakeQuestionThemeAssignmentCreationCommand(overrides: Partial<QuestionThemeAssignmentCreationCommand> = {}): QuestionThemeAssignmentCreationCommand {
  return {
    questionId: faker.database.mongodbObjectId(),
    payload: createFakeQuestionThemeAssignmentCreationContract(),
    ...overrides,
  };
}

function createFakeQuestionThemeAssignmentRemovalCommand(overrides: Partial<QuestionThemeAssignmentRemovalCommand> = {}): QuestionThemeAssignmentRemovalCommand {
  return {
    questionId: faker.database.mongodbObjectId(),
    themeId: faker.database.mongodbObjectId(),
    ...overrides,
  };
}

export {
  createFakeQuestionThemeAssignmentCreationCommand,
  createFakeQuestionThemeAssignmentRemovalCommand,
};