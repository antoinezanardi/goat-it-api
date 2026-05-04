import { faker } from "@faker-js/faker";

import type { QuestionModificationCommand } from "@question/domain/commands/question-modification.commands";

import { createFakeQuestionModificationContract } from "@faketories/contexts/question/contracts/question-modification/question-modification.contracts.faketory";

function createFakeQuestionModificationCommand(overrides: Partial<QuestionModificationCommand> = {}): QuestionModificationCommand {
  return {
    questionId: faker.database.mongodbObjectId(),
    payload: createFakeQuestionModificationContract(),
    ...overrides,
  };
}

export { createFakeQuestionModificationCommand };