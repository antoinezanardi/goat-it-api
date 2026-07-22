import type { QuestionModificationContract, QuestionThemeAssignmentCreationContract, QuestionThemeAssignmentModificationContract, QuestionCreationContract } from "@question/domain/types/question.contracts";
import type { Question } from "@question/domain/types/question.entities";

import type { QuestionFilterOptions, QuestionSortableField, FindRandomQuestionsOptions, QuestionStats } from "@question/domain/types/question.types";
import type { FindAllOptions } from "@shared/domain/types/find/find.types";

type QuestionRepository = {
  findAll: (options: FindAllOptions<QuestionSortableField, QuestionFilterOptions>) => Promise<Question[]>;
  findById: (id: string) => Promise<Question | undefined>;
  create: (questionCreationContract: QuestionCreationContract) => Promise<Question | undefined>;
  archive: (id: string) => Promise<Question | undefined>;
  assignTheme: (questionId: string, questionThemeAssignmentCreationContract: QuestionThemeAssignmentCreationContract) => Promise<Question | undefined>;
  removeTheme: (questionId: string, themeId: string) => Promise<Question | undefined>;
  modifyThemeAssignment: (questionId: string, themeId: string, contract: QuestionThemeAssignmentModificationContract) => Promise<Question | undefined>;
  modify: (id: string, contract: QuestionModificationContract) => Promise<Question | undefined>;
  countLiveByThemeId: (themeId: string) => Promise<number>;
  findRandom: (options: FindRandomQuestionsOptions) => Promise<Question[]>;
  getStats: () => Promise<QuestionStats>;
};

export type { QuestionRepository };