import type { QuestionAuthor } from "@question/domain/value-objects/question-author/question-author.types";
import type { QuestionCognitiveDifficulty } from "@question/domain/value-objects/question-cognitive-difficulty/question-cognitive-difficulty.types";
import type { QuestionContent } from "@question/domain/value-objects/question-content/question-content.types";
import type { QuestionRejection } from "@question/domain/value-objects/question-rejection/question-rejection.types";
import type { QuestionStatus } from "@question/domain/value-objects/question-status/question-status.types";
import type { QuestionThemeAssignment } from "@question/domain/value-objects/question-theme-assignment/question-theme-assignment.types";

type Question = {
  id: string;
  themes: QuestionThemeAssignment[];
  content: QuestionContent;
  cognitiveDifficulty: QuestionCognitiveDifficulty;
  author: QuestionAuthor;
  status: QuestionStatus;
  rejection?: QuestionRejection;
  sourceUrls: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type {
  Question,
};