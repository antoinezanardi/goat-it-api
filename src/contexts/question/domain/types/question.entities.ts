import type { QuestionAuthor, QuestionCategory, QuestionCognitiveDifficulty, QuestionContent, QuestionRejection, QuestionStatus, QuestionThemeAssignment } from "@question/domain/types/question.value-objects";

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
  createdAt: Date;
  updatedAt: Date;
};

export type {
  Question,
};