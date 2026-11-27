import { faker } from "@faker-js/faker";

import { createFakeQuestionModificationContract } from "@faketories/contexts/question/repository-contracts/question-modification/question-modification.repository-contracts.faketory";

import type { QuestionModificationCommand } from "@question/application/commands/question.commands";

function createFakeQuestionModificationCommand(overrides: Partial<QuestionModificationCommand> = {}): QuestionModificationCommand {
  return {
    questionId: faker.database.mongodbObjectId(),
    payload: createFakeQuestionModificationContract(),
    ...overrides,
  };
}

export { createFakeQuestionModificationCommand };