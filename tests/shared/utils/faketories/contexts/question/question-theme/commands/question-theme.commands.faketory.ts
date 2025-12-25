import { faker } from "@faker-js/faker";

import type { QuestionThemeCreationCommand, QuestionThemeModificationCommand } from "@question/modules/question-theme/domain/commands/question-theme.commands";

import { createFakeQuestionThemeCreationContract, createFakeQuestionThemeModificationContract } from "@faketories/contexts/question/question-theme/contracts/question-theme.contracts.faketory";

function createFakeQuestionThemeCreationCommand(questionThemeCreationCommand: Partial<QuestionThemeCreationCommand> = {}): QuestionThemeCreationCommand {
  return {
    payload: createFakeQuestionThemeCreationContract(),
    ...questionThemeCreationCommand,
  };
}

function createFakeQuestionThemeModificationCommand(questionThemeModificationCommand: Partial<QuestionThemeModificationCommand> = {}): QuestionThemeModificationCommand {
  return {
    questionThemeId: faker.database.mongodbObjectId(),
    payload: createFakeQuestionThemeModificationContract(),
    ...questionThemeModificationCommand,
  };
}

export {
  createFakeQuestionThemeCreationCommand,
  createFakeQuestionThemeModificationCommand,
};