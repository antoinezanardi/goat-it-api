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
   * A primary assignment is exclusive: assigning one demotes the question's previous primary theme in the same atomic update.
   *
   * Returns `undefined` when the conditional write matches no document: the question is missing, the theme is already
   * assigned or the question already holds `QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS` assignments.
   */
  assignTheme: (questionId: string, questionThemeAssignmentCreationContract: QuestionThemeAssignmentCreationContract) => Promise<Question | undefined>;

  /**
   * Returns `undefined` when the conditional write matches no document: the question is missing, the assignment is absent or
   * primary, or removing it would leave fewer than `QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS` assignments.
   */
  removeTheme: (questionId: string, themeId: string) => Promise<Question | undefined>;

  /**
   * Setting `isPrimary` promotes the assignment and demotes the previous primary theme in the same atomic update.
   *
   * Returns `undefined` when the conditional write matches no document.
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