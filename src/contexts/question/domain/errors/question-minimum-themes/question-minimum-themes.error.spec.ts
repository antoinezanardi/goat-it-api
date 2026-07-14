import { QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS } from "@question/domain/constants/question.constants";
import { QuestionMinimumThemesError } from "@question/domain/errors/question-minimum-themes/question-minimum-themes.error";

describe(QuestionMinimumThemesError, () => {
  it("should set message including minimum when constructed.", () => {
    const id = "min1";
    const error = new QuestionMinimumThemesError(id);

    expect(error.message).toBe(`Question with id ${id} must have at least ${QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS} theme assigned`);
  });

  it("should have correct name when constructed.", () => {
    const error = new QuestionMinimumThemesError("id");

    expect(error.name).toBe("QuestionMinimumThemesError");
  });
});