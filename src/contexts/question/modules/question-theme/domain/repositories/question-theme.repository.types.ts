import type { QuestionThemeModificationContract } from "@question/modules/question-theme/domain/contracts/question-theme.contracts";

import type { QuestionTheme, QuestionThemeDraft } from "@question/modules/question-theme/domain/entities/question-theme.types";

type QuestionThemeRepository = {
  findAll: () => Promise<QuestionTheme[]>;
  findById: (id: string) => Promise<QuestionTheme | undefined>;
  findBySlug: (slug: string) => Promise<QuestionTheme | undefined>;
  create: (questionTheme: QuestionThemeDraft) => Promise<QuestionTheme>;
  modify: (id: string, questionTheme: QuestionThemeModificationContract) => Promise<QuestionTheme | undefined>;
  archive: (id: string) => Promise<QuestionTheme | undefined>;
};

export type { QuestionThemeRepository };