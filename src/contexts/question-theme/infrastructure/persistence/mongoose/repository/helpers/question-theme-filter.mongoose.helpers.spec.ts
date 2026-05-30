import { QUESTION_THEME_STATUSES } from "@question-theme/domain/constants/question-theme.constants";
import { buildQuestionThemeFilterQuery } from "@question-theme/infrastructure/persistence/mongoose/repository/helpers/question-theme-filter.mongoose.helpers";

import type { QuestionThemeStatus } from "@question-theme/domain/types/question-theme.value-objects";

describe("Build Question Theme Filter Query", () => {
  it("should return an empty object when called without arguments.", () => {
    const result = buildQuestionThemeFilterQuery();

    expect(result).toStrictEqual({});
  });

  it("should return an empty object when no filter fields are defined.", () => {
    const result = buildQuestionThemeFilterQuery({});

    expect(result).toStrictEqual({});
  });

  it.each(QUESTION_THEME_STATUSES.map((status: QuestionThemeStatus) => ({ status })))("should return a query with status set to $status when status is $status.", ({ status }) => {
    const result = buildQuestionThemeFilterQuery({ status });

    expect(result).toStrictEqual({ status });
  });
});