import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";
import type { QuestionThemeMongooseDocument, QuestionThemeMongooseSchemaShape } from "@question/modules/question-theme/infrastructure/persistence/mongoose/types/question-theme.mongoose.types";

function createQuestionThemeFromDocument(questionThemeDocument: QuestionThemeMongooseDocument | QuestionThemeMongooseSchemaShape): QuestionTheme {
  return {
    id: questionThemeDocument._id.toString(),
    slug: questionThemeDocument.slug,
    label: questionThemeDocument.label,
    aliases: questionThemeDocument.aliases,
    description: questionThemeDocument.description,
    status: questionThemeDocument.status,
    createdAt: questionThemeDocument.createdAt,
    updatedAt: questionThemeDocument.updatedAt,
  };
}

export {
  createQuestionThemeFromDocument,
};