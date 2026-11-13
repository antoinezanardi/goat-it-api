/**
 * Describes one localized field evaluated by the translation-completeness filter.
 */
type TranslationCompletenessFieldSpec = {
  /**
   * Dot-notation path to the localized field, for example `"content.statement"`.
   */
  path: string;
  /**
   * Mandatory fields make a resource incomplete as soon as one locale is missing; optional fields only when partially translated.
   */
  isMandatory: boolean;
};

export type { TranslationCompletenessFieldSpec };