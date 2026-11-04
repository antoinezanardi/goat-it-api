const QUESTION_MONGOOSE_COLLECTION_NAME = "questions";

const QUESTION_THEME_USAGE_PERSISTENCE_FIELDS = {
  status: "status",
  themeId: "themes.themeId",
} as const;

export { QUESTION_MONGOOSE_COLLECTION_NAME, QUESTION_THEME_USAGE_PERSISTENCE_FIELDS };

export { QUESTION_STATUS_ACTIVE } from "@question/domain/constants/question.constants";