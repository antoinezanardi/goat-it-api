import type { QuestionAuthor, QuestionCategory, QuestionCognitiveDifficulty, QuestionContent, QuestionRejection, QuestionStatus, QuestionThemeAssignment } from "@question/domain/types/question.value-objects";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

type Question = {
  id: string;
  category: QuestionCategory;
  themes: QuestionThemeAssignment[];
  content: QuestionContent;
  cognitiveDifficulty: QuestionCognitiveDifficulty;
  author: QuestionAuthor;
  status: QuestionStatus;
  rejection?: QuestionRejection;
  sourceUrls: Set<string>;
  applicableLocales?: Locale[];
  createdAt: Date;
  updatedAt: Date;
};

export type {
  Question,
};