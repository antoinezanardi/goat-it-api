import type { QuestionTheme } from "@question/domain/entities/question-theme/question-theme.types";
import type { QuestionThemeMongooseDocument } from "@question/infrastructure/persistence/mongoose/question-theme/types/question-theme.mongoose.types";

function createQuestionThemeFromDocument(questionThemeDocument: QuestionThemeMongooseDocument): QuestionTheme {
  return {
    id: questionThemeDocument._id.toString(),
    label: questionThemeDocument.label,
    aliases: questionThemeDocument.aliases,
    description: questionThemeDocument.description,
    parentId: questionThemeDocument.parentId?.toString(),
    status: questionThemeDocument.status,
    createdAt: questionThemeDocument.createdAt,
    updatedAt: questionThemeDocument.updatedAt,
  };
}

export {
  createQuestionThemeFromDocument,
};