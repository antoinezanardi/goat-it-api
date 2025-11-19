const QUESTION_THEME_STATUSES = ["active", "archived"] as const satisfies readonly string[];

const DEFAULT_QUESTION_THEME_STATUS = QUESTION_THEME_STATUSES[0];

export {
  QUESTION_THEME_STATUSES,
  DEFAULT_QUESTION_THEME_STATUS,
};