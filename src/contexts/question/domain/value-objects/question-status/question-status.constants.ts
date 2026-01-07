const QUESTION_STATUSES = [
  "pending",
  "active",
  "archived",
  "rejected",
] as const satisfies readonly string[];

export {
  QUESTION_STATUSES,
};