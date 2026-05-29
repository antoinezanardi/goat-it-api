import type { Question } from "@question/domain/types/question.entities";

const QUESTION_AUTHOR_ROLE_ADMIN = "admin";
const QUESTION_AUTHOR_ROLE_GAME = "game";
const QUESTION_AUTHOR_ROLE_AI = "ai";

const QUESTION_AUTHOR_ROLES = [
  QUESTION_AUTHOR_ROLE_ADMIN,
  QUESTION_AUTHOR_ROLE_GAME,
  QUESTION_AUTHOR_ROLE_AI,
] as const satisfies readonly string[];

const QUESTION_CREATION_AUTHOR_ROLES = [
  QUESTION_AUTHOR_ROLE_ADMIN,
  QUESTION_AUTHOR_ROLE_AI,
] as const satisfies readonly string[];

const QUESTION_AUTHOR_NAME_MIN_LENGTH = 3;

const QUESTION_AUTHOR_NAME_MAX_LENGTH = 30;

const QUESTION_CATEGORIES = [
  "trivia",
  "lexicon",
  "riddle",
  "explanation",
] as const satisfies readonly string[];

const QUESTION_COGNITIVE_DIFFICULTIES = [
  "easy",
  "medium",
  "hard",
] as const satisfies readonly string[];

const QUESTION_REJECTION_TYPES = [
  "inappropriate-content",
  "incorrect-information",
  "poor-quality",
  "duplicate-question",
  "other",
] as const satisfies readonly string[];

const QUESTION_SOURCE_URLS_MIN_ITEMS = 1;

const QUESTION_SOURCE_URLS_MAX_ITEMS = 5;

const QUESTION_STATUS_PENDING = "pending";
const QUESTION_STATUS_ACTIVE = "active";
const QUESTION_STATUS_ARCHIVED = "archived";
const QUESTION_STATUS_REJECTED = "rejected";

const QUESTION_STATUSES = [
  QUESTION_STATUS_PENDING,
  QUESTION_STATUS_ACTIVE,
  QUESTION_STATUS_ARCHIVED,
  QUESTION_STATUS_REJECTED,
] as const satisfies readonly string[];

const QUESTION_CREATION_STATUSES = [
  QUESTION_STATUS_PENDING,
  QUESTION_STATUS_ACTIVE,
] as const satisfies readonly string[];

const QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS = 1;

const QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS = 3;

const ADMIN_QUESTION_SORTABLE_FIELDS = ["createdAt", "updatedAt", "category", "cognitiveDifficulty", "status"] as const satisfies readonly (keyof Question)[];

const QUESTION_SORTABLE_FIELDS = ["createdAt", "updatedAt", "category", "cognitiveDifficulty"] as const satisfies readonly (keyof Question)[];

export {
  QUESTION_AUTHOR_ROLE_ADMIN,
  QUESTION_AUTHOR_ROLE_GAME,
  QUESTION_AUTHOR_ROLE_AI,
  QUESTION_AUTHOR_ROLES,
  QUESTION_CREATION_AUTHOR_ROLES,
  QUESTION_AUTHOR_NAME_MIN_LENGTH,
  QUESTION_AUTHOR_NAME_MAX_LENGTH,
  QUESTION_CATEGORIES,
  QUESTION_COGNITIVE_DIFFICULTIES,
  QUESTION_REJECTION_TYPES,
  QUESTION_SOURCE_URLS_MIN_ITEMS,
  QUESTION_SOURCE_URLS_MAX_ITEMS,
  QUESTION_STATUS_PENDING,
  QUESTION_STATUS_ACTIVE,
  QUESTION_STATUS_ARCHIVED,
  QUESTION_STATUS_REJECTED,
  QUESTION_STATUSES,
  QUESTION_CREATION_STATUSES,
  QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS,
  QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS,
  ADMIN_QUESTION_SORTABLE_FIELDS,
  QUESTION_SORTABLE_FIELDS,
};