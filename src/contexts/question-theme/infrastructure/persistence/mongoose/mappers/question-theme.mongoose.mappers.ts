import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

import type { QuestionThemeMongooseDocument, QuestionThemeMongooseSchemaShape } from "@question-theme/infrastructure/persistence/mongoose/types/question-theme.mongoose.types";

function createQuestionThemeFromDocument(questionThemeDocument: QuestionThemeMongooseDocument | QuestionThemeMongooseSchemaShape): QuestionTheme {
  return {
    id: questionThemeDocument._id.toString(),
    slug: questionThemeDocument.slug,
    label: questionThemeDocument.label,
    aliases: questionThemeDocument.aliases,
    description: questionThemeDocument.description,
    color: questionThemeDocument.color,
    status: questionThemeDocument.status,
    createdAt: questionThemeDocument.createdAt,
    updatedAt: questionThemeDocument.updatedAt,
  };
}

export {
  createQuestionThemeFromDocument,
};