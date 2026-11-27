import { createQuestionThemeFromPersistenceShape } from "@question-theme/contracts/persistence/question-theme.persistence.mappers";

import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";
import type { QuestionThemeMongooseDocument, QuestionThemeMongooseSchemaShape } from "@question-theme/infrastructure/persistence/mongoose/types/question-theme.mongoose.types";

/**
 * Maps a Mongoose theme document or its raw schema shape to the domain entity through the published persistence mapper.
 *
 * A hydrated document is converted with `toObject()` first, so its localized nested paths reach the domain as plain objects instead of
 * Mongoose subdocuments carrying internal keys.
 */
function createQuestionThemeFromDocument(questionThemeDocument: QuestionThemeMongooseDocument | QuestionThemeMongooseSchemaShape): QuestionTheme {
  const questionThemePersistenceShape = "toObject" in questionThemeDocument ? questionThemeDocument.toObject() : questionThemeDocument;

  return createQuestionThemeFromPersistenceShape(questionThemePersistenceShape);
}

export {
  createQuestionThemeFromDocument,
};