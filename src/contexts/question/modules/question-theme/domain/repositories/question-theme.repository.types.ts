import type { QuestionThemeCreationContract, QuestionThemeModificationContract } from "@question/modules/question-theme/domain/contracts/question-theme.contracts";
import type { ADMIN_QUESTION_THEME_SORTABLE_FIELDS } from "@question/modules/question-theme/domain/constants/question-theme-sortable-fields.constants";

import type { TupleToUnion } from "type-fest";

import type { SortOptions } from "@shared/domain/types/sort.types";
import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

type QuestionThemeSortableField = TupleToUnion<typeof ADMIN_QUESTION_THEME_SORTABLE_FIELDS>;

type QuestionThemeRepository = {
  findAll: (sortOptions: SortOptions<QuestionThemeSortableField>) => Promise<QuestionTheme[]>;
  findById: (id: string) => Promise<QuestionTheme | undefined>;
  findByIds: (ids: Set<string>) => Promise<QuestionTheme[]>;
  findBySlug: (slug: string) => Promise<QuestionTheme | undefined>;
  create: (questionThemeCreationContract: QuestionThemeCreationContract) => Promise<QuestionTheme>;
  modify: (id: string, questionThemeModificationContract: QuestionThemeModificationContract) => Promise<QuestionTheme | undefined>;
  archive: (id: string) => Promise<QuestionTheme | undefined>;
};

export type { QuestionThemeRepository, QuestionThemeSortableField };