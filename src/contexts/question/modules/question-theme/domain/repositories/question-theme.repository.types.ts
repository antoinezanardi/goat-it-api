import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

type QuestionThemeRepository = {
  findAll: () => Promise<QuestionTheme[]>;
  findById: (id: string) => Promise<QuestionTheme | undefined>;
  create: (questionTheme: QuestionTheme) => Promise<QuestionTheme>;
  archive: (id: string) => Promise<QuestionTheme | undefined>;
};

export type { QuestionThemeRepository };