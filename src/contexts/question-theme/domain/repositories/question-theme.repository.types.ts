import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

import type { QuestionThemeCreationContract, QuestionThemeModificationContract } from "@question-theme/domain/repositories/question-theme.repository-contracts.types";
import type { AdminQuestionThemeFilterOptions, QuestionThemeSortableField, QuestionThemeStats } from "@question-theme/domain/types/question-theme.types";
import type { FindAllOptions } from "@shared/domain/types/find/find.types";

/**
 * Persistence boundary for question themes: domain entities in, domain entities out.
 *
 * `findById`, `findBySlug`, `modify` and `archive` return `undefined` instead of throwing when no document matches, so the use case decides whether that is an error.
 */
type QuestionThemeRepository = {
  findAll: (options: FindAllOptions<QuestionThemeSortableField, AdminQuestionThemeFilterOptions>) => Promise<QuestionTheme[]>;

  findById: (id: string) => Promise<QuestionTheme | undefined>;

  /**
   * Returns the themes whose id is in the set; missing ids are omitted and the order is not guaranteed.
   */
  findByIds: (ids: Set<string>) => Promise<QuestionTheme[]>;

  findBySlug: (slug: string) => Promise<QuestionTheme | undefined>;

  /**
   * Throws `QuestionThemeSlugAlreadyExistsError` when another theme already uses the slug.
   */
  create: (questionThemeCreationContract: QuestionThemeCreationContract) => Promise<QuestionTheme>;

  modify: (id: string, questionThemeModificationContract: QuestionThemeModificationContract) => Promise<QuestionTheme | undefined>;

  archive: (id: string) => Promise<QuestionTheme | undefined>;

  getStats: () => Promise<QuestionThemeStats>;
};

export type { QuestionThemeRepository };