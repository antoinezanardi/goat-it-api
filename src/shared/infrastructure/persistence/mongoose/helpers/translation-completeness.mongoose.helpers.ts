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

function buildIsFullyTranslatedMatchCondition(
  fieldSpecs: TranslationCompletenessFieldSpec[],
  isFullyTranslated: boolean,
): Record<string, unknown> {
  return isFullyTranslated ? { $and: fieldSpecs.map(buildFieldCompleteCondition) } : { $or: fieldSpecs.map(buildFieldIncompleteCondition) };
}

export { buildIsFullyTranslatedMatchCondition };