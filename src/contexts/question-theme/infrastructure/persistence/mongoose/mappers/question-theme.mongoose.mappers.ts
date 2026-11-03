import { createQuestionThemeFromPersistenceShape } from "@question-theme/contracts/persistence/question-theme.persistence.mappers";

import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

import type { QuestionThemeMongooseDocument, QuestionThemeMongooseSchemaShape } from "@question-theme/infrastructure/persistence/mongoose/types/question-theme.mongoose.types";

function createQuestionThemeFromDocument(questionThemeDocument: QuestionThemeMongooseDocument | QuestionThemeMongooseSchemaShape): QuestionTheme {
  return createQuestionThemeFromPersistenceShape(questionThemeDocument);
}

export {
  createQuestionThemeFromDocument,
};