/**
 * Counts of resources that are fully translated versus missing at least one locale value, exposed by the stats responses.
 */
type TranslationCompletenessStats = {
  fullyTranslated: number;
  incomplete: number;
};

export type { TranslationCompletenessStats };