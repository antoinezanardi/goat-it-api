import { dash } from "radashi";

function getDerivedErrorCodeFromClassName(errorClassName: string): string {
  const withoutErrorSuffix = errorClassName.replace(/Error$/u, "");

  return dash(withoutErrorSuffix);
}

export {
  getDerivedErrorCodeFromClassName,
};