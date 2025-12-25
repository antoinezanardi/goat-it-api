import type { QuestionThemeCreationContract, QuestionThemeModificationContract } from "@question/modules/question-theme/domain/contracts/question-theme.contracts";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

type QuestionThemeRepository = {
  findAll: () => Promise<QuestionTheme[]>;
  findById: (id: string) => Promise<QuestionTheme | undefined>;
  findBySlug: (slug: string) => Promise<QuestionTheme | undefined>;
  create: (questionThemeCreationContract: QuestionThemeCreationContract) => Promise<QuestionTheme>;
  modify: (id: string, questionThemeModificationContract: QuestionThemeModificationContract) => Promise<QuestionTheme | undefined>;
  archive: (id: string) => Promise<QuestionTheme | undefined>;
};

export type { QuestionThemeRepository };