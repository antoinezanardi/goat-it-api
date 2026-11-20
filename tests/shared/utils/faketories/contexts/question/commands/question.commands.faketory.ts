import type { QuestionCreationCommand } from "@question/application/commands/question.commands";

import { createFakeQuestionCreationContract } from "@faketories/contexts/question/repository-contracts/question.repository-contracts.faketory";

function createFakeQuestionCreationCommand(command: Partial<QuestionCreationCommand> = {}): QuestionCreationCommand {
  return {
    payload: createFakeQuestionCreationContract(),
    ...command,
  };
}

export { createFakeQuestionCreationCommand };