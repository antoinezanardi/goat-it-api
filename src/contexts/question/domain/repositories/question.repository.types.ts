import type { QuestionModificationContract } from "@question/domain/contracts/question-modification/question-modification.contracts";
import type { QuestionThemeAssignmentCreationContract } from "@question/domain/contracts/question-theme-assignment/question-theme-assignment.contracts";
import type { QuestionThemeAssignmentModificationContract } from "@question/domain/contracts/question-theme-assignment/question-theme-assignment-modification.contracts";
import type { QuestionCreationContract } from "@question/domain/contracts/question.contracts";
import type { ADMIN_QUESTION_SORTABLE_FIELDS } from "@question/domain/constants/question-sortable-fields.constants";

import type { TupleToUnion } from "type-fest";

import type { SortOptions } from "@shared/domain/types/sort.types";
import type { Question } from "@question/domain/entities/question.types";

type QuestionSortableField = TupleToUnion<typeof ADMIN_QUESTION_SORTABLE_FIELDS>;

type QuestionRepository = {
  findAll: (sortOptions: SortOptions<QuestionSortableField>) => Promise<Question[]>;
  findById: (id: string) => Promise<Question | undefined>;
  create: (questionCreationContract: QuestionCreationContract) => Promise<Question | undefined>;
  archive: (id: string) => Promise<Question | undefined>;
  assignTheme: (questionId: string, questionThemeAssignmentCreationContract: QuestionThemeAssignmentCreationContract) => Promise<Question | undefined>;
  removeTheme: (questionId: string, themeId: string) => Promise<Question | undefined>;
  modifyThemeAssignment: (questionId: string, themeId: string, contract: QuestionThemeAssignmentModificationContract) => Promise<Question | undefined>;
  modify: (id: string, contract: QuestionModificationContract) => Promise<Question | undefined>;
  countLiveByThemeId: (themeId: string) => Promise<number>;
};

export type { QuestionRepository, QuestionSortableField };