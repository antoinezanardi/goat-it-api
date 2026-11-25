import { createFakeQuestionCreationContract } from "@faketories/contexts/question/repository-contracts/question.repository-contracts.faketory";

import type { QuestionCreationCommand } from "@question/application/commands/question.commands";

function createFakeQuestionCreationCommand(command: Partial<QuestionCreationCommand> = {}): QuestionCreationCommand {
  return {
    payload: createFakeQuestionCreationContract(),
    ...command,
  };
}

export { createFakeQuestionCreationCommand };