import type { QuestionTheme } from "@question/domain/entities/question-theme/question-theme.types";

type QuestionThemeRepository = {
  findById: (id: string) => Promise<QuestionTheme>;
  findAll: () => Promise<QuestionTheme[]>;
  save: (questionTheme: QuestionTheme) => Promise<void>;
  archive: (id: string) => Promise<void>;
};

export type { QuestionThemeRepository };