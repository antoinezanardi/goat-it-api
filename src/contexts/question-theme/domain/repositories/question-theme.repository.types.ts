import type { QuestionThemeCreationContract, QuestionThemeModificationContract } from "@question-theme/domain/types/question-theme.contracts";
import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

import type { QuestionThemeSortableField } from "@question-theme/domain/types/question-theme.types";
import type { SortOptions } from "@shared/domain/types/sort/sort.types";

type QuestionThemeRepository = {
  findAll: (sortOptions: SortOptions<QuestionThemeSortableField>) => Promise<QuestionTheme[]>;
  findById: (id: string) => Promise<QuestionTheme | undefined>;
  findByIds: (ids: Set<string>) => Promise<QuestionTheme[]>;
  findBySlug: (slug: string) => Promise<QuestionTheme | undefined>;
  create: (questionThemeCreationContract: QuestionThemeCreationContract) => Promise<QuestionTheme>;
  modify: (id: string, questionThemeModificationContract: QuestionThemeModificationContract) => Promise<QuestionTheme | undefined>;
  archive: (id: string) => Promise<QuestionTheme | undefined>;
};

export type { QuestionThemeRepository };