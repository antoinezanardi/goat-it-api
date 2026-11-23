import { QUESTION_THEME_MONGOOSE_SCHEMA, QuestionThemeMongooseSchema } from "@question-theme/infrastructure/persistence/mongoose/schemas/question-theme.mongoose.schema";

describe(QuestionThemeMongooseSchema, () => {
  it("should declare the unique slug index when the schema is built.", () => {
    const slugIndex = QUESTION_THEME_MONGOOSE_SCHEMA.indexes().find(([fields]) => fields.slug === 1);

    expect(slugIndex?.[1].unique).toBe(true);
  });

  it("should declare the status index when the schema is built.", () => {
    const indexFields = QUESTION_THEME_MONGOOSE_SCHEMA.indexes().map(([fields]) => fields);

    expect(indexFields).toContainEqual({ status: 1 });
  });

  it("should enable the startup index build through the default schema options when the schema is built.", () => {
    expect(QUESTION_THEME_MONGOOSE_SCHEMA.options.autoIndex).toBe(true);
  });
});