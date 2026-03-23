import { createQuestionThemeFromDocument } from "@question/modules/question-theme/infrastructure/persistence/mongoose/mappers/question-theme.mongoose.mappers";

import { createFakeQuestionThemeDocument } from "@faketories/contexts/question/question-theme/mongoose/mongoose-document/question-theme.mongoose-document.faketory";
import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";
import type { QuestionThemeMongooseDocument } from "@question/modules/question-theme/infrastructure/persistence/mongoose/types/question-theme.mongoose.types";

describe("Question Theme Mongoose Mappers", () => {
  describe(createQuestionThemeFromDocument, () => {
    it("should map mongoose document to domain entity when called.", () => {
      const questionThemeDocument = createFakeQuestionThemeDocument();
      const expectedQuestionTheme = createFakeQuestionTheme({
        id: questionThemeDocument._id.toString(),
        slug: questionThemeDocument.slug,
        label: questionThemeDocument.label,
        description: questionThemeDocument.description,
        aliases: questionThemeDocument.aliases,
        color: questionThemeDocument.color,
        status: questionThemeDocument.status,
        createdAt: questionThemeDocument.createdAt,
        updatedAt: questionThemeDocument.updatedAt,
      });
      const result = createQuestionThemeFromDocument(questionThemeDocument as unknown as QuestionThemeMongooseDocument);

      expect(result).toStrictEqual<QuestionTheme>(expectedQuestionTheme);
    });

    it("should map document.color to entity.color when present.", () => {
      const questionThemeDocument = createFakeQuestionThemeDocument({ color: "#FF5733" });
      const result = createQuestionThemeFromDocument(questionThemeDocument as unknown as QuestionThemeMongooseDocument);

      expect(result.color).toBe("#FF5733");
    });

    it("should correctly map the document when color is absent.", () => {
      const questionThemeDocument = createFakeQuestionThemeDocument({ color: undefined });
      const result = createQuestionThemeFromDocument(questionThemeDocument as unknown as QuestionThemeMongooseDocument);

      expect(result.color).toBeUndefined();
    });
  });
});