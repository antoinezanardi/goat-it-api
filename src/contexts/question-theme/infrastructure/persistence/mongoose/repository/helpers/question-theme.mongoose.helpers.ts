import { QuestionThemeSlugAlreadyExistsError } from "@question-theme/domain/errors/question-theme-slug-already-exists/question-theme-slug-already-exists.error";

import { MONGO_DUPLICATE_KEY_ERROR_CODE } from "@shared/infrastructure/persistence/mongoose/constants/mongoose.constants";

import type { MongoDuplicateKeyError } from "@question-theme/infrastructure/persistence/mongoose/repository/helpers/question-theme.mongoose.helpers.types";

/**
 * Narrows an unknown error to a Mongo duplicate-key error by checking its numeric code, so non-error values are rejected.
 */
function isMongoDuplicateKeyError(error: unknown): error is MongoDuplicateKeyError {
  if (!(error instanceof Object) || !("code" in error) || !Error.isError(error)) {
    return false;
  }
  return error.code === MONGO_DUPLICATE_KEY_ERROR_CODE;
}

/**
 * Translates a duplicate-key rejection on the unique slug index into the domain error and rethrows every other error unchanged.
 *
 * @throws `QuestionThemeSlugAlreadyExistsError` when `slug` is provided and Mongo reports a duplicate key.
 */
function throwIfDuplicateKeyError(error: unknown, slug?: string): never {
  if (slug !== undefined && isMongoDuplicateKeyError(error)) {
    throw new QuestionThemeSlugAlreadyExistsError(slug);
  }
  throw error;
}

export {
  isMongoDuplicateKeyError,
  throwIfDuplicateKeyError,
};