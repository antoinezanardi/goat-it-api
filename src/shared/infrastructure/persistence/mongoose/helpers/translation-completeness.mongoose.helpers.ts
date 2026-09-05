import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

import type { TranslationCompletenessFieldSpec } from "@shared/infrastructure/persistence/mongoose/types/translation-completeness.mongoose.types";

/**
 * Build a flat condition where every locale of the given localized field is non-null.
 * Used for the "this field has every locale set" check in static (no `applicableLocales`) mode.
 */
function buildLocaleNonNullConditions(path: string): Record<string, unknown> {
  return Object.fromEntries(LOCALES.map(locale => [`${path}.${locale}`, { $ne: null }]));
}

/**
 * Build an array of conditions where any one locale of the given localized field is null.
 * Used as a `$or` array for "at least one locale is missing" in static mode.
 */
function buildLocaleNullConditions(path: string): Record<string, unknown>[] {
  return LOCALES.map(locale => ({ [`${path}.${locale}`]: null }));
}

/**
 * Build a Mongo match for "this localized field is complete":
 * - Mandatory fields: every locale must be set (non-null).
 * - Optional fields: the entire field is null OR every locale is set.
 */
function buildFieldCompleteCondition(fieldSpec: TranslationCompletenessFieldSpec): Record<string, unknown> {
  const allLocalesSet = buildLocaleNonNullConditions(fieldSpec.path);

  if (fieldSpec.isMandatory) {
    return allLocalesSet;
  }
  return { $or: [{ [fieldSpec.path]: null }, allLocalesSet] };
}

/**
 * Build a Mongo match for "this localized field is incomplete":
 * - Mandatory fields: at least one locale is null.
 * - Optional fields: the field is set (non-null) AND at least one locale is null.
 */
function buildFieldIncompleteCondition(fieldSpec: TranslationCompletenessFieldSpec): Record<string, unknown> {
  const someLocaleMissing = { $or: buildLocaleNullConditions(fieldSpec.path) };

  if (fieldSpec.isMandatory) {
    return someLocaleMissing;
  }
  return { $and: [{ [fieldSpec.path]: { $ne: null } }, someLocaleMissing] };
}

/**
 * Build the `$cond` expression that resolves the locales applicable to one resource:
 * - If `applicableLocalesPath` is empty/absent, fall back to ALL supported locales.
 * - Otherwise, use the array stored at `applicableLocalesPath`.
 * Designed to feed a `$map` over the applicable locales.
 */
function buildRequiredLocalesExpression(applicableLocalesPath: string): Record<string, unknown> {
  return {
    $cond: [
      { $eq: [{ $size: { $ifNull: [applicableLocalesPath, []] } }, 0] },
      LOCALES,
      applicableLocalesPath,
    ],
  };
}

/**
 * Build a `$getField` expression that dereferences `path[localeVariable]`.
 * Used inside a `$map` whose `as: "locale"` variable is referenced as `$$locale`.
 */
function buildDynamicLocaleFieldExpression(path: string, localeVariable: string): Record<string, unknown> {
  return {
    $getField: {
      field: `$$${localeVariable}`,
      input: `$${path}`,
    },
  };
}

/**
 * Build a Mongo `$expr` clause for "this localized field is complete across applicable locales":
 * - Mandatory fields: every applicable locale has a non-null value.
 * - Optional fields: the field is null OR every applicable locale has a non-null value.
 * Resolves applicable locales dynamically from the document's `applicableLocalesPath`.
 */
function buildDynamicFieldCompleteCondition(fieldSpec: TranslationCompletenessFieldSpec, applicableLocalesPath: string): Record<string, unknown> {
  const allLocalesNonNull = {
    $allElementsTrue: [
      {
        $map: {
          input: buildRequiredLocalesExpression(applicableLocalesPath),
          as: "locale",
          in: {
            $gt: [buildDynamicLocaleFieldExpression(fieldSpec.path, "locale"), null],
          },
        },
      },
    ],
  };

  if (fieldSpec.isMandatory) {
    return allLocalesNonNull;
  }
  return {
    $or: [{ $not: { $gt: [`$${fieldSpec.path}`, null] } }, allLocalesNonNull],
  };
}

/**
 * Build a Mongo `$expr` clause for "this localized field is incomplete across applicable locales":
 * - Mandatory fields: at least one applicable locale is null/missing.
 * - Optional fields: the field is set (non-null) AND at least one applicable locale is null/missing.
 * Resolves applicable locales dynamically from the document's `applicableLocalesPath`.
 */
function buildDynamicFieldIncompleteCondition(fieldSpec: TranslationCompletenessFieldSpec, applicableLocalesPath: string): Record<string, unknown> {
  const someLocaleNull = {
    $anyElementTrue: [
      {
        $map: {
          input: buildRequiredLocalesExpression(applicableLocalesPath),
          as: "locale",
          in: {
            $not: { $gt: [buildDynamicLocaleFieldExpression(fieldSpec.path, "locale"), null] },
          },
        },
      },
    ],
  };

  if (fieldSpec.isMandatory) {
    return someLocaleNull;
  }
  return {
    $and: [{ $gt: [`$${fieldSpec.path}`, null] }, someLocaleNull],
  };
}

/**
 * Build the top-level Mongo match clause used by the `is-fully-translated` filter.
 *
 * When `applicableLocalesPath` is omitted (static mode), each localized field is checked
 * against ALL supported locales (`LOCALES`).
 *
 * When `applicableLocalesPath` is provided (dynamic mode), each localized field is checked
 * against the resource's own `applicableLocales` array; if that array is empty/absent, the
 * check falls back to all supported locales.
 *
 * Combines per-field conditions with:
 * - `$and` when filtering for fully translated resources (every field must be complete).
 * - `$or` when filtering for incomplete resources (at least one field must be incomplete).
 *
 * @param fieldSpecs - The localized fields to evaluate. Mandatory fields require every locale
 *   to be non-null; optional fields are complete when null OR every locale is non-null.
 * @param isFullyTranslated - Filter direction. `true` returns complete resources, `false` returns incomplete ones.
 * @param applicableLocalesPath - Optional Mongo path (e.g. `"$applicableLocales"`) to the per-resource
 *   locale restriction. When omitted, all supported locales are always considered applicable.
 * @returns A Mongo match-condition object suitable for `Model.find(...)` or pipeline `$match`.
 */
function buildIsFullyTranslatedMatchCondition(
  fieldSpecs: TranslationCompletenessFieldSpec[],
  isFullyTranslated: boolean,
  applicableLocalesPath?: string,
): Record<string, unknown> {
  if (applicableLocalesPath === undefined) {
    return isFullyTranslated ? { $and: fieldSpecs.map(buildFieldCompleteCondition) } : { $or: fieldSpecs.map(buildFieldIncompleteCondition) };
  }

  const completeExpressions = fieldSpecs.map(spec => buildDynamicFieldCompleteCondition(spec, applicableLocalesPath));
  const incompleteExpressions = fieldSpecs.map(spec => buildDynamicFieldIncompleteCondition(spec, applicableLocalesPath));

  return {
    $expr: isFullyTranslated ? { $and: completeExpressions } : { $or: incompleteExpressions },
  };
}

export { buildIsFullyTranslatedMatchCondition };