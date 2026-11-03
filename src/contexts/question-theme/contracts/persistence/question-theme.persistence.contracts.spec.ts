import { QUESTION_THEME_MONGOOSE_COLLECTION_NAME } from "@question-theme/contracts/persistence/question-theme.persistence.contracts";

import type { QuestionThemePersistenceShape } from "@question-theme/contracts/persistence/question-theme.persistence.contracts";

import type { QuestionThemeMongooseSchemaShape } from "@question-theme/infrastructure/persistence/mongoose/types/question-theme.mongoose.types";

describe("Question Theme Persistence Contracts", () => {
  it("should expose the question theme collection name when read.", () => {
    expect(QUESTION_THEME_MONGOOSE_COLLECTION_NAME).toBe("question_themes");
  });

  it("should keep the published shape assignable from the question theme mongoose schema when compared.", () => {
    expectTypeOf<QuestionThemeMongooseSchemaShape>().toExtend<QuestionThemePersistenceShape>();
  });
});