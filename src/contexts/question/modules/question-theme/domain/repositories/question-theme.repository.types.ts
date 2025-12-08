import type { QuestionTheme, QuestionThemeDraft } from "@question/modules/question-theme/domain/entities/question-theme.types";

type QuestionThemeRepository = {
  findAll: () => Promise<QuestionTheme[]>;
  findById: (id: string) => Promise<QuestionTheme | undefined>;
  create: (questionTheme: QuestionThemeDraft) => Promise<QuestionTheme>;
  archive: (id: string) => Promise<QuestionTheme | undefined>;
};

export type { QuestionThemeRepository };