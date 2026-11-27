import { createQuestionThemeFromPersistenceShape } from "@question-theme/contracts/persistence/question-theme.persistence.mappers";

import { createFakeQuestionThemeDocument } from "@faketories/contexts/question-theme/mongoose/mongoose-document/question-theme.mongoose-document.faketory";

describe(createQuestionThemeFromPersistenceShape, () => {
  it("should map the persistence shape to a question theme when called.", () => {
    const questionThemeDocument = createFakeQuestionThemeDocument();

    const questionTheme = createQuestionThemeFromPersistenceShape(questionThemeDocument);

    expect(questionTheme).toStrictEqual({
      id: questionThemeDocument._id.toString(),
      slug: questionThemeDocument.slug,
      label: questionThemeDocument.label,
      aliases: questionThemeDocument.aliases,
      description: questionThemeDocument.description,
      color: questionThemeDocument.color,
      status: questionThemeDocument.status,
      createdAt: questionThemeDocument.createdAt,
      updatedAt: questionThemeDocument.updatedAt,
    });
  });
});