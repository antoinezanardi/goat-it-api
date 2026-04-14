import { faker } from "@faker-js/faker";

import type { QuestionThemeAssignmentModificationCommand } from "@question/domain/commands/question-theme-assignment/question-theme-assignment-modification.commands";

import { createFakeQuestionThemeAssignmentModificationContract } from "@faketories/contexts/question/contracts/question-theme-assignment/question-theme-assignment-modification.contracts.faketory";

function createFakeQuestionThemeAssignmentModificationCommand(overrides: Partial<QuestionThemeAssignmentModificationCommand> = {}): QuestionThemeAssignmentModificationCommand {
  return {
    questionId: faker.database.mongodbObjectId(),
    themeId: faker.database.mongodbObjectId(),
    payload: createFakeQuestionThemeAssignmentModificationContract(),
    ...overrides,
  };
}

export { createFakeQuestionThemeAssignmentModificationCommand };