import { QUESTION_MONGOOSE_SCHEMA, QuestionMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema";

describe(QuestionMongooseSchema, () => {
  it("should declare the compound theme usage index when the schema is built.", () => {
    const indexFields = QUESTION_MONGOOSE_SCHEMA.indexes().map(([fields]) => fields);

    expect(indexFields).toContainEqual({ "themes.themeId": 1, "status": 1 });
  });

  it("should not declare a standalone theme id index when the schema is built.", () => {
    const indexFields = QUESTION_MONGOOSE_SCHEMA.indexes().map(([fields]) => fields);

    expect(indexFields).not.toContainEqual({ "themes.themeId": 1 });
  });

  it("should enable the startup index build through the default schema options when the schema is built.", () => {
    expect(QUESTION_MONGOOSE_SCHEMA.options.autoIndex).toBe(true);
  });
});