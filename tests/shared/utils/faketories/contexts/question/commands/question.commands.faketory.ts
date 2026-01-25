import type { QuestionCreationCommand } from "@question/domain/commands/question.commands";

import { createFakeQuestionCreationContract } from "@faketories/contexts/question/contracts/question.contracts.faketory";

function createFakeQuestionCreationCommand(command: Partial<QuestionCreationCommand> = {}): QuestionCreationCommand {
  return {
    payload: createFakeQuestionCreationContract(),
    ...command,
  };
}

export { createFakeQuestionCreationCommand };