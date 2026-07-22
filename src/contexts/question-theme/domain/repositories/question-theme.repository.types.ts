import type { QuestionThemeCreationContract, QuestionThemeModificationContract } from "@question-theme/domain/types/question-theme.contracts";
import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

import type { AdminQuestionThemeFilterOptions, QuestionThemeSortableField, QuestionThemeStats } from "@question-theme/domain/types/question-theme.types";
import type { FindAllOptions } from "@shared/domain/types/find/find.types";

type QuestionThemeRepository = {
  findAll: (options: FindAllOptions<QuestionThemeSortableField, AdminQuestionThemeFilterOptions>) => Promise<QuestionTheme[]>;
  findById: (id: string) => Promise<QuestionTheme | undefined>;
  findByIds: (ids: Set<string>) => Promise<QuestionTheme[]>;
  findBySlug: (slug: string) => Promise<QuestionTheme | undefined>;
  create: (questionThemeCreationContract: QuestionThemeCreationContract) => Promise<QuestionTheme>;
  modify: (id: string, questionThemeModificationContract: QuestionThemeModificationContract) => Promise<QuestionTheme | undefined>;
  archive: (id: string) => Promise<QuestionTheme | undefined>;
  getStats: () => Promise<QuestionThemeStats>;
};

export type { QuestionThemeRepository };