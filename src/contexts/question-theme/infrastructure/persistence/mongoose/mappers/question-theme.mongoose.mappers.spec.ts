import { createQuestionThemeFromDocument } from "@question-theme/infrastructure/persistence/mongoose/mappers/question-theme.mongoose.mappers";

import { createFakeQuestionThemeDocument } from "@faketories/contexts/question-theme/mongoose/mongoose-document/question-theme.mongoose-document.faketory";
import { createFakeQuestionTheme } from "@faketories/contexts/question-theme/entity/question-theme.entity.faketory";

import type { QuestionThemeMongooseSchemaShape } from "@question-theme/infrastructure/persistence/mongoose/types/question-theme.mongoose.types";

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
    const result = createQuestionThemeFromDocument(questionThemeDocument);

    expect(result).toStrictEqual(expectedQuestionTheme);
  });

  it("should map document.color to entity.color when present.", () => {
    const questionThemeDocument = createFakeQuestionThemeDocument({ color: "#FF5733" });
    const result = createQuestionThemeFromDocument(questionThemeDocument);

    expect(result.color).toBe("#FF5733");
  });

  it("should correctly map the document when color is absent.", () => {
    const questionThemeDocument = createFakeQuestionThemeDocument({ color: undefined });
    const result = createQuestionThemeFromDocument(questionThemeDocument);

    expect(result.color).toBeUndefined();
  });

  it("should map a hydrated mongoose document through toObject when called.", () => {
    const questionThemeDocument = createFakeQuestionThemeDocument();
    const hydratedDocumentStub = {
      ...questionThemeDocument,
      slug: "unflattened-slug",
      toObject: (): QuestionThemeMongooseSchemaShape => questionThemeDocument,
    };
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
    const result = createQuestionThemeFromDocument(hydratedDocumentStub);

    expect(result).toStrictEqual(expectedQuestionTheme);
  });

  it("should use the plain localized maps returned by toObject when called.", () => {
    const questionThemeDocument = createFakeQuestionThemeDocument();
    const flattenedDocument = {
      ...questionThemeDocument,
      label: { en: "Flattened label" },
      aliases: { en: ["Flattened alias"] },
      description: { en: "Flattened description" },
    };
    const hydratedDocumentStub = {
      ...questionThemeDocument,
      toObject: (): QuestionThemeMongooseSchemaShape => flattenedDocument,
    };
    const result = createQuestionThemeFromDocument(hydratedDocumentStub);

    expect(result).toStrictEqual(createFakeQuestionTheme({
      id: flattenedDocument._id.toString(),
      slug: flattenedDocument.slug,
      label: flattenedDocument.label,
      aliases: flattenedDocument.aliases,
      description: flattenedDocument.description,
      color: flattenedDocument.color,
      status: flattenedDocument.status,
      createdAt: flattenedDocument.createdAt,
      updatedAt: flattenedDocument.updatedAt,
    }));
  });
});