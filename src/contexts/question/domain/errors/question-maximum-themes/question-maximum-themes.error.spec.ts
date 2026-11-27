import { QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS } from "@question/domain/constants/question.constants";
import { QuestionMaximumThemesError } from "@question/domain/errors/question-maximum-themes/question-maximum-themes.error";

describe(QuestionMaximumThemesError, () => {
  it("should set message including maximum when constructed.", () => {
    const id = "max1";
    const error = new QuestionMaximumThemesError(id);

    expect(error.message).toBe(`Question with id ${id} cannot have more than ${QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS} themes assigned`);
  });

  it("should have correct name when constructed.", () => {
    const error = new QuestionMaximumThemesError("id");

    expect(error.name).toBe("QuestionMaximumThemesError");
  });
});