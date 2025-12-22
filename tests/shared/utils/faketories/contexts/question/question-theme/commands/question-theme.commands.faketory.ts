import { faker } from "@faker-js/faker";

import type { QuestionThemeUpdateCommand } from "@question/modules/question-theme/domain/commands/question-theme.commands";

import { createFakeQuestionThemeUpdateContract } from "@faketories/contexts/question/question-theme/contracts/question-theme.contracts.faketory";

function createFakeQuestionThemeUpdateCommand(updateCommand: Partial<QuestionThemeUpdateCommand> = {}): QuestionThemeUpdateCommand {
  return {
    questionThemeId: faker.database.mongodbObjectId(),
    payload: createFakeQuestionThemeUpdateContract(),
    ...updateCommand,
  };
}

export {
  createFakeQuestionThemeUpdateCommand,
};