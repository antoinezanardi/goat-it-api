import type { TranslationCompletenessFieldSpec } from "@shared/infrastructure/persistence/mongoose/helpers/translation-completeness.mongoose.helpers";

const QUESTION_THEME_MONGOOSE_COLLECTION_NAME = "question_themes";

const QUESTION_THEME_TRANSLATION_COMPLETENESS_FIELD_SPECS: TranslationCompletenessFieldSpec[] = [
  { path: "label", isMandatory: true },
  { path: "aliases", isMandatory: true },
  { path: "description", isMandatory: true },
];

export { QUESTION_THEME_MONGOOSE_COLLECTION_NAME, QUESTION_THEME_TRANSLATION_COMPLETENESS_FIELD_SPECS };