import { faker } from "@faker-js/faker";

import type { QuestionThemeModificationCommand } from "@question/modules/question-theme/domain/commands/question-theme.commands";

import { createFakeQuestionThemeModificationContract } from "@faketories/contexts/question/question-theme/contracts/question-theme.contracts.faketory";

function createFakeQuestionThemeUpdateCommand(updateCommand: Partial<QuestionThemeModificationCommand> = {}): QuestionThemeModificationCommand {
  return {
    questionThemeId: faker.database.mongodbObjectId(),
    payload: createFakeQuestionThemeModificationContract(),
    ...updateCommand,
  };
}

export {
  createFakeQuestionThemeUpdateCommand,
};