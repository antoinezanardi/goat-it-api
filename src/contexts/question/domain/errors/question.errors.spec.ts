import { QUESTION_STATUS_ARCHIVED } from "@question/domain/value-objects/question-status/question-status.constants";
import { QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS } from "@question/domain/value-objects/question-theme-assignment/question-theme-assignment.constants";

import {
  QuestionNotFoundError,
  QuestionCreationError,
  QuestionAlreadyArchivedError,
  QuestionMinimumThemesError,
} from "./question.errors";

describe("Question Domain Errors", () => {
  describe(QuestionNotFoundError, () => {
    it("should set message when constructed.", () => {
      const id = "abc123";
      const error = new QuestionNotFoundError(id);

      expect(error.message).toBe(`Question with id ${id} not found`);
    });

    it("should have correct name when constructed.", () => {
      const error = new QuestionNotFoundError("x");

      expect(error.name).toBe("QuestionNotFoundError");
    });
  });

  describe(QuestionCreationError, () => {
    it("should set message when constructed.", () => {
      const error = new QuestionCreationError();

      expect(error.message).toBe("Failed to create question");
    });

    it("should have correct name when constructed.", () => {
      const error = new QuestionCreationError();

      expect(error.name).toBe("QuestionCreationError");
    });
  });

  describe(QuestionAlreadyArchivedError, () => {
    it("should set message including status when constructed.", () => {
      const id = "zzz";
      const error = new QuestionAlreadyArchivedError(id);

      expect(error.message).toBe(`Question with id ${id} already has status '${QUESTION_STATUS_ARCHIVED}'`);
    });

    it("should have correct name when constructed.", () => {
      const error = new QuestionAlreadyArchivedError("id");

      expect(error.name).toBe("QuestionAlreadyArchivedError");
    });
  });

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
});