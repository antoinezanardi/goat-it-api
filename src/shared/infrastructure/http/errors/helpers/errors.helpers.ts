import { dash } from "radashi";

/**
 * Derives the public API error code from an error class name: the trailing `Error` suffix is removed and the remaining words are kebab-cased.
 *
 * `QuestionNotFoundError` becomes `question-not-found`, while an `Error` occurring anywhere else in the name is kept; a class named exactly `Error` yields an empty code.
 */
function getDerivedErrorCodeFromClassName(errorClassName: string): string {
  const withoutErrorSuffix = errorClassName.replace(/Error$/u, "");

  return dash(withoutErrorSuffix);
}

export {
  getDerivedErrorCodeFromClassName,
};