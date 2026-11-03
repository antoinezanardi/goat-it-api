import type { QuestionStatus } from "@question/domain/types/question.value-objects";

const QUESTION_MONGOOSE_COLLECTION_NAME = "questions";

const QUESTION_THEME_USAGE_PERSISTENCE_FIELDS = {
  status: "status",
  themes: "themes",
  themeId: "themes.themeId",
} as const;

type QuestionThemeUsagePersistenceShape = {
  status: QuestionStatus;
  themes: { themeId: { toString: () => string } }[];
};

export { QUESTION_MONGOOSE_COLLECTION_NAME, QUESTION_THEME_USAGE_PERSISTENCE_FIELDS };

export { QUESTION_STATUS_ACTIVE } from "@question/domain/constants/question.constants";

export type { QuestionThemeUsagePersistenceShape };