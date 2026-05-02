import type { LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";
import type { QuestionCategory } from "@question/domain/value-objects/question-category/question-category.types";
import type { QuestionCognitiveDifficulty } from "@question/domain/value-objects/question-cognitive-difficulty/question-cognitive-difficulty.types";

type QuestionContentModificationContract = {
  statement?: Partial<LocalizedText>;
  answer?: Partial<LocalizedText>;
  context?: Partial<LocalizedText>;
  trivia?: Partial<LocalizedTexts>;
};

type QuestionModificationContract = {
  category?: QuestionCategory;
  cognitiveDifficulty?: QuestionCognitiveDifficulty;
  sourceUrls?: string[];
  content?: QuestionContentModificationContract;
};

export type {
  QuestionContentModificationContract,
  QuestionModificationContract,
};