import { buildQuestionThemeFilterQuery } from "@question-theme/infrastructure/persistence/mongoose/repository/helpers/question-theme-filter.mongoose.helpers";

describe("Build Question Theme Filter Query", () => {
  describe("when filters is undefined", () => {
    it("should return an empty object when called without arguments.", () => {
      const result = buildQuestionThemeFilterQuery();

      expect(result).toStrictEqual({});
    });
  });

  describe("when filters is an empty object", () => {
    it("should return an empty object when no filter fields are defined.", () => {
      const result = buildQuestionThemeFilterQuery({});

      expect(result).toStrictEqual({});
    });
  });

  describe("when filters has status defined", () => {
    it.each([
      { status: "active" as const },
      { status: "archived" as const },
    ])("should return a query with status set to $status when status is $status.", ({ status }) => {
      const result = buildQuestionThemeFilterQuery({ status });

      expect(result).toStrictEqual({ status });
    });
  });
});