import type { Question } from "@question/domain/types/question.entities";

import type { QuestionModificationContract, QuestionThemeAssignmentCreationContract, QuestionThemeAssignmentModificationContract, QuestionCreationContract } from "@question/domain/repositories/question.repository-contracts.types";
import type { QuestionFilterOptions, QuestionSortableField, FindRandomQuestionsOptions, QuestionStats } from "@question/domain/types/question.types";
import type { FindAllOptions } from "@shared/domain/types/find/find.types";

/**
 * Persistence boundary for questions: domain entities in, domain entities out.
 *
 * Mutating methods return the stored question after the write, or `undefined` when that question cannot be read back, so the caller decides whether that is an error.
 */
type QuestionRepository = {
  findAll: (options: FindAllOptions<QuestionSortableField, QuestionFilterOptions>) => Promise<Question[]>;

  /**
   * Returns `undefined` when no document matches, so the caller decides whether that is an error.
   */
  findById: (id: string) => Promise<Question | undefined>;

  create: (questionCreationContract: QuestionCreationContract) => Promise<Question | undefined>;

  archive: (id: string) => Promise<Question | undefined>;

  /**
   * A primary assignment is exclusive: assigning one demotes the question's previous primary theme.
   */
  assignTheme: (questionId: string, questionThemeAssignmentCreationContract: QuestionThemeAssignmentCreationContract) => Promise<Question | undefined>;

  removeTheme: (questionId: string, themeId: string) => Promise<Question | undefined>;

  /**
   * Setting `isPrimary` promotes the assignment and demotes the previous primary theme.
   */
  modifyThemeAssignment: (questionId: string, themeId: string, contract: QuestionThemeAssignmentModificationContract) => Promise<Question | undefined>;

  modify: (id: string, contract: QuestionModificationContract) => Promise<Question | undefined>;

  /**
   * Counts the pending and active questions using the theme, not only the active ones, because theme archiving protects both.
   */
  countLiveByThemeId: (themeId: string) => Promise<number>;

  /**
   * Returns a random sample of at most `options.limit` active questions, drawn after the exclusion and filter options are applied.
   */
  findRandom: (options: FindRandomQuestionsOptions) => Promise<Question[]>;

  getStats: () => Promise<QuestionStats>;
};

export type { QuestionRepository };