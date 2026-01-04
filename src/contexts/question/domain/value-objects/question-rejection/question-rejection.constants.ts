const QUESTION_REJECTION_TYPES = [
  "inappropriate-content",
  "incorrect-information",
  "poor-quality",
  "duplicate-question",
  "other",
] as const satisfies readonly string[];

export {
  QUESTION_REJECTION_TYPES,
};