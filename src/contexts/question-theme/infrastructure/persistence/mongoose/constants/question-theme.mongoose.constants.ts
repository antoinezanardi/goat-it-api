import type { TranslationCompletenessFieldSpec } from "@shared/infrastructure/persistence/mongoose/helpers/translation-completeness.mongoose.helpers";

const QUESTION_THEME_MONGOOSE_COLLECTION_NAME = "question_themes";

// Business rule: label, aliases, and description are all mandatory for question themes.
// See design spec section 2 for the definition of "fully translated" for question themes.
const QUESTION_THEME_TRANSLATION_COMPLETENESS_FIELD_SPECS: TranslationCompletenessFieldSpec[] = [
  { path: "label", isMandatory: true },
  { path: "aliases", isMandatory: true },
  { path: "description", isMandatory: true },
];

export { QUESTION_THEME_MONGOOSE_COLLECTION_NAME, QUESTION_THEME_TRANSLATION_COMPLETENESS_FIELD_SPECS };