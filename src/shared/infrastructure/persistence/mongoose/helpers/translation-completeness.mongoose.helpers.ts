import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

import type { TranslationCompletenessFieldSpec } from "@shared/infrastructure/persistence/mongoose/types/translation-completeness.mongoose.types";

function buildLocaleNonNullConditions(path: string): Record<string, unknown> {
  return Object.fromEntries(LOCALES.map(locale => [`${path}.${locale}`, { $ne: null }]));
}

function buildLocaleNullConditions(path: string): Record<string, unknown>[] {
  return LOCALES.map(locale => ({ [`${path}.${locale}`]: null }));
}

function buildFieldCompleteCondition(fieldSpec: TranslationCompletenessFieldSpec): Record<string, unknown> {
  const allLocalesSet = buildLocaleNonNullConditions(fieldSpec.path);

  if (fieldSpec.isMandatory) {
    return allLocalesSet;
  }
  return { $or: [{ [fieldSpec.path]: null }, allLocalesSet] };
}

function buildFieldIncompleteCondition(fieldSpec: TranslationCompletenessFieldSpec): Record<string, unknown> {
  const someLocaleMissing = { $or: buildLocaleNullConditions(fieldSpec.path) };

  if (fieldSpec.isMandatory) {
    return someLocaleMissing;
  }
  return { $and: [{ [fieldSpec.path]: { $ne: null } }, someLocaleMissing] };
}

function buildRequiredLocalesExpression(applicableLocalesPath: string): Record<string, unknown> {
  return {
    $cond: [
      { $eq: [{ $size: { $ifNull: [applicableLocalesPath, []] } }, 0] },
      LOCALES,
      applicableLocalesPath,
    ],
  };
}

function buildDynamicLocaleFieldExpression(path: string, localeVariable: string): Record<string, unknown> {
  return {
    $getField: {
      field: `$$${localeVariable}`,
      input: `$${path}`,
    },
  };
}

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