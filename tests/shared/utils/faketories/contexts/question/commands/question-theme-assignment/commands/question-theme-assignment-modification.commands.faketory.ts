import { faker } from "@faker-js/faker";

import type { QuestionThemeAssignmentModificationCommand } from "@question/application/commands/question.commands";

import { createFakeQuestionThemeAssignmentModificationContract } from "@faketories/contexts/question/repository-contracts/question-theme-assignment/question-theme-assignment-modification.repository-contracts.faketory";

function createFakeQuestionThemeAssignmentModificationCommand(overrides: Partial<QuestionThemeAssignmentModificationCommand> = {}): QuestionThemeAssignmentModificationCommand {
  return {
    questionId: faker.database.mongodbObjectId(),
    themeId: faker.database.mongodbObjectId(),
    payload: createFakeQuestionThemeAssignmentModificationContract(),
    ...overrides,
  };
}

export { createFakeQuestionThemeAssignmentModificationCommand };