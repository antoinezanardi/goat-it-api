import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

type TranslationCompletenessFieldSpec = {
  path: string;
  isMandatory: boolean;
};

function buildLocaleNonNullConditions(path: string): Record<string, unknown> {
  // Acceptable as MongoDB query syntax — null matches missing or explicitly null field values
  // oxlint-disable-next-line unicorn/no-null
  return Object.fromEntries(LOCALES.map(locale => [`${path}.${locale}`, { $ne: null }]));
}

function buildLocaleNullConditions(path: string): Record<string, unknown>[] {
  // Acceptable as MongoDB query syntax — null matches missing or explicitly null field values
  // oxlint-disable-next-line unicorn/no-null
  return LOCALES.map(locale => ({ [`${path}.${locale}`]: null }));
}

function buildFieldCompleteCondition(fieldSpec: TranslationCompletenessFieldSpec): Record<string, unknown> {
  const allLocalesSet = buildLocaleNonNullConditions(fieldSpec.path);

  if (fieldSpec.isMandatory) {
    return allLocalesSet;
  }
  // Acceptable as MongoDB query syntax — null matches missing or explicitly null field values
  // oxlint-disable-next-line unicorn/no-null
  return { $or: [{ [fieldSpec.path]: null }, allLocalesSet] };
}

function buildFieldIncompleteCondition(fieldSpec: TranslationCompletenessFieldSpec): Record<string, unknown> {
  const someLocaleMissing = { $or: buildLocaleNullConditions(fieldSpec.path) };

  if (fieldSpec.isMandatory) {
    return someLocaleMissing;
  }
  // Acceptable as MongoDB query syntax — null matches missing or explicitly null field values
  // oxlint-disable-next-line unicorn/no-null
  return { $and: [{ [fieldSpec.path]: { $ne: null } }, someLocaleMissing] };
}

function buildIsFullyTranslatedMatchCondition(
  fieldSpecs: TranslationCompletenessFieldSpec[],
  isFullyTranslated: boolean,
): Record<string, unknown> {
  return isFullyTranslated ? { $and: fieldSpecs.map(buildFieldCompleteCondition) } : { $or: fieldSpecs.map(buildFieldIncompleteCondition) };
}

export { buildIsFullyTranslatedMatchCondition };

export type { TranslationCompletenessFieldSpec };