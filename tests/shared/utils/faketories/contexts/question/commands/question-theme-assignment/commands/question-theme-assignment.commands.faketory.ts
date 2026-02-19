import { faker } from "@faker-js/faker";

import type { QuestionThemeAssignmentCreationCommand, QuestionThemeAssignmentRemovalCommand } from "@question/domain/commands/question-theme-assignment/question-theme-assignment.commands";

import { createFakeQuestionThemeAssignmentCreationContract } from "@faketories/contexts/question/contracts/question-theme-assignment/question-theme-assignment.contracts.faketory";

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