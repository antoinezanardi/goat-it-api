import type { QuestionThemeUpdateContract } from "@question/modules/question-theme/domain/contracts/question-theme.contracts";

import type { QuestionTheme, QuestionThemeDraft } from "@question/modules/question-theme/domain/entities/question-theme.types";

type QuestionThemeRepository = {
  findAll: () => Promise<QuestionTheme[]>;
  findById: (id: string) => Promise<QuestionTheme | undefined>;
  findBySlug: (slug: string) => Promise<QuestionTheme | undefined>;
  create: (questionTheme: QuestionThemeDraft) => Promise<QuestionTheme>;
  update: (id: string, questionTheme: QuestionThemeUpdateContract) => Promise<QuestionTheme>;
  archive: (id: string) => Promise<QuestionTheme | undefined>;
};

export type { QuestionThemeRepository };