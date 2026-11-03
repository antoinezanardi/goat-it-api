import { QUESTION_MONGOOSE_COLLECTION_NAME, QUESTION_STATUS_ACTIVE, QUESTION_THEME_USAGE_PERSISTENCE_FIELDS } from "@question/contracts/persistence/question.persistence.contracts";
import type { QuestionThemeUsagePersistenceShape } from "@question/contracts/persistence/question.persistence.contracts";
import type { QuestionMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema";

describe("Question Persistence Contracts", () => {
  it("should expose the question collection name when read.", () => {
    expect(QUESTION_MONGOOSE_COLLECTION_NAME).toBe("questions");
  });

  it("should expose the active question status when read.", () => {
    expect(QUESTION_STATUS_ACTIVE).toBe("active");
  });

  it("should expose the question theme usage persistence fields when read.", () => {
    expect(QUESTION_THEME_USAGE_PERSISTENCE_FIELDS).toStrictEqual({
      status: "status",
      themes: "themes",
      themeId: "themes.themeId",
    });
  });

  it("should keep the published usage shape assignable from the question mongoose schema when compared.", () => {
    expectTypeOf<QuestionMongooseSchema>().toExtend<QuestionThemeUsagePersistenceShape>();
  });
});