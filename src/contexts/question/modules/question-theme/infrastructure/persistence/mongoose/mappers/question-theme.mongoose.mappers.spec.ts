import { createQuestionThemeFromDocument } from "@question/modules/question-theme/infrastructure/persistence/mongoose/mappers/question-theme.mongoose.mappers";

import { createFakeQuestionTheme, createFakeQuestionThemeDocument } from "@factories/contexts/question/question-theme/question-theme.factory";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

describe("Question Theme Mongoose Mappers", () => {
  describe(createQuestionThemeFromDocument, () => {
    it("should map mongoose document to domain entity when called.", () => {
      const questionThemeDocument = createFakeQuestionThemeDocument();
      const expectedQuestionTheme = createFakeQuestionTheme({
        id: questionThemeDocument._id.toString(),
        label: questionThemeDocument.label,
        parentId: questionThemeDocument.parentId?.toString(),
        description: questionThemeDocument.description,
        aliases: questionThemeDocument.aliases,
        status: questionThemeDocument.status,
        createdAt: questionThemeDocument.createdAt,
        updatedAt: questionThemeDocument.updatedAt,
      });
      const result = createQuestionThemeFromDocument(questionThemeDocument);

      expect(result).toStrictEqual<QuestionTheme>(expectedQuestionTheme);
    });
  });
});