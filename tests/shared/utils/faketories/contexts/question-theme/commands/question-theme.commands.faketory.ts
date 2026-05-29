import { faker } from "@faker-js/faker";

import { createFakeQuestionThemeCreationContract, createFakeQuestionThemeModificationContract } from "@faketories/contexts/question-theme/contracts/question-theme.contracts.faketory";

import type { QuestionThemeCreationCommand, QuestionThemeModificationCommand } from "@question-theme/domain/types/question-theme.commands";

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