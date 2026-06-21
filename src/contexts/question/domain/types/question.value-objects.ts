import type { QUESTION_CREATION_AUTHOR_ROLES, QUESTION_AUTHOR_ROLES, QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES, QUESTION_REJECTION_TYPES, QUESTION_CREATION_STATUSES, QUESTION_STATUSES } from "@question/domain/constants/question.constants";

import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";
import type { TupleToUnion } from "type-fest";

import type { TupleToEnum } from "@shared/types/enum.types";
import type { LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

type QuestionAuthorRole = TupleToUnion<typeof QUESTION_AUTHOR_ROLES>;

type QuestionAuthorRoleEnum = TupleToEnum<typeof QUESTION_AUTHOR_ROLES>;

type QuestionCreationAuthorRole = TupleToUnion<typeof QUESTION_CREATION_AUTHOR_ROLES>;

type BaseQuestionAuthor<T extends QuestionAuthorRole> = {
  role: T;
  name?: string;
};

type QuestionGameAuthor = BaseQuestionAuthor<"game"> & {
  gameId: string;
};

type QuestionAIAuthor = BaseQuestionAuthor<"ai">;

type QuestionAdminAuthor = BaseQuestionAuthor<"admin">;

type QuestionAuthor =
  | QuestionGameAuthor
  | QuestionAIAuthor
  | QuestionAdminAuthor;

type QuestionCategory = TupleToUnion<typeof QUESTION_CATEGORIES>;

type QuestionCategoryEnum = TupleToEnum<typeof QUESTION_CATEGORIES>;

type QuestionCognitiveDifficulty = TupleToUnion<typeof QUESTION_COGNITIVE_DIFFICULTIES>;

type QuestionCognitiveDifficultyEnum = TupleToEnum<typeof QUESTION_COGNITIVE_DIFFICULTIES>;

type QuestionContent = {
  statement: Partial<LocalizedText>;
  answer: Partial<LocalizedText>;
  context?: Partial<LocalizedText>;
  trivia?: Partial<LocalizedTexts>;
};

type QuestionRejectionType = TupleToUnion<typeof QUESTION_REJECTION_TYPES>;

type QuestionRejection = {
  type: QuestionRejectionType;
  comment?: string;
};

type QuestionStatus = TupleToUnion<typeof QUESTION_STATUSES>;

type QuestionStatusEnum = TupleToEnum<typeof QUESTION_STATUSES>;

type QuestionCreationStatus = TupleToUnion<typeof QUESTION_CREATION_STATUSES>;

type QuestionThemeAssignment = {
  theme: QuestionTheme;
  isPrimary: boolean;
  isHint: boolean;
};

export type {
  QuestionAuthorRole,
  QuestionAuthorRoleEnum,
  QuestionCreationAuthorRole,
  QuestionAuthor,
  QuestionCategory,
  QuestionCategoryEnum,
  QuestionCognitiveDifficulty,
  QuestionCognitiveDifficultyEnum,
  QuestionContent,
  QuestionRejectionType,
  QuestionRejection,
  QuestionStatus,
  QuestionStatusEnum,
  QuestionCreationStatus,
  QuestionThemeAssignment,
};