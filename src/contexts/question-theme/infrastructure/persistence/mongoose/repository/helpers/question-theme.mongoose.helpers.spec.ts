import { QuestionThemeSlugAlreadyExistsError } from "@question-theme/domain/errors/question-theme-slug-already-exists/question-theme-slug-already-exists.error";
import { isMongoDuplicateKeyError, throwIfDuplicateKeyError } from "@question-theme/infrastructure/persistence/mongoose/repository/helpers/question-theme.mongoose.helpers";

import { MONGO_DUPLICATE_KEY_ERROR_CODE } from "@shared/infrastructure/persistence/mongoose/constants/mongoose.constants";

function createDuplicateKeyError(): Error & { code: number } {
  return Object.assign(new Error("duplicate key"), { code: MONGO_DUPLICATE_KEY_ERROR_CODE });
}

describe(isMongoDuplicateKeyError, () => {
  it.each<{ test: string; error: unknown }>([
    { test: "should return false when error is not an object.", error: "duplicate key" },
    { test: "should return false when error has no code property.", error: new Error("duplicate key") },
    { test: "should return false when error is an object but not an Error instance.", error: { code: MONGO_DUPLICATE_KEY_ERROR_CODE } },
    { test: "should return false when error code is not the duplicate key code.", error: Object.assign(new Error("duplicate key"), { code: 12_345 }) },
  ])("$test", ({ error }) => {
    expect(isMongoDuplicateKeyError(error)).toBe(false);
  });

  it("should return true when error is an Error with the duplicate key code.", () => {
    expect(isMongoDuplicateKeyError(createDuplicateKeyError())).toBe(true);
  });
});

describe(throwIfDuplicateKeyError, () => {
  it("should throw QuestionThemeSlugAlreadyExistsError when error is a duplicate key error and a slug is provided.", () => {
    expect(() => throwIfDuplicateKeyError(createDuplicateKeyError(), "duplicate-slug")).toThrow(new QuestionThemeSlugAlreadyExistsError("duplicate-slug"));
  });

  it("should rethrow the original error when error is a duplicate key error and no slug is provided.", () => {
    const error = createDuplicateKeyError();

    expect(() => throwIfDuplicateKeyError(error)).toThrow(error);
  });

  it("should rethrow the original error when error is not a duplicate key error and a slug is provided.", () => {
    const error = new Error("other error");

    expect(() => throwIfDuplicateKeyError(error, "duplicate-slug")).toThrow(error);
  });

  it("should rethrow the original error when error is not a duplicate key error and no slug is provided.", () => {
    const error = new Error("other error");

    expect(() => throwIfDuplicateKeyError(error)).toThrow(error);
  });
});